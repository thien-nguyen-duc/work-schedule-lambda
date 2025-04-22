const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const getSchedules = require('./functions/getSchedules.mjs');
const createSchedule = require('./functions/createSchedule.mjs');

const app = express();
app.use(cors({ origin: '*' })); // Restrict CORS to specific origin
app.use(bodyParser.json());

app.get('/schedules/:userId', async (req, res) => {
  const event = { pathParameters: { ...req.params } , queryStringParameters: {...req.query}};
  const result = await getSchedules.handler(event);
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.put('/schedules/:userId', async (req, res) => {
  const event = { pathParameters: { ...req.params}, queryStringParameters: {...req.query} , body: JSON.stringify(req.body) };
  const result = await createSchedule.handler(event);
  res.status(result.statusCode).json(JSON.parse(result.body));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});