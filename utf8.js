/*
 * js-utf8
 * https://github.com/hnagata/js-utf8
 * Copyright (c) 2014 H. Nagata
 * Licensed under the MIT license.
 */

var utf8 = utf8 || (function() {
	function encode(str, bytes) {
		var len = str.length,
		byteLength = len,
		bytes = bytes || new Uint8Array(byteLength),
		p = 0, i, c, d, _bytes;

		for(i = 0; i < len; ++i) {
			c = str.charCodeAt(i);
			if(c <= 0x7F){
				bytes[p++] = c;
			} else if(c <= 0x7FF) {
				bytes[p++] = 0xC0 | (c >>> 6);
				bytes[p++] = 0x80 | (c & 0x3F);
			} else if (c >= 0xD800 && c <= 0xDBFF) {
				if (!((d = str.charCodeAt(++i)) >= 0xDC00 && d <= 0xDFFF)) {
					throw "Illegal surrogates: " + c + ", " + d + " @ " + i;
				}
				c = 0x10000 | (c & 0x3FF) << 10 | (d & 0x3FF);
				bytes[p++] = 0xF0 | (c >>> 18);
				bytes[p++] = 0x80 | (c >>> 12 & 0x3F);
				bytes[p++] = 0x80 | (c >>> 6 & 0x3F);
				bytes[p++] = 0x80 | (c & 0x3F);
			} else if (c <= 0xFFFF) {
				bytes[p++] = 0xE0 | (c >>> 12);
				bytes[p++] = 0x80 | (c >>> 6 & 0x3F);
				bytes[p++] = 0x80 | (c & 0x3F);
			} else {
				throw "Illegal character: " + c + " @ " + i;
			}
			if(byteLength - p < 4) {
				_bytes = bytes;
				byteLength *= 2;
				bytes = new Uint8Array(byteLength);
				bytes.set(_bytes);
			}
		}
		return bytes.subarray(0, p);
	}

	function checkByte(b) {
		if (!(b && (b & 0xC0) == 0x80)) throw "Illegal following byte: " + b;
		return b & 0x3F;
	}

	function checkOverlong(n, v) {
		if (!(v >>> n)) throw "Overlong sequence: " + v;
		return v;
	}

	function decode(bytes) {
		var str = "", i = 0, len = bytes.byteLength, c;
		while (i < len) {
			c = bytes[i++];
			if (c <= 0x7F) {
				str += String.fromCharCode(c);
			} else if (c <= 0xC1) {
				throw "Illegal leading byte: " + c + " @ " + (i - 1);
			} else if (c <= 0xDF) {
				c = checkOverlong(7, 
					(c & 0x1F) << 6 | (checkByte(bytes[i++]) & 0x3F));
				str += String.fromCharCode(c);
			} else if (c <= 0xEF) {
				c = checkOverlong(11,
					(c & 0x0F) << 12 | (checkByte(bytes[i++]) & 0x3F) << 6 | 
					(checkByte(bytes[i++]) & 0x3F));
				str += String.fromCharCode(c);
			} else if (c <= 0xF4) {
				c = checkOverlong(16,
					(c & 0x07) << 18 | (checkByte(bytes[i++]) & 0x3F) << 12 |
					(checkByte(bytes[i++]) & 0x3F) << 6 | (checkByte(bytes[i++]) & 0x3F));
				if (c >= 0x110000) throw "Illegal code point: " + c + " @ " + (i - 4);
				str += String.fromCharCode((c >>> 10 & 0x3FF) | 0xD800);
				str += String.fromCharCode((c & 0x3FF) | 0xDC00);
			} else {
				throw "Illegal leading byte: " + c + " @ " + (i - 1);
			}
		}
		return str;
	}

	return {
		encode: encode,
		decode: decode
	};
})();

