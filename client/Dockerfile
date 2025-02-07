FROM node:20.18-alpine

WORKDIR /app
EXPOSE 4300
COPY ./ /app
RUN npm install
CMD ["npm", "run", "dev"]