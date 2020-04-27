// const {
//   CONNECTION_STRING
// } = require('./cs.config')
const dotenv = require('dotenv')
dotenv.config()
const mongodb = require('mongodb');
mongodb.connect(
  process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, client) => {
    module.exports = client;
    const app = require("./app");
    app.listen(process.env.PORT);
  }
);
