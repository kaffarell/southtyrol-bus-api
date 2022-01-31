import axios from 'axios';
import pino from 'pino';

const logger = pino();

interface IStopFinderRequest {
    nearestStopName: string;
    nearestStopId: string;
    nearestStopPlace: string;
    nearestStopDistance: string;
    nearestStopDistanceTime: string;
}


function extractDataFromJson(returnBody: any): Promise<Array<IStopFinderRequest> | string>{
    return new Promise<Array<IStopFinderRequest> | string>((resolve, reject) => {

        try{
            const usefulResponse = returnBody.stopFinder.itdOdvAssignedStops;
            const stopFinderRequestArray: Array<IStopFinderRequest> = [];
            for(let i = 0; i < usefulResponse.length; i++){
                const newStopFinderRequest: IStopFinderRequest = {
                    nearestStopName: usefulResponse[i].nameWithPlace,
                    nearestStopId: usefulResponse[i].stopID,
                    nearestStopPlace: usefulResponse[i].place,
                    nearestStopDistance: usefulResponse[i].distance,
                    nearestStopDistanceTime: usefulResponse[i].distanceTime,
                }
                stopFinderRequestArray.push(newStopFinderRequest);
            } 
            resolve(stopFinderRequestArray);
        }catch(e) {
            reject(e);
        }
    });
}

function getData(longitude: string, latitude: string): Promise<string>{
    return new Promise<string>((resolve, reject) => {
        axios.get('http://efa.sta.bz.it/apb/XML_STOPFINDER_REQUEST?locationServerActive=0&type_sf=coord&name_sf=' + longitude +':' + latitude +':WGS84[DD.DDDDD]&outputFormat=json')
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                if(error.reponse) {
                    logger.error(error.response.data);
                    logger.error(error.response.status);
                    logger.error(error.response.headers);
                }
                reject(error);
            });
    });
}

async function findLocationAction(longitude: string, latitude: string): Promise<Array<IStopFinderRequest> | string> {
    if(longitude.match(/[^0-9.]+/) != null || latitude.match(/[^0-9.]+/) != null){
        throw('Latitude or Longitude are not numbers');
    }
    const index_lat: number = latitude.indexOf('.');
    const index_lon: number = longitude.indexOf('.');
    if((latitude.length-1 - index_lat) != 5 || (longitude.length-1 - index_lon) != 5){
        throw('Latitude and Langitude have to have 5 digits after the comma');
    }

    let jsonData: string = '';
    try {
        jsonData = await getData(longitude, latitude);
    } catch (error) {
        throw(error);
    }
    let processedData: Array<IStopFinderRequest> | string = '';
    try {
        processedData = await extractDataFromJson(jsonData);
    } catch (error) {
        throw(error);
    }
    return processedData;
}

export {
    findLocationAction,
    IStopFinderRequest as stopFinderRequest
}