module.exports = function (express) {
    const router = express.Router();

    // Chargepoints routes
    require("./chargepoints.js")(router);

    return router;
};