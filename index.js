var Transform = require('stream').Transform;
var util = require('util');

module.exports = PassThroughTruncate;

util.inherits(PassThroughTruncate, Transform);
function PassThroughTruncate(truncateByteCount, options) {
  Transform.call(this, options);
  this.queue = [];
  this.buffersByteCount = 0;
  this.truncateByteCount = truncateByteCount;
}

PassThroughTruncate.prototype._transform = function(chunk, encoding, cb) {
  this.queue.push(chunk);
  this.buffersByteCount += chunk.length;
  for (;;) {
    var queuedChunk = this.queue[0];
    if (!queuedChunk) break;
    var newBuffersByteCount = this.buffersByteCount - queuedChunk.length;
    if (newBuffersByteCount >= this.truncateByteCount) {
      this.push(queuedChunk);
      this.queue.shift();
      this.buffersByteCount = newBuffersByteCount;
    }
  }
  cb();
};

PassThroughTruncate.prototype._flush = function(cb) {
  var index = this.buffersByteCount - this.truncateByteCount;
  for (;;) {
    var queuedChunk = this.queue.shift();
    if (!queuedChunk) break;
    var newIndex = index - queuedChunk.length;
    if (newIndex >= 0) {
      this.push(queuedChunk);
      index = newIndex;
    } else if (queuedChunk.length < index) {
      var err = new Error("stream too small to truncate");
      err.code = 'ETOOSMALL';
      cb(err);
      return;
    } else {
      this.push(queuedChunk.slice(0, index));
      this.queue = [];
      break;
    }
  }
  cb();
};
