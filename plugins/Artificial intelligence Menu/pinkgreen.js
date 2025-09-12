import axios from 'axios'
import FormData from 'form-data'
import crypto from 'crypto'

const BASE_URL = 'https://ai-apps.codergautam.dev'
const PROMPT_PINKGREEN = `Recolor this photographic image into a The photograph is characterized by a striking, intensely saturated duo-tone color palette dominated by a vivid, almost neon fuchsia pink and a deep, rich forest green. This coloring is not merely an overlay but appears to be an integral part of the image's processing, creating a high-contrast, almost graphic aesthetic.The pink serves as the primary highlight and luminous element, bathing the faces and immediate surroundings of the subjects in a brilliant. It carries a distinctly artificial, electronic, or even 'vaporwave' tint, devoid of natural skin tones, instead opting for a bold, artistic interpretation. This pink has a dark color, almost polished feel, enhancing the perception of light.Conversely, the forest green acts as the profound shadow and background tone. hard fade between colors,  It's a very dark, dense green, nearing black in its deepest parts, which absorbs light rather than reflecting it. This green provides a dramatic contrast to the bright pink, creating a sense of depth and chiaroscuro. The texture implied by this green appears somewhat muted and perhaps slightly desaturated in its core, giving way to the vibrancy of the pink.Regarding texture, the overall impression is one of a digitally enhanced or filtered image. There's a smoothness to the application of both colors, suggesting a clean, almost airbrushed finish, particularly on the subjects' skin areas where the pink predominates. There are no visible film grain, dust, or significant analog imperfections. The edges between the pink and green areas, while distinct, appear soft enough to blend rather than sharply cut, contributing to a slightly ethereal or dreamy quality despite the bold color choices. The overall 'coloring' feels intentional and art-directed, giving the photo a modern, almost avant-garde photographic print quality. dark and not a glowing picture`



function acakName(len = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

async function autoregist() {
  const uid = crypto.randomBytes(12).toString('hex')
  const email = `gienetic${Date.now()}@nyahoo.com`

  const payload = {
    uid,
    email,
    displayName: acakName(),
    photoURL: 'https://i.pravatar.cc/150',
    appId: 'photogpt'
  }

  const res = await axios.post(`${BASE_URL}/photogpt/create-user`, payload, {
    headers: { 'content-type': 'application/json', 'accept': 'application/json', 'user-agent': 'okhttp/4.9.2' }
  })

  if (res.data.success) return uid
  throw new Error('Register gagal: ' + JSON.stringify(res.data))
}

async function img2img(imageBuffer, prompt) {
  const uid = await autoregist()
  const form = new FormData()
  form.append('image', imageBuffer, { filename: 'input.jpg', contentType: 'image/jpeg' })
  form.append('prompt', prompt)
  form.append('userId', uid)

  const uploadRes = await axios.post(`${BASE_URL}/photogpt/generate-image`, form, {
    headers: { ...form.getHeaders(), 'accept': 'application/json', 'user-agent': 'okhttp/4.9.2', 'accept-encoding': 'gzip' }
  })

  if (!uploadRes.data.success) throw new Error(JSON.stringify(uploadRes.data))

  const { pollingUrl } = uploadRes.data
  let status = 'pending', resultUrl = null

  while (status !== 'Ready') {
    const pollRes = await axios.get(pollingUrl, { headers: { 'accept': 'application/json', 'user-agent': 'okhttp/4.9.2' } })
    status = pollRes.data.status
    if (status === 'Ready') {
      resultUrl = pollRes.data.result.url
      break
    }
    await new Promise(r => setTimeout(r, 3000))
  }

  if (!resultUrl) throw new Error('Gagal mendapatkan hasil gambar')
  const resultImg = await axios.get(resultUrl, { responseType: 'arraybuffer' })
  return Buffer.from(resultImg.data)
}

export default {
  command: ['pinkgreen', 'topinkgreen', 'pg'],
  tag: 'art',
  public: true,
  owner: false,
  admin: false,
  botAdmin: false,
  coin: 15,
  cooldown: 10000,

  async run(criv, { m }) {
    try {
      const quoted = m.quoted?.isMedia ? m.quoted : (m.isMedia ? m : null)
      const mime = (quoted?.msg || quoted || {}).mimetype || ''
      if (!/image/.test(mime)) return criv.reply(m, '📸 Kirim atau reply gambar dulu!')

      const imageBuffer = await quoted.download()
      if (!imageBuffer) return m.reply('❌ Gagal mengunduh gambar.')

      const hasil = await img2img(imageBuffer, PROMPT_PINKGREEN)
      await criv.sendFile(m.chat, hasil, 'pinkgreen.png', '✨ Berhasil! Foto Anda sekarang dalam gaya duotone pink dan hijau, dengan mempertahankan kualitas fotografis!', m)

    } catch (e) {
      console.error(e)
      m.reply('❌ Terjadi kesalahan: ' + e.message)
    }
  }
}
