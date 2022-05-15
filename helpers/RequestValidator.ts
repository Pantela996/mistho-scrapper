const ResponseModel = require("../models/ResponseModel");
import { Request, Response, NextFunction } from 'express';

class RequestValidator {

    checkParams(req: Request, res: Response, next: NextFunction) {
        if (!req.body.username || !req.body.password) return res.json(new ResponseModel().Failed('Invalid query params'));
        next();
    }

}

export default new RequestValidator();