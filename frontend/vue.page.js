module.exports = {
  index: {
    entry: "main.js",
    template: "templates/index.html", //원본 템플릿
    publishTemplate: "stub/index.html", // 퍼블리시 모드에서 사용할 템플릿
    filename: "templates/dist/index/html" // 빌드후 사용할 템플릿
  }
};
