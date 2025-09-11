import axios from 'axios'
import { addReplyGame, replyGames } from '../../lib/game.js'
import system from '../../lib/system.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['tebakhero', 'thml'],
  tag: 'game',
  public: true,
  coin: 0,
  cooldown: 3000,

  async run(criv, { m, sender }) {
    // cek apakah user masih punya game aktif
    const aktif = Object.values(replyGames).find(
      g => decodeJid(g.sender) === decodeJid(sender)
    )
    if (aktif) return m.reply('Kamu masih punya game yang belum selesai.\nKetik *.skip* untuk menyerah.')

    try {
      const { data } = await axios.get('https://api.vreden.my.id/api/tebakhero')
      const soal = data?.result
      if (!soal?.jawaban || !soal?.img) {
        console.log('[DEBUG] Data dari API tidak lengkap:', data)
        return m.reply('Soal tidak lengkap dari API. Coba lagi nanti.')
      }

      const jawaban = soal.jawaban.toString().trim().toUpperCase()
      const img = soal.img
      const hadiah = 50
      const waktu = 30000

      const teks =
        `🧠 *Tebak Hero MLBB!*\n\n` +
        `🎁 Hadiah: ${hadiah} coin\n` +
        `⏱️ Waktu: ${waktu / 1000} detik\n\n` +
        `Balas gambar ini untuk menjawab.\nKetik *.skip* untuk menyerah.`

      const kirim = await criv.sendMessage(
        m.chat,
        { image: { url: img }, caption: teks },
        { quoted: m }
      )

      const gameId = kirim.key.id
      addReplyGame(gameId, {
        sender: decodeJid(sender),
        chatId: m.chat,
        answer: jawaban,
        timeout: waktu,

        onCorrect: async msg => {
          await system.giveReward(sender, hadiah)
          await criv.sendMessage(msg.chat, {
            text: `🎉 Benar!\nJawaban: *${jawaban}*\nKamu mendapat *${hadiah} coin*`
          }, { quoted: msg })
        },

        onWrong: async msg => {
          await criv.sendMessage(msg.chat, {
            text: '❌ Salah! Coba lagi sebelum waktu habis.'
          }, { quoted: msg })
        },

        onTimeout: async () => {
          await criv.sendMessage(m.chat, {
            text: `⏰ Waktu habis!\nJawaban yang benar: *${jawaban}*`
          }, { quoted: m })
        }
      })
    } catch (err) {
      console.error('[ERROR] Gagal fetch soal tebakhero:', err)
      m.reply('Gagal mengambil soal. Coba lagi nanti.')
    }
  }
}