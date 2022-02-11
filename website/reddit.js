function extractUrlFromJson(returnBody){
    try{
        const usefulResponse = JSON.parse(returnBody).data.children[0].data.preview.images[0];
        
        if(usefulResponse == null) {
            console.error('No useful data found in response');
            return "";
        }

        // If there is a gif, return it, otherwise return the image
        if(usefulResponse.variants?.gif?.source?.url !== undefined) {
            console.log("gif");
            return usefulResponse.variants.gif.source.url;
        }else {
            console.log("image");
            return usefulResponse.source.url;
        }

    }catch(e) {
        console.error(e);
    }
}

async function getSubredditData() {
    try{
        let headers = new Headers({
            'User-Agent': 'MockClient/0.1 by Me'
        });
        let response = await fetch('https://api.reddit.com/r/ProgrammerHumor/top?t=day&raw_json=1', {
            headers: headers
        });
        return response.text();
    }catch(e) {
        console.error('Error when fetching data');
        console.error(e);
        throw(e);
    }
}

async function memeOfTheDayAction() {
    let jsonData = '';

    try {
        jsonData = await getSubredditData();
    } catch (error) {
        console.error('Encountered error when fetching data');
        console.error(error);
        return error;
    }
    let processedData = '';
    try {
        processedData = extractUrlFromJson(jsonData);
    } catch (error) {
        console.error('Encountered error when extracting data from response');
        console.error(error);
        return error;
    }
    return processedData;
}
