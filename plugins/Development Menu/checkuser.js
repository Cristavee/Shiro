export default {
  command: ['checkuser'],
  tag: 'dev',
  owner: true,

  async run(criv, { m, text, system }) {
    if (!text) text = m.sender

    const user = system.getUser(text)
    if (!user) return m.reply('User tidak ditemukan.')

    const info = `
> DATA USER: ${text}

• Nama: ${user.name || '-'}
• Bio: ${user.bio || '-'}
• Status: ${user.status || '-'}

• Premium: ${user.premium ? 'Ya' : 'Tidak'}
• Banned: ${user.isBanned ? 'Ya' : 'Tidak'}
• Badge: ${user.badge || '-'}

• Coin: ${user.coin || 0}
• Exp: ${user.exp || 0}
• Level: ${user.level || 0}
• Warn: ${user.warn || 0}

• Total Command: ${user.commandCount || 0}
• Game Played: ${user.gameStats?.totalPlayed || 0}
• Game Wins: ${user.gameStats?.totalWins || 0}

• Bergabung: ${user.joinedAt ? new Date(user.joinedAt).toLocaleString() : '-'}
• Terakhir pesan: ${user.lastMessage ? new Date(user.lastMessage).toLocaleString() : '-'}
`

    await m.reply(info.trim())
  }
}