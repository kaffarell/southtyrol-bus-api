import { findLocationAction, stopFinderRequest } from '../src/controller/stopfinder_request';


describe('Testing stopFinder', () => {
    test('Multiple stops', (done) => {
        findLocationAction('11.68667', '46.57504')
            .then((stop: Array<stopFinderRequest> | string) => {
                if(typeof stop !== 'string'){
                    expect(stop[0].nearestStopName).toEqual('Salvanel');
                    expect(stop[0].nearestStopId).toEqual('66002473');
                    expect(stop[0].nearestStopPlace).toEqual('St. Ulrich');
                    expect(stop[0].nearestStopDistance).toEqual('48');
                    expect(stop[0].nearestStopDistanceTime).toEqual('0');

                    expect(stop[1].nearestStopName).toEqual('Stua Catores');
                    expect(stop[1].nearestStopId).toEqual('66002472');
                    expect(stop[1].nearestStopPlace).toEqual('St. Ulrich');
                    expect(stop[1].nearestStopDistance).toEqual('312');
                    expect(stop[1].nearestStopDistanceTime).toEqual('4');
                }
                done()
            })
            .catch((err: string) => {
                fail(err);
            });
    });

    test('Multiple stops 2', (done) => {
        findLocationAction('11.68420', '46.57855')
            .then((stops: Array<stopFinderRequest> | string) => {
                if(typeof stops !== 'string'){
                    // Test all values from one stop and only the stopName from the others
                    expect(stops[0].nearestStopName).toEqual('St. Ulrich, Rodra');
                    expect(stops[0].nearestStopId).toEqual('66002592');
                    expect(stops[0].nearestStopPlace).toEqual('St. Ulrich');
                    expect(stops[0].nearestStopDistance).toEqual('741');
                    expect(stops[0].nearestStopDistanceTime).toEqual('11');

                    expect(stops[1].nearestStopId).toEqual('66002932');
                    expect(stops[2].nearestStopId).toEqual('66002754');
                }
                done();
            })
            .catch((err: string) => {
                fail(err);
            });
    });

    test('Longitude and Latitude not numbers', (done) => {
        findLocationAction('asdfasdf', 'fasdfasdf')
            .catch((err: string) => {
                expect(err).toBe('Latitude or Longitude are not numbers');
                done();
            });
    });
    test('Longitude and latitude have not 5 digits after the comma', (done) => {
        findLocationAction('10.000', '10.000000')
            .catch((err: string) => {
                expect(err).toBe('Latitude and Langitude have to have 5 digits after the comma');
                done();
            });
    });
});