FROM node:23-alpine
WORKDIR /
COPY package* .
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]