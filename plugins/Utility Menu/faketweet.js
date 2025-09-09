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
    if (!text) {
      return m.reply('Gunakan format: .tweet <teks tweet> | <nama> | <username> | <URL foto profil> | <retweets> | <quotes> | <likes> | <klien>\n\nContoh: .tweet Halo Dunia | John Doe | johndoe | https://example.com/profile.jpg | 100 | 50 | 200 | Twitter for Android');
    }
      const args = text.split('|').map(arg => arg.trim());
    
    const tweetText = args[0] || '';
    const name = args[1] || 'CRISTAVEE';
    const username = args[2] || 'cristavee';
    const profileUrl = args[3] || 'https://avatars.githubusercontent.com/u/159487561?v=4';
    const retweets = args[4] ? parseInt(args[4]) : 1000;
    const quotes = args[5] ? parseInt(args[5]) : 200;
    const likes = args[6] ? parseInt(args[6]) : 5000;
    const client = args[7] || 'Twitter for iPhone';
    const theme = 'dark';
      const validProfileUrl = (profileUrl.startsWith('http://') || profileUrl.startsWith('https://')) ? profileUrl : 'https://avatars.githubusercontent.com/u/159487561?v=4';
      try {
      const apiUrl = `https://api.siputzx.my.id/api/m/tweet?profile=${encodeURIComponent(validProfileUrl)}&name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&tweet=${encodeURIComponent(tweetText)}&image=null&theme=${encodeURIComponent(theme)}&retweets=${retweets}&quotes=${quotes}&likes=${likes}&client=${encodeURIComponent(client)}`;
      
      await criv.sendMessage(m.chat, {
        image: { url: apiUrl },
        caption: `> Tweet palsu Anda berhasil dibuat!`
      }, { quoted: m });
      } catch (err) {
      console.error(err);
      m.reply('Terjadi kesalahan saat membuat tweet palsu. Pastikan format dan URL yang Anda masukkan benar.');
    }
  }
};
