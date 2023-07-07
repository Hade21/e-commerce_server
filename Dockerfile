FROM node:20-alpine

WORKDIR /user/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY global.d.ts ./
COPY ./src .

RUN npm install
RUN npm run build
RUN npm install -g pm2
RUN ls -a

COPY . .

EXPOSE 80

CMD [ "pm2-runtime", "start", "build/main.js" ]
