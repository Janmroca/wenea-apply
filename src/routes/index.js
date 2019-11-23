module.exports = function (express) {
    const router = express.Router();

    // Contributors routes
    require("./chargepoints.js")(router);

    return router;
};