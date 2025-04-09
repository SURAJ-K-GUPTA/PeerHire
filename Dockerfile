FROM node:23-alpine
WORKDIR /
COPY . .

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]


