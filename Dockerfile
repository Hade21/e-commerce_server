FROM node:20

WORKDIR /user/src/app

COPY package*.json ./

RUN ls -a
RUN npm install
RUN npm run build

COPY . .

EXPOSE 8080

CMD ["npm", "start"]