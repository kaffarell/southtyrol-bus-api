import request from 'request';
import * as xml2js from 'xml2js';

interface Point {
    name: string;
    usage: string;
    locality: string;
}

interface routeParts {
    parts: Array<Parts>;
}

interface Parts {
    distance: string;
    type: string;
    points: Array<Point>;
}

interface Trip {
    totalTime: string;
    vehicleTime: string;
    routeParts: routeParts; 
}


function getXMLData(longitudeOrigin: string, latitudeOrigin: string, longitudeDestination: string, latitudeDestination: string): Promise<string>{
    return new Promise<string>((resolve, reject) => {
        request('http://efa.sta.bz.it/apb/XML_TRIP_REQUEST2?locationServerActive=1&type_origin=coord&name_origin=' + longitudeOrigin + ':' + latitudeOrigin + ':WGS84[DD.DDDDD]&type_destination=coord&name_destination=' + longitudeDestination + ':' + latitudeDestination + ':WGS84[DD.DDDDD]', (reqErr, reqRes, reqBody) => {
            if(reqErr){
                reject(reqErr);
            }else{
                resolve(reqBody);
            }
        });
    });
}

function extractDataFromXML(returnBody: string){
    return new Promise<Array<Trip> | string>((resolve, reject) => {
        const parser = new xml2js.Parser();
        parser.parseString(returnBody, (err: string, data: any) => {
            if(err){
                reject(err);
            }else{
                const usefuleResponse = data.itdRequest.itdTripRequest[0].itdItinerary[0].itdRouteList[0].itdRoute;
                console.log(usefuleResponse.length);
                resolve(usefuleResponse);
                
            }
        });
    });
}

async function findTripAction(longitudeOrigin: string, latitudeOrigin: string, longitudeDestination: string, latitudeDestination: string): Promise<Array<Trip> | string>{
    const xmlData = await getXMLData(longitudeOrigin, latitudeOrigin, longitudeDestination, latitudeDestination);
    const processedData = await extractDataFromXML(xmlData);
    return processedData;
}

export {
    findTripAction,
    Trip
}