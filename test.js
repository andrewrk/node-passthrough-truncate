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
  it("truncateByteCount is equal to buffer size", function(done) {
    var ssIn = StreamSink.fromBufferList([
      new Buffer("first buffer size is 23"),
      new Buffer("secon buffer size is 23"),
    ]);
    var ssOut = new StreamSink();
    ssOut.on('finish', function() {
      assert.strictEqual(ssOut.toString(), "first buffer size is 23");
      done();
    });
    ssIn.createReadStream().pipe(new PassThroughTruncate(23)).pipe(ssOut);
  });
  it("truncateByteCount is smaller than buffer size", function(done) {
    var ssIn = StreamSink.fromBufferList([
      new Buffer("first buffer size is 23"),
      new Buffer("secon buffer size is 23"),
    ]);
    var ssOut = new StreamSink();
    ssOut.on('finish', function() {
      assert.strictEqual(ssOut.toString(), "first buffer size is 23s");
      done();
    });
    ssIn.createReadStream().pipe(new PassThroughTruncate(22)).pipe(ssOut);
  });
  it("truncateByteCount is larger than buffer size", function(done) {
    var ssIn = StreamSink.fromBufferList([
      new Buffer("a"),
      new Buffer("a"),
      new Buffer("an"),
      new Buffer("890"),
      new Buffer("a"),
      new Buffer("size 6"),
    ]);
    var ssOut = new StreamSink();
    ssOut.on('finish', function() {
      assert.strictEqual(ssOut.toString(), "aaa");
      done();
    });
    ssIn.createReadStream().pipe(new PassThroughTruncate(11)).pipe(ssOut);
  });
  it("emits error when stream length is less than truncateByteCount", function(done) {
    var ssIn = StreamSink.fromBuffer(new Buffer("1234"));
    var ssOut = new StreamSink();
    ssOut.on('finish', function() {
      throw new Error("should error instead of finish");
    });
    var passThrough = new PassThroughTruncate(5);
    passThrough.on('error', function(err) {
      assert.strictEqual(err.code, 'ETOOSMALL');
      done();
    });
    ssIn.createReadStream().pipe(passThrough).pipe(ssOut);
  });
});
