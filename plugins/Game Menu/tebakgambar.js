import axios from 'axios'
import { addReplyGame, replyGames } from '../../lib/game.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['tebakgambar', 'tg'],
  tag: 'game',
  description: 'Tebak gambar dari deskripsi yang diberikan',
  public: true,
  coin: 0,
  cooldown: 3000,

  async run(criv, { m, sender, system }) {
    if (Object.values(replyGames).find(g => decodeJid(g.sender) === decodeJid(sender))) {
      return m.reply('Kamu masih punya game yang belum selesai.\nKetik *.skip* untuk menyerah.')
    }

    const { data } = await axios.get('https://api.siputzx.my.id/api/games/tebakgambar')

    const { img, jawaban, deskripsi } = data.data
    const rewardCoin = 30
    const timeout = 30000

    const caption = `🧠 *Tebak Gambar!*\n\n📌 *Deskripsi:* ${deskripsi}\n🎁 Hadiah: ${rewardCoin} coin\n⏱️ Waktu: ${timeout / 1000} detik\n\n> Balas gambar ini untuk menjawab.\nKetik *.skip* untuk menyerah.`

    const sent = await criv.sendMessage(m.chat, {
      image: { url: img },
      caption
    }, { quoted: m })

    const gameId = sent.key.id

    addReplyGame(gameId, {
      sender: decodeJid(sender),
      chatId: m.chat,
      answer: jawaban.trim().toUpperCase(),
      timeout,
      onCorrect: async (msg2) => {
        await system.giveReward(sender, rewardCoin)
        await criv.sendMessage(msg2.chat, {
          text: `🎉 *Benar!* Jawabannya: *${jawaban.toUpperCase()}*\nKamu mendapat 💰 *${rewardCoin} coin*!`
        }, { quoted: msg2 })
      },
      onWrong: async (msg2) => {
        await criv.sendMessage(msg2.chat, {
          text: 'Salah! Coba lagi sebelum waktu habis.'
        }, { quoted: msg2 })
      },
      onTimeout: async () => {
        await criv.sendMessage(m.chat, {
          text: `Waktu habis!\nJawaban yang benar: *${jawaban.toUpperCase()}*`
        }, { quoted: m })
      }
    })
  }
}