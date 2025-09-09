import { createCanvas, loadImage, registerFont } from 'canvas'
registerFont('./lib/media/fonts/Impact.ttf', { family: 'Impact' })
  export default {
  command: ['smeme'],
  tag: 'utility',
coin: 5,
    async run(criv, { m, args }) {
    const text = args.join(' ');
    if (!text) return criv.reply(m, 'Masukkan teks untuk meme\nContoh: .smeme atas|bawah');
      const [topText, bottomText] = text.split('|').map(t => t?.trim().toUpperCase() || '');
      // Ambil media dari reply atau langsung
    let sourceMsg = m.quoted?.isMedia ? m.quoted : (m.isMedia ? m : null)
      if (!sourceMsg) {
      return criv.reply(m, 'Kirim/balas gambar dengan teks\nContoh: .smeme atas|bawah');
    }
      try {
      const buffer = await sourceMsg.download();
      if (!buffer) return criv.reply(m, '> Gagal mendownload media.');
        // Load gambar
      const img = await loadImage(buffer);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
        // Gambar background
      ctx.drawImage(img, 0, 0, img.width, img.height);
        // Fungsi tulis teks
      const drawText = (text, y) => {
        const fontSize = Math.floor(img.height / 8);
        ctx.font = `${fontSize}px Impact`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = fontSize / 10;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
          const lines = wrapText(ctx, text, img.width - 20);
        const totalHeight = lines.length * fontSize * 1.1;
          let posY = y === 'top' ? 10 : img.height - totalHeight - 10;
        for (const line of lines) {
          ctx.strokeText(line, img.width / 2, posY);
          ctx.fillText(line, img.width / 2, posY);
          posY += fontSize * 1.1;
        }
      };
        if (topText) drawText(topText, 'top');
      if (bottomText) drawText(bottomText, 'bottom');
        const memeBuffer = canvas.toBuffer();
        const stickerWithExif = await criv.createExif(memeBuffer, {
        packname: global.pack || 'MemeBot',
        author: global.author || 'StickerGen'
      });
        await criv.sendAsSticker(m.chat, stickerWithExif, { quoted: m });
      } catch (err) {
      console.error('[SMEME ERROR]', err);
      criv.reply(m, '> Gagal membuat stiker meme.');
    }
  }
}
  // Membungkus teks biar rapi
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  return lines;
}