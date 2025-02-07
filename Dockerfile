FROM node:20.18-alpine

WORKDIR /app
EXPOSE 5000
COPY ./ /app
RUN npm install
# TODO create script to run these post initialization
# RUN npx prisma db push
# RUN npx prisma db seed
CMD ["node", "server.js"]