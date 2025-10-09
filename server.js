const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

// Konfigurasi Swagger JSDoc
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Dokumentasi',
      version: '1.0.0',
      description: 'Dokumentasi API untuk aplikasi ini. Mohon pastikan path API sudah benar.',
    },
    servers: [
      {
        url: `http://localhost:${port}/api`, // Sesuaikan dengan base URL API Anda
        description: 'Server Pengembangan Lokal',
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'], // Sesuaikan path ke file rute dan model Anda
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware untuk menyajikan Swagger UI
// Pastikan path '/api-docs' tidak bentrok dengan rute lain
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Contoh rute dasar (bisa dihapus jika sudah ada rute lain)
app.get('/', (req, res) => {
  res.send('Aplikasi berjalan. Kunjungi /api-docs untuk dokumentasi API.');
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
  console.log(`Dokumentasi API tersedia di http://localhost:${port}/api-docs`);
});