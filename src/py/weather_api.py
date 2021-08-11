import requests
from datetime import datetime
import json
import pytz

def get_weather(timezone, appid, lat, lon, units, lang):
    tz = pytz.timezone(timezone)
    url = 'http://api.openweathermap.org/data/2.5/onecall'
    params = {
        'appid' : appid,
        'lat' : lat,
        'lon' :  lon,
        'units' : units,
        'lang' : lang
        }
    weather_data = requests.get(url, params=params).json()
    for hour in weather_data['hourly']:
        hour['dt'] = datetime.utcfromtimestamp(int(hour['dt'])).astimezone(tz).strftime('%H:%M')
    
    return weather_data

if __name__ == '__main__':
    pass