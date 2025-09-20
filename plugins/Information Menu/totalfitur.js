export default {
  command: ['totalfitur', 'total', 'fitur'],
  tag: 'information',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, pushName }) {
    try {
      await criv.sendMessage(
        m.chat,
        {
          text: `*Total Fitur*\n${global.totalFeature}`,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: false,
              title: "Fitur",
              body: global.wm,
              thumbnailUrl: global.thumb,
              sourceUrl: global.thumb,
              mediaType: 1,
              renderLargerThumbnail: false
            },
            isForwarded: true
          },
          ephemeralExpiration: 8640,
          footer: global.footer
        },
        {
          quoted: {
            key: {
              remoteJid: '0@s.whatsapp.net',
              fromMe: false,
              id: 'BAE5F1E87A7CABA5F74A3213DE6B1C9B'
            },
            message: {
              conversation: `HAI ${pushName || 'Pengguna'} 👋`
            }
          }
        }
      );
    } catch (err) {
      console.error('Error totalfitur:', err);
      await m.reply('❌ Gagal menampilkan total fitur.');
    }
  }
};
