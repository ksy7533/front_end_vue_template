const path = require("path");
module.exports = function getPageConfig(pageObj) {
  const mode = process.env.FRONT_MODE;

  Object.keys(pageObj).forEach(key => {
    if (!pageObj[key].template) return;
    pageObj[key].template = path.join(
      global.ZUM_OPTION.resourcePath,
      pageObj[key].template
    );

    if (mode === "publish") {
      if (pageObj[key].publishTemplate) {
        pageObj[key].template = path.join(
          global.ZUM_OPTION.resourcePath,
          pageObj[key].publishTemplate
        );
      }
      delete pageObj[key].filename;
    }
  });

  return pageObj;
};
