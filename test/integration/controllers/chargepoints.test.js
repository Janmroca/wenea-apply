const app = require("../../../src/server.js");
const request = require("supertest");


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
            .send(
                {
                    status: "ready"
                }
            )
            .end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.be.equal("Name must be specified.");
                done();
            });
    });

    it("should FAIL if specified status is incorrect", (done) => {
        request(app)
            .post("/chargepoint")
            .send(
                {
                    status: "wrong-status"
                }
            )
            .end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.be.equal("Specified status is not valid.");
                done();
            });
    });

    it("should FAIL if specified name is longer than 32 characters", (done) => {
        request(app)
            .post("/chargepoint")
            .send(
                {
                    status: "ready",
                    name: "123456789012345678901234567890123"
                }
            )
            .end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.text).to.be.equal("Name can't be longer than 32 characters.");
                done();
            });
    });

    it("should CREATE a new chargepoint with specified parameters", (done) => {
        request(app)
            .post("/chargepoint")
            .send(
                {
                    status: "ready",
                    name: "sample-name"
                }
            )
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.text).to.be.equal(0);
                done();
            });
    });

});