var PassThroughTruncate = require('./');
var StreamSink = require('streamsink');
var assert = require('assert');
var describe = global.describe;
var it = global.it;

describe("PassThroughTruncate", function() {
  it("truncateByteCount is 0", function(done) {
    var ssIn = StreamSink.fromBuffer(new Buffer("hello this is my stream"));
    var ssOut = new StreamSink();
    ssOut.on('finish', function() {
      assert.strictEqual(ssOut.toString(), "hello this is my stream");
      done();
    });
    ssIn.createReadStream().pipe(new PassThroughTruncate(0)).pipe(ssOut);
  });
  it("truncateByteCount is equal to buffer size");
  it("truncateByteCount is smaller than buffer size");
  it("truncateByteCount is larger than buffer size");
  it("emits error when stream length is less than truncateByteCount");
});
