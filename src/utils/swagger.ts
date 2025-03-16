import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger configuration
const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Swagger documentation',
        version: '1.0.0',
        description: 'URL Shshortening App documentation with Swagger',
      },
      servers: [
        {
          url: `http://localhost:3000`,
        },
      ],
    },
    apis: [ "./src/routes/urlShorten.route.ts" ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


function swaggerDocs(app: Express ) {
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export default swaggerDocs;