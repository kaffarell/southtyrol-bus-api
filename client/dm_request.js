function extractDataFromJson(returnBody){
    try{
        const usefulResponse = JSON.parse(returnBody).departureList;

        // Return error when no departureList was found
        if(usefulResponse == null) {
            console.error('No departureList found');
            return "";
        }

        const data = [];
        for(let i = 0; i < usefulResponse.length; i++) {
            data.push({
                number: usefulResponse[i].servingLine.number,
                direction: usefulResponse[i].servingLine.direction,
                timeHour: usefulResponse[i].dateTime.hour,
                timeMinute: usefulResponse[i].dateTime.minute,
                realtime: usefulResponse[i].servingLine.realtime,
            });
        }
        return data;
    }catch(e) {
        console.error(e);
    }
}

async function getData(stopId, date, time) {
    //http://efa.sta.bz.it/apb/XML_DM_REQUEST?useRealtime=1&locationServerActive=1&mode=direct&useAllStops=1&limit=10&itdDate=20220201&itdTime=1246&itdTripDateTimeDepArr=dep&ptOptionsActive=0&imparedOptionsActive=0&changeSpeed=normal&lineRestriction=400&maxChanges=9&routeType=leasttime&name_dm=6600218&type_dm=stop&outputFormat=JSON
    try{
        let response = await fetch(`http://efa.sta.bz.it/apb/XML_DM_REQUEST?useRealtime=1&locationServerActive=1&mode=direct&useAllStops=1&limit=10&itdDate=${date}&itdTime=${time}&itdTripDateTimeDepArr=dep&ptOptionsActive=0&imparedOptionsActive=0&changeSpeed=normal&lineRestriction=400&maxChanges=9&routeType=leasttime&name_dm=${stopId}&type_dm=stop&outputFormat=JSON`)
        return response.text();
    }catch(e) {
        console.error('Error when fetching data');
        console.error(e);
        throw(e);
    }
}

async function dmRequestAction(stopId) {
    if(stopId.match(/[^0-9.]+/) != null){
        throw('StopId is not a number');
    }

    let jsonData = '';
    // Get current date and time, convert to string and pad with leading zeroes
    const currentDate = new Date();
    const dateString = currentDate.getFullYear().toString().padStart(4,'0') + 
        // Months start at 0
        (currentDate.getMonth()+1).toString().padStart(2, '0') + 
        currentDate.getDate().toString().padStart(2, '0');

    const time = currentDate.getHours().toString().padStart(2, '0') + 
        currentDate.getMinutes().toString().padStart(2, '0');

    try {
        jsonData = await getData(stopId, dateString, time);
    } catch (error) {
        console.error('Encountered error when fetching data');
        console.error(error);
        return error;
    }
    let processedData = '';
    try {
        processedData = extractDataFromJson(jsonData);
    } catch (error) {
        console.error('Encountered error when extracting data from response');
        console.error(error);
        return error;
    }
    return processedData;
}
