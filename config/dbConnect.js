const mongoose = require("mongoose");
const config = require("config");
const url = config.get("mongoDB_URL");

exports.dbConnect = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log("DB is Connect...");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
