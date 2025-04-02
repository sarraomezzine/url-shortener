import express, { Express } from "express";
import shortenerRoutes from "./routes/shortener.routes";
import config from "./config";
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const app: Express = express();

// Load the OpenAPI specification from the YAML file
try {
    const openapiDocument = yaml.load(fs.readFileSync('./docs/openapi.yaml', 'utf8')) as object;
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
} catch (e) {
    console.error(e);
}

app.use(express.json());
app.use("/", shortenerRoutes);

app.listen(config.port, () => {
    console.log(`[server]: Server is running at http://localhost:${config.port}`);
});
