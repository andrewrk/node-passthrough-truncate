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
    if (newBuffersByteCount < this.truncateByteCount) break;
    this.push(queuedChunk);
    this.queue.shift();
    this.buffersByteCount = newBuffersByteCount;
  }
  cb();
};

PassThroughTruncate.prototype._flush = function(cb) {
  var index = this.buffersByteCount - this.truncateByteCount;
  if (index < 0) {
    var err = new Error("stream too small to truncate");
    err.code = 'ETOOSMALL';
    cb(err);
  } else if (index === 0) {
    cb();
  } else {
    var queuedChunk = this.queue.shift();
    this.push(queuedChunk.slice(0, index));
    this.queue = [];
    cb();
  }
};
