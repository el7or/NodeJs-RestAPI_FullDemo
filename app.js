const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const authRoutes = require('./routes/auth');
const rolesRoutes = require('./routes/roles');
// const usersRoutes = require('./routes/users');

const app = express();
const port = 8080;

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'images') },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

app.use(bodyParser.json()); // application/json
app.use(multer({ storage: fileStorage }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(authRoutes);
app.use(rolesRoutes);
// app.use(usersRoutes);

app.use((error, req, res, next) => {
    console.error(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const errors = error.data;
    res.status(status).json({ message: message, errors: errors });
});

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerFile)); // => https://medium.com/swlh/automatic-api-documentation-in-node-js-using-swagger-dd1ab3c78284

mongoose
    .connect(
        'mongodb+srv://node_test:node_test@cluster0.u9j79.mongodb.net/test-node?retryWrites=true&w=majority'
    )
    .then(result => {
        app.listen(port, () => console.log(`app listening on http://localhost:${port}`));
    })
    .catch(err => console.error(err));