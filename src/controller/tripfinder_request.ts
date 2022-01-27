import request from 'request';

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


function getData(longitudeOrigin: string, latitudeOrigin: string, longitudeDestination: string, latitudeDestination: string): Promise<string>{
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


function extractDataFromJson(returnBody: string){
    return new Promise<Array<Trip> | string>((resolve, reject) => {
        const parsedJson = JSON.parse(returnBody);
        try{
            const usefulResponse = parsedJson.itdRequest.itdTripRequest[0].itdItinerary[0].itdRouteList[0].itdRoute;
            // Go trough all possible routes:
            const allTrips: Array<Trip> = []; 
            for(let i = 0; i < usefulResponse.length; i++){
                const currTrip: Trip = new Trip();
                currTrip.totalTime = usefulResponse[i].$.publicDuration;
                currTrip.vehicleTime = usefulResponse[i].$.vehicleTime;
                // Go trough all Parts of a route
                for(let a = 0; a < usefulResponse[i].itdPartialRouteList[0].itdPartialRoute.length; a++){
                    const currPart: Part = new Part();
                    // Go trough all points of a part
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
                
        }catch{
            reject();
        }
    });
}

async function findTripAction(longitudeOrigin: string, latitudeOrigin: string, longitudeDestination: string, latitudeDestination: string): Promise<Array<Trip> | string> {
    if(longitudeOrigin.match(/[^0-9.]+/) != null || latitudeOrigin.match(/[^0-9.]+/) != null || longitudeDestination.match(/[^0-9.]+/) != null || latitudeDestination.match(/[^0-9.]+/) != null){
        throw('Latitude or Longitude are not numbers');
    }
    const index_lat_or: number = latitudeOrigin.indexOf('.');
    const index_lon_or: number = longitudeOrigin.indexOf('.');
    const index_lat_dest: number = latitudeDestination.indexOf('.');
    const index_lon_dest: number = longitudeDestination.indexOf('.');
    
    if((latitudeOrigin.length-1 - index_lat_or) != 5 || (longitudeOrigin.length-1 - index_lon_or) != 5){
        throw('Latitude and Langitude have to have 5 digits after the comma');
    }
    if((latitudeDestination.length-1 - index_lat_dest) != 5 || (longitudeDestination.length-1 - index_lon_dest) != 5){
        throw('Latitude and Langitude have to have 5 digits after the comma');
    }

    let jsonData: string = '';
    try{
        jsonData = await getData(longitudeOrigin, latitudeOrigin, longitudeDestination, latitudeDestination);
    }catch(e){
        throw(e);
    }
    let processedData: Array<Trip> | string = '';
    try{
        processedData = await extractDataFromJson(jsonData);
    }catch(e){
        throw(e);
    }
    return processedData;
}

export {
    findTripAction,
    Trip
}