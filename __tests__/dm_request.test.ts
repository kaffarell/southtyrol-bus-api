import { dmRequestAction, extractDataFromJson, getData, IDmRequest } from '../src/controller/dm_request';


describe('Testing dm request', () => {
    test('Testing dm_request', (done) => {
        getData('66001143', '20220209', '0822').then((result: string) => {
                extractDataFromJson(result).then((output: Array<IDmRequest> | string) => {
                    if(typeof output !== 'string'){
                        /*
                        {
                            "number": "401",
                            "directionName": "Bruneck, Busbahnhof",
                            "timeHour": "8",
                            "timeMinute": "24",
                            "realtime": "0",
                            "direction": "R"
                        },
                        */
                        expect(output[0].number).toEqual('401');
                        expect(output[0].directionName).toEqual('Brunico, Via Europa');
                        expect(output[0].timeHour).toEqual('8');
                        expect(output[0].timeMinute).toEqual('24');
                        expect(output[0].realtime).toEqual('0');
                        expect(output[0].direction).toEqual('R');
                        /*
                        {
                            "number": "320.1",
                            "directionName": "Milland, Zeffer",
                            "timeHour": "8",
                            "timeMinute": "24",
                            "realtime": "0",
                            "direction": "H"
                        },
                        */
                        expect(output[1].number).toEqual('320.1');
                        expect(output[1].directionName).toEqual('Millan, Zeffer');
                        expect(output[1].timeHour).toEqual('8');
                        expect(output[1].timeMinute).toEqual('24');
                        expect(output[1].realtime).toEqual('0');
                        expect(output[1].direction).toEqual('H');
                    }
                    done();
                })
                .catch((err: string) => {
                    fail(err);
                });

            })
            .catch((err: string) => {
                fail(err);
            });
    });
    test('Testing dm_request 1', (done) => {
        getData('66001143', '20220209', '0832').then((result: string) => {
                extractDataFromJson(result).then((output: Array<IDmRequest> | string) => {
                    if(typeof output !== 'string'){
                        /*
                        	{
                            "number": "401",
                            "directionName": "Brixen, Progress",
                            "timeHour": "8",
                            "timeMinute": "32",
                            "realtime": "0",
                            "direction": "H"
                        },
                        */
                        expect(output[0].number).toEqual('401');
                        expect(output[0].directionName).toEqual('Bressanone, Progress');
                        expect(output[0].timeHour).toEqual('8');
                        expect(output[0].timeMinute).toEqual('32');
                        expect(output[0].realtime).toEqual('0');
                        expect(output[0].direction).toEqual('H');
                        /*
                        {
                            "number": "320.1",
                            "directionName": "Vahrn, Post",
                            "timeHour": "8",
                            "timeMinute": "34",
                            "realtime": "0",
                            "direction": "H"
                        },
                        */
                        expect(output[1].number).toEqual('320.1');
                        expect(output[1].directionName).toEqual('Varna, Posta');
                        expect(output[1].timeHour).toEqual('8');
                        expect(output[1].timeMinute).toEqual('34');
                        expect(output[1].realtime).toEqual('0');
                        expect(output[1].direction).toEqual('H');
                    }
                    done();
                })
                .catch((err: string) => {
                    fail(err);
                });

            })
            .catch((err: string) => {
                fail(err);
            });
    });
});