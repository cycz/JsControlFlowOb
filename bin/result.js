/*
* Add integers, wrapping at 2^32. This uses 16-bit operations internally
* to work around bugs in some JS interpreters.
*/
function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
* Bitwise rotate a 32-bit number to the left.
*/


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
* These functions implement the four basic operations the algorithm uses.
*/


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}
/*
* Calculate the MD5 of an array of little-endian words, and a bit length.
*/


/*
* Convert an array of little-endian words to a string
*/
function binl2rstr(input) {
  var i;
  var output = '';
  var length32 = input.length * 32;

  for (i = 0; i < length32; i += 8) {
    output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xff);
  }

  return output;
}
/*
* Convert a raw string to an array of little-endian words
* Characters >255 have their high-byte silently ignored.
*/


function rstr2binl(input) {
  var i;
  var output = [];
  output[(input.length >> 2) - 1] = undefined;

  for (i = 0; i < output.length; i += 1) {
    output[i] = 0;
  }

  var length8 = input.length * 8;

  for (i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
  }

  return output;
}
/*
* Calculate the MD5 of a raw string
*/


function rstrMD5(s) {
  return binl2rstr(_$$Gk(0, rstr2binl(s), s.length * 8));
}
/*
* Calculate the HMAC-MD5, of a key and some data (raw strings)
*/


function rstrHMACMD5(key, data) {
  var i;
  var bkey = rstr2binl(key);
  var ipad = [];
  var opad = [];
  var hash;
  ipad[15] = opad[15] = undefined;

  if (bkey.length > 16) {
    bkey = _$$Gk(0, bkey, key.length * 8);
  }

  for (i = 0; i < 16; i += 1) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5c5c5c5c;
  }

  hash = _$$Gk(0, ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(_$$Gk(0, opad.concat(hash), 512 + 128));
}
/*
* Convert a raw string to a hex string
*/


function rstr2hex(input) {
  var hexTab = '0123456789abcdef';
  var output = '';
  var x;
  var i;

  for (i = 0; i < input.length; i += 1) {
    x = input.charCodeAt(i);
    output += hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f);
  }

  return output;
}
/*
* Encode a string as utf-8
*/


function str2rstrUTF8(input) {
  return unescape(encodeURIComponent(input));
}
/*
* Take string arguments and return either raw or hex encoded strings
*/


function rawMD5(s) {
  return rstrMD5(str2rstrUTF8(s));
}

function hexMD5(s) {
  return rstr2hex(rawMD5(s));
}

function rawHMACMD5(k, d) {
  return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
}

function hexHMACMD5(k, d) {
  return rstr2hex(rawHMACMD5(k, d));
}

function _$$Gk(_$$ey, _$$VM, _$$VO, _$$TK) {
  var _$$gs = [31, 3, 19, 2, 17, 1, 8, 18, 0, 25, 32, 13, 27, 35, 16, 12, 33, 26, 22, 20, 34, 24, 4, 21, 9, 10, 30, 11, 6, 29, 15, 23, 7, 37, 28, 5, 36, 14];

  while (1) {
    _$$QL = _$$gs[_$$ey++];

    if (_$$QL < 1) {
      var i;
    } else if (_$$QL < 2) {
      _$$0g = true;
    } else if (_$$QL < 3) {
      console.log('检测失败流程1');
    } else if (_$$QL < 4) {
      _$$0g = !!document;
    } else if (_$$QL < 5) {
      if (_$$0g) _$$ey += 3;
    } else if (_$$QL < 6) {
      if (!_$$TK) {
        return hexHMACMD5(_$$VO, _$$VM);
      }
    } else if (_$$QL < 7) {
      var b = -271733879;
    } else if (_$$QL < 8) {
      return [a, b, c, d];
    } else if (_$$QL < 9) {
      if (_$$0g) _$$ey += 1;
    } else if (_$$QL < 10) {
      console.log('同流程无用假代码2');
    } else if (_$$QL < 11) {
      console.log('同流程无用假代码3');
    } else if (_$$QL < 12) {
      var a = 1732584193;
    } else if (_$$QL < 13) {
      console.log('随机无用假代码1');
    } else if (_$$QL < 14) {
      console.log('随机无用假代码1');
    } else if (_$$QL < 15) {
      return;
    } else if (_$$QL < 16) {
      var d = 271733878;
    } else if (_$$QL < 17) {
      if (!_$$0g) _$$ey += 1;
    } else if (_$$QL < 18) {
      _$$VM[(_$$VO + 64 >>> 9 << 4) + 14] = _$$VO;
    } else if (_$$QL < 19) {
      console.log('随机无用假代码1');
    } else if (_$$QL < 20) {
      if (_$$0g) _$$ey += 1;
    } else if (_$$QL < 21) {
      console.log('随机无用假代码1');
    } else if (_$$QL < 22) {
      console.log('同流程无用假代码1');
    } else if (_$$QL < 23) {
      if (!_$$0g) _$$ey += 1;
    } else if (_$$QL < 24) {
      for (i = 0; i < _$$VM.length; i += 16) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;
        a = md5ff(a, b, c, d, _$$VM[i], 7, -680876936);
        d = md5ff(d, a, b, c, _$$VM[i + 1], 12, -389564586);
        c = md5ff(c, d, a, b, _$$VM[i + 2], 17, 606105819);
        b = md5ff(b, c, d, a, _$$VM[i + 3], 22, -1044525330);
        a = md5ff(a, b, c, d, _$$VM[i + 4], 7, -176418897);
        d = md5ff(d, a, b, c, _$$VM[i + 5], 12, 1200080426);
        c = md5ff(c, d, a, b, _$$VM[i + 6], 17, -1473231341);
        b = md5ff(b, c, d, a, _$$VM[i + 7], 22, -45705983);
        a = md5ff(a, b, c, d, _$$VM[i + 8], 7, 1770035416);
        d = md5ff(d, a, b, c, _$$VM[i + 9], 12, -1958414417);
        c = md5ff(c, d, a, b, _$$VM[i + 10], 17, -42063);
        b = md5ff(b, c, d, a, _$$VM[i + 11], 22, -1990404162);
        a = md5ff(a, b, c, d, _$$VM[i + 12], 7, 1804603682);
        d = md5ff(d, a, b, c, _$$VM[i + 13], 12, -40341101);
        c = md5ff(c, d, a, b, _$$VM[i + 14], 17, -1502002290);
        b = md5ff(b, c, d, a, _$$VM[i + 15], 22, 1236535329);
        a = md5gg(a, b, c, d, _$$VM[i + 1], 5, -165796510);
        d = md5gg(d, a, b, c, _$$VM[i + 6], 9, -1069501632);
        c = md5gg(c, d, a, b, _$$VM[i + 11], 14, 643717713);
        b = md5gg(b, c, d, a, _$$VM[i], 20, -373897302);
        a = md5gg(a, b, c, d, _$$VM[i + 5], 5, -701558691);
        d = md5gg(d, a, b, c, _$$VM[i + 10], 9, 38016083);
        c = md5gg(c, d, a, b, _$$VM[i + 15], 14, -660478335);
        b = md5gg(b, c, d, a, _$$VM[i + 4], 20, -405537848);
        a = md5gg(a, b, c, d, _$$VM[i + 9], 5, 568446438);
        d = md5gg(d, a, b, c, _$$VM[i + 14], 9, -1019803690);
        c = md5gg(c, d, a, b, _$$VM[i + 3], 14, -187363961);
        b = md5gg(b, c, d, a, _$$VM[i + 8], 20, 1163531501);
        a = md5gg(a, b, c, d, _$$VM[i + 13], 5, -1444681467);
        d = md5gg(d, a, b, c, _$$VM[i + 2], 9, -51403784);
        c = md5gg(c, d, a, b, _$$VM[i + 7], 14, 1735328473);
        b = md5gg(b, c, d, a, _$$VM[i + 12], 20, -1926607734);
        a = md5hh(a, b, c, d, _$$VM[i + 5], 4, -378558);
        d = md5hh(d, a, b, c, _$$VM[i + 8], 11, -2022574463);
        c = md5hh(c, d, a, b, _$$VM[i + 11], 16, 1839030562);
        b = md5hh(b, c, d, a, _$$VM[i + 14], 23, -35309556);
        a = md5hh(a, b, c, d, _$$VM[i + 1], 4, -1530992060);
        d = md5hh(d, a, b, c, _$$VM[i + 4], 11, 1272893353);
        c = md5hh(c, d, a, b, _$$VM[i + 7], 16, -155497632);
        b = md5hh(b, c, d, a, _$$VM[i + 10], 23, -1094730640);
        a = md5hh(a, b, c, d, _$$VM[i + 13], 4, 681279174);
        d = md5hh(d, a, b, c, _$$VM[i], 11, -358537222);
        c = md5hh(c, d, a, b, _$$VM[i + 3], 16, -722521979);
        b = md5hh(b, c, d, a, _$$VM[i + 6], 23, 76029189);
        a = md5hh(a, b, c, d, _$$VM[i + 9], 4, -640364487);
        d = md5hh(d, a, b, c, _$$VM[i + 12], 11, -421815835);
        c = md5hh(c, d, a, b, _$$VM[i + 15], 16, 530742520);
        b = md5hh(b, c, d, a, _$$VM[i + 2], 23, -995338651);
        a = md5ii(a, b, c, d, _$$VM[i], 6, -198630844);
        d = md5ii(d, a, b, c, _$$VM[i + 7], 10, 1126891415);
        c = md5ii(c, d, a, b, _$$VM[i + 14], 15, -1416354905);
        b = md5ii(b, c, d, a, _$$VM[i + 5], 21, -57434055);
        a = md5ii(a, b, c, d, _$$VM[i + 12], 6, 1700485571);
        d = md5ii(d, a, b, c, _$$VM[i + 3], 10, -1894986606);
        c = md5ii(c, d, a, b, _$$VM[i + 10], 15, -1051523);
        b = md5ii(b, c, d, a, _$$VM[i + 1], 21, -2054922799);
        a = md5ii(a, b, c, d, _$$VM[i + 8], 6, 1873313359);
        d = md5ii(d, a, b, c, _$$VM[i + 15], 10, -30611744);
        c = md5ii(c, d, a, b, _$$VM[i + 6], 15, -1560198380);
        b = md5ii(b, c, d, a, _$$VM[i + 13], 21, 1309151649);
        a = md5ii(a, b, c, d, _$$VM[i + 4], 6, -145523070);
        d = md5ii(d, a, b, c, _$$VM[i + 11], 10, -1120210379);
        c = md5ii(c, d, a, b, _$$VM[i + 2], 15, 718787259);
        b = md5ii(b, c, d, a, _$$VM[i + 9], 21, -343485551);
        a = safeAdd(a, olda);
        b = safeAdd(b, oldb);
        c = safeAdd(c, oldc);
        d = safeAdd(d, oldd);
      }
    } else if (_$$QL < 25) {
      _$$0g = true;
    } else if (_$$QL < 26) {
      _$$0g = true;
    } else if (_$$QL < 27) {
      _$$0g = false;
    } else if (_$$QL < 28) {
      var olda;
    } else if (_$$QL < 29) {
      if (!_$$VO) {
        if (!_$$TK) {
          return hexMD5(_$$VM);
        }

        return rawMD5(_$$VM);
      }
    } else if (_$$QL < 30) {
      var c = -1732584194;
    } else if (_$$QL < 31) {
      var oldd;
    } else if (_$$QL < 32) {
      /* append padding */
      _$$VM[_$$VO >> 5] |= 0x80 << _$$VO % 32;
    } else if (_$$QL < 33) {
      if (_$$0g) _$$ey += 1;
    } else if (_$$QL < 34) {
      var oldb;
    } else if (_$$QL < 35) {
      var oldc;
    } else if (_$$QL < 36) {
      _$$0g = false;
    } else if (_$$QL < 37) {
      return rawHMACMD5(_$$VO, _$$VM);
    } else {
      return;
    }
  }
}

var _$$xs = 0;
var _$$no = [1, 9, 10, 5, 2, 7, 8, 11, 0, 4, 6, 3];

while (1) {
  _$$Kn = _$$no[_$$xs++];

  if (_$$Kn < 1) {
    console.log('随机无用假代码1');
  } else if (_$$Kn < 2) {
    document = 1;
  } else if (_$$Kn < 3) {
    console.log('随机无用假代码1');
  } else if (_$$Kn < 4) {
    break;
  } else if (_$$Kn < 5) {
    console.log('随机无用假代码1');
  } else if (_$$Kn < 6) {
    console.log('随机无用假代码1');
  } else if (_$$Kn < 7) {
    console.log(_$$Gk(34, '123'));
  } else if (_$$Kn < 8) {
    console.log('同流程无用假代码1');
  } else if (_$$Kn < 9) {
    console.log('同流程无用假代码2');
  } else if (_$$Kn < 10) {
    _$$kS = true;
  } else if (_$$Kn < 11) {
    if (_$$kS) _$$xs += 7;
  } else {
    console.log('同流程无用假代码3');
  }
}