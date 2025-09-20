export default {
  command: ['kapan', 'kapankah'],
  tag: 'fun',
  public: true,
  cooldown: 5000,
  coin: 5,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply('Contoh: .kapan saya jadi kaya?');
    }

    const answers = [
      'Sekarang',
      'Besok',
      'Lusa',
      'Minggu depan',
      'Bulan depan',
      'Tahun depan',
      'Dalam waktu dekat',
      'Dalam waktu yang sangat lama',
      'Tidak akan pernah',
      'Kemarin',
      'Hanya Tuhan yang tahu',
      'Sepertinya tidak akan terjadi',
      'Mungkin nanti',
      'Sabar, ya!',
      'Entahlah, tanya rumput yang bergoyang.',
      'Setelah kiamat.'
    ];

    const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

    const teks = `
*Kapankah ${text}?*
Menurut ramalan:
> ${randomAnswer}

_Ingat, ini hanya hiburan (mungkin)._
    `.trim();

    await m.reply(teks);
  }
};