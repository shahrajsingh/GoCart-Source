const path = require('path');
const exp = require('express');
const bodyParser = require("body-parser");
const app = exp();
const productroute = require('./routes/products');
const userroute = require('./routes/user');
const mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", exp.static(path.join("images")));
mongoose.connect("mongodb+srv://Shahraj:"+ process.env.MONGO_ATLAS_PW+"@cluster0-9kpzp.gcp.mongodb.net/store", {useNewUrlParser: true}).then(() => {
  console.log('connection successfull');
})
  .catch(() => {
    console.log('connection failed');
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/product", productroute);
app.use("/api/user",userroute);

module.exports = app;

