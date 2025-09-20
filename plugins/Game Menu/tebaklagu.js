import axios from 'axios'
import { addReplyGame, replyGames } from '../../lib/game.js'
import system from '../../lib/system.js'
import { decodeJid } from '../../lib/helpers.js'

export default {
  command: ['tebaklagu'],
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
      const { data } = await axios.get('https://api.vreden.my.id/api/v1/game/tebak/lagu')
      const soal = data?.result
      if (!soal?.lagu || !soal?.judul) {
        return m.reply('Soal tidak lengkap dari API.')
      }

      const jawaban = soal.judul.trim().toUpperCase()
      const hadiah = 50
      const waktu = 100000

      const teks =
        `🎵 *Tebak Judul Lagu!*\n\n` +
        `👤 Penyanyi: ${soal.artis || '-'}\n` +
        `🎁 Hadiah: ${hadiah} coin\n` +
        `⏱️ ${waktu / 1000} detik\n\n` +
        `Balas lagu dibawah ini dengan judul lagu yang benar.\nKetik *.skip* untuk menyerah.`
       await m.reply(teks)
      const kirim = await criv.sendMessage(
        m.chat,
        { audio: { url: soal.lagu }, mimetype: 'audio/mpeg', ptt: false, caption: teks },
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
              `> Judul: ${soal.judul}\n` +
              `> Penyanyi: ${soal.artis}\n` +
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
            text: `> ⏰ Waktu habis!\n> Jawaban yang benar: ${soal.judul} - ${soal.artis}`
          }, { quoted: m })
        }
      })
    } catch (err) {
      console.error(err)
      m.reply('Gagal mengambil soal. Coba lagi nanti.')
    }
  }
}