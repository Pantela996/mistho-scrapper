"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileFromDirectory = exports.deleteDirectory = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const deleteDirectory = async (urlHash) => {
    const dirPath = path_1.default.resolve(__dirname, `../../tmp/${urlHash}`);
    if (fs_1.default.existsSync(dirPath)) {
        fs_1.default.readdirSync(dirPath).forEach(function (entry) {
            var entry_path = path_1.default.join(dirPath, entry);
            if (fs_1.default.lstatSync(entry_path).isDirectory()) {
                deleteDirectory(entry_path);
            }
            else {
                fs_1.default.unlinkSync(entry_path);
            }
        });
        fs_1.default.rmdirSync(dirPath);
    }
};
exports.deleteDirectory = deleteDirectory;
const getFileFromDirectory = async (file, cb) => {
    fs_1.default.readdir(file, (err, files) => {
        cb(files);
    });
};
exports.getFileFromDirectory = getFileFromDirectory;
//# sourceMappingURL=FileManager.js.map