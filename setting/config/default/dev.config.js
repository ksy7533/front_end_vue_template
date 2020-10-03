const { createProxyMiddleware } = require("http-proxy-middleware");
const proxyConfig = require("./_proxyConfig");
const path = require("path");
const page = require(path.join(process.env.INIT_CWD, "./frontend/vue.page.js"));

module.exports = {
  devServer: {
    port: 3000,
    open: true,
    disableHostCheck: true,
    /**
     * devServer가 Revers proxy 서버가 되어 모든 요청을 'localhost:8080'으로 전달하고
     * 받은 응답이 html인 경우 js를 삽입한다
     */
    setup: function(app, server) {
      const proxyFunction = createProxyMiddleware({
        target: "http://localhost:8080", // 모든 요청을 8080포트로 변경요청
        changeOrigin: true, // 타겟 서버 구성에 따라 호스트 헤더가 변경되도록 한다
        selfHandleResponse: true, // proxyRes 이벤트를 수신하게하고 핸들러를 커스텀 가능하게 한다
        onProxyRes: proxyConfig(page, "localhost:3000", "localhost:8080")
      });

      app.use("/**", (req, res, next) => {
        if (
          req.originalUrl.includes(".js") ||
          req.originalUrl.includes("/static")
        ) {
          return next();
        }
        return proxyFunction(req, res, next);
      });
    }
  },

  chainWebpack: config => {
    config.optimization.delete("splitChunks");
  }
};
