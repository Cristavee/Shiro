
import axios from 'axios'

export default {
command: ['brat'],
tag: 'utility',
description: 'Membuat stiker Brat.',
owner: false,
admin: false,
botAdmin: false,
public: true,
premium: false,
coin: 5,
cooldown: 5000,

async run(criv, { m, text }) {
if (!text || !text.trim())
return m.reply('Kirim teks untuk membuat stiker Brat.\nContoh: .brat hai saha')

try {  
  const apiUrl = `https://apidl.asepharyana.tech/api/image/brat?text=${encodeURIComponent(text.trim())}`  

  const response = await axios.get(apiUrl, { responseType: 'arraybuffer' })  
  const buffer = Buffer.from(response.data, 'binary')  

  if (!buffer || buffer.length === 0)   
    throw new Error('Buffer kosong dari API')  
  await criv.sendAsSticker(m.chat, buffer, { quoted: m })  

} catch (e) {  
  console.error('[BRAT ERROR]', e)  
  await m.reply('❌ Gagal membuat stiker. Coba lagi nanti.')  
}

}
}

