const controller = require("./../controllers/chargepoints.js");

module.exports = function (router) {

    router.post("/chargepoint",
        controller.createChargepoint); 

    router.delete("/chargepoint/:id",
        controller.deleteChargepoint); 

    router.get("/chargepoint",
        controller.getChargepoints); 

    router.get("/chargepoint/:id",
        controller.getChargepoint); 

    router.put("/chargepoint/:id/status",
        controller.updateChargepointStatus); 
  };