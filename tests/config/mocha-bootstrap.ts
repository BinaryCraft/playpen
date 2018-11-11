import "behavioural-describe-mocha";
import {expect, use} from "chai";
import {spy} from "sinon";
import sinonChai = require("sinon-chai");

use(sinonChai);

global.expect = expect;
global.spy = spy;