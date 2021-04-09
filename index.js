const express = require("express");
const app = express();
const http = require("http");
const bodyparser = require("body-parser");
const agencyController = require("./api/controllers/AgencyController");
const productController = require("./api/controllers/ProductController");
const cors = require("cors");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use("/agency", agencyController);
app.use("/product", productController);

app.use(cors());
app.options("*", cors());

//Use system configuration for port or use 6001 by default.
const port = process.env.PORT || 3000;

//Create server with exported express app
const server = http.createServer(app);
server.listen(port, () => {
  console.log("app running");
});
