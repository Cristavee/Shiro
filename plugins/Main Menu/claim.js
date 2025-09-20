function formatTime(ms) {
  const d = Math.floor(ms / (1000 * 60 * 60 * 24));
  const h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((ms % (1000 * 60)) / 1000);
  return [d > 0 ? `${d} hari` : '', h > 0 ? `${h} jam` : '', m > 0 ? `${m} menit` : '', s > 0 ? `${s} detik` : '']
    .filter(Boolean)
    .join(', ');
}

export default {
  command: ['claim', 'hadiah', 'klaim'],
  tag: 'main',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 0,
  cooldown: 3000,

  async run(criv, { m, args, sender, system }) {
    try {
      const intervalKey = args[0]?.toLowerCase() || 'daily';

      const intervals = {
        daily: { label: 'harian', ms: 24 * 60 * 60 * 1000, reward: 100 },
        weekly: { label: 'mingguan', ms: 7 * 24 * 60 * 60 * 1000, reward: 500 },
        monthly: { label: 'bulanan', ms: 30 * 24 * 60 * 60 * 1000, reward: 1000 },
        yearly: { label: 'tahunan', ms: 365 * 24 * 60 * 60 * 1000, reward: 5000 }
      };

      if (!intervals[intervalKey]) {
        const list = Object.keys(intervals).map(i => `> ${i}`).join('\n');
        return m.reply(`Interval tidak valid!\nGunakan salah satu dari:\n\n${list}`);
      }

      const { label, ms, reward } = intervals[intervalKey];

      if (system.canClaim(sender, intervalKey)) {
        system.giveReward(sender, reward);
        await system.setClaim(sender, intervalKey);
        return m.reply(`✅ Kamu berhasil klaim reward *${label}* sebesar *${reward} coin*!`);
      } else {
        const user = system.getUser(sender);
        const last = user.lastClaimed?.[intervalKey] || 0;
        const remaining = last + ms - Date.now();
        const sisa = formatTime(remaining);
        return m.reply(`❌ Kamu sudah klaim *${label}* sebelumnya.\nSilakan coba lagi dalam *${sisa}*.`);
      }
    } catch (err) {
      console.error('Error claim:', err);
      m.reply('❌ Terjadi kesalahan saat mencoba klaim.');
    }
  }
};