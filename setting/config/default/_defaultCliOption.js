const path = require("path");
const page = require(path.join(process.env.INIT_CWD, "vue.page.js"));

const getPageConfig = require("./_getPageConfig");

module.exports = {
  getDefaultOption: function() {
    console.log(getPageConfig(page));

    return {
      pages: getPageConfig(page)
    };
  }
};
