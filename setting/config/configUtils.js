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

const applyChain = (func, config) => (func ? func(config) : null);

module.exports = {
  modeConfigurer: function(projectConfigurer) {
    if (process.env.FRONT_MODE === "publish") {
      const requiredConfig = require(`./default/${process.env.FRONT_MODE}.config.js`);
      // console.log(requiredConfig);

      return merge.all([
        defaultOption,
        projectConfigurer,
        requiredConfig,
        {
          chainWebpack: config => {
            applyChain(defaultOption.chainWebpack, config);
            applyChain(projectConfigurer.chainWebpack, config);
            applyChain(requiredConfig.chainWebpack, config);
          }
        }
      ]);
    } else {
      return merge.all([defaultOption, projectConfigurer]);
    }
  }
};
