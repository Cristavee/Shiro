import axios from 'axios'
import { addReplyGame, replyGames, stopUserGame } from '../../lib/game.js'
import { decodeJid } from '../../lib/helpers.js'
  export default {
  command: ['tebaktebakan', 'ttebak'],
  tag: 'game',
public: true,
  coin: 0,
  cooldown: 3000,
    async run(criv, { m, sender, text, system }) {
    const mode = text?.toLowerCase().trim()
      if (Object.values(replyGames).find(g => decodeJid(g.sender) === decodeJid(sender))) {
      return m.reply('Kamu masih punya game yang belum selesai.\nKetik *.skip* untuk menyerah.')
    }
      const { data } = await axios.get('https://api.siputzx.my.id/api/games/tebaktebakan')
        const soal = data.data.soal
      const jawaban = data.data.jawaban.toString().trim().toUpperCase()
        const rewardCoin = 30
      const timeout = 30000
        const caption = `🧠 *Tebak-Tebakan Receh!*\n\n❓ *Pertanyaan:* ${soal}\n🎁 Hadiah: ${rewardCoin} coin\n⏱️ Waktu: ${timeout / 1000} detik\n\n> Balas pesan ini untuk menjawab.\nKetik *.skip* untuk menyerah.`
        const sent = await criv.sendMessage(m.chat, { text: caption }, { quoted: m })
        const gameId = sent.key.id
        addReplyGame(gameId, {
        sender: decodeJid(sender),
        chatId: m.chat,
        answer: jawaban,
        timeout,
        onCorrect: async (msg2) => {
          await system.gameWin(sender)
          await system.giveReward(sender, rewardCoin)
          await criv.sendMessage(msg2.chat, {
            text: `🎉 *Benar!* Jawabannya: *${jawaban}*\nKamu mendapat 💰 *${rewardCoin} coin*!`
          }, { quoted: msg2 })
        },
        onWrong: async (msg2) => {
          await criv.sendMessage(msg2.chat, {
            text: 'Salah! Coba lagi sebelum waktu habis.'
          }, { quoted: msg2 })
        },
        onTimeout: async () => {
          await criv.sendMessage(m.chat, {
            text: `Waktu habis!\nJawaban yang benar: *${jawaban}*`
          }, { quoted: m })
        }
      })
  }
}