import axios from 'axios'
  export default {
  command: ['play','musik','music'],
  tag: 'download',
owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 5,
  cooldown: 5000,
    async run(criv, { m, text }) {
    if (!text) return criv.reply(m, msg.query)
      try {
      const api = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(text)}`
      const { data } = await axios.get(api)
        const hasil = data?.result
      if (!hasil?.status || !hasil?.download?.url) return criv.reply(m, msg.error)
        const {
        title,
        url: video,
        thumbnail,
        duration,
        views,
        author
      } = hasil.metadata
        const link = hasil.download.url
      const namaFile = hasil.download.filename || `${title}.mp3`
        const teks = `
> Judul   : ${title}
> Durasi  : ${duration?.timestamp || '-'}
> Views   : ${views?.toLocaleString() || '-'} kali
> Channel : ${author?.name || '-'}
> Link    : ${video}
> Format  : MP3 128kbps
  > Mengirim audio, tunggu sebentar...
      `.trim()
        await criv.sendImage(m.chat, thumbnail, teks )
        const ambil = await axios.get(link, {
        responseType: 'arraybuffer',
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': '*/*' },
        timeout: 15000,
        validateStatus: () => true
      })
        const buffer = Buffer.from(ambil.data)
      await criv.sendMessage(m.chat, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: namaFile
      }, { quoted: m })
      } catch (err) {
      console.error(err)
      criv.reply(m, msg.error)
    }
      await criv.sendReaction(m.chat, m.key, '')
  }
}