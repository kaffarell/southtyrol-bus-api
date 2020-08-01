import { findLocationAction, stopFinderRequest } from '../src/controller/stopfinder_request';


describe('Testing stopFinder', () => {
    test('Single stop', () => {

    });

    test('Multiple stops', () => {
        findLocationAction('11.68420', '46.57855')
            .then((stops: Array<stopFinderRequest> | string) => {
                if(typeof stops !== 'string'){
                    // Test all values from one stop and only the stopName from the others
                    expect(stops[0].nearestStopName).toEqual('Rodra');
                    //expect(stops[0].stopId).toEqual('234');
                    expect(stops[0].nearestStopPlace).toEqual('St. Ulrich');
                    expect(stops[0].nearestStopDistance).toEqual('720');
                    expect(stops[0].nearestStopDistanceTime).toEqual('10');
                    expect(stops[0].nearestPlace).toEqual('St. Ulrich');
                    expect(stops[0].nearestStreet).toEqual('Streda Val D Anna 24');

                    expect(stops[1].nearestStopName).toEqual('St. Ulrich, Cuca');
                    expect(stops[2].nearestStopName).toEqual('St. Ulrich, Seceda');
                }
            });
    });
});