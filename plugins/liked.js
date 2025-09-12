export default {
  command: ['like'], 
  tag: '',
  owner: false,
  admin: false, 
  botAdmin: false, 
  public: true, 
  group: false,
  premium: false,
  coin: 5,
  cooldown: 100,
  
async run(criv, { system,  m}) {
 await system.like()
  m.reply('Like +1 ♥️')
  }
}
