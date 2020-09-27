const merge = require("deepmerge");
const path = require("path");
const { getDefaultOption } = require("./default/_defaultCliOption");

global.ZUM_OPTION = merge(
  {
    resourcePath: path.join(process.env.INIT_CWD, "./resources")
  },
  global.ZUM_OPTION || {}
);

const defaultOption = getDefaultOption();

module.exports = {
  modeConfigurer: function(projectConfigurer) {
    if (process.env.FRONT_MODE === "publish") {
      return merge.all([defaultOption, projectConfigurer]);
    }
  }
};
