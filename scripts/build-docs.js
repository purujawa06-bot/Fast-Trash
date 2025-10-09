const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');

// --- Konfigurasi Jalur ---
const DOCS_SRC = path.resolve(__dirname, '../docs');
const DOCS_DIST = path.resolve(__dirname, '../dist/docs');
const ASSETS_DIST = path.resolve(__dirname, '../dist/assets');

// --- Template HTML Dasar ---
const HTML_TEMPLATE = (title, content, navLinks) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Dokumentasi Proyek</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
    <header>
        <h1>Dokumentasi Proyek</h1>
        <nav>
            <a href="index.html">Beranda</a>
            ${navLinks.map(link => `<a href="${link.file}">${link.title}</a>`).join('')}
        </nav>
    </header>
    <main>
        ${content}
    </main>
    <footer>
        <p>&copy; ${new Date().getFullYear()} Dokumentasi Proyek</p>
    </footer>
    <script src="../assets/script.js"></script>
</body>
</html>
`;

// --- Konten CSS Default ---
const DEFAULT_CSS = `
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8f8f8; color: #333; }
header { background: #2c3e50; color: #ecf0f1; padding: 1.5rem 0; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
header h1 { margin: 0; font-size: 2.5rem; }
nav { margin-top: 15px; }
nav a { color: #ecf0f1; text-decoration: none; margin: 0 15px; font-weight: bold; transition: color 0.3s ease; }
nav a:hover { color: #3498db; text-decoration: underline; }
main { padding: 30px; max-width: 1000px; margin: 30px auto; background: #fff; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
h1, h2, h3, h4, h5, h6 { color: #2c3e50; }
footer { text-align: center; padding: 25px; margin-top: 40px; background: #2c3e50; color: #ecf0f1; font-size: 0.9rem; }
pre { background-color: #e8e8e8; padding: 1.2em; overflow-x: auto; border-radius: 6px; margin-bottom: 1.5em; }
code { font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace; background-color: #e8e8e8; padding: 0.2em 0.5em; border-radius: 4px; }
pre code { background-color: transparent; padding: 0; }
a { color: #3498db; text-decoration: none; }
a:hover { text-decoration: underline; }
ul, ol { margin-left: 20px; }
p { margin-bottom: 1em; }
blockquote { border-left: 4px solid #3498db; padding-left: 15px; margin: 1.5em 0; color: #555; }
table { width: 100%; border-collapse: collapse; margin-bottom: 1em; }
table, th, td { border: 1px solid #ddd; }
th, td { padding: 10px; text-align: left; }
th { background-color: #f2f2f2; }
`;

// --- Konten JS Default ---
// Untuk fungsionalitas interaktif, bisa ditambahkan di sini.
// Misalnya, untuk menjalankan contoh kode, toggle UI, dll.
const DEFAULT_JS = `
document.addEventListener('DOMContentLoaded', () => {
    console.log("Dokumentasi dimuat. Siap untuk fitur interaktif!");

    // Contoh sederhana: Menyorot tautan navigasi aktif
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath ||
            (currentPath === 'index.html' && link.getAttribute('href') === 'index.html')) {
            link.style.color = '#e74c3c'; // Warna aktif
            link.style.textDecoration = 'underline';
        }
    });

    // Anda bisa menambahkan fungsionalitas untuk "mencoba" kode di sini.
    // Misalnya, menemukan blok kode dengan kelas tertentu dan menambahkan tombol "Run".
    // const codeBlocks = document.querySelectorAll('pre code.runnable');
    // codeBlocks.forEach(block => {
    //     // Tambahkan tombol atau fungsionalitas interaktif lainnya
    // });
});
`;

// --- Fungsi Utilitas ---
async function prepareDistDir() {
    await fs.rm(DOCS_DIST, { recursive: true, force: true });
    await fs.mkdir(DOCS_DIST, { recursive: true });
    await fs.rm(ASSETS_DIST, { recursive: true, force: true });
    await fs.mkdir(ASSETS_DIST, { recursive: true });
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function titleize(slug) {
    return slug.replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// --- Fungsi Utama Pembangunan Dokumentasi ---
async function buildDocs() {
    console.log('Memulai pembangunan dokumentasi...');
    await prepareDistDir();

    // Tulis aset default (CSS, JS)
    await fs.writeFile(path.join(ASSETS_DIST, 'style.css'), DEFAULT_CSS);
    await fs.writeFile(path.join(ASSETS_DIST, 'script.js'), DEFAULT_JS);
    console.log('Aset default (style.css, script.js) telah dibuat.');

    const files = await fs.readdir(DOCS_SRC);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    const documentLinks = []; // Akan menyimpan metadata untuk semua dokumen

    // Tahap 1: Kumpulkan metadata semua dokumen Markdown
    for (const file of mdFiles) {
        const filenameWithoutExt = path.parse(file).name;
        const htmlSlug = slugify(filenameWithoutExt);
        const title = titleize(htmlSlug); // Judul yang bagus dari slug

        documentLinks.push({ file: `${htmlSlug}.html`, title: title });
    }

    // Tahap 2: Proses setiap dokumen dan buat file HTML
    for (const file of mdFiles) {
        const filePath = path.join(DOCS_SRC, file);
        const mdContent = await fs.readFile(filePath, 'utf-8');
        const filenameWithoutExt = path.parse(file).name;
        const htmlSlug = slugify(filenameWithoutExt);
        const title = titleize(htmlSlug); // Gunakan fungsi titleize

        const htmlContent = marked.parse(mdContent);
        // Lewatkan daftar lengkap tautan navigasi ke setiap halaman
        const finalHtml = HTML_TEMPLATE(title, htmlContent, documentLinks);

        await fs.writeFile(path.join(DOCS_DIST, `${htmlSlug}.html`), finalHtml);
        console.log(`Dokumen '${file}' telah dikonversi ke '${htmlSlug}.html'.`);
    }

    // Tahap 3: Buat file index.html
    const indexContent = `
        <h2>Selamat Datang di Dokumentasi Proyek</h2>
        <p>Gunakan navigasi di atas atau pilih salah satu dokumen di bawah ini:</p>
        <ul>
            ${documentLinks.map(link => `<li><a href="${link.file}">${link.title}</a></li>`).join('')}
        </ul>
    `;
    const finalIndexHtml = HTML_TEMPLATE('Beranda', indexContent, documentLinks); // Gunakan daftar lengkap
    await fs.writeFile(path.join(DOCS_DIST, 'index.html'), finalIndexHtml);
    console.log('File index.html telah dibuat.');

    console.log('Pembangunan dokumentasi selesai!');
}

// --- Jalankan Proses Pembangunan ---
buildDocs().catch(err => {
    console.error('Terjadi kesalahan saat membangun dokumentasi:', err);
    process.exit(1);
});
