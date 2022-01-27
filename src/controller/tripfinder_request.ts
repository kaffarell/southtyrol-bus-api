import request from 'request';

class Point {
    name: string = '';
    usage: string = '';
    locality: string = '';
    placeID: string = '';
    date: string = '';
    time: string = '';
    rttime: string = '';
}

class Part {
    // TODO: check what this is
    realtime: string = '';
    // f.e. Bus, Fussweg etc
    product: string = '';
    // f.e. Bus line nr 503
    productNumber: string = '';
    timeMinute: string = '';
    points: Array<Point> = [];

}

class Trip {
    totalTime: string = '';
    // TODO: interchange and distance should be int
    interchange: string = '';
    distance: string = '';
    routeParts: Array<Part> = []; 
}


function getData(longitudeOrigin: string, latitudeOrigin: string, longitudeDestination: string, latitudeDestination: string): Promise<string>{
    return new Promise<string>((resolve, reject) => {
        request('http://efa.sta.bz.it/apb/XML_TRIP_REQUEST2?locationServerActive=1&type_origin=coord&name_origin=' + longitudeOrigin + ':' + latitudeOrigin + ':WGS84[DD.DDDDD]&type_destination=coord&name_destination=' + longitudeDestination + ':' + latitudeDestination + ':WGS84[DD.DDDDD]&outputFormat=json', (reqErr, reqRes, reqBody) => {
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
        let parsedJson;
        try{
            parsedJson = JSON.parse(returnBody);
        }catch(e){
            reject(e);
        }
        console.log(parsedJson.trips[0].legs[0].points);

        try{
            const usefulResponse = parsedJson.trips;
            // Go trough all possible routes:
            const allTrips: Array<Trip> = []; 
            for(let i = 0; i < usefulResponse.length; i++){
                const currTrip: Trip = new Trip();
                currTrip.totalTime = usefulResponse[i].duration;
                currTrip.interchange = usefulResponse[i].interchange;
                currTrip.distance = usefulResponse[i].distance;
                // Go trough all Parts of a route
                for(let a = 0; a < usefulResponse[i].legs.length; a++){
                    const currPart: Part = new Part();
                    // Go trough all points of a part
                    for(let b = 0; b < usefulResponse[i].legs[a].points.length; b++){
                        const currPoint: Point = new Point();
                        currPoint.name = usefulResponse[i].legs[a].points[b].name;
                        currPoint.usage = usefulResponse[i].legs[a].points[b].usage;
                        currPoint.locality = usefulResponse[i].legs[a].points[b].place;
                        currPoint.placeID = usefulResponse[i].legs[a].points[b].placeID;
                        currPoint.date = usefulResponse[i].legs[a].points[b].dateTime.date;
                        currPoint.time = usefulResponse[i].legs[a].points[b].dateTime.time;
                        currPoint.rttime = usefulResponse[i].legs[a].points[b].dateTime.rttime;
                        currPart.points.push(currPoint);
                    }
                    currPart.product = usefulResponse[i].legs[a].mode.product; 
                    currPart.productNumber = usefulResponse[i].legs[a].mode.number; 
                    currPart.timeMinute = usefulResponse[i].legs[a].timeMinute; 
                    currPart.realtime = usefulResponse[i].legs[a].mode.realtime; 
                    currTrip.routeParts.push(currPart);
                }
                allTrips.push(currTrip);
                
            }
            resolve(allTrips);
                
        }catch(e){
            reject(e);
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