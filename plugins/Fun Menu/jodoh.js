import axios from 'axios'

async function cekJodoh(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2) {
  const apiUrl = `https://api.siputzx.my.id/api/primbon/ramalanjodoh?nama1=${encodeURIComponent(nama1)}&tgl1=${tgl1}&bln1=${bln1}&thn1=${thn1}&nama2=${encodeURIComponent(nama2)}&tgl2=${tgl2}&bln2=${bln2}&thn2=${thn2}`
  const res = await axios.get(apiUrl)
  return res.data
}

export default {
  command: ['jodoh', 'ramalanjodoh', 'cocokjodoh'],
  tag: 'fun',
  public: true,
  cooldown: 5000,
  coin: 10,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply(
        'Masukkan data dengan format:\n.jodoh putu,16,11,2007|keyla,1,1,2008'
      )
    }

    try {
      const [p1, p2] = text.split('|')
      if (!p1 || !p2) {
        return m.reply(
          'Format salah!\nGunakan: .jodoh putu,16,11,2007|keyla,1,1,2008'
        )
      }

      const [nama1, tgl1, bln1, thn1] = p1.split(',')
      const [nama2, tgl2, bln2, thn2] = p2.split(',')
      if (!nama1 || !tgl1 || !bln1 || !thn1 || !nama2 || !tgl2 || !bln2 || !thn2) {
        return m.reply('Format salah! Pastikan semua data lengkap.')
      }

      const result = await cekJodoh(nama1, tgl1, bln1, thn1, nama2, tgl2, bln2, thn2)
      if (!result.status || !result.data) {
        return m.reply('Data ramalan tidak ditemukan.')
      }

      const data = result.data.result
      const ramalan = (data.hasil_ramalan || [])
        .map((r, i) => `${i + 1}. ${r}`)
        .join('\n')

      const message = `
*Ramalan Jodoh Primbon*
Orang Pertama: ${data.orang_pertama.nama}
Tanggal Lahir: ${data.orang_pertama.tanggal_lahir}

Orang Kedua   : ${data.orang_kedua.nama}
Tanggal Lahir : ${data.orang_kedua.tanggal_lahir}

Deskripsi:
${data.deskripsi}

Hasil Ramalan:
${ramalan}

Peringatan:
${result.data.peringatan}
      `.trim()

      await criv.sendMessage(m.chat, { text: message }, { quoted: m })
    } catch (err) {
      console.error('Ramalan Jodoh error:', err)
      m.reply('Terjadi kesalahan saat mengecek ramalan jodoh.')
    }
  }
}