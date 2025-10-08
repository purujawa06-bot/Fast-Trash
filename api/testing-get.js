/**
 * @swagger
 * /testing-get:
 *   get:
 *     summary: Endpoint untuk tujuan testing.
 *     description: Endpoint ini digunakan untuk menguji fungsionalitas API dengan parameter 'tes' dan 'user_id'.
 *     tags:
 *       - main
 *     parameters:
 *       - in: query
 *         name: tes
 *         schema:
 *           type: string
 *         required: true
 *         description: Parameter wajib untuk tujuan pengujian.
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: false
 *         description: ID pengguna (opsional) untuk pengujian lebih lanjut.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Endpoint 'testing' berhasil dipanggil!
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "success"
 *             message:
 *               type: string
 *               example: "Endpoint 'testing' berhasil dipanggil!"
 *             data_diterima:
 *               type: object
 *               properties:
 *                 tes:
 *                   type: string
 *                   example: "nilaiTes"
 *                 user_id:
 *                   type: string
 *                   example: "123" atau "tidak ada"
 *       400:
 *         description: Parameter 'tes' wajib diisi.
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "error"
 *             message:
 *               type: string
 *               example: "Parameter 'tes' wajib diisi."
 */

module.exports = (req, res) => {
  const { tes, user_id } = req.query;

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