# South Tyrol bus API  
![Build](https://github.com/kaffarell/southtyrol-bus-api/workflows/CI/badge.svg?branch=master) 
![GitHub release (latest by date)](https://img.shields.io/github/v/release/kaffarell/southtyrol-bus-api)
![GitHub issues](https://img.shields.io/github/issues/kaffarell/southtyrol-bus-api)  
![Website](https://img.shields.io/website?label=Heroku&logo=heroku&url=https%3A%2F%2Fsouthtyrol-bus-api.herokuapp.com%2Fapi%2F)
  
  
  
Modern and easy to use wrapper for the [STA (Strutture Trasporto Alto Adige) API](https://data.civis.bz.it/de/dataset/southtyrolean-public-transport)

#### Issues and PRs are welcome 🎓

## Documentation
Documentation can be found [here](https://github.com/kaffarell/southtyrol-bus-api/wiki)

## School
For a school project we created a little website for this api. Instead of making the requests to this app and then to the OpenData Endpoints, we created a slim, client-side version of this api. We embedded this library in a html page and created a small demo-application which displays the different bus-lines that stop at a specific bus-stop. 

Because we had to use different apis for this school project, we also included the meme of the day, fetched directly from the reddit api and the current teacher-of-the-week leaderboard, fetched from our api (can be found at kaffarell/teacher-of-the-week).

Website for the display also hosted here: https://southtyrol-bus-api.netlify.app/
 
 
## Setup
 * Install npm and nodeJS
 * Execute `npm install`
 * Execute `npm run build` to transpile ts and run the linter
 * Execute `npm start` to run the app

