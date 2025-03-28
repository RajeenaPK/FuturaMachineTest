const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv=require('dotenv')

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config()



app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

  app.listen(3000,()=>{
    console.log("port 3000 is connected");
    
})