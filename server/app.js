const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const postRouter = require('./routes/posts');
const userRouter = require('./routes/user');

const app = express();
mongoose.connect('mongodb+srv://rumit:bwLfJDjHsQQ5lggi@cluster0-y1sqz.mongodb.net/node-angular?retryWrites=true')
  .then(() => {
    console.log('Connected to database successfully');
  }).catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("server/images")));

app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
   "Access-Control-Allow-Headers",
   "Origin, X-Requested-With, Content-Type, Accept, x-auth"
   );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});


app.use("/api/posts" , postRouter);
app.use("/api/user", userRouter);

module.exports = app;
