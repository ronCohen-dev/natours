const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env);

// creating a server with express
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Application running on ${port} port ...`);
});
