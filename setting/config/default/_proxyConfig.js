module.exports = function(
  pageElements,
  devHost,
  backendHost,
  publicPath = process.env.publicPath
) {
  /**
   * 스크립트를 삽입할 Path 검사 정규식 생성 함수
   * vue.page.js의 path속성을 읽는다
   * path 배열의 원소중에 하나를 찾는 정규표현식으로 반환한다
   * ['/*', '/test'] => /(\/test)|()/gi
   */
  const generatePathRegx = path => {
    return new RegExp(
      path
        .map(str => str.replace(/(\/\*+)/g, ""))
        .map(str => str.replace(/\//g, "/"))
        .map(str => `(${str})`)
        .join("|"),
      "gi"
    );
  };

  return function(proxyRes, request, response) {
    const body = [];

    /**
     * proxyRes의 헤더의 모든 호스트를 devServer host로 변경
     */
    if (proxyRes.headers) {
      for (let field in proxyRes.headers) {
        if (!proxyRes.headers.hasOwnProperty(field)) continue;
        proxyRes.headers[field] = changeHost(
          proxyRes.headers[field],
          devHost,
          backendHost
        );
      }
    }
    /**
     * vue.page의 path값에 해당하는 것을 찾는 정규표현식으로 현재 요청된 originalUrl의 경로와 path값이 일치하면
     * 해당하는 pageElement를 반환한다
     */
    const pageElement = Object.keys(pageElements)
      .map(key => [key, pageElements[key]])
      .find(([key, pageEl]) =>
        generatePathRegx(pageEl.path).test(request.originalUrl)
      );

    if (
      pageElement &&
      pageElement.length &&
      proxyRes.headers &&
      proxyRes.headers["content-type"] &&
      proxyRes.headers["content-type"].match("text/html")
    ) {
      const scriptFilename = `${publicPath}/static/js/${
        pageElement[0]
      }.js`.replace(/\/\//gi, "/");
      const appendScript = `<script src="${scriptFilename}"></script>`;

      // 원래는 chunk-vendors.js index.js 2개로 나뉘었지만
      // config.optimization.delete("splitChunks"); 플러그인을 해제하여 index.js만 사용하도록 변경
      // const chunkVendors = `${publicPath}/static/js/chunk-vendors.js`.replace(
      //   /\/\//gi,
      //   "/"
      // );
      // const appendScript = `<script src="${chunkVendors}"></script><script src="${scriptFilename}"></script>`;
      /**
       * 프록시에 받은 response를 커스텀한 response로 변경하기 위해 'data', 'end' 이벤트 핸들러를 이용한다
       * 'data'핸들러는 데이터를 청크 단위로 받아서 처리할수있는데 body 배열에 모두 푸시한다
       * 'end' data를 모두 받은 후에 하나의 문자열로 합친다
       */
      proxyRes.on("data", chunk => body.push(chunk));
      proxyRes.on("end", () => {
        const html = changeHost(
          appendScriptToHtml(Buffer.concat(body).toString(), appendScript),
          devHost,
          backendHost
        );
        // html을 변경했으므로 다시계산
        proxyRes.headers["content-length"] = html.length.toString();
        response.writeHead(proxyRes.statusCode, proxyRes.headers);
        response.end(html);
      });
    } else {
      proxyRes.on("data", chunk => body.push(chunk));
      proxyRes.on("end", () => {
        const html = changeHost(
          Buffer.concat(body).toString(),
          devHost,
          backendHost
        );
        proxyRes.headers["content-length"] = html.length.toString();
        response.writeHead(proxyRes.statusCode, proxyRes.headers);
        response.end(html);
      });
    }
  };
};

// target html 문자열내 'devhost' 문자열을 'backendhost' 문자열로 치환하는 함수

function changeHost(target, devHost, backendHost) {
  const regex = new RegExp(backendHost, "gi");
  let replaced = target;
  if (target.replace) {
    replaced = target.replace(regex, devHost);
  } else if (target.map) {
    replaced = target.map(t => t.replace(regex, devHost));
  }
  return replaced;
}

// html 파일 마지막 라인에 스크립트를 추가하는 함수
function appendScriptToHtml(html, script) {
  if (html.includes("</body>")) {
    html = html.replace("</body>", script + "</body>");
  }
  return html;
}
