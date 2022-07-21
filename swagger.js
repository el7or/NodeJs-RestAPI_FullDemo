const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/auth.js', './routes/roles.js'];
const doc = {
    info: {
        title: 'Rest API',
        description: '',
    },
    host: 'localhost:8080',
    schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc)
// .then(() => {
//     require('./app.js')
// })