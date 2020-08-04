'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var request = _interopDefault(require('request'));
var xml2js = require('xml2js');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function extractDataFromXML(returnBody) {
    return new Promise(function (resolve, reject) {
        var parser = new xml2js.Parser();
        parser.parseString(returnBody, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                var usefulResponse = data.itdRequest.itdStopFinderRequest[0].itdOdv;
                var stopFinderRequestArray = [];
                for (var i = 0; i < usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop.length; i++) {
                    var newStopFinderRequest = {
                        nearestStopName: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.nameWithPlace,
                        nearestStopId: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.stopID,
                        nearestStopPlace: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.place,
                        nearestStopDistance: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.distance,
                        nearestStopDistanceTime: usefulResponse[0].itdOdvAssignedStops[0].itdOdvAssignedStop[i].$.distanceTime,
                        nearestPlace: usefulResponse[0].itdOdvPlace[0].odvPlaceElem[0]._,
                        nearestStreet: usefulResponse[0].itdOdvName[0].odvNameElem[0]._,
                    };
                    stopFinderRequestArray.push(newStopFinderRequest);
                }
                resolve(stopFinderRequestArray);
            }
        });
    });
}
function getXMLData(longitude, latitude) {
    return new Promise(function (resolve, reject) {
        request('http://efa.sta.bz.it/apb/XML_STOPFINDER_REQUEST?locationServerActive=0&type_sf=coord&name_sf=' + longitude + ':' + latitude + ':WGS84[DD.DDDDD]', function (reqErr, reqRes, reqBody) {
            if (reqErr) {
                reject(reqErr);
            }
            else {
                resolve(reqBody);
            }
        });
    });
}
function findLocationAction(longitude, latitude) {
    return __awaiter(this, void 0, void 0, function () {
        var xmlData, processedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getXMLData(longitude, latitude)];
                case 1:
                    xmlData = _a.sent();
                    return [4 /*yield*/, extractDataFromXML(xmlData)];
                case 2:
                    processedData = _a.sent();
                    return [2 /*return*/, processedData];
            }
        });
    });
}

function getXMLData$1(longitudeOrigin, latitudeOrigin, longitudeDestination, latitudeDestination) {
    return new Promise(function (resolve, reject) {
        request('http://efa.sta.bz.it/apb/XML_TRIP_REQUEST2?locationServerActive=1&type_origin=coord&name_origin=' + longitudeOrigin + ':' + latitudeOrigin + ':WGS84[DD.DDDDD]&type_destination=coord&name_destination=' + longitudeDestination + ':' + latitudeDestination + ':WGS84[DD.DDDDD]', function (reqErr, reqRes, reqBody) {
            if (reqErr) {
                reject(reqErr);
            }
            else {
                resolve(reqBody);
            }
        });
    });
}
function extractDataFromXML$1(returnBody) {
    return new Promise(function (resolve, reject) {
        var parser = new xml2js.Parser();
        parser.parseString(returnBody, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                var usefulResponse = data.itdRequest.itdTripRequest[0].itdItinerary[0].itdRouteList[0].itdRoute;
                // Go trough all possible routes:
                for (var i = 0; i < usefulResponse.length; i++) {
                    console.log('Test');
                    currTrip.totalTime = usefulResponse[i].$.publicDuration;
                    currTrip.vehicleTime = usefulResponse[i].$.vehicleTime;
                    console.log(currTrip);
                    for (var a = 0; a < usefulResponse[i].itdPartialRouteList.length; a++) {
                        for (var b = 0; b < usefulResponse[i].itdPartialRouteList.itdPartialRoute.itdPoint.length; b++) {
                            point.name = usefulResponse[i].itdPartialRouteList[a].itdPartialRoute.itdPoint[b].name;
                            point.usage = usefulResponse[i].itdPartialRouteList[a].itdPartialRoute.itdPoint[b].usage;
                            point.locality = usefulResponse[i].itdPartialRouteList[a].itdPartialRoute.itdPoint[b].locality;
                            parts.points.push(point);
                            console.log(point);
                        }
                        parts.type = usefulResponse[i].itdPartialRouteList[a].itdPartialRoute.itdMeansOfTransport.productName;
                        parts.distance = usefulResponse[i].itdPartialRouteList[a].itdPartialRoute.$.distance;
                        console.log(parts);
                        routeParts.parts.push(parts);
                    }
                    console.log(currTrip);
                    allTrips.push(currTrip);
                }
                resolve(allTrips);
            }
        });
    });
}
function findTripAction(longitudeOrigin, latitudeOrigin, longitudeDestination, latitudeDestination) {
    return __awaiter(this, void 0, void 0, function () {
        var xmlData, processedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getXMLData$1(longitudeOrigin, latitudeOrigin, longitudeDestination, latitudeDestination)];
                case 1:
                    xmlData = _a.sent();
                    return [4 /*yield*/, extractDataFromXML$1(xmlData)];
                case 2:
                    processedData = _a.sent();
                    return [2 /*return*/, processedData];
            }
        });
    });
}

var Router = express.Router();
Router.get('/', function (req, res) {
    res.send("Api under Construction 🚧");
});
Router.post('/stopFinder', function (req, res) {
    findLocationAction(req.body.lon, req.body.lat)
        .then(function (stops) {
        res.json(stops);
    })
        .catch(function (err) {
        res.json(err);
    });
});
Router.post('/tripFinder', function (req, res) {
    findTripAction(req.body.lon_or, req.body.lat_or, req.body.lon_dest, req.body.lat_dest)
        .then(function (trips) {
        res.json(trips);
    })
        .catch(function (err) {
        res.json(err);
    });
});

var app = express();
app.use(express.json());
app.use('/api', Router);
app.listen(5000, function () {
    console.log('Server listening on Port 5000');
});
