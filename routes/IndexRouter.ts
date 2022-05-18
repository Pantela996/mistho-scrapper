import express from 'express';
const router = express.Router();
import RequestValidator from '../middlewares/RequestValidator';
import UserProfileScrappingIntegrationService from '../services/UserProfileScrappingIntegrationService';

router.post(
  '/',
  [RequestValidator.checkParams],
  async (req: any, res: any, next: any) => {
    let response = await UserProfileScrappingIntegrationService.ScrapeUserData(
      req.body
    );
    res.status(response.statusCode);
    res.send(response);
  }
);

export default router;
