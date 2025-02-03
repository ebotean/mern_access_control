FROM node:18.20-alpine

WORKDIR /app
EXPOSE 5000
COPY ./ /app
RUN npm install
CMD ["node", "server.js"]