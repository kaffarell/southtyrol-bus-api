import request from 'request';
import * as xml2js from 'xml2js';

class Point {
    name: string = '';
    usage: string = '';
    locality: string = '';
    placeID: string = '';
}

class Part {
    distance: string = '';
    type: string = '';
    timeMinute: string = '';
    points: Array<Point> = [];

}

class Trip {
    totalTime: string = '';
    vehicleTime: string = '';
    routeParts: Array<Part> = []; 
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
                // Go trough all possible routes:
                const allTrips: Array<Trip> = []; 
                for(let i = 0; i < usefulResponse.length; i++){
                    const currTrip: Trip = new Trip();
                    currTrip.totalTime = usefulResponse[i].$.publicDuration;
                    currTrip.vehicleTime = usefulResponse[i].$.vehicleTime;
                    for(let a = 0; a < usefulResponse[i].itdPartialRouteList[0].itdPartialRoute.length; a++){
                        const currPart: Part = new Part();
                        for(let b = 0; b < usefulResponse[i].itdPartialRouteList[0].itdPartialRoute[a].itdPoint.length; b++){
                            const currPoint: Point = new Point();
                            currPoint.name = usefulResponse[i].itdPartialRouteList[0].itdPartialRoute[a].itdPoint[b].$.name;
                            currPoint.usage = usefulResponse[i].itdPartialRouteList[0].itdPartialRoute[a].itdPoint[b].$.usage;
                            currPoint.locality = usefulResponse[i].itdPartialRouteList[0].itdPartialRoute[a].itdPoint[b].$.locality;
                            currPoint.placeID = usefulResponse[i].itdPartialRouteList[0].itdPartialRoute[a].itdPoint[b].$.placeID;
                            currPart.points.push(currPoint);
                        }
                        currPart.type = usefulResponse[i].itdPartialRouteList[0].itdPartialRoute[a].itdMeansOfTransport[0].$.productName; 
                        currPart.distance = usefulResponse[i].itdPartialRouteList[0].itdPartialRoute[a].$.distance; 
                        currPart.timeMinute = usefulResponse[i].itdPartialRouteList[0].itdPartialRoute[a].$.timeMinute; 
                        currTrip.routeParts.push(currPart);
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