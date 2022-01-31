import pino from 'pino';
import axios from 'axios';
const logger = pino();

interface IDmRequest {
    test: string;
}

function extractDataFromJson(returnBody: any): Promise<IDmRequest | string>{
    return new Promise<IDmRequest | string>((resolve, reject) => {

        console.log(returnBody.dm);

        try{
            const usefulResponse = returnBody.dm;
        }catch(e) {
            reject(e);
        }
    });
}

function getData(stopId: string): Promise<string>{
    return new Promise<string>((resolve, reject) => {
        axios.get('http://efa.sta.bz.it/apb/XML_DM_REQUEST?type_dm=stopID&name_dm=' + stopId + '&outputFormat=json')
            .then(reponse => {
                resolve(reponse.data);
            }).catch(error => {
                if(error.reponse) {
                    logger.error(error.response.data)
                    logger.error(error.response.status);
                    logger.error(error.response.headers);
                }
                reject(error);
            });
    });
}

async function dmRequestAction(stopId: string): Promise<IDmRequest | string> {
    if(stopId.match(/[^0-9.]+/) != null){
        throw('StopId is not a number');
    }

    let jsonData: string = '';
    try {
        jsonData = await getData(stopId);
    } catch (error) {
        throw(error);
    }
    let processedData: IDmRequest | string = '';
    try {
        processedData = await extractDataFromJson(jsonData);
    } catch (error) {
        throw(error);
    }
    return processedData;
}

export {
    dmRequestAction,
    IDmRequest
}