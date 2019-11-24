const app = require("../../../src/server.js");
const chargepointService = require("../../../src/services/chargepointService.js");
const request = require("supertest");
const timeFuncs = require("../../../src/helpers/time.js")

before( () => {
    chargepointService.initialize()
        .then( () => { return chargepointService.cleanCollection() })
})

beforeEach(() => {
    return chargepointService.initialize()
})

describe("POST /chargepoint", function() {

    it("should FAIL if no status is specified", (done) => {
        request(app)
            .post("/chargepoint")
            .end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.be.equal("Status must be specified.");
                done();
            });
    });

    it("should FAIL if no name is specified", (done) => {
        request(app)
            .post("/chargepoint")
            .send({
                status: "ready"
            }).end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.be.equal("Name must be specified.");
                done();
            });
    });

    it("should FAIL if specified status is incorrect", (done) => {
        request(app)
            .post("/chargepoint")
            .send({
                status: "wrong-status"
            }).end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.be.equal("Specified status is not valid.");
                done();
            });
    });

    it("should FAIL if specified name is longer than 32 characters", (done) => {
        request(app)
            .post("/chargepoint")
            .send({
                status: "ready",
                name: "123456789012345678901234567890123"
            }).end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.be.equal("Name can't be longer than 32 characters.");
                done();
            });
    });

    it("should CREATE a new chargepoint", (done) => {
        request(app)
            .post("/chargepoint")
            .send({
                status: "ready",
                name: "sample-name"
            }).end(function(err, res) {
                expect(res.statusCode).to.equal(201);
                expect(res.text).to.be.equal("0");
                done();
            });
    });

    it("should CREATE a new chargepoint with correct field", (done) => {
        request(app)
            .post("/chargepoint")
            .send({
                status: "ready",
                name: "test"
            }).end(function(err, res) {
                currentTime = timeFuncs.getCurrentTime()
                expect(res.statusCode).to.equal(201);
                expect(res.text).to.be.equal("1");
                chargepointService.findChargepoint({ name : "test" })
                    .then( (chargepoints) => {
                        expect(chargepoints.length).to.equal(1)
                        expect(chargepoints[0].name).to.equal("test")
                        expect(chargepoints[0].status).to.equal("ready")
                        expect(chargepoints[0].created_at.getTime() / 1000 ).to.be.at.least(currentTime)
                        done()
                })
            });
    });

    it("should FAIL when creating a new chargepoint with an already used name", (done) => {
        request(app)
            .post("/chargepoint")
            .send({
                status: "ready",
                name: "sample-name"
            }).end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.be.equal("Already exists a chargepoint with that name.");
                done();
            });
    });

});

describe("DELETE /chargepoint/:id", function() {

    it("should FAIL if a chargepoint with specified id doesn't exist", (done) => {
        request(app)
            .delete("/chargepoint/2")
            .end(function(err, res) {
                expect(res.statusCode).to.equal(404);
                expect(res.text).to.be.equal("Doesn't exist a chargepoint with that id.");
                done();
            });
    });

    it("should DELETE a chargepoint if id is correct", (done) => {
        request(app)
            .delete("/chargepoint/1")
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

    it("should UPDATE deleted_at field if id is correct", (done) => {
        request(app)
            .delete("/chargepoint/1")
            .end(function(err, res) {
                currentTime = timeFuncs.getCurrentTime()
                expect(res.statusCode).to.equal(200);
                chargepointService.findChargepoint({ name : "test" })
                    .then( (chargepoints) => {
                        expect(chargepoints.length).to.equal(1)
                        expect(chargepoints[0].deleted_at.getTime() / 1000 ).to.be.at.least(currentTime)
                        done()
                })
            });
    });
});

describe("GET /chargepoint/", function() {

    it("should GET all chargepoints", (done) => {
        request(app)
            .get("/chargepoint")
            .end(function(err, res) {
                expect(res.body.length).to.equal(2)
                done()
            });
    });
});

describe("GET /chargepoint/:id", function() {

    it("should FAIL when id is invalid", (done) => {
        request(app)
            .get("/chargepoint/2")
            .end(function(err, res) {
                expect(res.statusCode).to.equal(404);
                expect(res.text).to.be.equal("Doesn't exist a chargepoint with that id.");
                done()
            });
    });

    it("should GET a chargepoint", (done) => {
        request(app)
            .get("/chargepoint/1")
            .end(function(err, res) {
                expect(res.body.name).to.equal("test")
                expect(res.body.status).to.equal("ready")
                done()
            });
    });
});

describe("PUT /chargepoint/:id/status", function() {

    it("should FAIL if no status is specified", (done) => {
        request(app)
            .put("/chargepoint/1/status")
            .end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.be.equal("Status must be specified.");
                done();
            });
    });

    it("should FAIL if specified status is incorrect", (done) => {
        request(app)
            .put("/chargepoint/1/status")
            .send({
                status: "wrong-status"
            }).end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.be.equal("Specified status is not valid.");
                done();
            });
    });

    it("should FAIL when id is invalid", (done) => {
        request(app)
            .put("/chargepoint/2/status")
            .send({
                status: "ready"
            }).end(function(err, res) {
                expect(res.statusCode).to.equal(404);
                expect(res.text).to.be.equal("Doesn't exist a chargepoint with that id.");
                done()
            });
    });

    it("should UPDATE status of the chargepoint", (done) => {

        chargepointService.findChargepoint({ id: "1"})
            .then( chargepoint => {
                expect(chargepoint[0].status).to.be.equal("ready")
                request(app)
                    .put("/chargepoint/1/status")
                    .send({
                        status: "charging"
                    })
                    .end(function(err, res) {
                        chargepointService.findChargepoint({ id: "1"})
                            .then( chargepoint => {
                                expect(chargepoint[0].status).to.equal("charging")
                                done()
                            })
                    });
            })
    });
});