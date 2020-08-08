import { findTripAction, Trip } from '../src/controller/tripfinder_request';


describe('Testing stopFinder', () => {
    test('Single stop', () => {
        findTripAction('11.67910', '46.57146', '11.71916', '46.55839')
            .then((trip: Array<Trip> | string) => {
                if(typeof trip !== 'string'){
                    // Trip properties
                    expect(trip[0].totalTime).toEqual('00:20');
                    expect(trip[0].vehicleTime).toEqual('11');
                    // Part 1
                    expect(trip[0].routeParts[0].distance).toEqual('363');
                    expect(trip[0].routeParts[0].type).toEqual('Fussweg');
                    expect(trip[0].routeParts[0].timeMinute).toEqual('6');
                    // Point 1
                    expect(trip[0].routeParts[0].points[0].name).toEqual('St. Ulrich, Streda Rezia 258');
                    expect(trip[0].routeParts[0].points[0].usage).toEqual('departure');
                    expect(trip[0].routeParts[0].points[0].locality).toEqual('St. Ulrich');
                    expect(trip[0].routeParts[0].points[0].placeID).toEqual('-1');
                    // Point 2
                    expect(trip[0].routeParts[0].points[1].name).toEqual('Betania');
                    expect(trip[0].routeParts[0].points[1].usage).toEqual('arrival');
                    expect(trip[0].routeParts[0].points[1].locality).toEqual('St. Ulrich');
                    expect(trip[0].routeParts[0].points[1].placeID).toEqual('1');
                    // Part 2
                    expect(trip[0].routeParts[1].type).toEqual('Bus');
                    expect(trip[0].routeParts[1].timeMinute).toEqual('11');
                    // Point 1
                    expect(trip[0].routeParts[1].points[0].name).toEqual('Betania');
                    expect(trip[0].routeParts[1].points[0].usage).toEqual('departure');
                    expect(trip[0].routeParts[1].points[0].locality).toEqual('St. Ulrich');
                    expect(trip[0].routeParts[1].points[0].placeID).toEqual('1');
                    // Point 2
                    expect(trip[0].routeParts[1].points[1].name).toEqual('St. Christina, Rathaus');
                    expect(trip[0].routeParts[1].points[1].usage).toEqual('arrival');
                    expect(trip[0].routeParts[1].points[1].locality).toEqual('St. Christina in Gröden');
                    expect(trip[0].routeParts[1].points[1].placeID).toEqual('1');
                    // Part 3
                    expect(trip[0].routeParts[2].distance).toEqual('204');
                    expect(trip[0].routeParts[2].type).toEqual('Fussweg');
                    expect(trip[0].routeParts[2].timeMinute).toEqual('3');
                    // Point 1
                    expect(trip[0].routeParts[2].points[0].name).toEqual('St. Christina, Rathaus');
                    expect(trip[0].routeParts[2].points[0].usage).toEqual('departure');
                    expect(trip[0].routeParts[2].points[0].locality).toEqual('St. Christina in Gröden');
                    expect(trip[0].routeParts[2].points[0].placeID).toEqual('1');
                    // Point 2
                    expect(trip[0].routeParts[2].points[1].name).toEqual('St. Christina in Gröden, Streda Chemun 13');
                    expect(trip[0].routeParts[2].points[1].usage).toEqual('arrival');
                    expect(trip[0].routeParts[2].points[1].locality).toEqual('St. Christina in Gröden');
                    expect(trip[0].routeParts[2].points[1].placeID).toEqual('-1');
                }
            })
            .catch((err: string) => {
                throw(err);
            });
    });

    test('Multiple stops', () => {
        findTripAction('11.67910', '46.57146', '11.71916', '46.55839')
            .then((trip: Array<Trip> | string) => {
                if(typeof trip !== 'string'){
                    expect(trip[0].totalTime).toEqual('00:20');
                    expect(trip[1].totalTime).toEqual('00:17');
                    expect(trip[2].totalTime).toEqual('00:17');
                    expect(trip[3].totalTime).toEqual('00:17');

                }
            })
            .catch((err: string) => {
                throw(err);
            });
    });


    test('Longitude and Latitude not numbers', () => {
        findTripAction('asdfasdf', 'fasdfasdf', '11.71916', '46.55839')
            .catch((err: string) => {
                expect(err).toBe('Latitude or Longitude are not numbers');
            });
    });
    test('Longitude and latitude have not 5 digits after the comma', () => {
        findTripAction('11.7196', '46.55839', '11.71916', '46.558390')
            .catch((err: string) => {
                expect(err).toBe('Latitude and Langitude have to have 5 digits after the comma');
            });
    });
});