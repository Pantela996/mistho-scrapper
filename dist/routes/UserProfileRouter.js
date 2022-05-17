"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserProfileService_1 = __importDefault(require("../services/UserProfileService"));
const path_1 = __importDefault(require("path"));
const mime_1 = __importDefault(require("mime"));
const ResponseModel_1 = __importDefault(require("../models/ResponseModel"));
const FileManager_1 = require("../util/FileManager");
const router = express_1.default.Router();
router.get('/', async (req, res, next) => {
    let response = await UserProfileService_1.default.getUserProfile(req.query.email);
    res.send(response);
});
router.get('/all', async (req, res, next) => {
    let response = await UserProfileService_1.default.getAllUsersProfiles();
    res.status(200);
    res.send(response);
});
router.get('/download', async (req, res, next) => {
    let file = `${path_1.default.resolve(__dirname, `../../tmp/${req.query.url}`)}`;
    const callback = (files) => {
        try {
            file = file + `\\${files[0]}`;
            const filename = path_1.default.basename(file);
            const mimetype = mime_1.default.lookup(file);
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);
            res.download(file); // Set disposition and send it.
        }
        catch (err) {
            res.status(500);
            res.send(new ResponseModel_1.default().Failed({
                message: err.message,
                messageCode: 'FAILED',
            }));
        }
    };
    await (0, FileManager_1.getFileFromDirectory)(file, callback);
});
exports.default = router;
//# sourceMappingURL=UserProfileRouter.js.map