import moment from 'moment-timezone';
  export default {
  command: ['profile', 'profil', 'me'],
  tag: 'information',
public: true,
  coin: 2,
  cooldown: 5000,
    async run(criv, { m, sender, pushName, system, isOwner }) {
    let user = system.getUser(sender);
    const tier = system.getTier(sender);
      // fallback data
    user.level ??= 1;
    user.exp ??= 0;
    user.coin ??= 0;
    user.joinedAt ??= Date.now();
    user.commandCount ??= 0;
    user.claims ??= {};
    user.name ??= 'Unknown';
    user.premium ??= false;
    user.bio ??= 'Belum disetel. Gunakan .setbio [bio]';
    user.isBanned ??= false;
    user.warn ??= 0;
    user.gameStats ??= { totalPlayed: 0, totalWins: 0 };
    user.inventory ??= { items: {} };
    user.badge ??= tier.badge || '🪵 Basic';
      const joinedAt = moment(user.joinedAt).tz('Asia/Jakarta').format('DD MMMM YYYY, HH:mm:ss');
      const claimHistory = Object.keys(user.claims).length > 0
      ? Object.entries(user.claims)
          .map(([key, val]) => {
            const timeAgo = val > 0 ? moment(val).fromNow() : 'Belum pernah';
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
            return `  - ${formattedKey}: ${timeAgo}`;
          })
          .join('\n')
      : '  - Belum pernah klaim daily/reward lainnya.';
      const needExp = user.level * 100;
    const barLength = 20;
    const percent = Math.floor((user.exp / needExp) * 100);
    const filledBar = Math.floor((percent / 100) * barLength);
    const bar = '█'.repeat(filledBar) + '░'.repeat(barLength - filledBar);
    const expProgress = `[${bar}] ${percent}% (${user.exp}/${needExp} EXP)`;
      const allUsersData = system.getAllUsers ? system.getAllUsers() : {};
    const sortedUsers = Object.entries(allUsersData)
      .map(([id, data]) => ({
        id,
        level: data.level || 0,
        exp: data.exp || 0
      }))
      .sort((a, b) => (b.level - a.level) || (b.exp - a.exp));
    const cleanSender = sender.includes('@') ? sender.split('@')[0] : sender;
    const rank = sortedUsers.findIndex(u => u.id === cleanSender) + 1;
      const phoneNumber = sender.split('@')[0];
    const num = phoneNumber.length >= 12
      ? `+${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5, 9)}-${phoneNumber.slice(9)}`
      : `+${phoneNumber}`;
      const coinDisplay = m.isOwner ? '♾️ Infinity' : `${user.coin.toLocaleString('id-ID')}`;
    const inventoryDisplay = Object.keys(user.inventory.items).length > 0
      ? Object.entries(user.inventory.items).map(([item, qty]) => `${item} x${qty}`).join(', ')
      : 'Kosong';
      // caption info
  const caption = `
┌───「 *PROFIL ${pushName.toUpperCase()}* 」
> *Nama*        \t: ${pushName}
> *Bio*           \t: ${user.bio}
> *Nomor*       \t: ${num}
> *Koin*          \t: ${coinDisplay}
> *Tier/Badge*  \t: ${user.badge}
> *EXP*          \t: ${expProgress}
  > *Commands digunakan*:  ${user.commandCount}
> *Games*             \t: ${user.gameStats.totalPlayed} dimainkan, ${user.gameStats.totalWins} menang
> *Rank Global*        \t: #${rank} / ${sortedUsers.length}
> *Status*             \t: ${user.isBanned ? '⛔ Banned' : user.premium ? '💎 Premium' : 'Freemium'}
> *Peringatan*         \t: ${user.warn}x
> *Bergabung*          \t: ${joinedAt}
> *Inventory*          \t: ${inventoryDisplay}
  > *Riwayat Klaim*:
${claimHistory}
└───
`.trim();
      try {
      // ambil foto profil
      const profilePic = await criv.profilePictureUrl(m.rawSender, 'image')
      if (profilePic) {
        await criv.sendMessage(m.chat, { 
          image: { url: profilePic }, 
          caption, 
        }, { quoted: m });
      } else {
        // fallback jika tidak ada foto profil
        await criv.sendMessage(m.chat, { text: caption }, { quoted: m });
      }
    } catch (err) {
      console.error(err);
      await criv.sendMessage(m.chat, { text: caption }, { quoted: m });
    }
  }
};