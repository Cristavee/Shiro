import axios from 'axios'
import { addReplyGame, replyGames } from '../../lib/game.js'
import system from '../../lib/system.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['kuis'],
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
      const { data } = await axios.get('https://api.vreden.my.id/api/v1/game/kuis')
      const soal = data?.result
      if (!soal?.question || !soal?.choices || !soal?.correctAnswer) {
        return m.reply('Soal tidak lengkap dari API.')
      }

      const hadiah = 100
      const waktu = 30000
      const jawaban = soal.correctAnswer.trim().toUpperCase()

      const teks =
        `🧠 *Game Kuis Pilihan Ganda!*\n\n` +
        `❓ ${soal.question}\n\n` +
        Object.entries(soal.choices)
          .map(([key, val]) => `${key}. ${val}`)
          .join('\n') +
        `\n\n🎁 Hadiah: ${hadiah} coin\n⏱️ ${waktu / 1000} detik\n\n` +
        `Balas dengan huruf A/B/C untuk menjawab.\nKetik *.skip* untuk menyerah.`

      const kirim = await criv.sendMessage(
        m.chat,
        { text: teks },
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
              `> Jawaban: ${jawaban}. ${soal.choices[jawaban]}\n` +
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
            text: `> ⏰ Waktu habis!\n> Jawaban yang benar: ${jawaban}. ${soal.choices[jawaban]}`
          }, { quoted: m })
        }
      })
    } catch (err) {
      console.error(err)
      m.reply('Gagal mengambil soal. Coba lagi nanti.')
    }
  }
}