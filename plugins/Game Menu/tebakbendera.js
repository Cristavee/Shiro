import axios from 'axios'
import { addReplyGame, replyGames } from '../../lib/game.js'
import system from '../../lib/system.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['tebakbendera'],
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
      const { data } = await axios.get('https://api.vreden.my.id/api/v1/game/tebak/bendera')
      const soal = data?.result
      if (!soal?.img || !soal?.name) {
        return m.reply('Soal tidak lengkap dari API.')
      }

      const jawaban = soal.name.trim().toUpperCase()
      const hadiah = 120
      const waktu = 30000

      const teks =
        `🚩 *Tebak Bendera Negara!*\n\n` +
        `🎁 Hadiah: ${hadiah} coin\n` +
        `⏱️ ${waktu / 1000} detik\n\n` +
        `Balas gambar ini dengan nama negara.\nKetik *.skip* untuk menyerah.`

      const kirim = await criv.sendMessage(
        m.chat,
        { image: { url: soal.img }, caption: teks },
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
              `> Jawaban: ${soal.name}\n` +
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
            text: `> ⏰ Waktu habis!\n> Jawaban yang benar: ${soal.name}`
          }, { quoted: m })
        }
      })
    } catch (err) {
      console.error(err)
      m.reply('Gagal mengambil soal. Coba lagi nanti.')
    }
  }
}