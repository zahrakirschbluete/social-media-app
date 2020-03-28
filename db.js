const mongodb = require("mongodb");
const connectionString =
  "mongodb+srv://todoAppUser:Budapest2020@cluster0-8bgaw.mongodb.net/social-media-app?retryWrites=true&w=majority";
mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    module.exports = client.db();
    const app = require("./app");
    app.listen(3000);
  }
);
