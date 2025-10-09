const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// HTML content for API Documentation - Cartoon Mobile First Style
const apiDocHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎉 Dokumentasi API Lucu!</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');

        body {
            font-family: 'Comic Neue', cursive;
            background-color: #ffe6f2; /* Warna pink cerah */
            margin: 0;
            padding: 20px;
            color: #333;
            text-align: center;
            line-height: 1.6;
            overflow-x: hidden; /* Mengatasi scroll horizontal */
        }

        .container {
            background-color: #fff;
            border-radius: 25px;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
            padding: 30px 20px;
            margin: 20px auto;
            max-width: 90%;
            border: 3px dashed #ff99cc; /* Border lucu */
            box-sizing: border-box;
        }

        h1 {
            color: #ff66b2; /* Pink lebih gelap */
            font-size: 2.5em;
            margin-bottom: 20px;
            text-shadow: 2px 2px #ffeeee;
        }

        h2 {
            color: #ff3399;
            font-size: 1.8em;
            margin-top: 30px;
            border-bottom: 2px solid #ff99cc;
            padding-bottom: 10px;
            display: inline-block;
            transform: rotate(-3deg);
        }

        p {
            font-size: 1.1em;
            color: #555;
            margin-bottom: 15px;
        }

        .endpoint-card {
            background-color: #fff0f5; /* Lavender Blush */
            border-radius: 15px;
            padding: 20px;
            margin: 25px 0;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
            border: 2px solid #ffccdd;
            text-align: left;
            position: relative;
            overflow: hidden;
        }

        .endpoint-card::before {
            content: '✨';
            position: absolute;
            top: -10px;
            left: -10px;
            font-size: 4em;
            opacity: 0.2;
            transform: rotate(-20deg);
        }

        .endpoint-card h3 {
            color: #cc0066;
            font-size: 1.5em;
            margin-bottom: 10px;
            transform: rotate(2deg);
            display: inline-block;
        }

        .method {
            background-color: #66ccff; /* Biru muda */
            color: white;
            padding: 5px 10px;
            border-radius: 8px;
            font-weight: bold;
            margin-right: 10px;
            display: inline-block;
        }

        .path {
            background-color: #99ff99; /* Hijau muda */
            color: #333;
            padding: 5px 10px;
            border-radius: 8px;
            display: inline-block;
            font-weight: bold;
        }

        .code-block {
            background-color: #f0f8ff; /* Alice Blue */
            border: 1px solid #add8e6; /* Light Blue */
            padding: 15px;
            border-radius: 10px;
            margin-top: 15px;
            overflow-x: auto;
            font-family: 'Courier New', Courier, monospace;
            color: #005577;
            font-size: 0.95em;
            text-align: left;
        }

        footer {
            margin-top: 40px;
            font-size: 0.9em;
            color: #777;
            padding: 15px;
            background-color: #ffe6f2;
            border-top: 1px dashed #ff99cc;
            border-radius: 15px;
        }

        @media (min-width: 768px) {
            .container {
                max-width: 700px;
                padding: 40px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>👋 Selamat Datang di Dunia API Kami!</h1>
        <p>Ini adalah dokumentasi sederhana untuk API kami. Bersiaplah untuk bersenang-senang!</p>

        <h2>🚀 Endpoint Lucu</h2>

        <div class="endpoint-card">
            <h3>Endpoint: Ping Server</h3>
            <p><strong>Deskripsi:</strong> Untuk memeriksa apakah server kami hidup dan sehat.</p>
            <p>
                <span class="method">GET</span>
                <span class="path">/api/ping</span>
            </p>
            <p><strong>Respon Sukses (200 OK):</strong></p>
            <div class="code-block">
                <code>
{
  "message": "Pong! Server is alive! 🎈"
}
                </code>
            </div>
        </div>

        <div class="endpoint-card">
            <h3>Endpoint: Halaman Utama</h3>
            <p><strong>Deskripsi:</strong> Anda sedang melihatnya! Halaman dokumentasi ini.</p>
            <p>
                <span class="method">GET</span>
                <span class="path">/</span>
            </p>
            <p><strong>Respon Sukses (200 OK):</strong></p>
            <div class="code-block">
                <code>
<!-- Ini adalah halaman HTML yang sedang Anda lihat! -->
                </code>
            </div>
        </div>

        <footer>
            <p>Dibuat dengan ❤️ dan banyak stiker lucu!</p>
        </footer>
    </div>
</body>
</html>
`;

// Serve the cartoonish API documentation at the root path
app.get('/', (req, res) => {
  res.type('html').send(apiDocHtml);
});

// New endpoint: /api/ping
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong! Server is alive! 🎈' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
