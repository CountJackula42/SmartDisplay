# SmartDisplay

Based on [janhapke/screendle](https://github.com/janhapke/screendle).
* Switched javascript backend to python backend.
* Changed HVV to MVV API.
* Changed DarkSky API to Openweathermap.org

Was ment to learn programming a webserver with a e-reader frontend. 

# Usage
## Configuration
Before using fill the config.yaml file with the needed information. Get an API-KEY at https://openweathermap.org/api.

Example Config:
```
time_api:
    timezone: 'Europe/Berlin'

weather_api:
    appid: 'adase27123d951fasd4dfg6754785d1'
    lat: '48.1407'
    lon: '11.5566'
    units: 'metric'
    lang: 'de'

transport_api:
    sbahn_station: 'München'
    sbahn_label: 'SBAHN'
    bus_station: 'München'
    bus_label: 'REGIONAL_BUS'
```
## Local Run
```
python app.py
```
## Raspberry Pi
The server is running on a raspberry pi 3 inside a docker container.

## Docker
```
docker run -d --name smart-display --net=host smart-display
```

