function extractUrlFromJson(returnBody){
    try{
        let usefulResponse = JSON.parse(returnBody).data;
        
        if(usefulResponse == null) {
            console.error('No useful data found in response');
            return "";
        }

        // Go trough the top memes of the and get first one which is not a video
        let counter = 0;
        while(usefulResponse.children[counter].data.is_video === true || usefulResponse.children[counter].data.post_hint !== 'image') {
            // If first 10 posts are videos, then fail
            if(counter > 10) {
                console.error('No gif or image found in the top 10 posts');
                return "";
            }
            counter++;
        }

        usefulResponse = usefulResponse.children[counter].data;

        // Returns the url of the image in the post
        // Makes no difference if the image is a normal image or a gif
        return usefulResponse.url;

    }catch(e) {
        console.error(e);
    }
}

async function getSubredditData() {
    try{
        let headers = new Headers({
            'User-Agent': 'MockClient/0.1 by Me'
        });
        let response = await fetch('https://api.reddit.com/r/memes/top?t=day&raw_json=1', {
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
