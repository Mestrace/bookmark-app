require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database connection
connectDB();


const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// Setting up server functions
app.get('/ping', (req, res) => {
    res.send('Bookmark API is running!');
});

app.use('/api/v1/bookmark', require('./routes/bookmark'));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

