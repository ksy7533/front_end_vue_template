/**
 * publish mode일시 stub 폴더에서 데이터를 가져오도록 한다
 */

if (
  process.env.NODE.ENV !== "production" &&
  process.env.FRONT_MODE === "publish"
) {
  const regex = /^.*\/\/[^\/]+:?[0-9]?\//i;

  [
    "request",
    "get",
    "delete",
    "head",
    "options",
    "post",
    "put",
    "patch"
  ].forEach(method => {
    const _method = Axios[method];
    Axios[method] = function(url, ...args) {
      if (url.includes("http")) {
        return _method(url, ...args);
      }

      let parsedUrl = `${url.replace(regex, "")}`;

      if (parsedUrl.charAt(0) !== "/") {
        parsedUrl = "/" + parsedUrl;
      }

      return _method(`${process.env.publicPath}stub${parsedUrl}`, ...args);
    };
  });
}
