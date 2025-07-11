FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g @angular/cli@17
RUN npm install

COPY . .
RUN ng analytics disable

ENV NG_CLI_ANALYTICS=false

EXPOSE 4200

CMD ["npm", "start"]