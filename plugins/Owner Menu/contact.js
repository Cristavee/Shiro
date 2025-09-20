export default {
  command: ['contact'], 
  tag: 'fun',
  owner: true,
  admin: false, 
  botAdmin: false, 
  public: true, 
  group: false, 
  premium: false,
  coin: 5,
  cooldown: 7000,
    async run(criv, { system,  m, text }) {
        
  if (!text) return criv.reply(msg.query)
  await criv.sendContact(m.chat, [{ name: text , number: '123456789' }], m);
  }
}