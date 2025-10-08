const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs'); // Keep YAML for potential future use or if user wants to convert, though not strictly needed for this direct JSON generation.

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Swagger/OpenAPI document
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Fast-Trash API',
    version: '1.0.0',
    description: 'Dokumentasi API untuk proyek Fast-Trash',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Local server',
    },
  ],
  paths: {}, // This will be populated dynamically
  components: {
    schemas: {} // Can be extended for shared schemas if needed
  }
};

const buildApiCollection = () => {
  const apiDirectory = path.join(__dirname, 'api');

  // Modified parseParams to support OpenAPI structure
  const parseOpenAPIParams = (paramsString, routePath) => {
    if (!paramsString) return [];
    
    const definedParams = paramsString.split(' ').filter(p => p).map(paramStr => {
      const parts = paramStr.split(':');
      const name = parts[0];
      const type = parts[1] || 'string'; // Default to string
      const inLocation = parts[2] || 'query'; // Default to query if not specified
      const requiredChar = parts[3];
      const required = requiredChar === '*' ? true : false; // '*' for required, '?' or omit for optional

      const schema = { type }; // Simple schema for now

      return {
        name,
        in: inLocation,
        description: `Parameter ${name}`,
        required,
        schema
      };
    });

    // Extract path parameters from routePath like /users/{id}
    const pathParamsFromRoute = (routePath.match(/\{([^}]+)\}/g) || []).map(param => param.slice(1, -1));

    pathParamsFromRoute.forEach(paramName => {
      const existingParam = definedParams.find(p => p.name === paramName && p.in === 'path');
      if (!existingParam) {
        // If a path parameter is in the route but not explicitly defined in paramsString, add it.
        // Assume string type and required by default for path params.
        definedParams.push({
          name: paramName,
          in: 'path',
          description: `ID of the ${paramName}`,
          required: true, // Path params are typically required
          schema: { type: 'string' }
        });
      }
    });

    return definedParams;
  };

  try {
    const files = fs.readdirSync(apiDirectory);
    files.forEach(file => {
      if (!file.endsWith('.js')) return;

      const filePath = path.join(apiDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const commentBlockMatch = fileContent.match(/\/\*([\s\S]*?)\*\//);

      if (!commentBlockMatch) return;

      const endpointInfo = {};
      const lines = commentBlockMatch[1].match(/^\s*\*\s*([^:]+):\s*(.*)/gm);

      if (!lines) return;

      lines.forEach(line => {
        const parts = line.match(/^\s*\*\s*([^:]+):\s*(.*)/);
        if (parts && parts.length === 3) {
          endpointInfo[parts[1].trim()] = parts[2].trim();
        }
      });

      if (!endpointInfo.nama || !endpointInfo.metode) {
        console.error(`❌ File ${file} tidak memiliki 'nama' atau 'metode' di blok komentar.`);
        return;
      }

      // Convert path string like '/users/{id}' to OpenAPI compatible path '/users/{id}'
      const routePath = `/${endpointInfo.nama.replace(/\{(\w+)\}/g, '{$1}')}`; // Ensure curly braces are used
      const method = endpointInfo.metode.toLowerCase();
      const handler = require(filePath);

      // --- OpenAPI Documentation Generation --- 
      const openapiOperation = {
        summary: endpointInfo.deskripsi || endpointInfo.nama,
        description: endpointInfo.deskripsi,
        parameters: parseOpenAPIParams(endpointInfo.params, routePath),
        responses: {}
      };

      // Handle request_body
      if (endpointInfo.request_body) {
        try {
          openapiOperation.requestBody = {
            required: true, // Assuming request body is usually required
            content: {
              'application/json': {
                schema: JSON.parse(endpointInfo.request_body)
              }
            }
          };
        } catch (e) {
          console.error(`❌ Gagal parsing request_body di ${file}:`, e.message);
        }
      }

      // Handle responses
      if (endpointInfo.responses) {
        try {
          const parsedResponses = JSON.parse(endpointInfo.responses);
          for (const statusCode in parsedResponses) {
            openapiOperation.responses[statusCode] = {
              description: parsedResponses[statusCode].description || 'Successful response',
              content: {
                'application/json': {
                  schema: parsedResponses[statusCode].schema || { type: 'object' }
                }
              }
            };
          }
        } catch (e) {
          console.error(`❌ Gagal parsing responses di ${file}:`, e.message);
          openapiOperation.responses['200'] = { description: 'Success' }; // Fallback
        }
      } else {
        openapiOperation.responses['200'] = { description: 'Success' }; // Default 200 response
      }

      // Add operation to swaggerDocument.paths
      if (!swaggerDocument.paths[routePath]) {
        swaggerDocument.paths[routePath] = {};
      }
      swaggerDocument.paths[routePath][method] = openapiOperation;

      // --- Express Route Registration ---
      if (app[method]) {
          app[method](routePath, handler);
          console.log(`✅ Endpoint terdaftar: [${method.toUpperCase()}] ${routePath}`);
      } else {
          console.error(`❌ Metode tidak valid '${method}' untuk endpoint '${endpointInfo.nama}'`);
      }
    });
  } catch (error) {
    console.error(`❌ Gagal membaca direktori API: ${apiDirectory}`, error);
  }
};

// Build the API collection and populate swaggerDocument.paths
buildApiCollection();

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Remove the old /router.json and its redirect
// app.get('/router.json', (req, res) => { /* ... */ });
// app.use((req, res, next) => { res.redirect('/router.json') });

// Redirect root path to Swagger UI
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📚 Dokumentasi API tersedia di http://localhost:${PORT}/api-docs`);
});
