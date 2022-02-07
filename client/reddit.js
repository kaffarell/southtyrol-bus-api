function extractUrlFromJson(returnBody){
    try{
        const usefulResponse = JSON.parse(returnBody).data.children[0].data.preview.images[0];
        
        if(usefulResponse == null) {
            console.error('No useful data found in response');
            return "";
        }

        // If there is a gif, return it, otherwise return the image
        if(usefulResponse.variants?.gif?.source?.url !== undefined) {
            return usefulResponse.variants.gif.source.url;
        }else {
            return usefulResponse.source.url;
        }

    }catch(e) {
        console.error(e);
    }
}

async function getSubredditData() {
    try{
        let response = await fetch('https://api.reddit.com/r/memes/top?t=day');
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