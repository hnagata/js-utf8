js-utf8
=======

Converts raw string into UTF8 ArrayBuffer and vice versa.

- Supporting surrogate pairs.
- Strict decoding. Any invalid UTF8 sequences will throw exceptions.
- Able to use external buffer for performance.

Usage
-----

```js
/* Encoding */

utf8.encode("hoge")
// Returns [Uint8Array] includes UTF8 sequence of "hoge".

utf8.encode("𝒉𝒐𝒈𝒆")
// Converts "hoge" using surrogate characters.

bytes = new Uint8Buffer(4);
utf8.encode("hoge", bytes)
// Stores UTF8 sequence into `bytes` and returns it.

utf8.encode("fuga", bytes)
// Now `bytes` is overwritten with "fuga".

utf8.encode("foobar", bytes)
// UTF8 sequence is stored in new buffer, since `bytes` doesn't have enough size.
// Note that `bytes` may be overwritten.


/* Decoding */

utf8.decode(new Uint8Array([0x68, 0x6F, 0x67, 0x65]));
// Returns "hoge".

utf8.decode(new Uint8Array([0xE3, 0x81, 0x93, 0x82, 0xE3, 0x81]);
// Invalid UTF8 sequence causes an exception.
```

License
-------
Copyright (c) 2014 H. Nagata Licensed under the MIT license.
