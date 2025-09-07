import axios from 'axios'

export default {
  command: ['nik', 'ceknik', 'nikchecker'],
  tag: 'search',
  description: 'Cek informasi NIK (Nomor Induk Kependudukan)',
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) return m.reply('Silakan masukkan NIK.\nContoh: .nik 3202285909840005')

    try {
      const { data } = await axios.get(`https://api.siputzx.my.id/api/tools/nik-checker?nik=${encodeURIComponent(text)}`)
      if (!data?.status || !data?.data) return m.reply('NIK tidak ditemukan atau API bermasalah.')

      const info = data.data.data
      const metadata = data.data.metadata

      const caption = `🆔 *Cek NIK*\n\n` +
                      `> NIK: ${data.data.nik}\n` +
                      `> Nama: ${info.nama}\n` +
                      `> Jenis Kelamin: ${info.kelamin}\n` +
                      `> Tempat Lahir / Tanggal Lahir: ${info.tempat_lahir}\n` +
                      `> Usia: ${info.usia}\n` +
                      `> Provinsi: ${info.provinsi}\n` +
                      `> Kabupaten: ${info.kabupaten}\n` +
                      `> Kecamatan: ${info.kecamatan}\n` +
                      `> Kelurahan: ${info.kelurahan}\n` +
                      `> TPS: ${info.tps}\n` +
                      `> Alamat: ${info.alamat}\n` +
                      `> Zodiak: ${info.zodiak}\n` +
                      `> Ultah Mendatang: ${info.ultah_mendatang}\n` +
                      `> Pasaran: ${info.pasaran}\n\n` +
                      `> Metode Pencarian: ${metadata.metode_pencarian}\n` +
                      `> Kode Wilayah: ${metadata.kode_wilayah}\n` +
                      `> Nomor Urut: ${metadata.nomor_urut}\n` +
                      `> Kategori Usia: ${metadata.kategori_usia}\n` +
                      `> Jenis Wilayah: ${metadata.jenis_wilayah}`

      await criv.sendMessage(m.chat, { text: caption }, { quoted: m })

    } catch (err) {
      console.error('Error NIK Checker:', err)
      m.reply('Gagal mengambil data NIK. Coba lagi nanti.')
    }
  }
}