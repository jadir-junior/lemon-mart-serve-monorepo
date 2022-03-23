"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const express_1 = require("express");
const v1_1 = require("./v1");
const v2_1 = require("./v2");
const api = (0, express_1.Router)();
exports.api = api;
api.use('/v1', v1_1.router);
api.use('/v2', v2_1.router);
//# sourceMappingURL=api.js.map