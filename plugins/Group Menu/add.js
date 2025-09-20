export default {
  command: ['add', 'tambah'],
  tag: 'group',
  owner: false,
  admin: true,
  botAdmin: true,
  public: true,
  group: true,
  premium: false,
  coin: 0,
  cooldown: 5000,
  async run(criv, { m, text, mentioned, quoted }) {
    let usersToAdd = []

    // Ambil target dari mention, reply, atau nomor teks
    if (mentioned) {
      usersToAdd.push(mentioned)
    } else if (quoted && quoted.sender) {
      usersToAdd.push(quoted.sender)
    } else if (text) {
      const cleanText = text.replace(/[^0-9+]/g, '')
      const numberMatch = cleanText.match(/(?:62|0)?([8-9]\d{7,11})/)
      if (numberMatch && numberMatch[1]) {
        let number = `${numberMatch[1]}@s.whatsapp.net`
        usersToAdd.push(number)
      }
    }

    if (usersToAdd.length === 0) return m.reply(global.msg.reply)

    let successCount = 0
    let failedList = []

    for (let userJid of usersToAdd) {
      // Format JID
      if (!userJid.endsWith('@s.whatsapp.net')) {
        userJid = userJid.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
      }
      if (userJid.startsWith('0')) {
        userJid = '62' + userJid.substring(1)
      }

      try {
        const response = await criv.groupParticipantsUpdate(m.chat, [userJid], 'add')

        if (response[0] && response[0].status == 200) {
          successCount++
        } else {
          let statusMessage = response[0]?.status ? `Status: ${response[0].status}` : 'Tidak diketahui'

          if (response[0]?.status === 403) {
            // Privasi aktif, kirim link invite
            try {
              const groupInviteCode = await criv.groupInviteCode(m.chat)
              const inviteLink = `https://chat.whatsapp.com/${groupInviteCode}`
              const groupMetadata = await criv.groupMetadata(m.chat)
              const groupName = groupMetadata.subject || 'Grup Ini'

              await criv.sendMessage(userJid, {
                text: `Kami mencoba menambahkan Anda ke grup "${groupName}", tetapi pengaturan privasi Anda tidak mengizinkannya. Silakan bergabung lewat link ini:\n\n${inviteLink}`
              })
              statusMessage = 'Privasi aktif, link dikirim via chat pribadi.'
            } catch (inviteError) {
              statusMessage = `Gagal kirim link undangan: ${inviteError.message}`
            }
          } else if (response[0]?.status === 408) {
            statusMessage = 'Pengguna keluar baru-baru ini atau privasi aktif.'
          } else if (response[0]?.status === 409) {
            statusMessage = 'Pengguna sudah di grup.'
          } else if (response[0]?.status === 401) {
            statusMessage = 'Nomor tidak valid/tidak terdaftar.'
          } else if (response[0]?.code === 404) {
            statusMessage = 'Nomor tidak ditemukan di WhatsApp.'
          } else if (response[0]?.status === 400 && response[0]?.code === '400') {
            statusMessage = 'Permintaan tidak valid.'
          }

          failedList.push(`${userJid.split('@')[0]} (${statusMessage})`)
        }
      } catch (error) {
        if (error.message === 'bad-request') {
          failedList.push(`${userJid.split('@')[0]} (Gagal: Permintaan tidak valid / nomor tidak ditemukan)`)
        } else {
          failedList.push(`${userJid.split('@')[0]} (Error: ${error.message})`)
        }
      }
    }

    // Buat summary hasil penambahan anggota
    let result = `*Status Penambahan Anggota:*\n`
    result += `Berhasil: ${successCount}\n`

    if (failedList.length > 0) {
      result += `Gagal: ${failedList.length}\n- ${failedList.join('\n- ')}\n`
    }

    await m.reply(result)
  }
}
  