import axios from 'axios'
import { addReplyGame, replyGames } from '../../lib/game.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['caklontong', 'cl'],
  tag: 'game',
  public: true,
  coin: 0,
  cooldown: 3000,

  async run(criv, { m, sender, system }) {
    const aktif = Object.values(replyGames).find(
      g => decodeJid(g.sender) === decodeJid(sender)
    )
    if (aktif) {
      return m.reply(
        'Kamu masih punya game yang belum selesai.\nKetik *.skip* untuk menyerah.'
      )
    }

    try {
      const { data } = await axios.get('https://api.siputzx.my.id/api/games/caklontong')
      const soal = data?.data?.soal
      const jawaban = data?.data?.jawaban?.toString().trim().toUpperCase()
      const deskripsi = data?.data?.deskripsi || ''

      if (!soal || !jawaban) {
        return m.reply('Soal tidak lengkap dari API. Coba lagi nanti.')
      }

      const hadiah = 30
      const waktu = 30000

      const teks = 
        `📌 *Cak Lontong*\n\n` +
        `Pertanyaan: ${soal}\n` +
        `Waktu: ${waktu / 1000} detik\n` +
        `Hadiah: ${hadiah} coin\n\n` +
        `Balas pesan ini untuk menjawab.\n` +
        `Gunakan *.skip* untuk menyerah.`

      const kirim = await criv.sendMessage(m.chat, { text: teks }, { quoted: m })
      const gameId = kirim.key.id

      addReplyGame(gameId, {
        sender: decodeJid(sender),
        chatId: m.chat,
        answer: jawaban,
        timeout: waktu,

        onCorrect: async msg => {
          await system.giveReward(sender, hadiah)
          await criv.sendMessage(msg.chat, {
            text: `✅ Benar!\nJawaban: ${jawaban}\n${deskripsi}\nKamu mendapat ${hadiah} coin.`
          }, { quoted: msg })
        },

        onWrong: async msg => {
          await criv.sendMessage(msg.chat, {
            text: '❌ Salah. Coba lagi sebelum waktu habis.'
          }, { quoted: msg })
        },

        onTimeout: async () => {
          await criv.sendMessage(m.chat, {
            text: `⏰ Waktu habis!\nJawaban yang benar: ${jawaban}\nDeskripsi: ${deskripsi}`
          }, { quoted: m })
        }
      })
    } catch (err) {
      console.error(err)
      m.reply('Gagal mengambil soal. Coba lagi nanti.')
    }
  }
}