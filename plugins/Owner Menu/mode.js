export default {
  command: ['mode'],
  tag: 'owner',
  owner: true,
  public: true,
  coin: 0,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply(
        'Gunakan:\n' +
        '.mode self → mode pribadi\n' +
        '.mode public → mode umum\n' +
        '.mode private → hanya personal chat'
      );
    }

    const mode = text.toLowerCase();

    switch (mode) {
      case 'self':
        criv.public = false;
        criv.private = false;
        break;
      case 'public':
        criv.public = true;
        criv.private = false;
        break;
      case 'private':
        criv.public = true;
        criv.private = true;
        break;
      default:
        return m.reply('Input tidak dikenali. Gunakan: self, public, atau private.');
    }

    let status = criv.public ? 'UMUM (PUBLIC)' : 'PRIBADI (SELF)';
    if (criv.private) status = 'PRIVATE';

    return m.reply(`✅ Bot sekarang berjalan dalam mode: *${status}*.`);
  }
};