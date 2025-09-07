import axios from 'axios';

export default {
  command: ['threadsstalk', 'thread'],
  tag: 'search',
  description: 'View detailed information about a Threads account.',
  owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5, 
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply('Please enter the Threads username you want to stalk.\n\nExample: .threadsstalk google');
    }

    try {
      const apiUrl = `https://api.siputzx.my.id/api/stalk/threads?q=${encodeURIComponent(text)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data) {
        return m.reply(`Sorry, the Threads account with username "${text}" was not found or an error occurred.`);
      }

      const userData = data.data;

      let message = `> Threads Account Info for *@${userData.username}*:\n\n`;
      message += `> Name: ${userData.name}\n`;
      message += `> Bio: ${userData.bio || 'No bio provided'}\n`;
      message += `> Verified: ${userData.is_verified ? 'Yes' : 'No'}\n`;
      message += `> Followers: ${userData.followers.toLocaleString()}\n`;
      
      if (userData.links && userData.links.length > 0) {
        message += `> Links: ${userData.links.join(', ')}\n`;
      }

      const profilePicUrl = userData.hd_profile_picture || userData.profile_picture;

      if (profilePicUrl) {
        await criv.sendMessage(m.chat, {
          image: { url: profilePicUrl },
          caption: message
        }, { quoted: m });
      } else {
        await criv.sendMessage(m.chat, { text: message }, { quoted: m });
      }

    } catch (err) {
      console.error(err);
      return m.reply('An error occurred while fetching Threads account data. Please try again later.');
    }
  }
};
