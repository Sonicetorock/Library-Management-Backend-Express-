require('dotenv').config();
const express = require('express');
const {DBConnection} = require('./config/dbConnect');

const app = express();
app.use(express.json()); 

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server ignited on port ${PORT}`)
    DBConnection();// Connect to MongoDB
});
