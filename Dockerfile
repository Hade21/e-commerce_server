FROM node:20

WORKDIR /user/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY global.d.ts ./

RUN ls -a
RUN npm install
RUN npm run build
RUN npm install -g pm2

COPY . .

EXPOSE 80

CMD [ "pm2-runtime", "start", "build/main.js" ]
