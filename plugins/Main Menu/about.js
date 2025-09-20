import moment from 'moment-timezone';
import * as helpers from '../../lib/helpers.js';

function formatNomor(nomor) {
  if (!nomor) return '-';
  return nomor.replace(/(.{4})/g, '$1-').replace(/-$/, '');
}

export default {
  command: ['about', 'bot'],
  tag: 'main',
  public: true,
  coin: 10,

  async run(criv, { m, system }) {
    try {
      const waktu = moment().tz('Asia/Jakarta').format('dddd, DD MMMM YYYY • HH:mm:ss');
      const ownerNumber = (global.bot?.owner || '').replace(/[^0-9]/g, '');
      const prefix = Array.isArray(global.prefix) && global.prefix.length > 0 ? global.prefix[0] : '-';
      const totalFeature = typeof global.totalFeature === 'number' ? global.totalFeature : 0;
      const wa = formatNomor(global.wa);

      const teks = `
*───「 About This Bot 」───*
Bot Name      : ${global.bot?.name || 'Bot'}
Owner Name    : ${global.bot?.ownerName || 'Owner'}
Owner Number  : .owner
Prefix        : ${prefix}
Full          : ${global.bot?.full || 'undefined'}
Total Fitur   : ${totalFeature}

*Social Media*
WhatsApp      : ${wa}
Instagram     : ${global.ig || '-'}
Facebook      : ${global.fb || '-'}
YouTube       : ${global.yt || '-'}
GitHub        : ${global.git || '-'}

*Note:*
Bot ini masih dalam tahap pengembangan.
Beberapa fitur mungkin belum optimal dan masih terdapat error.

Waktu Sekarang: ${waktu}
      `.trim();

      await criv.sendMessage(
        m.chat,
        {
          text: teks,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: false,
              title: global.wm,
              thumbnailUrl: global.thumb,
              mediaType: 1,
              renderLargerThumbnail: true
            },
            isForwarded: true
          },
          mentions: ownerNumber ? [`${ownerNumber}@s.whatsapp.net`] : []
        },
        { quoted: m }
      );
    } catch (err) {
      console.error('Error about bot:', err);
      await m.reply('❌ Gagal menampilkan info bot.');
    }
  }
};
