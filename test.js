var PassThroughTruncate = require('./');
var describe = global.describe;
var it = global.it;


describe("PassThroughTruncate", function() {
  it("truncateByteCount is 0");
  it("truncateByteCount is equal to buffer size");
  it("truncateByteCount is smaller than buffer size");
  it("truncateByteCount is larger than buffer size");
  it("emits error when stream length is less than truncateByteCount");
});
