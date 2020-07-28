import request from 'request';
import express from 'express';
import * as xml2js from 'xml2js';

interface stopFinderRequest {
    nearestStopName: string;
    nearestStopId: string;
    nearestStopPlace: string;
    nearestStopDistance: string;
    nearestStopDistanceTime: string;
    nearestPlace: string;
    nearestStreet: string;
}


function extractDataFromXML(res: express.Response, returnBody: string): void{
    const parser = new xml2js.Parser();
    parser.parseString(returnBody, (err: string, data: any) => {
        if(err){
            res.end(err);
            res.sendStatus(500);
        }else{
            const usefulResponse = data.itdRequest.itdStopFinderRequest[0].itdOdv;
            const stopFinderRequestArray: Array<stopFinderRequest> = [];
            for(let i = 0; i < usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop.length; i++){
                const newStopFinderRequest: stopFinderRequest = {
                    nearestStopName: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.nameWithPlace,
                    nearestStopId: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.stopId,
                    nearestStopPlace: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.place,
                    nearestStopDistance: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.distance,
                    nearestStopDistanceTime: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.distanceTime,
                    nearestPlace: usefulResponse[0].itdOdvPlace[0].odvPlaceElem[0]._,
                    nearestStreet: usefulResponse[0].itdOdvName[0].odvNameElem[0]._,
                }
                stopFinderRequestArray.push(newStopFinderRequest);
            } 
            res.json(stopFinderRequestArray);

        }
    })
}

function findLocationAction(req: express.Request, res: express.Response): void{
    const longitude: string = req.body.lon;
    const latitude: string = req.body.lat;
    let returnBody: string;
    request('http://efa.sta.bz.it/apb/XML_STOPFINDER_REQUEST?locationServerActive=0&type_sf=coord&name_sf=' + longitude +':' + latitude +':WGS84[DD.DDDDD]', (reqErr, reqRes, reqBody) => {
        if(reqErr){
            res.sendStatus(500);
            res.end(reqErr);
        }else{
            returnBody = reqBody;
            extractDataFromXML(res, returnBody);
        }
    });
}

export default findLocationAction;