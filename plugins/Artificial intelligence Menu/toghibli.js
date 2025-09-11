import axios from 'axios'
import FormData from 'form-data'

const OPENAI_KEY = 'YOUR_APIKEY'

async function editImage(buffer, prompt) {
  const apiUrl = 'https://api.openai.com/v1/images/edits'
  const form = new FormData()
  form.append('image', buffer, { filename: 'image.png' })
  form.append('prompt', prompt)
  form.append('model', 'gpt-image-1')
  form.append('n', 1)
  form.append('size', '1024x1024')
  form.append('quality', 'medium')

  const response = await axios.post(apiUrl, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${OPENAI_KEY}`
    }
  })

  const result = response.data
  if (!result?.data?.[0]?.b64_json) throw new Error('Gagal mendapatkan gambar')
  return Buffer.from(result.data[0].b64_json, 'base64')
}

export default {
  command: ['imagedit', 'toghibli', 'ghibli'],
  tag: 'ai',
  description: 'Edit gambar dengan prompt atau ubah ke style Studio Ghibli',

  async run(criv, { m, text, command }) {
    if (OPENAI_KEY == 'YOUR_APIKEY') return m.reply("You didn't set the Apikey yet, get one in https://aistudio.google.com/app/u/5/apikey")
    if (!m.quoted || !/image/.test(m.quoted.mimetype)) {
      if (command === 'imagedit') return m.reply(`❌ Reply gambar dengan perintah: .imagedit <prompt>`)
      if (command === 'toghibli') return m.reply(`❌ Reply gambar dengan perintah: .toghibli`)
    }

    try {
      const buffer = await m.quoted.download()
      let prompt

      if (command === 'toghibli' || 'ghibli') {
        prompt = 'Convert this image into Studio Ghibli art style'
      } else if (command === 'imagedit') {
        if (!text) return m.reply(`❌ Contoh: .imagedit ubah jadi kartun lucu`)
        prompt = text
      }

      const result = await editImage(buffer, prompt)
      await criv.sendFile(m.chat, result, 'edit.png', `✅ Selesai: ${prompt}`, m, false, { mimetype: 'image/png' })

    } catch (err) {
      console.error('Image Edit Error:', err)
      m.reply(`❌ Terjadi kesalahan: ${err.message}`)
    }
  }
}