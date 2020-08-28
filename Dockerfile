FROM node:latest
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
EXPOSE 5000
COPY . .
CMD ["npm", "start"]
