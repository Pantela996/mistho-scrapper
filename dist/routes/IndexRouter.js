"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const RequestValidator_1 = __importDefault(require("../middlewares/RequestValidator"));
const UserProfileScrappingIntegrationService_1 = __importDefault(require("../services/UserProfileScrappingIntegrationService"));
router.post('/', [RequestValidator_1.default.checkParams], async (req, res, next) => {
    let response = await UserProfileScrappingIntegrationService_1.default.ScrapeUserData(req.body);
    res.status(response.statusCode);
    res.send(response);
});
exports.default = router;
//# sourceMappingURL=IndexRouter.js.map