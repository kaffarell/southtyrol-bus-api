'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var request = _interopDefault(require('request'));
var xml2js = require('xml2js');

function extractDataFromXML(returnBody, callback) {
    var parser = new xml2js.Parser();
    parser.parseString(returnBody, function (err, data) {
        if (err) {
            callback(err);
        }
        else {
            var usefulResponse = data.itdRequest.itdStopFinderRequest[0].itdOdv;
            var stopFinderRequestArray = [];
            for (var i = 0; i < usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop.length; i++) {
                var newStopFinderRequest = {
                    nearestStopName: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.nameWithPlace,
                    nearestStopId: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.stopId,
                    nearestStopPlace: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.place,
                    nearestStopDistance: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.distance,
                    nearestStopDistanceTime: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.distanceTime,
                    nearestPlace: usefulResponse[0].itdOdvPlace[0].odvPlaceElem[0]._,
                    nearestStreet: usefulResponse[0].itdOdvName[0].odvNameElem[0]._,
                };
                stopFinderRequestArray.push(newStopFinderRequest);
            }
            callback(stopFinderRequestArray);
        }
    });
}
function findLocationAction(longitude, latitude, callback) {
    request('http://efa.sta.bz.it/apb/XML_STOPFINDER_REQUEST?locationServerActive=0&type_sf=coord&name_sf=' + longitude + ':' + latitude + ':WGS84[DD.DDDDD]', function (reqErr, reqRes, reqBody) {
        if (reqErr) {
            callback(reqErr);
        }
        else {
            extractDataFromXML(reqBody, function (stopRequest) {
                callback(stopRequest);
            });
        }
    });
}

var Router = express.Router();
Router.get('/', function (req, res) {
    res.send("Api under Construction 🚧");
});
Router.post('/stopFinder', function (req, res) {
    findLocationAction(req.body.lon, req.body.lat, function (stopRequest) {
        res.json(stopRequest);
    });
});

var app = express();
app.use(express.json());
app.use('/api', Router);
app.listen(5000, function () {
    console.log('Server listening on Port 5000');
});
