export default {
  command: ['menfess','confess'],
  tag: 'fun',
group: false,
  owner: false,
  coin: 30,
  private: true,
    async run(criv, { m, args, text, db }) {
    db.data.confess ||= {}
    const sender = m.rawSender
    const cmd = args[0]?.toLowerCase()
      // AKHIRI SESI
    if (cmd === 'end') {
      const session = Object.values(db.data.confess).find(
        s => s.sender === sender || s.recipient === sender
      )
      if (!session) return m.reply('❌ Kamu tidak ada dalam sesi menfess.')
      delete db.data.confess[session.sender]
      await m.reply('✅ Sesi menfess berakhir.')
      await criv.sendMessage(session.recipient, { text: '❌ Lawan bicaramu mengakhiri sesi menfess.' })
      return
    }
      // APPROVE / DECLINE
    if (cmd === 'approve' || cmd === 'decline') {
      const session = Object.values(db.data.confess).find(s => s.recipient === sender)
      if (!session) return m.reply('❌ Kamu tidak memiliki sesi yang harus disetujui.')
      session.approved = cmd === 'approve'
      await m.reply(`✅ Kamu telah ${cmd === 'approve' ? 'menyetujui' : 'menolak'} untuk mengetahui identitas pengirim.`)
      await criv.sendMessage(session.sender, {
        text: cmd === 'approve'
          ? '📬 Penerima telah menyetujui untuk mengetahui identitasmu. Kamu bisa membagikannya dengan .menfess share'
          : '📬 Penerima menolak untuk mengetahui identitasmu.'
      })
      return
    }
      // SHARE IDENTITAS
    if (cmd === 'share') {
      const session = Object.values(db.data.confess).find(s => s.sender === sender)
      if (!session) return m.reply('❌ Kamu tidak memiliki sesi aktif.')
      if (!session.approved) return m.reply('❌ Penerima belum menyetujui untuk mengetahui identitasmu.')
      await criv.sendContact(session.recipient, [
        { name: m.pushName, number: sender.split('@')[0] }
      ])
      await m.reply('✅ Identitasmu telah dibagikan ke penerima sebagai kontak WhatsApp.')
      return
    }
      // MULAI SESI CONFESS
    if (!text) return m.reply(`Gunakan:\n.confess <nomor> | <alias>\nContoh:\n.confess 62812xxxxxxx | Secret Admirer`)
    const [target, alias] = text.split('|').map(s => s.trim())
    if (!target || !alias) return m.reply('❌ Format salah.\nGunakan: .menfess <nomor> | <alias>')
    const recipient = target.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    if (target === criv.user.id.split(':')[0]) return m.reply('Mengirim menfess ke nomor bot tidak dapat dilakukan')
    if (target === m.sender) return m.reply('Anda tidak dapat melakukan menfess ke nomor anda sendiri')
    
      if (db.data.confess[sender]) return m.reply('❌ Kamu sudah punya sesi menfess, ketik .menfess end untuk mengakhiri.')
    if (Object.values(db.data.confess).find(s => s.recipient === recipient))
      return m.reply('❌ Penerima sedang ada dalam sesi menfess lain.')
      db.data.confess[sender] = { sender, recipient, alias, approved: false }
      await m.reply(`✅ Sesi menfess dimulai dengan ${target}.\nSemua pesanmu akan diteruskan sebagai *${alias}*.\nKetik .confess end untuk berhenti.`)
    await criv.sendMessage(recipient, {
      text: `📩 Kamu mendapat menfess anonim!\nSemua pesan akan dikirim lewat bot.\nKetik *.menfess approve* untuk mengetahui identitas pengirim atau *.menfess decline* untuk menolak.`
    })
  }}