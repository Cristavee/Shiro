import axios from 'axios'
import FormData from 'form-data'

const OPENAI_KEY = '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'

async function editImage(buffer, prompt) {
  const url = 'https://api.openai.com/v1/images/edits'
  const form = new FormData()
  form.append('image', buffer, { filename: 'image.png' })
  form.append('prompt', prompt)
  form.append('model', 'gpt-image-1')
  form.append('n', 1)
  form.append('size', '1024x1024')
  form.append('quality', 'medium')

  const res = await axios.post(url, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${OPENAI_KEY}`
    }
  })

  const data = res.data
  if (!data?.data?.[0]?.b64_json) throw new Error('Gagal mendapatkan gambar')
  return Buffer.from(data.data[0].b64_json, 'base64')
}

export default {
  command: ['imagedit', 'toghibli', 'ghibli'],
  tag: 'ai',

  async run(criv, { m, text, command }) {
    const quoted = m.quoted?.isMedia ? m.quoted : (m.isMedia ? m : null)
    if (!quoted || !/image/.test(quoted.mimetype)) {
      if (command === 'imagedit') return m.reply('Reply gambar dengan perintah: .imagedit <prompt>')
      if (command === 'toghibli' || command === 'ghibli') return m.reply('Reply gambar dengan perintah: .' + command)
      return
    }

    try {
      const buffer = await quoted.download()
      let prompt

      if (command === 'toghibli' || command === 'ghibli') {
        prompt = 'Convert this image into Studio Ghibli art style'
      } else if (command === 'imagedit') {
        if (!text) return m.reply('Contoh: .imagedit ubah jadi kartun lucu')
        prompt = text
      }

      const result = await editImage(buffer, prompt)
      await criv.sendFile(m.chat, result, 'edit.png', `Selesai: ${prompt}`, m, false, {
        mimetype: 'image/png'
      })
    } catch (err) {
      console.error('Image Edit Error:', err)
      m.reply('Terjadi kesalahan: ' + err.message)
    }
  }
}