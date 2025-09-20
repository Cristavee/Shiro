import axios from 'axios'
import { addReplyGame, replyGames, stopUserGame } from '../../lib/game.js'
import system from '../../lib/system.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['tebakkimia', 'kimia'],
  tag: 'game',
  public: true,
  coin: 0,
  cooldown: 3000,

  async run(criv, { m, sender, text }) {
    const mode = text?.toLowerCase().trim()
    if (mode === 'skip' || mode === 'stop') {
      const stop = stopUserGame(sender)
      return m.reply(stop ? 'Game berhasil dihentikan.' : 'Tidak ada game yang sedang berlangsung.')
    }

    const aktif = Object.values(replyGames).find(
      g => decodeJid(g.sender) === decodeJid(sender)
    )
    if (aktif) {
      return m.reply('Kamu masih punya game yang belum selesai.\nKetik *.skip* untuk menyerah.')
    }

    const { data } = await axios.get('https://api.siputzx.my.id/api/games/tebakkimia')
    const { unsur, lambang } = data?.data || {}

    const jawaban = lambang.toString().trim().toUpperCase()
    const hadiah = 40
    const waktu = 30000

    const teks =
      `🧪 *Tebak Lambang Kimia!*\n\n` +
      `> Soal: ${unsur}\n` +
      `> Hadiah: ${hadiah} coin\n` +
      `> Waktu: ${waktu / 1000} detik\n\n` +
      `Balas pesan ini untuk menjawab.\n` +
      `Ketik *.skip* untuk menyerah.`

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
          text:
            `> Benar!\n` +
            `> Jawaban: ${jawaban}\n` +
            `> Kamu mendapat ${hadiah} coin`
        }, { quoted: msg })
      },

      onWrong: async msg => {
        await criv.sendMessage(msg.chat, {
          text: '> Salah. Coba lagi sebelum waktu habis.'
        }, { quoted: msg })
      },

      onTimeout: async () => {
        await criv.sendMessage(m.chat, {
          text:
            `> Waktu habis!\n` +
            `> Jawaban yang benar: ${jawaban}`
        }, { quoted: m })
      }
    })
  }
}