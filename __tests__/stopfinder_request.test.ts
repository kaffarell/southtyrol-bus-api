import { findLocationAction, stopFinderRequest } from '../src/controller/stopfinder_request';


describe('Testing stopFinder', () => {
    test('Single stop', () => {
        findLocationAction('11.68880', '46.57855')
            .then((stop: Array<stopFinderRequest> | string) => {
                if(typeof stop !== 'string'){
                    expect(stop[0].nearestStopName).toEqual('Martin');
                    expect(stop[0].nearestStopId).toEqual('66002594');
                    expect(stop[0].nearestStopPlace).toEqual('St. Ulrich');
                    expect(stop[0].nearestStopDistance).toEqual('909');
                    expect(stop[0].nearestStopDistanceTime).toEqual('13');
                    expect(stop[0].nearestPlace).toEqual('St. Ulrich');
                    expect(stop[0].nearestStreet).toEqual('Streda Cuca 68');
                }
            });
    });

    test('Multiple stops', () => {
        findLocationAction('11.68420', '46.57855')
            .then((stops: Array<stopFinderRequest> | string) => {
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