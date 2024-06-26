FROM node:21

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .
EXPOSE 3000
ENV NODE_ENV="development"
CMD ["npm", "start"]