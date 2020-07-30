import express from 'express';
import  { findLocationAction, stopFinderRequest } from '../controller/stopfinder_request';

const Router: express.Router = express.Router();



Router.get('/', (req: express.Request, res: express.Response) => {
    res.send("Api under Construction 🚧");
});

Router.post('/stopFinder', (req: express.Request, res: express.Response) => {
    findLocationAction(req.body.lon, req.body.lat, (stopRequest: Array<stopFinderRequest> | string) => {
        res.json(stopRequest);
    });
});

export default Router;