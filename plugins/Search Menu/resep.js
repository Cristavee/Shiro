import axios from 'axios'
  export default {
  command: ['resep', 'cariresep', 'cookpad'],
  tag: 'search',
public: true,
  coin: 10,
    async run(criv, { m, args, command }) {
    if (!args.length) {
      return criv.reply(m, msg.query+`\nContoh: *${global.prefix + command} nasi goreng*`)
    }
      const query = args.join(' ')
    const url = `https://zenz.biz.id/search/cookpad?q=${encodeURIComponent(query)}`
    try {
      const { data } = await axios.get(url)
      if (!data.status || !data.result || !data.result.recipes.length) {
        return criv.reply(m, 'Resep tidak ditemukan.')
      }
        const result = data.result.recipes.slice(0, 3).map((r, i) => {
        return `🍽️ *${r.title}*\n👩‍🍳 *${r.author}*\n📖 ${r.link}\n🧂 *Bahan:* ${r.ingredients.slice(0, 5).join(', ')}${r.ingredients.length > 5 ? ', dll.' : ''}`
      }).join('\n\n')
        await criv.sendMessage(m.chat, {
        text: `🍳 *Hasil pencarian resep untuk:* _${query}_\n\n${result}`
      }, { quoted: m })
    } catch (e) {
      console.error(e)
      criv.reply(m, 'Terjadi kesalahan saat mencari resep.')
    }
  }
}