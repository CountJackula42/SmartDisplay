import mvg_api
import json
from datetime import datetime
import pytz

class MvgStation():
    def __init__(self, station_name):
        self.station_name = station_name
        self.station_id = mvg_api.get_id_for_station(station_name)
    
    def get_departures(self, label, timezone):
        self.label = label
        self.departures_request = mvg_api.get_departures(self.station_id)
        self.departures = []
        tz = pytz.timezone(timezone)
        for i in self.departures_request:
            dp_time = i['departureTime']
            ts = dp_time/1000
            dt = datetime.fromtimestamp(ts).astimezone(tz).strftime('%H:%M')
            i.update({'formatedTime': dt})
            if i['product'] == self.label:
                self.departures.append(i)
            else:
                continue
        return json.dumps(self.departures, indent=2)


if __name__ == '__main__':
    bus = MvgStation(station_name='Feldstraße, Fürstenfeldbruck')
    bus.get_departures(label='REGIONAL_BUS', timezone='Europe/Berlin')
    bus.departures
    print(bus.departures)

    sbahn = MvgStation(station_name='Fürstenfeldbruck')
    sbahn.get_departures(label='SBAHN', timezone='Europe/Berlin')
    sbahn.departures
    print(sbahn.departures)
