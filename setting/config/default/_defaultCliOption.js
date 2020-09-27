const path = require("path");
const page = require(path.join(process.env.INIT_CWD, "vue.page.js"));

const getPageConfig = require("./_getPageConfig");

module.exports = {
  getDefaultOption: function() {
    console.log(getPageConfig(page));
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

      pages: getPageConfig(page)
    };
  }
};
