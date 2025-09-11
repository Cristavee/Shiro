import axios from 'axios'
import { addReplyGame, replyGames } from '../../lib/game.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['tebakgambar', 'tg'],
  tag: 'game',
  public: true,
  coin: 0,
  cooldown: 3000,

  async run(criv, { m, sender, system }) {
    // cek apakah user masih ada game aktif
    const aktif = Object.values(replyGames).find(
      g => decodeJid(g.sender) === decodeJid(sender)
    )
    if (aktif) {
      return m.reply('Kamu masih punya game yang belum selesai.\nKetik *.skip* untuk menyerah.')
    }

    try {
      const { data } = await axios.get('https://api.siputzx.my.id/api/games/tebakgambar')
      const soal = data?.data
      const img = soal?.img
      const jwb = soal?.jawaban?.toString().trim().toUpperCase()
      const desk = soal?.deskripsi || ''

      if (!img || !jwb) return m.reply('Soal tidak lengkap dari API. Coba lagi nanti.')

      const hadiah = 30
      const waktu = 30000

      const teks =
        `🧠 *Tebak Gambar!*\n\n` +
        `📌 Deskripsi: ${desk}\n` +
        `🎁 Hadiah: ${hadiah} coin\n` +
        `⏱️ Waktu: ${waktu / 1000} detik\n\n` +
        `Balas gambar ini untuk menjawab.\n` +
        `Ketik *.skip* untuk menyerah.`

      const kirim = await criv.sendMessage(
        m.chat,
        { image: { url: img }, caption: teks },
        { quoted: m }
      )

      const gameId = kirim.key.id
      addReplyGame(gameId, {
        sender: decodeJid(sender),
        chatId: m.chat,
        answer: jwb,
        timeout: waktu,

        onCorrect: async msg => {
          await system.giveReward(sender, hadiah)
          await criv.sendMessage(msg.chat, {
            text:
              `> Benar!\n` +
              `> Jawaban: ${jwb}\n` +
              `> Kamu mendapat ${hadiah} coin`
          }, { quoted: msg })
        },

        onWrong: async msg => {
          await criv.sendMessage(msg.chat, {
            text: '> Salah. Coba lagi sebelum waktu habis.'
          }, { quoted: msg })
        },

        onTimeout: async () => {
          await criv.sendMessage(m.chat, {
            text:
              `> Waktu habis!\n` +
              `> Jawaban yang benar: ${jwb}`
          }, { quoted: m })
        }
      })
    } catch (err) {
      console.error(err)
      m.reply('Gagal mengambil soal. Coba lagi nanti.')
    }
  }
}