export default (app) => {
  const robots = require("../controllers/robot.controller.js");

  var router = require("express").Router();

  router.get("/:table", robots.getAllData);
  router.get(
    "/:table/:city/:place/:machine/:type/:module/:signalName/:signalNumber/:measure",
    robots.getSignalData
  );
  router.get("/:table/filter", robots.getrealfilter);

  app.use("/api/robots", router);
};
