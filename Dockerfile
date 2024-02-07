FROM node:alpine

COPY .package*.json /app

WORKDIR /app
RUN npm install

COPY . .

EXPOSE 3000

CMD node server.js