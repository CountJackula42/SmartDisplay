from datetime import datetime
import json
import locale
import pytz

def get_time(timezone):
    locale.setlocale(locale.LC_ALL, 'de_DE.UTF-8')
    tz = pytz.timezone(timezone)
    time_data = datetime.now().astimezone(tz).strftime('%H:%M')
    return time_data

def get_date(timezone):
    locale.setlocale(locale.LC_ALL, 'de_DE.UTF-8')
    tz = pytz.timezone(timezone)
    date = datetime.now().astimezone(tz).strftime('%A<br>%-d. %B')
    return date

if __name__ == '__main__':
    print(get_time(timezone='Europe/Berlin'))
    print(get_date(timezone='Europe/Berlin'))