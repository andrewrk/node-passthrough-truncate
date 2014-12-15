# node-passthrough-truncate [![Build Status](https://travis-ci.org/andrewrk/node-passthrough-truncate.svg?branch=master)](https://travis-ci.org/andrewrk/node-passthrough-truncate) [![Coverage Status](https://img.shields.io/coveralls/andrewrk/node-passthrough-truncate.svg)](https://coveralls.io/r/andrewrk/node-passthrough-truncate)

A `PassThrough` stream which truncates the last N bytes of a stream.

For example, let's say you are piping a file into a deflate stream, and you want
to remove the `0x00 0x00 0xff 0xff` at the end. You don't know how long the
stream is going to be ahead of time, but you know you need to remove the last
4 bytes.

This module works by keeping enough extra buffers around such that at least N
bytes are buffered when the stream is flushed, N being the number of bytes you
wish to truncate.

## Usage

```js
var PassThroughTruncate = require('passthrough-truncate');
// chop off the last 4 bytes of the stream
myOtherStream.pipe(new PassThroughTruncate(4)).pipe(process.stdout);
```

## API Documentation

### new PassThroughStream(truncateByteCount, streamOptions)

 * `truncateByteCount` - `number` - number of bytes to chop off the end of the
   stream.
 * `streamOptions` - `object` - passed directly to the `Transform` stream
   constructor.

Returns a `PassThrough` stream which is missing the last `truncateByteCount`
bytes.

#### Event: 'error'

`function (error) { }`

An 'error' event is emitted when the stream contains fewer bytes than
`truncateByteCount`. In this situation, `error.code === 'ETOOSMALL'`.
