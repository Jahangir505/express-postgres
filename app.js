require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hello world",
  });
});

app.use("/api/v1/auth", authRoute);

app.use('*', (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Not found",
  });
})
const PORT = process.env.APP_PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
