const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const stubPath = path.join(
  process.env.INIT_CWD,
  "./frontend/resources",
  "./stub"
);

module.exports = {
  devServer: {
    port: 4000,
    open: true,
    disableHostCheck: true,

    setup: function(app, server) {
      app.use(cookieParser()); // cookie parser
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      require(path.join(stubPath, "./app"))(app); //

      const publicPath = process.env.publicPath;

      app.all(`${publicPath}stub/**`, (req, res) => {
        const data = require(path.join(
          stubPath,
          `../${req.path.replace(publicPath, "")}`
        ));

        const method = Object.keys(data).find(
          key => key.toUpperCase() === req.method
        );

        if (method) {
          res.send(data[method](req));
        } else {
          res.send(data);
        }
      });
    }
  }
};
