const merge = require("deepmerge");

console.log(process.env.FRONT_MODE);

module.exports = {
  modeConfigurer: function(projectConfigurer) {
    return merge({}, projectConfigurer);
  }
};
