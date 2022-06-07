require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./routers/auth');

const { PORT = 5000 } = process.env;

const app = express();

app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);
    app.listen(PORT, () => console.log(`server started on ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
