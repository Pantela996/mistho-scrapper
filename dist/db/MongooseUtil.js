"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
mongoose_1.default.Promise = global.Promise;
dotenv_1.default.config();
const { DB_HOST, DB_NAME, DB_PORT } = process.env;
const connectToDatabase = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true,
        };
        await mongoose_1.default.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, options);
    }
    catch (err) {
        console.log(err);
    }
};
exports.connectToDatabase = connectToDatabase;
//# sourceMappingURL=MongooseUtil.js.map