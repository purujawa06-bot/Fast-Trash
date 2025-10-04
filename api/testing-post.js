/*
* nama: testing-post
* kategori: main
* metode: post
* params: tes* user_id
* versi: 1.0.0
* status: aktif
* deskripsi: Endpoint untuk tujuan testing.
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