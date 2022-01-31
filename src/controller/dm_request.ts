import request from 'request';

interface IDmRequest {
    test: string;
}

function extractDataFromJson(returnBody: string): Promise<IDmRequest | string>{
    return new Promise<IDmRequest | string>((resolve, reject) => {

        let parsedJson;
        try{
            parsedJson = JSON.parse(returnBody);
        }catch(e){
            console.error('Error parsing json');
            reject(e);
        }
        console.log(parsedJson.dm);

        try{
            const usefulResponse = parsedJson.dm;
        }catch(e) {
            reject(e);
        }
    });
}

function getData(stopId: string): Promise<string>{
    return new Promise<string>((resolve, reject) => {
        request('http://efa.sta.bz.it/apb/XML_DM_REQUEST?type_dm=stopID&name_dm=' + stopId + '&outputFormat=json', (reqErr, reqRes, reqBody) => {
            if(reqErr){
                reject(reqErr);
            }else{
                resolve(reqBody);
            }
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