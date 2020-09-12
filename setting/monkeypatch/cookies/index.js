/**
 * cookies.set 기본 유효기간 설정
 * cookies.get number 타입일시 리턴값 number로 설정
 */
import Cookies from "js-cookie";

const _cookieSet = Cookies.set;
Cookies.set = function(key, value, options) {
  options = options ? options : {};

  if (!options.expires) {
    options.expires = 30;
  }

  if (process.env.NODE_ENV !== "production") {
    if (options.domain) delete options.domain;
  }

  return _cookieSet(key, value, options);
};

const isNumber = /^\d+&/;

const _cookieGet = Cookies.get;

Cookies.get = function(key, options) {
  const value = _cookieGet(key, options);

  if (isNumber.test(value)) {
    return parseInt(value);
  }

  return value;
};
