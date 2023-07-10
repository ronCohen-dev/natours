const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const connectionString = 'mongodb://localhost:27017/natours';

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database ! ');
  })
  .catch((error) => {
    console.error('Connection error:', error);
  });

// creating a server with express
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Application running on ${port} port ...`);
});
