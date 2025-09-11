const rand = arr => arr[Math.floor(Math.random() * arr.length)]

const persen = [
  '0%',
  '0,4%',
  '1%',
  '2,9%',
  '6%',
  '12%',
  '20%',
  '27%',
  '35%',
  '41%',
  '49%',
  '54%',
  '60%',
  '66%',
  '73%',
  '78%',
  '84%',
  '92%',
  '93%',
  '94%',
  '96%',
  '98,3%',
  '99,7%',
  '99,9%'
]

export default {
  command: ['ceksifat', 'sifat'],
  tag: 'fun',
  coin: 5,

  async run(criv, { m, text }) {
    if (!text) return m.reply('Masukan namamu!')

    const sifat = `
> *Sifat ${text}*
> Nama        : ${text}
> Ahlak Baik  : ${rand(persen)}
> Ahlak Buruk : ${rand(persen)}
> Orang yang  : ${rand(['Baik Hati','Sombong','Pelit','Dermawan','Rendah Hati','Pemalu','Penakut','Pengusil','Cengeng'])}
> Hobi        : ${rand(['Kerja','Malas-malasan','Membantu','Ngegosip','Jail','Shoping','Chattan sama Doi','Chattan di WA karna Jomblo','Nangis','Tidur','Makan','Ngocok tiap hari'])}
> Cerdas      : ${rand(persen)}
> Nakal       : ${rand(persen)}
> Berani      : ${rand(persen)}
> Takut       : ${rand(persen)}
    `.trim()

    await criv.reply(m, sifat, m.mentionedJid ? { mentions: m.mentionedJid } : {})
  }
}