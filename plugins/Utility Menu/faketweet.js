import axios from 'axios';

export default {
  command: ['tweet', 'x'],
  tag: 'utility',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 10,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) return m.reply('Gunakan format: .tweet <teks tweet> | <nama>\nContoh: .tweet Halo Dunia | John Doe');

    const args = text.split('|').map(arg => arg.trim());
    const tweetText = args[0] || '';
    const name = args[1] || 'CRISTAVEE';

    // Random data
    const username = name.toLowerCase() + '_'
    const profileUrl = `https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png`;
    const retweets = Math.floor(Math.random() * 50000);
    const quotes = Math.floor(Math.random() * 10000);
    const likes = Math.floor(Math.random() * 100000);
    const clientOptions = ['Twitter for iPhone', 'Twitter for Android', 'Twitter Web App'];
    const client = clientOptions[Math.floor(Math.random() * clientOptions.length)];
    const theme = 'dark';

    try {
      const apiUrl = `https://api.siputzx.my.id/api/m/tweet?profile=${encodeURIComponent(profileUrl)}&name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&tweet=${encodeURIComponent(tweetText)}&image=null&theme=${encodeURIComponent(theme)}&retweets=${retweets}&quotes=${quotes}&likes=${likes}&client=${encodeURIComponent(client)}`;
      
      await criv.sendMessage(m.chat, {
        image: { url: apiUrl }
      });
    } catch (err) {
      console.error(err);
      m.reply('Terjadi kesalahan saat membuat tweet palsu.');
    }
  }
};