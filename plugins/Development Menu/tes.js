
  export default {
  command: ['tes', 't'],
  tag: 'dev',
  owner: true,
  admin: false,
  botAdmin: false,
  public: true,
  premium: false,
  coin: 5,
  cooldown: 5000,
    async run(criv, { m, text }) {  
    switch (text) {
      case '1': {
        const cards = [
          {
            image: { url: 'https://example.jpg' },
            title: '🖼️ Judul Kartu',
            body: '📝 Isi Konten Kartu',
            footer: '📍 Footer Kartu',
            buttons: [
              {
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                  display_text: '💬 Tombol Cepat',
                  id: 'ID_TOMBOL_1'
                })
              },
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: '🔗 Kunjungi Website',
                  url: 'https://www.example.com'
                })
              }
            ]
          }
        ]
          await criv.sendMessage(m.chat, {
          interactiveMessage: {
            header: { title: '🗂️ Judul Utama' },
            body: { text: '📢 Isi Utama Pesan\n📌 Subjudul Opsional' },
            footer: { text: '📩 Footer Pesan' },
            nativeFlowMessage: {
              buttons: [],
              messageParamsJson: JSON.stringify({ cards })
            }
          }
        })
      }
      break
        case '2': {
        const ppUrl = await criv.profilePictureUrl(m.rawSender, 'image')
        await criv.sendImage(m.chat, ppUrl)
      }
      break
        case '3': {
            criv.sendMessage(m.chat, {
  text: "Hello Wolrd !;", 
  footer: "© Baileys Pro",
  buttons: [
  {
    buttonId: '.tes',
    buttonText: {
      displayText: 'TESTING BOT'
    },
    type: 1,
  },
  {
    buttonId: ' ',
    buttonText: {
      displayText: 'PRIVATE SCRIPT'
    },
    type: 1,
  },
  {
    buttonId: 'action',
    buttonText: {
      displayText: 'ini pesan interactiveMeta'
    },
    type: 4,
    nativeFlowInfo: {
      name: 'single_select',
      paramsJson: JSON.stringify({
        title: 'message',
        sections: [
          {
            title: 'Baileys - 2025',
            highlight_label: '😜',
            rows: [
              {
                header: 'HEADER',
                title: 'TITLE',
                description: 'DESCRIPTION',
                id: 'YOUR ID',
              },
              {
                header: 'HEADER',
                title: 'TITLE',
                description: 'DESCRIPTION',
                id: 'YOUR ID',
              },
            ],
          },
        ],
      }),
    },
  },
  ],
  headerType: 1,
  viewOnce: true
}, { quoted: m });
      }
      break
        default: {
        await m.reply('ID YANG TERSEDIA 1-15')
      }
    }
  }
}