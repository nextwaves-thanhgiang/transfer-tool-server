const express = require("express");
const app = express();
const PORT = process.env.PORT || 3003;
const route = require("./src/routers");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors"); // Import thư viện CORS
const db = require("./src/config/db");

db.connect();

// Sử dụng middleware CORS
app.use(cors());

app.use(bodyParser.json());

route(app);

app.listen(PORT, () =>
  console.log("Example app listening at localhost port " + PORT)
);
