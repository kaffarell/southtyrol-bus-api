import pino from 'pino';
import axios from 'axios';
const logger = pino();

interface IDmRequest {
    number: string;
    directionName: string;
    timeHour: string;
    timeMinute: string;
    realtime: string;
    // Direction in which the Bus is going. Either 'R' or 'H'
    direction: string;
}

function extractDataFromJson(returnBody: any): Promise<Array<IDmRequest> | string>{
    return new Promise<Array<IDmRequest> | string>((resolve, reject) => {

        try{
            const usefulResponse = returnBody.departureList;

            // Return error when no departureList was found
            if(usefulResponse == null) {
                reject('No departureList found');
            }

            const data = new Array<IDmRequest>();
            for(let i = 0; i < usefulResponse.length; i++) {
                data.push({
                    number: usefulResponse[i].servingLine.number,
                    directionName: usefulResponse[i].servingLine.direction,
                    timeHour: usefulResponse[i].dateTime.hour,
                    timeMinute: usefulResponse[i].dateTime.minute,
                    realtime: usefulResponse[i].servingLine.realtime,
                    direction: usefulResponse[i].servingLine.liErgRiProj.direction,
                });
            }
            resolve(data);

        }catch(e) {
            reject(e);
        }
    });
}

function getData(stopId: string, date: string, time: string): Promise<string>{
    return new Promise<string>((resolve, reject) => {
        //http://efa.sta.bz.it/apb/XML_DM_REQUEST?useRealtime=1&locationServerActive=1&mode=direct&useAllStops=1&limit=10&itdDate=20220201&itdTime=1246&itdTripDateTimeDepArr=dep&ptOptionsActive=0&imparedOptionsActive=0&changeSpeed=normal&lineRestriction=400&maxChanges=9&routeType=leasttime&name_dm=6600218&type_dm=stop&outputFormat=JSON
        axios.get(`http://efa.sta.bz.it/apb/XML_DM_REQUEST?useRealtime=1&locationServerActive=1&mode=direct&useAllStops=1&limit=10&itdDate=${date}&itdTime=${time}&itdTripDateTimeDepArr=dep&ptOptionsActive=0&imparedOptionsActive=0&changeSpeed=normal&lineRestriction=400&maxChanges=9&routeType=leasttime&name_dm=${stopId}&type_dm=stop&outputFormat=JSON`)
            .then(response => {
                resolve(response.data);
            }).catch(error => {
                if(error.response) {
                    logger.error(error.response.data)
                    logger.error(error.response.status);
                    logger.error(error.response.headers);
                }
                logger.error('Error when fetching data');
                logger.error(error);
                reject(error);
            });
    });
}

async function dmRequestAction(stopId: string): Promise<Array<IDmRequest> | string> {
    if(stopId.match(/[^0-9.]+/) != null){
        throw('StopId is not a number');
    }

    let jsonData: string = '';
    // Get current date and time, convert to string and pad with leading zeroes
    const currentDate: Date = new Date();
    const dateString: string = currentDate.getFullYear().toString().padStart(4,'0') + 
        // Months start at 0
        (currentDate.getMonth()+1).toString().padStart(2, '0') + 
        currentDate.getDate().toString().padStart(2, '0');

    const time: string = currentDate.getHours().toString().padStart(2, '0') + 
        currentDate.getMinutes().toString().padStart(2, '0');

    try {
        jsonData = await getData(stopId, dateString, time);
    } catch (error) {
        logger.error('Encountered error when fetching data');
        logger.error(error);
        throw(error);
    }
    let processedData: Array<IDmRequest> | string = '';
    try {
        processedData = await extractDataFromJson(jsonData);
    } catch (error) {
        logger.error('Encountered error when extracting data from response');
        logger.error(error);
        throw(error);
    }
    return processedData;
}

export {
    dmRequestAction,
    IDmRequest
}