# South Tyrol Bus API

## StopFinder



URL: `http://127.0.0.1:5000/api/stopFinder`  
METHOD: `POST`  
ARGUMENTS:  
```
{
    "lon": "11.67458",
    "lat": "46.57325"
}
``` 
RESPONSE: 
```
[
    {
        "nearestStopName": "Martin",
        "nearestStopPlace": "St. Ulrich",
        "nearestStopDistance": "909",
        "nearestStopDistanceTime": "13",
        "nearestPlace": "St. Ulrich",
        "nearestStreet": "Streda Cuca 68"
    }
]
```


When using a stopFinderRequest you have to provide coordinates, and based on them
you will receive the nearest Bus stations and other info. When creating the post request you have to provide a body.
The body consists of two variables: longitude and latitude. As a response you will get an array with all the bus 
stations that are withing a predefined radius from your coordinates. Like in the example response above the response contains
the stop name the place where the stop is located, the distance in meters to the stop from your coordinates and the
walking time to the stop. There are also fields with the nearest place and the nearest street(house).
