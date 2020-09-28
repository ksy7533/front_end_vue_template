const express = require("express");
const cookieParser = require("cookie-parser");

module.exports = {
  devServer: {
    port: 4000,
    open: true,
    disableHostCheck: true,

    setup: function(app, server) {
      app.use(cookieParser()); // cookie parser
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
    }
  }
};
