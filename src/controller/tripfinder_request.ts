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

interface Trips {
    trips: Array<Trip>;
}


function getXMLData(longitudeOrigin: string, latitudeOrigin: string, longitudeDestination: string, latitudeDestination: string){

}

function extractDataFromXML(){

}

async function findTripAction(longitudeOrigin: string, latitudeOrigin: string, longitudeDestination: string, latitudeDestination: string){
    const xmlData = await getXMLData(longitudeOrigin, latitudeOrigin, longitudeDestination, latitudeDestination);
    const processedData = await extractDataFromXML(xmlData);
    return processedData;
}