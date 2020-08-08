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


function extractDataFromXML(returnBody: string): Promise<Array<stopFinderRequest> | string>{
    return new Promise<Array<stopFinderRequest> | string>((resolve, reject) => {

        const parser = new xml2js.Parser();
        parser.parseString(returnBody, (err: string, data: any) => {
            if(err){
                reject(err);
            }else{
                const usefulResponse = data.itdRequest.itdStopFinderRequest[0].itdOdv;
                const stopFinderRequestArray: Array<stopFinderRequest> = [];
                for(let i = 0; i < usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop.length; i++){
                    const newStopFinderRequest: stopFinderRequest = {
                        nearestStopName: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.nameWithPlace,
                        nearestStopId: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.stopID,
                        nearestStopPlace: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.place,
                        nearestStopDistance: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.distance,
                        nearestStopDistanceTime: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.distanceTime,
                        nearestPlace: usefulResponse[0].itdOdvPlace[0].odvPlaceElem[0]._,
                        nearestStreet: usefulResponse[0].itdOdvName[0].odvNameElem[0]._,
                    }
                    stopFinderRequestArray.push(newStopFinderRequest);
                } 
                resolve(stopFinderRequestArray);
            }
        });
    });
}

function getXMLData(longitude: string, latitude: string): Promise<string>{
    return new Promise<string>((resolve, reject) => {
        request('http://efa.sta.bz.it/apb/XML_STOPFINDER_REQUEST?locationServerActive=0&type_sf=coord&name_sf=' + longitude +':' + latitude +':WGS84[DD.DDDDD]', (reqErr, reqRes, reqBody) => {
            if(reqErr){
                reject(reqErr);
            }else{
                resolve(reqBody);
            }
        });
    });
}

async function findLocationAction(longitude: string, latitude: string): Promise<Array<stopFinderRequest> | string> {
    if(longitude.match(/[^0-9.]+/) != null || latitude.match(/[^0-9.]+/) != null){
        throw('Latitude or Longitude are not numbers');
    }
    const index_lat: number = latitude.indexOf('.');
    const index_lon: number = longitude.indexOf('.');
    if((latitude.length-1 - index_lat) != 5 || (longitude.length-1 - index_lon) != 5){
        throw('Latitude and Langitude have to have 5 digits after the comma');
    }

    let xmlData: string = '';
    try {
        xmlData = await getXMLData(longitude, latitude);
    } catch (error) {
        throw(error);
    }
    let processedData: Array<stopFinderRequest> | string = '';
    try {
        processedData = await extractDataFromXML(xmlData);
    } catch (error) {
        throw(error);
    }
    return processedData;
}

export {
    findLocationAction,
    stopFinderRequest
}