import express, { NextFunction, Request, Response } from 'express';
import UserProfileService from '../services/UserProfileService';
import path from 'path';
import mime from 'mime';
import fs from 'fs';
const router = express.Router();

router.get('/', async (req: any, res: Response, next: NextFunction) => {
    let response = await UserProfileService.getUserProfile(req.query.email);
    res.send(response);
});

router.get('/all', async (req: any, res: Response, next: NextFunction) => {
    let response = await UserProfileService.getAllUsersProfiles();
    res.status(200);
    res.send(response);
});

router.get('/download', async (req: any, res: Response, next: NextFunction) => {
    let file = `${path.resolve(__dirname, `../../tmp/${req.query.url}`)}`;

    fs.readdir(file, (err, files) => {
        file = file + `\\${files[0]}`;
        console.log(file);
        if(fs.existsSync(file)) console.log("here exists");
    
        const filename = path.basename(file);
        const mimetype = mime.lookup(file);
    
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
        res.download(file); // Set disposition and send it.
    });


});

export default router;