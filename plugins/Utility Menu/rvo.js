export default {
  command: ['readviewonce', 'rvo'],
  tag: 'utility',
  description: 'Membuka media view once',
  public: true,
  premium: true,
  coin: 5,
  cooldown: 5000,

  async run(criv, { m }) {
    try {
      const quotedMsg = m.quoted?.isMedia ? m.quoted : (m.isMedia ? m : null)
      if (!quotedMsg) return criv.reply(m, global.msg.reply);

      const isViewOnce = Object.values(quotedMsg?.message || {})
        .some(msgPart => msgPart?.viewOnce === true);

      if (!isViewOnce) return criv.reply(m, global.msg.media);

      const buffer = await quotedMsg.download?.().catch(() => null);
      if (!buffer) return criv.reply(m, global.msg.error);

      const mediaType = quotedMsg.mediaType;
      const mediaContent = quotedMsg?.message?.[mediaType];
      const mime = mediaContent?.mimetype || '';
      const caption = mediaContent?.caption || '';

      let msgToSend = {};

      if (/image/.test(mime)) {
        msgToSend.image = buffer;
      } else if (/video/.test(mime)) {
        msgToSend.video = buffer;
        if (/gif/.test(mime) || mediaContent?.gifPlayback) {
          msgToSend.gifPlayback = true;
        }
      } else {
        return criv.reply(m, global.msg.media);
      }

      if (caption) msgToSend.caption = caption;

      await criv.sendMessage(m.chat, msgToSend, { quoted: m })

    } catch (err) {
      console.error('❌ RVO error:', err);
      criv.reply(m, global.msg.error);
    }
  }
}