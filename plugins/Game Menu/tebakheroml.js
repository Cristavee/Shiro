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
    if (Object.values(replyGames).find(g => decodeJid(g.sender) === decodeJid(sender))) {
      return m.reply('Kamu masih punya game yang belum selesai.\nKetik *.skip* untuk menyerah.')
    }
      try {
      const { data } = await axios.get('https://api.vreden.my.id/api/tebakhero')
        if (!data?.result?.jawaban || !data?.result?.img) {
        console.log('[DEBUG] Data dari API tidak lengkap:', data)
        return m.reply('Soal tidak lengkap dari API. Coba lagi nanti.')
      }
        const jawaban = data.result.jawaban.toString().trim().toUpperCase()
      const img = data.result.img
        const rewardCoin = 50
      const timeout = 30000
        const caption = `🧠 *Tebak Hero MLBB!*\n\nHadiah: ${rewardCoin} coin\nWaktu: ${timeout / 1000} detik\n\n> Balas gambar ini untuk menjawab.\nKetik *.skip* untuk menyerah.`
        const sent = await criv.sendMessage(m.chat, {
        image: { url: img },
        caption
      }, { quoted: m })
        const gameId = sent.key.id
        addReplyGame(gameId, {
        sender: decodeJid(sender),
        chatId: m.chat,
        answer: jawaban,
        timeout,
        onCorrect: async (msg2) => {
          await system.giveReward(sender, rewardCoin)
          await criv.sendMessage(msg2.chat, {
            text: `🎉 Benar. Jawabannya: *${jawaban}*\nKamu mendapat *${rewardCoin} coin*.`
          }, { quoted: msg2 })
        },
        onWrong: async (msg2) => {
          await criv.sendMessage(msg2.chat, {
            text: 'Salah. Coba lagi sebelum waktu habis.'
          }, { quoted: msg2 })
        },
        onTimeout: async () => {
          await criv.sendMessage(m.chat, {
            text: `Waktu habis. Jawaban yang benar: ${jawaban}`
          }, { quoted: m })
        }
      })
      } catch (err) {
      console.error('[ERROR] Gagal fetch soal tebakhero:', err)
      m.reply('Gagal mengambil soal. Coba lagi nanti.')
    }
  }
}