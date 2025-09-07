import axios from 'axios';

export default {
  command: ['mlstalk', 'mlprofile'],
  tag: 'search',
  description: 'Mencari informasi username Mobile Legends (MLBB) berdasarkan ID dan Zone ID.',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5, 
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply(msg.query)
    }

    const parts = text.split(/[()\s]+/);
    let id = parts[0]
    let zoneId = parts[1];

    if (!id || !zoneId) {
      return m.reply('Contoh: .mlstalk 12345678 (1234)');
    }

    
    zoneId = zoneId.replace(/\D/g, ''); 

    if (isNaN(id) || isNaN(zoneId)) {
        return m.reply('ID dan Zone ID harus berupa angka. Contoh: .mlstalk 12345678 (1234)');
    }

    try {
      const apiUrl = `https://api.vreden.my.id/api/mlstalk?id=${encodeURIComponent(id)}&zoneid=${encodeURIComponent(zoneId)}`;
      const { data } = await axios.get(apiUrl);

      if (data.status !== 200 || !data.result || !data.result.data || !data.result.data.userNameGame) {
        return m.reply(`Maaf, data pemain MLBB untuk ID: ${id} dan Zone ID: ${zoneId} tidak ditemukan atau tidak valid.`);
      }

      const userData = data.result.data;
      const userNameGame = userData.userNameGame;

      let message = `> Informasi Akun Mobile Legends:\n\n`;
      message += `> ID Game: ${id}\n`;
      message += `> Zone ID: ${zoneId}\n`;
      message += `> Username: *${userNameGame}*\n`;

      await criv.sendMessage(m.chat, { text: message }, { quoted: m });

    } catch (err) {
      console.error(err);
      return m.reply(msg.error);
    }
  }
};
