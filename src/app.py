from flask import Flask, render_template, Response
from py.weather_api import get_weather
from py.time_api import get_time, get_date
from py.transport_api import MvgStation
from py.config import Config
import json

cfg = Config()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather')
def weather():
    return get_weather(
        timezone=cfg.config['time_api']['timezone'],
        appid=cfg.config['weather_api']['appid'],
        lat=cfg.config['weather_api']['lat'],
        lon=cfg.config['weather_api']['lon'],
        units=cfg.config['weather_api']['units'],
        lang=cfg.config['weather_api']['lang']
        )

@app.route('/time')
def time():
    return get_time(timezone=cfg.config['time_api']['timezone'])

@app.route('/date')
def date():
    return get_date(timezone=cfg.config['time_api']['timezone'])

@app.route('/busses')
def busses(
    station_name=cfg.config['transport_api']['bus_station'],
    label=cfg.config['transport_api']['bus_label'],
    timezone=cfg.config['time_api']['timezone']
    ):
    bus = MvgStation(station_name)
    bus.get_departures(label, timezone)
    return Response(
        json.dumps(bus.departures), mimetype='application/json'
        )

@app.route('/trains')
def trains(
    station_name=cfg.config['transport_api']['sbahn_station'],
    label=cfg.config['transport_api']['sbahn_label'],
    timezone=cfg.config['time_api']['timezone']
    ):
    sbahn = MvgStation(station_name)
    sbahn.get_departures(label, timezone)
    return Response(
        json.dumps(sbahn.departures), mimetype='application/json'
        )


if __name__ == "__main__":
    app.run(host='0.0.0.0')