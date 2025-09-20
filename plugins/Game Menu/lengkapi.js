import axios from 'axios'
import { addReplyGame, replyGames } from '../../lib/game.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['lengkapikalimat', 'lkm'],
  tag: 'game',
  public: true,
  coin: 0,
  cooldown: 3000,

  async run(criv, { m, sender, system }) {
    const aktif = Object.values(replyGames).find(
      g => decodeJid(g.sender) === decodeJid(sender)
    )
    if (aktif) {
      return m.reply('Kamu masih punya game yang belum selesai.\nKetik *.skip* untuk menyerah.')
    }

    try {
      const { data } = await axios.get('https://api.siputzx.my.id/api/games/lengkapikalimat')
      const soal = data?.data?.pertanyaan
      const jawaban = data?.data?.jawaban?.toString().trim().toUpperCase()

      if (!soal || !jawaban) return m.reply('Soal tidak lengkap dari API. Coba lagi nanti.')

      const hadiah = 25
      const waktu = 30000

      const teks =
        `📝 *Lengkapi Kalimat!*\n\n` +
        `> Pertanyaan: ${soal}\n` +
        `> Waktu: ${waktu / 1000} detik\n` +
        `> Hadiah: ${hadiah} coin\n\n` +
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
    } catch (err) {
      console.error(err)
      m.reply('Gagal mengambil soal. Coba lagi nanti.')
    }
  }
}