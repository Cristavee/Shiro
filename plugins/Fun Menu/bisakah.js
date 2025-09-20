export default {
  command: ['bisakah'],
  tag: 'fun',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 3,
  cooldown: 5000,

  async run(criv, { m, text, command }) {
    if (!text) return m.reply('Contoh: .bisakah saya jadi programmer?')

    const jawaban = [
      'Iya',
      'Bisa',
      'Tentu saja bisa',
      'Tentu bisa',
      'Sudah pasti',
      'Sudah pasti bisa',
      'Tidak',
      'Tidak bisa',
      'Tentu tidak',
      'Tentu tidak bisa',
      'Sudah pasti tidak'
    ]

    const hasil = criv.pickRandom
      ? criv.pickRandom(jawaban)
      : jawaban[Math.floor(Math.random() * jawaban.length)]

    const hasilText = `
> *Pertanyaan:* ${command} ${text}
> *Jawaban:* ${hasil}
    `.trim()

    await m.reply(hasilText)
  }
}