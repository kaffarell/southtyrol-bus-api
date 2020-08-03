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
                const usefulResponse = data.itdRequest.itdTripRequest[0].itdItinerary[0].itdRouteList[0].itdRoute;
                const allTrips = {} as Array<Trip>;
                // Go trough all possible routes:
                
                for(let i = 0; i < usefulResponse.length; i++){
                    console.log('Test');
                    const currTrip = {} as Trip;
                    currTrip.totalTime = usefulResponse[i].$.publicDuration;
                    currTrip.vehicleTime = usefulResponse[i].$.vehicleTime;
                    const routeParts = {} as routeParts;
                    for(let a = 0; a < usefulResponse[i].itdPartialRouteList.length; a++){
                        const parts = {} as Parts;
                        for(let b = 0; b < usefulResponse[i].itdPartialRouteList.itdPartialRoute.itdPoint.length; b++){
                            const point = {} as Point;
                            point.name = usefulResponse[i].itdPartialRouteList.itdPartialRoute.itdPoint[b].name;
                            point.usage = usefulResponse[i].itdPartialRouteList.itdPartialRoute.itdPoint[b].usage;
                            point.locality = usefulResponse[i].itdPartialRouteList.itdPartialRoute.itdPoint[b].locality;
                            parts.points.push(point);
                        }
                        parts.type = usefulResponse[i].itdPartialRouteList.itdPartialRoute.itdMeansOfTransport.productName; 
                        parts.distance = usefulResponse[i].itdPartialRouteList.itdPartialRoute.$.distance; 
                        routeParts.parts.push(parts);
                    }
                    allTrips.push(currTrip);
                    
                }
                resolve(allTrips);
                
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