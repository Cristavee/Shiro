import axios from 'axios'
import { addReplyGame, replyGames } from '../../lib/game.js'
import system from '../../lib/system.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['tebaklogo', 'tl'],
  tag: 'game',
  public: true,
  coin: 0,
  cooldown: 3000,

  async run(criv, { m, sender }) {
    // Cek apakah user masih punya game aktif
    if (Object.values(replyGames).find(g => decodeJid(g.sender) === decodeJid(sender))) {
      return m.reply('Kamu masih punya game yang belum selesai.\nKetik *.skip* untuk menyerah.')
    }

    try {
      const { data } = await axios.get('https://api.siputzx.my.id/api/games/tebaklogo')
      const logoData = data?.data?.data
      const imageUrl = logoData?.image
      const jawaban = logoData?.jawaban?.toString().trim().toUpperCase()

      if (!imageUrl || !jawaban) return m.reply('Soal tidak lengkap dari API. Coba lagi nanti.')

      const rewardCoin = 40
      const timeout = 30000

      const caption =
        `🖼️ *Tebak Logo*\n\n` +
        `Perhatikan gambar di bawah dan jawab logo tersebut.\n` +
        `🎁 Hadiah: ${rewardCoin} coin\n` +
        `⏱️ Waktu: ${timeout / 1000} detik\n\n` +
        `Balas pesan ini untuk menjawab.\nKetik *.skip* untuk menyerah.`

      const sent = await criv.sendMessage(m.chat, { image: { url: imageUrl }, caption }, { quoted: m })
      const gameId = sent.key.id

      addReplyGame(gameId, {
        sender: decodeJid(sender),
        chatId: m.chat,
        answer: jawaban,
        timeout,

        onCorrect: async msg => {
          await system.giveReward(sender, rewardCoin)
          await criv.sendMessage(msg.chat, {
            text: `✅ Benar!\nJawaban: *${jawaban}*\nKamu mendapat *${rewardCoin} coin*`
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
      console.error('[ERROR] Gagal fetch soal tebaklogo:', err)
      m.reply('Gagal mengambil soal. Coba lagi nanti.')
    }
  }
}