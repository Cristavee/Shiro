import fetch from "node-fetch";

function getRealJid(m) {
  let jid = null;

  if (m.quoted) {
    jid = m.quoted.key?.participant;
  } else if (
    Array.isArray(m.message?.extendedTextMessage?.contextInfo?.mentionedJid) &&
    m.message.extendedTextMessage.contextInfo.mentionedJid.length
  ) {
    jid = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
  }

  if (jid && jid.endsWith('@lid')) {
    jid = jid.replace('@lid', '@s.whatsapp.net');
  }

  return jid || m.sender;
}

export default {
  command: ['getpp', 'getpic', 'pp'],
  tag: 'utility',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: true,
  premium: false,
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, mentioned }) {
    try {
      let targetJid = m.isGroup
        ? m.quoted?.sender || mentioned?.[0] || m.sender
        : m.quoted?.sender || m.sender;

      if (!targetJid) return m.reply('Target tidak ditemukan.');

      // Konversi @lid ke format standar
      if (targetJid.endsWith('@lid')) {
        targetJid = targetJid.replace('@lid', '@s.whatsapp.net');
      }

      // Ambil foto profil
      const profileUrl = await criv.profilePictureUrl(targetJid, 'image')
        .catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");

      const response = await fetch(profileUrl);
      const buffer = await response.buffer();

      await criv.sendImage(m.chat, buffer, {
        caption: `Foto profil`,
        jpegThumbnail: buffer,
        quoted: m
      });

    } catch (err) {
      console.error('Error getpp:', err);
      m.reply('Gagal mengambil foto profil.');
    }
  }
};