require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');

// express app
const app = express();

// ============================================== Middleware ==========================================================
// Takes the body of the request and parses it into a js object and attaches into the req object, so we can use it in our routes
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);
//====================================================================================================================

// connect to db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        // listen to port
        app.listen(process.env.PORT, () => {
            console.log(
                'connected to database and listening for requests on port',
                process.env.PORT
            );
        });
    })
    .catch((err) => {
        console.log(err);
    });


    
