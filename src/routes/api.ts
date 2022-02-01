import express from 'express';
import  { findLocationAction, stopFinderRequest } from '../controller/stopfinder_request';
import  { findTripAction, Trip } from '../controller/tripfinder_request';
import  { dmRequestAction, IDmRequest } from '../controller/dm_request';



const Router: express.Router = express.Router();


Router.get('/', (req: express.Request, res: express.Response) => {
    res.send("Cannot get /");
});

Router.post('/stopFinder', (req: express.Request, res: express.Response) => {
    findLocationAction(req.body.lon, req.body.lat)
        .then((stops: Array<stopFinderRequest> | string) => {
            res.json(stops);
        })
        .catch((err: string) => {
            res.send('Error: ' + err);
        });
});

Router.post('/tripFinder', (req: express.Request, res: express.Response) => {
    findTripAction(req.body.lon_or, req.body.lat_or, req.body.lon_dest, req.body.lat_dest)
        .then((trips: Array<Trip> | string) => {
            res.json(trips);
        })
        .catch((err: string) => {
            res.send('Error: ' + err);
        });
});

Router.post('/dm', (req: express.Request, res: express.Response) => {
    dmRequestAction(req.body.stopId)
        .then((dm: Array<IDmRequest> | string) => {
            res.json(dm);
        })
        .catch((err: string) => {
            res.send('Error: ' + err);
        });
})

export default Router;