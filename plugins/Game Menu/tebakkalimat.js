import axios from 'axios'
import { addReplyGame, replyGames } from '../../lib/game.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['tebakkalimat', 'tkalimat'],
  tag: 'game',
  description: 'Tebak kata atau kalimat yang hilang!',
  public: true,
  coin: 0,
  cooldown: 3000,

  async run(criv, { m, sender, system }) {
    if (Object.values(replyGames).find(g => decodeJid(g.sender) === decodeJid(sender))) {
      return m.reply('Kamu masih punya game yang belum selesai.\nKetik *.skip* untuk menyerah.')
    }

    try {
      const { data } = await axios.get('https://api.siputzx.my.id/api/games/tebakkalimat')
      const soal = data?.data?.soal
      const jawaban = data?.data?.jawaban?.toString().trim().toUpperCase()

      if (!soal || !jawaban) return m.reply('Soal tidak lengkap dari API. Coba lagi nanti.')

      const rewardCoin = 30
      const timeout = 30000
      const caption = `📝 *Tebak Kalimat*\n\nPertanyaan: ${soal}\nWaktu: ${timeout / 1000} detik\nHadiah: ${rewardCoin} coin\n\nBalas pesan ini untuk menjawab.\nGunakan *.skip* untuk menyerah.`
      const sent = await criv.sendMessage(m.chat, { text: caption }, { quoted: m })
      const gameId = sent.key.id

      addReplyGame(gameId, {
        sender: decodeJid(sender),
        chatId: m.chat,
        answer: jawaban,
        timeout,
        onCorrect: async (msg2) => {
          await system.giveReward(sender, rewardCoin)
          await criv.sendMessage(msg2.chat, {
            text: `✅ Benar!\nJawaban: ${jawaban}\nKamu mendapat ${rewardCoin} coin.`
          }, { quoted: msg2 })
        },
        onWrong: async (msg2) => {
          await criv.sendMessage(msg2.chat, {
            text: '❌ Salah. Coba lagi sebelum waktu habis.'
          }, { quoted: msg2 })
        },
        onTimeout: async () => {
          await criv.sendMessage(m.chat, {
            text: `⏰ Waktu habis!\nJawaban yang benar: ${jawaban}`
          }, { quoted: m })
        }
      })

    } catch (err) {
      console.error(err)
      m.reply('Gagal mengambil soal. Coba lagi nanti.')
    }
  }
}