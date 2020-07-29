# South Tyrol Bus API

## StopFinder

When using a stopFinderRequest you have to provide coordinates, and based on them
you will receive the nearest Bus stations and other info.


URL: `http://127.0.0.1:5000/api/stopFinder`  
METHOD: `POST`  
ARGUMENTS:`
{
    "lon": "11.67458",
    "lat": "46.57325"
}
`  
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
