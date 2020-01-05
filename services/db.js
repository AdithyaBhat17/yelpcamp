const mongoose = require('mongoose');

module.exports = function() {
  mongoose
    .connect(process.env.DB_URL, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log('Connected to MongoDB');
    });
};
