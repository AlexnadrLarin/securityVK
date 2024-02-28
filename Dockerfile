FROM node:14
LABEL authors="carsoniero"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
