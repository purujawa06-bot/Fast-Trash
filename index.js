const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'REST API Collection',
      version: '1.0.0',
      description: 'A simple Express API with Swagger UI documentation',
      contact: {
        name: 'Developer',
        email: 'developer@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
      {
        url: 'https://your-vercel-app-url.vercel.app', // Placeholder for Vercel URL
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated ID of the user',
              readOnly: true,
            },
            name: {
              type: 'string',
              description: 'The name of the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The email of the user',
            },
          },
          example: {
            id: 'd5fE_asz',
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
      },
    },
  },
  apis: ['./index.js'], // Path to the API docs (JSDoc comments in this file)
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(express.json());

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns a simple welcome message.
 *     responses:
 *       200:
 *         description: A successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to the API! Access documentation at /api-docs
 */
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API! Access documentation at /api-docs' });
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all users.
 *     responses:
 *       200:
 *         description: An array of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input.
 */
app.get('/users', (req, res) => {
  // In a real app, this would fetch from a database
  const users = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
  ];
  res.json(users);
});

app.post('/users', (req, res) => {
  const newUser = { id: Date.now().toString(), ...req.body };
  // In a real app, save to database
  res.status(201).json(newUser);
});

// For Vercel deployment, export the app
module.exports = app;

// Only listen if not being imported by Vercel (i.e., local development)
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
  });
}
