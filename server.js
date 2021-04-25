// mongodb+srv://<username>:<password>@cluster0.zlo5o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const { urlencoded } = require("body-parser");
const express = require("express");

const { dbConnect } = require("./config/dbConnect");

const app = express();

//  Connect DB
dbConnect();

//  Parser Body
app.use(urlencoded({ extended: true }));
app.use(express.json());

// Define Routes

app.use("/api/users", require("./routes/users"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("Server Say Hello");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});
