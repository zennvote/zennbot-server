FROM node:latest

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --production

COPY . .

RUN yarn build

CMD ["node", "dist"]
