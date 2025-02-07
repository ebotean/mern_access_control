#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

const broker = () => {
  return {
    send: (queue, message) => {
      amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
          throw error0;
        }
        connection.createChannel(function (error1, channel) {
          if (error1) {
            throw error1;
          }

          channel.assertQueue(queue, {
            durable: false
          });
          channel.sendToQueue(queue, Buffer.from(message));

          console.log(" [x] Sent %s", message);
        });
        setTimeout(function () {
          connection.close();
          process.exit(0);
        }, 500);
      });
    }
  }
}

module.exports = broker;