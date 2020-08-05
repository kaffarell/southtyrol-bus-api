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
                    expect(trip[0].routeParts[0].type).toEqual('Bus');
                    expect(trip[0].routeParts[0].timeMinute).toEqual('11');
                    // Point 1
                    expect(trip[0].routeParts[0].points[0].name).toEqual('Betania');
                    expect(trip[0].routeParts[0].points[0].usage).toEqual('departure');
                    expect(trip[0].routeParts[0].points[0].locality).toEqual('St. Ulrich');
                    expect(trip[0].routeParts[0].points[0].placeID).toEqual('1');
                    // Point 2
                    expect(trip[0].routeParts[0].points[1].name).toEqual('St. Christina, Rathaus');
                    expect(trip[0].routeParts[0].points[1].usage).toEqual('arrival');
                    expect(trip[0].routeParts[0].points[1].locality).toEqual('St. Christina in Gröden');
                    expect(trip[0].routeParts[0].points[1].placeID).toEqual('1');
                    // Part 3
                    expect(trip[0].routeParts[0].distance).toEqual('204');
                    expect(trip[0].routeParts[0].type).toEqual('Fussweg');
                    expect(trip[0].routeParts[0].timeMinute).toEqual('3');
                    // Point 1
                    expect(trip[0].routeParts[0].points[0].name).toEqual('St. Christina, Rathaus');
                    expect(trip[0].routeParts[0].points[0].usage).toEqual('departure');
                    expect(trip[0].routeParts[0].points[0].locality).toEqual('St. Christina in Gröden');
                    expect(trip[0].routeParts[0].points[0].placeID).toEqual('1');
                    // Point 2
                    expect(trip[0].routeParts[0].points[1].name).toEqual('St. Christina in Gröden, Streda Chemun 13');
                    expect(trip[0].routeParts[0].points[1].usage).toEqual('arrival');
                    expect(trip[0].routeParts[0].points[1].locality).toEqual('St. Christina in Gröden');
                    expect(trip[0].routeParts[0].points[1].placeID).toEqual('-1');
                }
            });
    });

    test('Multiple stops', () => {
        findTripAction('11.68420', '46.57855')
            .then((stops: Array<Trip> | string) => {
                if(typeof stops !== 'string'){
                    // Test all values from one stop and only the stopName from the others
                    expect(stops[0].nearestStopName).toEqual('Rodra');
                    expect(stops[0].nearestStopId).toEqual('66002592');
                    expect(stops[0].nearestStopPlace).toEqual('St. Ulrich');
                    expect(stops[0].nearestStopDistance).toEqual('720');
                    expect(stops[0].nearestStopDistanceTime).toEqual('10');
                    expect(stops[0].nearestPlace).toEqual('St. Ulrich');
                    expect(stops[0].nearestStreet).toEqual('Streda Val D Anna 24');

                    expect(stops[1].nearestStopId).toEqual('66002932');
                    expect(stops[2].nearestStopId).toEqual('66002754');
                }
            });
    });
});