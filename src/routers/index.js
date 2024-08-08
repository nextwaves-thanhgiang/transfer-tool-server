const user = require("./userRouter");
const transfer = require("./transferRouter");

function route(app) {
  // app.use("/crawl", data);
  // app.use("/pasternack", pasternack);
  app.use("/api/user", user);
  app.use("/api/transfer", transfer);
}

module.exports = route;
