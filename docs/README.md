# Dokumentasi Proyek

Selamat datang di dokumentasi proyek ini! Dokumentasi ini dirancang agar mudah diakses dan dapat dicoba langsung di browser Anda, memungkinkan eksplorasi dan pengujian yang interaktif.

## Memulai (Running Locally)

Untuk melihat dokumentasi ini di browser Anda secara lokal, ikuti langkah-langkah berikut:

### Prasyarat

Pastikan Anda memiliki Python dan `pip` (package installer for Python) terinstal di sistem Anda.

### Instalasi MkDocs

Dokumentasi ini dibuat menggunakan [MkDocs](https://www.mkdocs.org/), sebuah generator situs statis yang cepat dan sederhana. Jika Anda belum memilikinya, instal MkDocs melalui pip:

```bash
pip install mkdocs
```

### Menjalankan Server Dokumentasi

Navigasikan ke direktori utama proyek Anda (di mana file `mkdocs.yml` berada) di terminal Anda, lalu jalankan perintah berikut:

```bash
mkdocs serve
```

Setelah perintah ini dijalankan, Anda akan melihat pesan yang menunjukkan bahwa server sedang berjalan. Biasanya, dokumentasi dapat diakses melalui:

[http://127.0.0.1:8000](http://127.0.0.1:8000)

Buka URL ini di browser web pilihan Anda. MkDocs akan secara otomatis memuat ulang halaman di browser Anda setiap kali Anda membuat perubahan pada file Markdown sumber.

## Struktur Dokumentasi

File Markdown untuk dokumentasi berada di dalam direktori `docs/`.

- `index.md`: Halaman utama dokumentasi.
- File Markdown lainnya: Sesuai dengan struktur navigasi yang didefinisikan dalam `mkdocs.yml`.

Selamat menjelajahi dokumentasi!
