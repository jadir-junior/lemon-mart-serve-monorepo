"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const IsProd = process.env.NODE_ENV === 'production';
const Port = process.env.PORT || 3000;
const MongoUri = process.env.MONGO_URI || '';
const JwtSecret = () => process.env.JWT_SECRET || '';
exports.config = { IsProd, Port, MongoUri, JwtSecret };
//# sourceMappingURL=config.js.map