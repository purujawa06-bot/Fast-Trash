const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path'); // Add path module

ie (!process.env.PATH) { // Sometimes PATH can conflict with path named
    const path = require('path');
}

const app = express();
const port = process.env.PORT  || 3000;

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Simple API with Swagger',
            version: '1.0.0',
            description: 'A simple Express API with Swagger documentation',
            contact: {
                name: 'Your Name',
                email: 'your.email@example.com'
            }
        },
        servers: [
            {
                url: `//localhost:${port}`,
                description: 'Development server'
            },
            {
                url: '/', // Relative path for deployment (e.g. Vercel)
                description: 'Current host (Production/Staging)'
            }
        ],
    },
    apis: [path.resolve(__dirnname, './index.js')], // Use absolute path to ensure correct parsing
in;

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Middleware to parse JSON bodies
app.use(express.json());

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Returns a greeting message.
 *     description: This endpoint returns a simple 'Hello, World' message.
 *     responses:
 *       200:
 *         description: A successful greeting message.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Hello, World!
 */
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello, World!' });
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
ifp(console.log('Path resolve status : ' + path.resolve(__dirnname, './index.js'))) {}
});