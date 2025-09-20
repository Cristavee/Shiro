import axios from 'axios'

export default {
  command: ['nik', 'ceknik', 'nikchecker'],
  tag: 'search',
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
      const meta = data.data.metadata

      const caption = `
Cek NIK

> NIK: ${data.data.nik}
> Nama: ${info.nama}
> Jenis Kelamin: ${info.kelamin}
> Tempat / Tanggal Lahir: ${info.tempat_lahir}
> Usia: ${info.usia}
> Provinsi: ${info.provinsi}
> Kabupaten: ${info.kabupaten}
> Kecamatan: ${info.kecamatan}
> Kelurahan: ${info.kelurahan}
> TPS: ${info.tps}
> Alamat: ${info.alamat}
> Zodiak: ${info.zodiak}
> Ultah Mendatang: ${info.ultah_mendatang}
> Pasaran: ${info.pasaran}

> Metode Pencarian: ${meta.metode_pencarian}
> Kode Wilayah: ${meta.kode_wilayah}
> Nomor Urut: ${meta.nomor_urut}
> Kategori Usia: ${meta.kategori_usia}
> Jenis Wilayah: ${meta.jenis_wilayah}
`.trim()

      await criv.sendMessage(m.chat, { text: caption }, { quoted: m })

    } catch (err) {
      console.error('Error NIK Checker:', err)
      m.reply('Gagal mengambil data NIK. Coba lagi nanti.')
    }
  }
}