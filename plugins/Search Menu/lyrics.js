import axios from 'axios'

async function getLyrics(title) {
  if (!title) throw new Error('Judul lagu tidak boleh kosong')

  const { data } = await axios.get(`https://lrclib.net/api/search?q=${encodeURIComponent(title)}`, {
    headers: {
      referer: `https://lrclib.net/search/${encodeURIComponent(title)}`,
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
    }
  })

  if (!data || !data[0]) throw new Error('Lirik tidak ditemukan')

  const song = data[0]
  const track = song.trackName || 'Unknown Track'
  const artist = song.artistName || 'Unknown Artist'
  const album = song.albumName || 'Unknown Album'
  const duration = song.duration
    ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`
    : 'Unknown'

  let lyrics = song.plainLyrics || song.syncedLyrics || 'Tidak ada lirik tersedia'
  lyrics = lyrics.replace(/\[.*?\]/g, '').trim()

  return `*Lirik Lagu*

> Judul: ${track}
> Artis: ${artist}
> Album: ${album}
> Durasi: ${duration}

──────────────────
${lyrics}`
}

export default {
  command: ['lirik', 'lyrics'],
  tag: 'search',
  description: 'Cari lirik lagu dari judul',

  async run(criv, { m, args }) {
    if (!args.length) return m.reply('Masukkan judul lagu\nContoh: .lirik nina feast')

    try {
      const title = args.join(' ')
      const result = await getLyrics(title)
      await criv.sendMessage(m.chat, { text: result }, { quoted: m })
    } catch (err) {
      console.error('Lyrics Error:', err)
      m.reply(err.message)
    }
  }
}