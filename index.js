const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const buildApiCollection = () => {
  const collection = [];
  const apiDirectory = path.join(__dirname, 'api');

  const parseParams = (paramsString) => {
    if (!paramsString) return [];
    return paramsString.split(' ').filter(p => p).map(param => {
      const isRequired = param.endsWith('*');
      const name = isRequired ? param.slice(0, -1) : param;
      return { name, required: isRequired };
    });
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

      endpointInfo.params = parseParams(endpointInfo.params);
      const routePath = `/${endpointInfo.nama}`;
      collection.push({ path: routePath, ...endpointInfo });

      const method = endpointInfo.metode.toLowerCase();
      const handler = require(filePath);

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

  return collection;
};

const apiCollection = buildApiCollection();

app.get('/router.json', (req, res) => {
  const baseDomain = `https://${req.get('host')}`;

  const endpointsWithUrl = apiCollection.map(endpoint => ({
    ...endpoint,
    url: `${baseDomain}${endpoint.path}`
  }));

  res.setHeader('Content-Type', 'application/json');
  res.json({
    project_name: "Fast-Trash API",
    version: "1.0.0",
    base_domain: baseDomain,
    total_endpoints: apiCollection.length,
    endpoints: endpointsWithUrl
  });
});

app.use((req, res, next) => {
    res.redirect('/router.json')
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📚 Dokumentasi API tersedia di http://localhost:${PORT}/`);
});