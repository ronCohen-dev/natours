const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from server side', app: 'natours' });
});

app.post('/', (req, res) => {
  res.send('This is post requst endpoint ...');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Application running on ${port} port ...`);
});
