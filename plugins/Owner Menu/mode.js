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
        '> .mode self → mode pribadi\n' +
        '> .mode public → mode umum\n' +
        '> .mode private → hanya personal chat'
      );
    }

    const sys = m.db.system;
    const mode = text.toLowerCase();

    const modes = {
      self:    { public: false, private: false, status: 'PRIBADI (SELF)' },
      public:  { public: true,  private: false, status: 'UMUM (PUBLIC)' },
      private: { public: true,  private: true,  status: 'PRIVATE' }
    };

    const selected = modes[mode];
    if (!selected) return m.reply('❌ Input tidak dikenali. Gunakan: self, public, atau private.');

    criv.public = sys.public = selected.public;
    criv.private = sys.private = selected.private;

    await m.db.write();
    return m.reply(`✅ Bot sekarang berjalan dalam mode: *${selected.status}*`);
  }
};