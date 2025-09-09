import axios from 'axios'
  export default {
  command: ['ppcouple', 'ppcp'],
  tag: 'fun',
owner: false,
  admin: false,
  botAdmin: false,
  public: true,
  group: false,
  premium: false,
  coin: 0,
  cooldown: 5000,
    async run(criv, { m }) {
    try {
      let res = await axios.get('https://apis.davidcyriltech.my.id/couplepp')
      let male = res.data.male
      let female = res.data.female
        await criv.sendAlbumMessage(
        m.chat,
        [
          {
            image: { url: male },
            caption: "👦 Foto Couple Cowok"
          },
          {
            image: { url: female },
            caption: "👧 Foto Couple Cewek"
          }
        ],
        {
          quoted: m,
          delay: 2000 
        }
      )
    } catch (e) {
      console.error(e)
      m.reply('Gagal mengambil pp couple.')
    }
  }
}