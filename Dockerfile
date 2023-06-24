FROM node:20

WORKDIR /user/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY global.d.ts ./

RUN ls -a
RUN npm install

COPY . .

EXPOSE 80

CMD [ "npm", "run", "start" ]
