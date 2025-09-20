import axios from 'axios'
import { addReplyGame, replyGames } from '../../lib/game.js'
import system from '../../lib/system.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['tebakheroff', 'thff'],
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
      const { data } = await axios.get('https://api.vreden.my.id/api/tebakff')
      const soal = data?.result
      if (!soal?.jawaban || !soal?.img) {
        console.log('[DEBUG] API response:', data)
        return m.reply('Soal tidak lengkap dari API. Jawaban atau gambar tidak ditemukan.')
      }

      const jawaban = soal.jawaban.toString().trim().toUpperCase()
      const img = soal.img
      const hadiah = 50
      const waktu = 30000

      const teks =
        `🧠 *Tebak Karakter Free Fire!*\n\n` +
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
            text:
              `> 🎉 Benar!\n` +
              `> Jawaban: ${jawaban}\n` +
              `> Kamu mendapat ${hadiah} coin`
          }, { quoted: msg })
        },

        onWrong: async msg => {
          await criv.sendMessage(msg.chat, {
            text: '> ❌ Salah! Coba lagi sebelum waktu habis.'
          }, { quoted: msg })
        },

        onTimeout: async () => {
          await criv.sendMessage(m.chat, {
            text: `> ⏰ Waktu habis!\n> Jawaban yang benar: ${jawaban}`
          }, { quoted: m })
        }
      })
    } catch (err) {
      console.error(err)
      m.reply('Gagal mengambil soal. Coba lagi nanti.')
    }
  }
}