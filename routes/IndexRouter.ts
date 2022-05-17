import express from 'express';
const router = express.Router();
import RequestValidator from '../middlewares/RequestValidator';
import ScrappingService from '../services/ScrappingService';

router.post(
  '/',
  [RequestValidator.checkParams],
  async (req: any, res: any, next: any) => {
    let response = await ScrappingService.ScrapeUserData(req.body);
    res.status(200);
    res.send(response);
  }
);

export default router;
