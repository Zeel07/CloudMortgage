FROM node:latest

WORKDIR /app

COPY . /app

RUN npm install sails -g

RUN npm install sails-mysql

RUN npm install requests

EXPOSE 1337

RUN ls

CMD ["sails", "lift"]