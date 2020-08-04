import request from 'request';
import * as xml2js from 'xml2js';

class Point {
    name: string = '';
    usage: string = '';
    locality: string = '';
}

class Part {
    distance: string = '';
    type: string = '';
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
                let allTrips: Array<Trip> = []; 
                for(let i = 0; i < usefulResponse.length; i++){
                    let currTrip: Trip = new Trip();
                    currTrip.totalTime = usefulResponse[i].$.publicDuration;
                    currTrip.vehicleTime = usefulResponse[i].$.vehicleTime;
                    for(let a = 0; a < usefulResponse[i].itdPartialRouteList.length; a++){
                        let currPart: Part = new Part();
                        for(let b = 0; b < usefulResponse[i].itdPartialRouteList.itdPartialRoute.itdPoint.length; b++){
                            let currPoint: Point = new Point();
                            currPoint.name = usefulResponse[i].itdPartialRouteList[a].itdPartialRoute.itdPoint[b].name;
                            currPoint.usage = usefulResponse[i].itdPartialRouteList[a].itdPartialRoute.itdPoint[b].usage;
                            currPoint.locality = usefulResponse[i].itdPartialRouteList[a].itdPartialRoute.itdPoint[b].locality;
                            currPart.points.push(currPoint);
                        }
                        currPart.type = usefulResponse[i].itdPartialRouteList[a].itdPartialRoute.itdMeansOfTransport.productName; 
                        currPart.distance = usefulResponse[i].itdPartialRouteList[a].itdPartialRoute.$.distance; 
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