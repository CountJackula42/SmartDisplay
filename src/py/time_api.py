from datetime import datetime
from time import timezone
from babel.dates import format_date, get_timezone, format_time, UTC
#import json
#import locale
#import pytz

def get_time(timezone):
    #locale.setlocale(locale.LC_ALL, 'de_DE.UTF-8')
    #tz = pytz.timezone(timezone)
    #time_data = datetime.now().astimezone(tz).strftime('%H:%M')
    tz = get_timezone(timezone)
    d = datetime.now(tz=UTC)
    time_data = format_time(d, format='H:mm', tzinfo=tz, locale='de')
    return time_data

def get_date(timezone):
    tz = get_timezone(timezone)
    d = datetime.now(tz=UTC)
    date = format_date(d, "EEEE'<br>'d.MMMM", locale='de')
    #locale.setlocale(locale.LC_ALL, 'de_DE.UTF-8')
    #tz = pytz.timezone(timezone)
    #date = datetime.now().astimezone(tz).strftime('%A<br>%-d. %B')
    return date

if __name__ == '__main__':
    print(get_time(timezone='Europe/Berlin'))
    print(get_date(timezone='Europe/Berlin'))