const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/auth.js', './routes/roles.js'];
const doc = {
    info: {
        title: 'Rest API',
        description: '',
    },
    host: !process.env.PORT ? 'localhost:8080' : 'https://node-mongoose-restapi.herokuapp.com',
    schemes: ['http', 'https']
};

swaggerAutogen(outputFile, endpointsFiles, doc)
// .then(() => {
//     require('./app.js')
// })