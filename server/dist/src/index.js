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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instance = void 0;
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const config_1 = require("./config");
const document_ts_1 = __importDefault(require("document-ts"));
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting server: ');
        console.log(`isProd: ${config_1.config.IsProd}`);
        console.log(`port: ${config_1.config.Port}`);
        console.log(`mongoUri: ${config_1.config.MongoUri}`);
        if (!config_1.config.JwtSecret() || config_1.config.JwtSecret() === 'xxxxxx') {
            throw new Error('JWT_SECRET env var not set or set to default value. Pick a secure password.');
        }
        try {
            yield document_ts_1.default.connect(config_1.config.MongoUri, config_1.config.IsProd);
            console.log('Connected to database!');
        }
        catch (error) {
            console.log(`Couldn't connect to a database: ${error}`);
        }
        exports.Instance = http_1.default.createServer(app_1.app);
        exports.Instance.listen(config_1.config.Port, () => __awaiter(this, void 0, void 0, function* () {
            console.log(`Server listening on port ${config_1.config.Port}...`);
            console.log('Initializing default user...');
            yield createIndexes();
            // Seed the database with a demo user. Replace with yout own function to seed admin users
            console.log('Done.');
        }));
    });
}
function createIndexes() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Create indexes...');
    });
}
start();
//# sourceMappingURL=index.js.map