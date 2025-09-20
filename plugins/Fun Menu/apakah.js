export default {
  command: ['apakah'],
  tag: 'fun',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 3,
  cooldown: 5000,

  async run(criv, { m, text, pushName }) {
    if (!text) return m.reply(msg.query)

    const list = [
      'Oh jelas.',
      'Mungkin ya.',
      'Pasti',
      'Jangan ditanya',
      'Tidak mungkin',
      'Mimpi',
      'Bisa jadi.',
      'Bisa jadi tidak.',
      'Tidak.',
      'Mustahil.'
    ]

    const jawab = await criv.pickRandom(list)

    const hasil = `
> *Pertanyaan:* ${text}
> *Penanya:* ${pushName}
> *Jawaban:* ${jawab}
    `.trim()

    await m.reply(hasil)
  }
}