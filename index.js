const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple REST API with Swagger',
      version: '1.0.0',
      description: 'A simple Express API with basic endpoints and Swagger documentation.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
      {
        url: 'https://your-vercel-app-url.vercel.app', // Replace with your Vercel app URL after deployment
        description: 'Production server',
      },
    ],
  },
  apis: ['./index.js'], // Path to the API docs (JSDoc comments in this file)
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware to parse JSON bodies
app.use(express.json());

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Returns a simple greeting message.
 *     responses:
 *       200:
 *         description: A successful response with a greeting.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello from the simple API!
 */
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the simple API!' });
});

/**
 * @swagger
 * /api/echo:
 *   post:
 *     summary: Echoes the received message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: This is a test message.
 *     responses:
 *       200:
 *         description: The echoed message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 echo: 
 *                   type: string
 *                   example: This is a test message.
 *       400:
 *         description: Bad request if message is missing.
 */
app.post('/api/echo', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required in the request body.' });
  }
  res.json({ echo: message });
});

// Basic root route
app.get('/', (req, res) => {
  res.send('Welcome to the Simple REST API. Go to /api-docs for Swagger UI.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
