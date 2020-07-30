import request from 'request';
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

type extractDataFromXMLCallback = (stopRequest: Array<stopFinderRequest> | string) => void;
type findLocationActionCallback = (stopRequest: Array<stopFinderRequest> | string) => void;


function extractDataFromXML(returnBody: string, callback: extractDataFromXMLCallback): void{
    const parser = new xml2js.Parser();
    parser.parseString(returnBody, (err: string, data: any) => {
        if(err){
            callback(err);
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
            callback(stopFinderRequestArray);
        }
    });
}

function findLocationAction(longitude: string, latitude: string, callback: findLocationActionCallback): void{

        request('http://efa.sta.bz.it/apb/XML_STOPFINDER_REQUEST?locationServerActive=0&type_sf=coord&name_sf=' + longitude +':' + latitude +':WGS84[DD.DDDDD]', (reqErr, reqRes, reqBody) => {
            if(reqErr){
                callback(reqErr);
            }else{
                extractDataFromXML(reqBody, (stopRequest: Array<stopFinderRequest> | string) => {
                    callback(stopRequest);
                });
            }
        });
}

export {
    findLocationAction,
    stopFinderRequest
}