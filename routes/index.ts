import express from 'express';
import ResponseModel from '../models/ResponseModel';
const router = express.Router();
import RequestValidator from '../helpers/RequestValidator';
import Browser from '../scrapper/browser';

/* GET home page. */
router.post('/', [RequestValidator.checkParams], async (req : any, res : any, next : any) => {
  let response = await Browser.crawl("https://www.glassdoor.com/index.htm", req.body);
  console.log(response);
  res.status(200);
  res.send(ResponseModel.Success("Success"));
});

export default router;