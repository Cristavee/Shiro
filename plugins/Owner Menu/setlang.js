export default {
  command: ['setlang'],
  tag: 'main',
  public: true,
  owner: true,

  async run(criv, { m, args, text }) {
    if (!args[0]) {
      return m.reply(`Ex:\n.setlang indonesia\n.setlang english\n.setlang japan`)
    }

    const lang = text
    if (lang.length < 4) return m.reply('Please enter a valid language and no less than four digits letters')
    criv.lang = lang

    m.reply(`✅ Language has been set to *${lang}*`)
  }
}