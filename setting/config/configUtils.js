const merge = require("deepmerge");
module.exports = {
  modeConfigurer: function(projectConfigurer) {
    return merge({}, projectConfigurer);
  }
};
