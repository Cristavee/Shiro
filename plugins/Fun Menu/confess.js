export default {
  command: ['menfess', 'confess'],
  tag: 'fun',
  group: false,
  owner: false,
  private: true,
  coin: 30,

  async run(criv, { m, args, text, db }) {
    db.data.confess ||= {}
    const sender = m.rawSender
    const cmd = args[0]?.toLowerCase()

    // AKHIRI SESI
    if (cmd === 'end') {
      const sess = Object.values(db.data.confess).find(
        s => s.sender === sender || s.recipient === sender
      )
      if (!sess) return m.reply('Kamu tidak ada dalam sesi menfess.')

      delete db.data.confess[sess.sender]
      await m.reply('Sesi menfess berakhir.')
      await criv.sendMessage(sess.recipient, {
        text: 'Lawan bicaramu mengakhiri sesi menfess.'
      })
      return
    }

    // APPROVE / DECLINE
    if (cmd === 'approve' || cmd === 'decline') {
      const sess = Object.values(db.data.confess).find(s => s.recipient === sender)
      if (!sess) return m.reply('Kamu tidak memiliki sesi yang harus disetujui.')

      sess.approved = cmd === 'approve'
      await m.reply(
        `Kamu telah ${cmd === 'approve' ? 'menyetujui' : 'menolak'} untuk mengetahui identitas pengirim.`
      )

      await criv.sendMessage(sess.sender, {
        text: cmd === 'approve'
          ? 'Penerima menyetujui untuk mengetahui identitasmu. Gunakan .menfess share untuk membagikannya.'
          : 'Penerima menolak untuk mengetahui identitasmu.'
      })
      return
    }

    // SHARE IDENTITAS
    if (cmd === 'share') {
      const sess = Object.values(db.data.confess).find(s => s.sender === sender)
      if (!sess) return m.reply('Kamu tidak memiliki sesi aktif.')
      if (!sess.approved) return m.reply('Penerima belum menyetujui untuk mengetahui identitasmu.')

      await criv.sendContact(sess.recipient, [
        { name: m.pushName, number: sender.split('@')[0] }
      ])
      await m.reply('Identitasmu telah dibagikan ke penerima sebagai kontak WhatsApp.')
      return
    }

    // MULAI SESI CONFESS
    if (!text) {
      return m.reply(
        `Gunakan:\n.menfess <nomor> | <alias>\nContoh:\n.menfess 62812xxxxxxx | Secret Admirer`
      )
    }

    const [num, alias] = text.split('|').map(s => s.trim())
    if (!num || !alias) {
      return m.reply('Format salah.\nGunakan: .menfess <nomor> | <alias>')
    }

    const recipient = num.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    if (num === criv.user.id.split(':')[0]) return m.reply('Tidak bisa mengirim menfess ke nomor bot.')
    if (num === m.sender) return m.reply('Tidak bisa mengirim menfess ke nomor sendiri.')

    if (db.data.confess[sender]) {
      return m.reply('Kamu sudah punya sesi menfess, ketik .menfess end untuk mengakhiri.')
    }

    if (Object.values(db.data.confess).find(s => s.recipient === recipient)) {
      return m.reply('Penerima sedang ada dalam sesi menfess lain.')
    }

    db.data.confess[sender] = { sender, recipient, alias, approved: false }

    await m.reply(
      `Sesi menfess dimulai dengan ${num}.\nSemua pesanmu akan diteruskan sebagai *${alias}*.\nKetik .menfess end untuk berhenti.`
    )

    await criv.sendMessage(recipient, {
      text: `Kamu mendapat menfess anonim!\nSemua pesan akan dikirim lewat bot.\nKetik *.menfess approve* untuk mengetahui identitas pengirim atau *.menfess decline* untuk menolak.`
    })
  }
}