import { generateWAMessageFromContent, proto } from 'baileys-x'

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
        let msg = generateWAMessageFromContent(m.chat, {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                body: proto.Message.InteractiveMessage.Body.create({ text: "YP" }),
                footer: proto.Message.InteractiveMessage.Footer.create({ text: "Bot" }),
                header: proto.Message.InteractiveMessage.Header.create({
                  title: "Igna",
                  subtitle: "test",
                  hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons: [
                    {
                      name: "single_select",
                      buttonParamsJson: "{\"title\":\"title\",\"sections\":[{\".menu\":\".play dj webito\",\"highlight_label\":\"label\",\"rows\":[{\"header\":\"header\",\"title\":\"title\",\"description\":\"description\",\"id\":\"id\"},{\"header\":\"header\",\"title\":\"title\",\"description\":\"description\",\"id\":\"id\"}]}]}"
                    },
                    { name: "cta_reply", buttonParamsJson: "{\"display_text\":\"quick_reply\",\"id\":\"message\"}" },
                    { name: "cta_url", buttonParamsJson: "{\"display_text\":\"url\",\"url\":\"https://www.google.com\",\"merchant_url\":\"https://www.google.com\"}" },
                    { name: "cta_call", buttonParamsJson: "{\"display_text\":\"call\",\"id\":\"message\"}" },
                    { name: "cta_copy", buttonParamsJson: "{\"display_text\":\"copy\",\"id\":\"123456789\",\"copy_code\":\"message\"}" },
                    { name: "cta_reminder", buttonParamsJson: "{\"display_text\":\"Recordatorio\",\"id\":\"message\"}" },
                    { name: "cta_cancel_reminder", buttonParamsJson: "{\"display_text\":\"cta_cancel_reminder\",\"id\":\"message\"}" },
                    { name: "address_message", buttonParamsJson: "{\"display_text\":\"address_message\",\"id\":\"message\"}" },
                    { name: "send_location", buttonParamsJson: "" }
                  ]
                })
              })
            }
          }
        }, {})
          await criv.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })
      }
      break
        default: {
        await m.reply('ID YANG TERSEDIA 1-15')
      }
    }
  }
}