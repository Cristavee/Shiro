/*
* Author : ZenzzXD
*/

import axios from 'axios'
import FormData from 'form-data'

async function scrapeApiKey() {
  const targetUrl = 'https://overchat.ai/image/ghibli'
  const { data: htmlContent } = await axios.get(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129 Safari/537.36'
    }
  })
  const apiKeyRegex = /const apiKey = '([^']+)'/
  const match = htmlContent.match(apiKeyRegex)
  if (!match) throw new Error('ApiKey tidak ditemukan')
  return match[1]
}

async function editImage(buffer, prompt, apiKey) {
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
      Authorization: `Bearer ${apiKey}`
    }
  })

  const result = response.data
  if (!result?.data?.[0]?.b64_json) throw new Error('Gagal mendapatkan gambar')
  return Buffer.from(result.data[0].b64_json, 'base64')
}

export default {
  command: ['ghibli', 'toghibli', 'gb', 'imagedit'],
  tag: 'ai',
  public: true,
  owner: false,
  admin: false,
  botAdmin: false,
  coin: 15,
  cooldown: 10000,

  async run(criv, { m, text, command }) {
    try {
      const quoted = m.quoted?.isMedia ? m.quoted : (m.isMedia ? m : null)
      if (!quoted || !quoted.isMedia || !quoted.isImage) {
        if (command === 'imagedit') return m.reply(`❌ Reply gambar dengan command .imagedit <prompt>`)
        if (command === 'toghibli') return m.reply(`❌ Reply gambar dengan command .toghibli`)
      }

      const buffer = await quoted.download()
      if (!buffer) return m.reply('❌ Gagal mengunduh gambar.')

      let prompt
      if (command === 'toghibli' || command === 'ghibli' || command === 'gb') {
        prompt = 'Please convert this image into Studio Ghibli art style'
      } else if (command === 'imagedit') {
        if (!text) return m.reply(`❌ Contoh: .imagedit ubah jadi kartun lucu`)
        prompt = text
      }

      const apiKey = await scrapeApiKey()
      const result = await editImage(buffer, prompt, apiKey)

      await criv.sendFile(m.chat, result, 'gb_shiro.png', 'Success !', m, false, { mimetype: 'image/png' })

    } catch (err) {
      console.error(err)
      m.reply(`❌ Terjadi kesalahan: ${err.message}`)
    }
  }
}      m.reply(`❌ Terjadi kesalahan: ${err.message}`)
    }
  }
}      m.reply(`❌ Terjadi kesalahan: ${err.message}`)
    }
  }
}
