export default {
  command: ['ping', 'speed', 'p'],
  tag: 'information',
  public: true,
  coin: 2,
    
  async run(criv, { m }) {
    const start = Date.now()
    await criv.sendMessage(m.chat, { text: '🏓 calculate Speed...' }, { quoted: m })
      
    const latency = Date.now() - start 
    m.reply(`Response Speeed: *${latency}ms*`)
  }
}