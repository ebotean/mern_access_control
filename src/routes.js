const express = require('express')
const { getLatestAccesses, accessClearance, getAccessLog } = require('./app/access.controller');
const router = express.Router()


router.get('/access', async (req, res) => {
  let accessList = await getLatestAccesses();
  return res.status(200).json(accessList);
});

router.get('/access/log', async (req, res) => {
  const queryParams = req.query;
  let accessList = await getAccessLog(queryParams.dateFrom, queryParams.dateTo);
  return res.status(200).json(accessList);
});

router.post('/access/clearance', async (req, res) => {
  if (!req.body) {
    console.error('No request body');
    return res.json({ error: 'No request body' });
  }
  const direction = req.body?.direction ?? 'in';
  const entering = direction === 'in';
  const userId = req.body?.userId;
  if (!userId) {
    return res.status(400).json({ error: 'The "userId" parameter is required.' });
  }
  try {
    const access = await accessClearance(userId, entering);
    return res.json(access);
  } catch (e) {
    console.log(e);
    const errorMsg = e;
    console.error(errorMsg);
    return res.status(500).json({ error: errorMsg });
  }
});

module.exports = router