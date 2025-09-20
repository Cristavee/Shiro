function cleanName(name) {
  if (!name) return "Pengguna Tanpa Nama";
  const cleaned = name.replace(/[\u200B-\u200D\uFEFF\u2800\u3164\s]+/g, "").trim();
  return cleaned.length > 0 ? name : "Pengguna Tanpa Nama";
}

export default {
  command: ['leaderboard', 'top', 'lb'],
  tag: 'information',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  cooldown: 5000,

  async run(criv, { m, system }) {
    try {
      const allUserIds = Object.keys(m.db.users)
        .map(id => id?.split(':')[0].split('@')[0])
        .filter(Boolean);

      const allUsers = [...new Set(allUserIds)].map(id => system.getUser(id));

      const users = allUsers
        .filter(u => u && u.name && u.name !== 'Unknown')
        .map(u => ({
          id: u.id,
          name: cleanName(u.name),
          level: u.level || 1,
          exp: u.exp || 0,
          coin: u.coin || 0,
        }))
        .filter(u => u.name !== "Pengguna Tanpa Nama")
        .sort((a, b) => b.level - a.level || b.exp - a.exp)
        .slice(0, 10);

      if (!users.length) return m.reply('Leaderboard masih kosong.');

      const sisa = allUsers.length - 10
      const medal = ['🥇', '🥈', '🥉'];
      let text = '🏆 *Leaderboard*\n\n';

      users.forEach((user, index) => {
        const prefix = medal[index] || `*${index + 1}.*`;
        text += `${prefix} *${user.name}* — _Level ${user.level} (${user.exp} EXP) | ${user.coin}💰_\n`;
      });

      text += `\nDan ${sisa} lainnya...`;

      await criv.sendMessage(m.chat, { text }, { quoted: m });
    } catch (err) {
      console.error('Error leaderboard:', err);
      m.reply('Gagal menampilkan leaderboard.');
    }
  }
};