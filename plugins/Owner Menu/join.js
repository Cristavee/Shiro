export default {
  command: ['join', 'gabung'],
  tag: 'owner', 
  owner: true,
  admin: false,
  botAdmin: false,
  public: false,
  group: false, 
  premium: false,
  coin: 0,
  cooldown: 5000,
    async run(criv, { m, text }) {
        
    if (!text) {
      return m.reply('Ex: `.join https://chat.whatsapp.com/abcdefgh`');
    }
        
    const match = text.match(/(?:https?:\/\/chat\.whatsapp\.com\/)?([0-9A-Za-z]{22})/)
    
    if (!match || !match[1]) {
      return m.reply('Invalid URL.')
    }
        
    const inviteCode = match[1];
        await m.reply('Trying to join...')
        
      const res = await criv.groupAcceptInvite(inviteCode);

if (res) {
    const data = await criv.groupMetadata(res);
    await m.reply(`Berhasil bergabung ke grup: *${data.subject}*!`);
} else {
    await m.reply('Gagal bergabung ke grup. Pastikan link valid dan bot belum di-kick.');
}
  }
}
