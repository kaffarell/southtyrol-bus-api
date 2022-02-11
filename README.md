# South Tyrol bus API  
![Build](https://github.com/kaffarell/southtyrol-bus-api/workflows/CI/badge.svg?branch=master) 
![GitHub release (latest by date)](https://img.shields.io/github/v/release/kaffarell/southtyrol-bus-api)
![GitHub issues](https://img.shields.io/github/issues/kaffarell/southtyrol-bus-api)  
![Website](https://img.shields.io/website?label=Heroku&logo=heroku&url=https%3A%2F%2Fsouthtyrol-bus-api.herokuapp.com%2Fapi%2F)
  
  
  
Modern and easy to use wrapper for the [STA (Strutture Trasporto Alto Adige) API](https://data.civis.bz.it/de/dataset/southtyrolean-public-transport)

#### Issues and PRs are welcome 🎓

## Documentation
Documentation can be found [here](https://github.com/kaffarell/southtyrol-bus-api/wiki)
 
 
## Setup
### Hosted version
The Demo-Website is hosted here: https://southtyrol-bus-api.netlify.app/  
The Api-Wrapper this repository mainly contains is hosted here: https://southtyrol-bus-api.herokuapp.com/  

### Local Setup
To run the api locally:
 * Install npm and nodeJS
 * Execute `npm install`
 * Execute `npm run build` to transpile ts and run the linter  
To display the demo-website locally simply open index.html in a webbrowser.

## School
For a school project we created a little website for this api. Instead of making the requests to this app and then to the OpenData Endpoints, we created a slim, client-side version of this api. We embedded this library in a html page and created a small demo-application which displays the different bus-lines that stop at a specific bus-stop. 

Because we had to use different apis for this school project, we also included the meme of the day, fetched directly from the reddit api and the current teacher-of-the-week leaderboard, fetched from our api (can be found at kaffarell/teacher-of-the-week).

## Apis:
### OpenData Bus Info
Getting data from the OpenData api was pretty straightforwarth although the documentation was confusing and lacking some pretty important information. For example the `outputFormat` attribute is nowhere to be found in the documentation (That's why previous interations of the api used xml and converted it to json) and it uses per default a coordinate format that we have never seen before (You can set custom coodinate formats in the options though). But after we figured out the basic attributes of the request the fetching was pretty easy.

### Reddit
The reddit api is really well designed with a rich documentation with examples (https://www.reddit.com/dev/api/). So fetching the top meme of the day from the r/memes subreddit was implemented in a matter of minutes. The only tricky thing was the usage of the `raw_json=1` attribute. If you don't include this attribute in your request, the api is going to substitute <, > and ? with &lt;, &gt;, and &amp (This caused the JSON.parse to fail).

### Teacher of the week
The Teacher of the week backend and frontend can be found in this repository: https://github.com/kaffarell/teacher-of-the-week (The respository is private for privacy reasons, if you want access, you can contact me through email). Instead of implementing the whole frontend of the leaderboard again for this demo, we simply created an iframe and embedded the already existing leaderboard.


 * Execute `npm start` to run the app

