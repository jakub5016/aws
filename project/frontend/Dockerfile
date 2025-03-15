FROM node:20-alpine

# ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
