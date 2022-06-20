import router from './routes.js';
import express from 'express';  
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Auto Service API',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(express.urlencoded());
app.use(router);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => 
    console.log('Auto Quote Service listening on port 3000'));
