const webpack = require("webpack");
const path = require("path");
const page = require(path.join(process.env.INIT_CWD, "/frontend/vue.page.js"));
const TerserPlugin = require("terser-webpack-plugin");
const getPageConfig = require("./_getPageConfig");

module.exports = {
  getDefaultOption: function() {
    const cssImportOption = ['@import "@/styles/index";'];
    return {
      productionSourceMap: false, // 빌드시 소스맵 기능을 사용하지 않아 빌드속도 상승

      assetsDir: "static", // 빌드시 outputDir내의 정적파일들의 위치, 데브서버 정적파일 패스변경

      css: {
        loaderOptions: {
          sass: {
            prependData: `@import "@/styles/index.scss";` // 해당 scss파일을 미리 불러와서 셋팅해둔다
          }
        },
        extract: !process.env.FRONT_MODE // css파일 추출여부, 추출아니면 인라인으로 박힘
      },

      pages: getPageConfig(page),

      chainWebpack: config => {
        process.env.publicPath =
          require(path.resolve(process.env.INIT_CWD, "./vue.config"))
            .publicPath || "/"; // 번들이 배포될 기본 URL

        config.resolve.alias.set("#", global.ZUM_OPTION.resourcePath);
        config.resolve.alias.set("@", process.env.INIT_CWD + "/frontend/src");
        config.plugins.delete("progress"); // 빌드시 진행과정 생략

        config.optimization.minimizer("TerserPlugin").use(TerserPlugin, [
          {
            extractComments: true,
            terserOptions: { ie8: false }
          }
        ]);

        return config.output
          .jsonpFunction("ExampleJsonp") // jsonp 함수를 사용하기 위한 기능
          .end()
          .plugin("provide") // vue 전역에서 해당 모듈 임포트 하지않아도 사용가능
          .use(webpack.ProvidePlugin, [
            {
              Cookies: "js-cookie/src/js.cookie.js"
            }
          ])
          .end()
          .plugin("define") // vue cli 환경설정내에서 정의한것을 vue내부에서도 사용가능
          .use(webpack.DefinePlugin, [
            {
              "process.env": JSON.stringify(process.env)
            }
          ])
          .end();
      }
    };
  }
};
