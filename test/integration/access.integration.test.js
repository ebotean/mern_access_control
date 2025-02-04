const request = require('supertest');
const express = require('express');

const app = require('../../src/app/app');

describe('GET /access', function () {
  it('responds with json array', async function () {
    const response = await request(app)
      .get('/access')
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.length > 0).toEqual(true);
  });
});


describe('POST /access/clearance', function () {
  const changeDirection = (direction) => {
    if (direction === 'in') {
      return 'out';
    }
    return 'in';
  }

  it('is able to handle user transit', async function () {
    const userId = 1;
    let direction = 'out';
    let response = await request(app)
      .post('/access/clearance')
      .send({ userId: userId, direction: direction });

    if (response.body.status === 'ERROR') {
      expect(response.body.message).not.toEqual(null);
    }

    direction = changeDirection(direction);
    response = await request(app)
      .post('/access/clearance')
      .send({ userId: userId, direction: direction });

    // User got entry clearance
    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual('SUCCESS');
    expect(response.body.userId).toEqual(userId);
    expect(response.body.message).toEqual(null);
    expect(response.body.createdAt).not.toEqual(null);
    expect(response.body.updatedAt).toEqual(null);


    // Get user exit clearance
    direction = changeDirection(direction);
    response = await request(app)
      .post('/access/clearance')
      .send({ userId: userId, direction: direction });

    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual('SUCCESS');
    expect(response.body.userId).toEqual(userId);
    expect(response.body.message).toEqual(null);
    expect(response.body.createdAt).not.toEqual(null);
    expect(response.body.updatedAt).not.toEqual(null);
  });
});