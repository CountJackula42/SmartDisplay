# syntax=docker/dockerfile:1

FROM python:3.9-slim-buster

WORKDIR /app/
COPY requirements.txt requirements.txt

RUN apt-get update &&\
    apt-get install -y locales ntp && \
    sed -i -e 's/# de_DE.UTF-8 UTF-8/de_DE.UTF-8 UTF-8/' /etc/locale.gen && \
    dpkg-reconfigure --frontend=noninteractive locales && \
    apt-get clean && \
    pip3 install -r requirements.txt

ENV LANG de_DE.UTF-8
ENV LC_ALL de_DE.UTF-8

COPY . .

WORKDIR /app/src

EXPOSE 5000

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]