"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const auth_routes_1 = require("./routes/auth.routes");
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.router = router;
router.use('/auth', auth_routes_1.router);
//# sourceMappingURL=index.js.map