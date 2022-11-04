# syntax=docker/dockerfile:1

# base image (abstract)
##
FROM python:3.10.5-alpine3.16 as base

# Env vars
ENV PYTHONIOENCODING=utf-8 \
    TZ=Europe/Berlin \
    LANG=de_DE.UTF-8 \
    LANGUAGE=de_DE.UTF-8 \
    LC_ALL=de_DE.UTF-8

VOLUME [ "/app/src" ]
WORKDIR /app/src
COPY requirements.txt /app/src/requirements.txt

RUN apk add --no-cache \
    tzdata && \
    cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime && \
    echo "Europe/Berlin" >  /etc/timezone && \
    apk del tzdata && \
    python -m pip install \
        --upgrade pip setuptools wheel \
        --no-cache-dir && \
    python -m pip install \
        -r requirements.txt



#COPY . .

#WORKDIR /app/src


EXPOSE 8000

#ENTRYPOINT [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
CMD [ "gunicorn" "--bind '0.0.0.0:5000'" "'smartdisplay:app'" ]