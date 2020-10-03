module.exports = {
  index: {
    entry: "frontend/main.js",
    template: "templates/index.html", //원본 템플릿 경로
    publishTemplate: "stub/index.html", // 퍼블리시 모드에서 사용할 템플릿 경로
    // filename: "templates/dist/index.html", // 빌드후 사용할 템플릿 경로
    path: ["/test", "/*"] // dev 모드 프록시에 적용할 path
  }
};
