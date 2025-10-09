/*
* nama: testing-post
* kategori: main
* metode: post
* params: tes* user_id
* versi: 1.0.0
* status: aktif
* deskripsi: Endpoint untuk tujuan testing.
*/

/**
 * @swagger
 * /api/testing-post:
 *   post:
 *     tags:
 *       - main
 *     summary: Endpoint untuk tujuan testing.
 *     description: Endpoint ini digunakan untuk menguji fungsionalitas dasar API. Memerlukan parameter 'tes' dan bisa menerima 'user_id'.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tes
 *             properties:
 *               tes:
 *                 type: string
 *                 description: Data tes yang wajib diisi.
 *                 example: "ini adalah tes"
 *               user_id:
 *                 type: string
 *                 description: ID pengguna (opsional).
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Berhasil memanggil endpoint testing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Endpoint 'testing' berhasil dipanggil!"
 *                 data_diterima:
 *                   type: object
 *                   properties:
 *                     tes:
 *                       type: string
 *                       example: "nilai tes"
 *                     user_id:
 *                       type: string
 *                       example: "id_pengguna"
 *       400:
 *         description: Parameter 'tes' tidak ada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Parameter 'tes' wajib diisi."
 */
module.exports = (req, res) => {
  const { tes, user_id } = req.body;

  if (!tes) {
    return res.status(400).json({
      status: 'error',
      message: "Parameter 'tes' wajib diisi."
    });
  }

  res.json({
    status: 'success',
    message: "Endpoint 'testing' berhasil dipanggil!",
    data_diterima: {
      tes,
      user_id: user_id || 'tidak ada'
    }
  });
};