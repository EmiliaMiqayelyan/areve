"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const sequelize_1 = require("./config/sequelize");
require("./models");
async function bootstrap() {
    await sequelize_1.sequelize.authenticate();
    app_1.default.listen(env_1.env.port, () => {
        console.log(`Backend running on http://localhost:${env_1.env.port}`);
    });
}
bootstrap().catch((error) => {
    console.error("Failed to start backend", error);
    process.exit(1);
});
