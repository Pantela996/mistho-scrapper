import express, { NextFunction, Response } from 'express';
import UserProfileService from '../services/UserProfileService';
import path from 'path';
import mime from 'mime';
import ResponseModel from '../models/ResponseModel';
import { getFileFromDirectory } from '../util/FileManager';
const router = express.Router();

router.get('/', async (req: any, res: Response, next: NextFunction) => {
  let response = await UserProfileService.getUserProfile(req.query.email);
  res.status(response.statusCode);
  res.send(response);
});

router.get('/all', async (req: any, res: Response, next: NextFunction) => {
  let response = await UserProfileService.getAllUsersProfiles();
  res.status(response.statusCode);
  res.send(response);
});

router.get('/download', async (req: any, res: Response, next: NextFunction) => {
  let file = `${path.resolve(__dirname, `../../tmp/${req.query.url}`)}`;

  const callback = (files: string[]) => {
    try {
      file = file + `\\${files[0]}`;

      const filename = path.basename(file);
      const mimetype = mime.lookup(file);

      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);
      res.status(200);
      res.download(file); // Set disposition and send it.
    } catch (err : any) {
      console.log(err.message);
      res.send(
        new ResponseModel().Failed({
          message: (err as any).message,
          messageCode: 'FAILED',
        }, 500)
      );
    }
  };

  await getFileFromDirectory(file, callback);
});

export default router;
