global.chai = require("chai");
global.chai.should();
global.assert = require("chai").assert;

global.expect = global.chai.expect;
global.sinon = require("sinon");

global.sinonChai = require("sinon-chai");
global.chai.use(global.sinonChai);

var sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(global.sinon);
