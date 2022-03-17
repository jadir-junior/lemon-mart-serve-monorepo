"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_1 = require("../../models/user");
const auth_service_1 = require("../../services/auth.service");
const user_service_1 = require("../../services/user.service");
const router = (0, express_1.Router)();
exports.router = router;
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_1.UserCollection.findOne({ email: email.toLowerCase() });
    if (user && (yield user.comparePassword(req.body.password))) {
        return res.send({ accessToken: yield (0, user_service_1.createJwt)(user) });
    }
    return res.status(401).json({ message: auth_service_1.IncorrectEmailPasswordMessage });
}));
router.get('/me', (0, auth_service_1.authenticate)(), (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentUser } = res.locals;
    if (currentUser) {
        return res.send(currentUser);
    }
    return res.status(401).send({ message: auth_service_1.AuthenticationRequiredMessage });
}));
//# sourceMappingURL=auth.routes.js.map