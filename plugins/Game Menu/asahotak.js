import axios from 'axios'
import { addReplyGame, replyGames, stopUserGame } from '../../lib/game.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['asahotak', 'otak'],
  tag: 'game',
  public: true,
  coin: 0,
  cooldown: 3000,

  async run(criv, { m, sender, text, system }) {
    const mode = text?.toLowerCase().trim()

    // Hentikan game
    if (mode === 'skip' || mode === 'stop') {
      const success = stopUserGame(sender)
      return m.reply(success ? 'Game berhasil dihentikan.' : 'Tidak ada game yang sedang berlangsung.')
    }

    // Cek kalau user masih punya game aktif
    if (Object.values(replyGames).find(g => decodeJid(g.sender) === decodeJid(sender))) {
      return m.reply('Kamu masih punya game yang belum selesai.\nKetik *.skip* untuk menyerah.')
    }

    // Ambil soal
    const { data } = await axios.get('https://api.siputzx.my.id/api/games/asahotak')
    const soal = data.data.soal
    const jawaban = data.data.jawaban.toString().trim().toUpperCase()

    const rewardCoin = 35
    const timeout = 30000

    const caption = `
🧠 *Asah Otak*

❓ Soal:
> ${soal}

🎁 Hadiah:
> ${rewardCoin} coin

⏱️ Waktu:
> ${timeout / 1000} detik

Balas pesan ini untuk menjawab.
Ketik *.skip* untuk menyerah.
    `.trim()

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
          text: `Benar! Jawabannya: *${jawaban}*\nKamu mendapat *${rewardCoin} coin*!`
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