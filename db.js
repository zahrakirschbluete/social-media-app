// const {
//   CONNECTION_STRING
// } = require('./cs.config')

const mongodb = require('mongodb');
mongodb.connect(
  CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, client) => {
    module.exports = client;
    const app = require("./app");
    app.listen(3000);
  }
);
