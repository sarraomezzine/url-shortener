import express from 'express';
import appRouter from './src/routes/urlShorten.route.ts'; // Import your routes
import swaggerDocs from './src/utils/swagger.ts'


const app = express();
const port = process.env.PORT || 3000;

// request body parser 
app.use(express.json());

// Health check route
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'Server is running' });
});

// Register routes
app.use('/', appRouter);

// Error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
});

// Start the server
app.listen(port, () => {
  swaggerDocs(app)
  console.log(`Server is running on http://localhost:${port}`);
});
