# South Tyrol bus API
Modern and easy to use wrapper for the [STA (Strutture Trasporto Alto Adige) API](https://data.civis.bz.it/de/dataset/southtyrolean-public-transport)

#### Issues and PRs are welcome 🎓
The Issue management happens on JIRA so if you want to participate you can hit me up with an email and I will add you to the board!

## Features
Documentation can be found under docs/_build/html/index.html
 * StopFinderRequest (submit coordinates and you will get all the bus-stations near you)
 
 
## Setup
 * Install npm
 * Execute `npm install`
 * Execute `npm run build` to transpile ts and run the linter
 * Execute `npm start` to run the app
 * Execute `make html` in the docs/ directory to build the documentation


## Todo
 * [x] Implement StopFinderRequest (Get specific Location + Info about near bus stations)
 * [x] Write Documentation
 * [ ] Write Tests (jest)
 * [ ] TripRequest (Calculate Trip with begin coord. and end coord.)


