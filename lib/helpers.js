import fs from 'fs'
import fetch from 'node-fetch'
import { fileTypeFromBuffer } from 'file-type'
import { JSDOM } from 'jsdom'
import axios from 'axios'
import sharp from 'sharp'
import { createCanvas, loadImage } from 'canvas'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { downloadMediaMessage } from 'baileys-x'
import { jidDecode } from 'baileys-x'
import path from 'path'
import tmp from 'tmp'
import { spawn } from 'child_process'
import FormData from 'form-data'
import pkg from '@vitalets/google-translate-api'

export function safeJidDecode(jid) {
if (!jid) {
return { user: '' };
}
try {
const decoded = jidDecode(jid);
return decoded || { user: '' };
} catch (e) {
console.error("Error decoding JID:", jid, e);
return { user: '' };
}
}

export function decodeJid(jid = '') {
if (!jid || typeof jid !== 'string') return jid
if (jid.includes(':')) return jid.split(':')[0] + '@s.whatsapp.net'
return jid
}

export function getTarget(m, args) {
if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
return decodeJid(m.message.extendedTextMessage.contextInfo.mentionedJid[0])
}

if (m.quoted?.sender) {
return decodeJid(m.quoted.sender)
}

if (args && args.length > 0) {
for (const arg of args) {
const potentialJid = arg.replace(/[^0-9]/g, '');
if (potentialJid.length >= 7 && potentialJid.length <= 15) {
return decodeJid(potentialJid + '@s.whatsapp.net');
}
if (arg.endsWith('@s.whatsapp.net') || arg.endsWith('@g.us')) {
return decodeJid(arg);
}
}
}
return decodeJid(m.sender)
}

export function parseAmount(args = []) {
const amountStr = args.find(arg => /^\d+$/.test(arg))
const amount = parseInt(amountStr)
return isNaN(amount) || amount <= 0 ? 1 : amount
}

export function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms))
}

export function formatDuration(ms) {
if (typeof ms !== 'number' || ms < 0) {
return 'Invalid duration';
}

const seconds = Math.floor(ms / 1000);
const minutes = Math.floor(seconds / 60);
const hours = Math.floor(minutes / 60);
const days = Math.floor(hours / 24);

let parts = [];
if (days > 0) {
parts.push(`${days} hari`);
}
if (hours % 24 > 0) {
parts.push(`${hours % 24} jam`);
}
if (minutes % 60 > 0) {
parts.push(`${minutes % 60} menit`);
}
if (seconds % 60 > 0) {
parts.push(`${seconds % 60} detik`);
}

return parts.length > 0 ? parts.join(', ') : 'kurang dari 1 detik';
}

export function extendHelper(criv) {
if (!criv || typeof criv.sendMessage !== 'function') {
console.error("Error: Objek 'criv' bukan instance socket Baileys yang valid. Fungsi helper tidak akan ditambahkan.")
return
}

criv.translate = async (text, target = 'id') => {
try {
const translate = pkg.translate
const res = await translate(text, { to: target })
return res.text
} catch (e) {
console.error('Translate error:', e.message)
return text
}
}

criv.upload = async (filePath) => {
const baseApi = 'https://nevio.zone.id';
  if (!fs.existsSync(filePath)) {
    throw new Error('File tidak ditemukan: ' + filePath);
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.mp4') {
throw new Error(' Hanya file .mp4 yang diperbolehkan!');
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(path.resolve(filePath)));

  try {
    const res = await axios.post(`${baseApi}/api/upload`, form, {
      headers: form.getHeaders()
    });

    if (res.status === 200 && res.data?.filename) {
      const id = res.data.filename.split('.')[0];
      const urlVideo = `${baseApi}/video?id=${id}`;
      return urlVideo;
    } else {
      throw new Error(`Upload gagal. Status: ${res.status}`);
    }
  } catch (error) {
    console.error('Gagal upload:', error.response?.data || error.message);
    throw error;
  }
}

criv.fetchBuffer = async (url) => {
try {
if (!url) {
throw new Error('URL is required');
}

const response = await axios({  
  method: 'get',  
  url: url,  
  responseType: 'arraybuffer'  
});  

const buffer = Buffer.from(response.data);  

return buffer;

} catch (error) {
console.error('Error fetching buffer:', error);
throw new Error('Failed to fetch buffer: ' + error.message);
}
};

criv.fetchMessages = async (jid, id) => {
try {
if (!jid || !id) {
throw new Error('jid dan id pesan harus disediakan')
}

const message = await criv.loadMessage(jid, id)  
if (!message) {  
  throw new Error('Pesan tidak ditemukan')  
}  

return message

} catch (error) {
console.error('❌ Gagal mengambil pesan:', error)
throw new Error('Gagal fetch pesan: ' + error.message)
}
}

criv.getName = async function (jid) {
if (!jid) return ''
try {
const metadata = await this.onWhatsApp(jid)
if (metadata?.[0]?.notify) return metadata[0].notify

const contact = this.contacts?.[jid] || {}  
return contact.name || contact.notify || jid.split('@')[0]

} catch (e) {
return jid.split('@')[0]
}
}

criv.sleep = async (s) => {
return new Promise(resolve => setTimeout(resolve, s * 1000))
}

criv.downloadMediaMessage = async (msg) => {
return await downloadMediaMessage(msg, 'buffer', {})
}

criv.pickRandom = (list) => list[Math.floor(Math.random() * list.length)]

criv.sendFormattedMessage = async (jidOrMsg, ct, opt = {}) => {
let j = jidOrMsg, q = null
if (typeof jidOrMsg === 'object' && jidOrMsg.chat) {
q = jidOrMsg
j = jidOrMsg.chat
if (!opt.quoted) opt.quoted = q
}

try {
if (!j || !j.includes('@')) return
if (!ct) return criv.sendMessage(j, { text: '[⚠️ Kosong]' }, opt)

let msg = {}  

// --- STRING ---  
if (typeof ct === 'string') {  
  msg.text = ct.trim() || '[Kosong]'  
}   
// --- BUFFER ---  
else if (ct instanceof Buffer) {  
  msg.sticker = ct  
}   
// --- OBJECT ---  
else if (typeof ct === 'object') {  
  msg = { ...ct }  

  if (!(msg.sticker instanceof Buffer)) {  
    for (let k of ['image', 'video', 'audio', 'document', 'thumbnail']) {  
      if (typeof msg[k] === 'string' && msg[k].startsWith('http')) {  
        try {   
          msg[k] = await criv.fetchBuffer(msg[k])   
        } catch {   
          delete msg[k]   
        }  
      }  
    }  

    if (msg.text && (msg.image || msg.video || msg.audio || msg.document)) {  
      msg.caption = msg.text  
      delete msg.text  
    }  

    if (msg.contextInfo?.externalAdReply?.thumbnail) {  
      let ad = msg.contextInfo.externalAdReply.thumbnail  
      if (typeof ad === 'string' && ad.startsWith('http')) {  
        try {   
          msg.contextInfo.externalAdReply.thumbnail = await criv.fetchBuffer(ad)   
        } catch {   
          delete msg.contextInfo.externalAdReply.thumbnail  
        }  
      }  
    }  
  }  
}   
// --- FORMAT TIDAK DIKENAL ---  
else {  
  return criv.sendMessage(j, { text: '[⚠️ Format tak dikenal]' }, opt)  
}  

// presence update  
if (opt.status) {  
  await criv.sendPresenceUpdate(opt.status, j)  
  delete opt.status  
  await criv.sleep(500)  
}  

// hapus quoted kalau bukan object  
if (opt.quoted && typeof opt.quoted !== 'object') delete opt.quoted  

// handle mentions dari teks/caption  
let teks = msg.caption || msg.text  
if (teks) {  
  let m = (teks.match(/@(\d+)/g) || []).map(x => decodeJid(x.replace('@', '') + '@s.whatsapp.net'))  
  if (m.length) msg.mentions = [...(msg.mentions || []), ...m]  
}  

return await criv.sendMessage(j, msg, opt)

} catch (e) {
console.error('❌ sendFormattedMessage err:', e)
try {
let fb = typeof ct === 'string' ? ct : (ct?.text || ct?.caption || '[❌ gagal kirim]')
return await criv.sendMessage(j, { text: fb }, opt)
} catch (er) {
console.error('❌ fallback err:', er)
}
}
}

criv.sendMessages = async (jid, message, quoted = null) => {
return await criv.sendFormattedMessage(jid, message, { quoted })
}

criv.reply = async (m, teks, options = {}) => {
return await criv.sendFormattedMessage(m, teks, options)
}

criv.sendText = async (jid, text, quoted = null) => {
return await criv.sendFormattedMessage(jid, { text }, { quoted })
}

criv.sendContact = async (jid, contacts, quoted = null) => {
const vcards = contacts.map(({ name, number }) => {
  const formattedNumber = number.startsWith('0') ? '62' + number.substring(1) : number;
  return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;waid=${formattedNumber}:${formattedNumber}\nEND:VCARD`
})
return await criv.sendFormattedMessage(jid, {
  contacts: {
    displayName: contacts.length > 1 ? `${contacts.length} Kontak :` : contacts[0].name,
    contacts: vcards.map(vcard => ({ vcard }))
  }
}, { quoted })
}

criv.sendImage = async (jid, buffer, caption = '', quoted = null, options = {}) => {
return await criv.sendFormattedMessage(
jid,
{ image: buffer, caption },
{ quoted, ...options }
)
}

criv.sendVideo = (jid, buffer, caption = '', quoted = null, options = {}) => {
criv.sendFormattedMessage(jid, { video: buffer, caption }, { quoted, ...options }) }

criv.sendAudio = (jid, buffer, ptt = false, quoted = null, options = {}) => {
criv.sendMessage(jid, { audio: buffer, mimetype: options.mimetype || 'audio/mpeg', ptt, ...options }, { quoted }) }

criv.sendFile = async (jid, buffer, mimetype = '', fileName = 'file', quoted = null, options = {}) => {
const type = await fileTypeFromBuffer(buffer) || { mime: mimetype }
const mime = type.mime || mimetype || 'application/octet-stream'
if (mime.startsWith('image/')) return criv.sendImage(jid, buffer, fileName, quoted, options)
if (mime.startsWith('video/')) return criv.sendVideo(jid, buffer, fileName, quoted, options)
if (mime.startsWith('audio/')) return criv.sendAudio(jid, buffer, false, quoted, options)
return criv.sendFormattedMessage(jid, { document: buffer, fileName, mimetype: mime }, { quoted, ...options })
}

criv.sendAsSticker = async (jid, buffer, options = {}) => {
const type = await fileTypeFromBuffer(buffer)
if (!type) return

let convertedBuffer = buffer  

if (type.mime.startsWith('image/') && type.mime !== 'image/gif') {  
  convertedBuffer = await sharp(buffer).webp({ quality: 100 }).toBuffer()  
} else if (type.mime === 'image/gif' || type.mime.startsWith('video/')) {  
  const tmpIn = `./temp/in_${Date.now()}.${type.ext}`  
  const tmpOut = `./temp/out_${Date.now()}.webp`  
  fs.writeFileSync(tmpIn, buffer)  

  await new Promise((resolve, reject) => {  
    const ff = spawn('ffmpeg', [  
      '-i', tmpIn,  
      '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,fps=15',  
      '-t', '3',  
      '-loop', '0',  
      tmpOut  
    ])  
    ff.on('close', code => code === 0 ? resolve() : reject())  
  })  

  convertedBuffer = fs.readFileSync(tmpOut)  
  fs.unlinkSync(tmpIn)  
  fs.unlinkSync(tmpOut)  
}  

const sticker = new Sticker(convertedBuffer, {  
  pack: options.pack || global.pack || 'Bot Sticker',  
  author: options.author || global.author || 'By Bot',  
  type: StickerTypes.FULL,  
  quality: 100,  
})  

const stickerBuffer = await sticker.toBuffer()  
return criv.sendFormattedMessage(jid, { sticker: stickerBuffer }, options)

}

criv.sendAlbumMessage = async (jid, items, options = {}) => {
  const delay = options.delay || 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    try {
      await criv.sendMessage(jid, item, { quoted: options.quoted })
      if (delay > 0 && i < items.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    } catch (err) {
      console.error(`Gagal kirim media ke-${i + 1}:`, err)
    }
  }
}


criv.sendLocation = async (jid, latitude, longitude, name = '', address = '', quoted = null, options = {}) => {
return await criv.sendFormattedMessage(jid, {
location: {
degreesLatitude: latitude,
degreesLongitude: longitude,
name: name,
address: address
}
}, { quoted, ...options })
}

criv.sendReaction = async (jid, messageKey, emoji) => {
return await criv.sendFormattedMessage(jid, {
react: {
key: messageKey,
text: emoji
}
}, { quoted: false })
}

criv.deleteMessage = async (jid, messageKey) => {
return await criv.sendFormattedMessage(jid, {
delete: messageKey
}, { quoted: false })
}

criv.sendPoll = async (jid, name, values, options = {}) => {
if (!Array.isArray(values) || values.length === 0) {
throw new Error('Poll options (values) must be a non-empty array.')
}
return await criv.sendFormattedMessage(jid, {
poll: {
name: name,
values: values,
selectableOptionsCount: options.selectableOptionsCount || 1
}
}, options)
}

criv.sendListMessage = async (jid, buttonText, description, sections, title = '', footer = '', quoted = null, options = {}) => {
return await criv.sendFormattedMessage(jid, {
text: description,
footer: footer,
title: title,
buttonText: buttonText,
sections: sections
}, { quoted, ...options })
}

criv.sendButtonMessage = async (jid, text, buttons, options = {}) => {
return await criv.sendFormattedMessage(jid, {
text: text,
buttons: buttons.map(btn => ({
buttonId: btn.id,
buttonText: { displayText: btn.text },
type: 1
}))
}, options)
}

criv.sendStickerFromUrl = async (jid, url, options = {}) => {
try {
const response = await fetch(url)
if (!response.ok) throw new Error(`Failed to fetch sticker from URL: ${response.statusText}`)
const buffer = await response.buffer()
return await criv.sendAsSticker(jid, buffer, options)
} catch (e) {
console.error(`❌ Error in sendStickerFromUrl to ${jid} from ${url}:`, e)
await criv.reply(jid, 'Gagal mengirim stiker dari URL. Pastikan URL valid dan mengarah ke gambar/video.', options)
}
}

criv.sendMediaUrl = async (jid, url, type = 'auto', caption = '', quoted = null, options = {}) => {
try {
const response = await fetch(url)
if (!response.ok) throw new Error(`Failed to fetch media from URL: ${response.statusText}`)
const buffer = await response.buffer()
const fileInfo = await fileTypeFromBuffer(buffer) || {}
const mime = fileInfo.mime || 'application/octet-stream'

if (type === 'image' || mime.startsWith('image/')) {  
    return await criv.sendImage(jid, buffer, caption, quoted, options)  
  } else if (type === 'video' || mime.startsWith('video/')) {  
    return await criv.sendVideo(jid, buffer, caption, quoted, options)  
  } else if (type === 'audio' || mime.startsWith('audio/')) {  
    return await criv.sendAudio(jid, buffer, false, quoted, options)  
  } else {  
    return await criv.sendFormattedMessage(jid, {  
      document: buffer,  
      fileName: url.substring(url.lastIndexOf('/') + 1) || 'file',  
      mimetype: mime,  
      caption: caption  
    }, { quoted, ...options })  
  }  
} catch (e) {  
  if (!response.ok) throw new Error(`Failed to fetch media from URL: ${response.statusText}`)
  await criv.reply(jid, 'Gagal mengirim media dari URL. Pastikan URL valid.', options)  
}

}

criv.createExif = async (buffer, { pn = '', ath = '' } = {}) => {
try {
const pngBuffer = await sharp(buffer).png().toBuffer()

const image = await loadImage(pngBuffer)  
const canvas = createCanvas(image.width, image.height)  
const ctx = canvas.getContext('2d')  
ctx.drawImage(image, 0, 0)  

const cleanImage = canvas.toBuffer('image/png')  

const sticker = new Sticker(cleanImage, {  
  pack: pn || global.pack || 'StickerBot',  
  author: ath || global.author || 'By Shiro',  
  type: StickerTypes.FULL,  
  quality: 100  
})  

return await sticker.toBuffer()

} catch (err) {
console.error('[createExif] Gagal membuat stiker:', err)
throw err
}
}

criv.createMeme = async (buffer, text = '') => {
const { createCanvas, loadImage } = await import('canvas');

const image = await loadImage(buffer);
const canvas = createCanvas(image.width, image.height);
const ctx = canvas.getContext('2d');

ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

ctx.font = Math.floor(canvas.height * 0.06) + 'px Impact';

ctx.fillStyle = 'rgba(20, 20, 20, 0.85)';

ctx.strokeStyle = 'white';
ctx.lineWidth = 3;
ctx.textAlign = 'center';

const wrapText = (ctx, text, maxWidth) => {
const words = text.split(' ');
const lines = [];
let line = '';

for (const word of words) {  
  const testLine = line + word + ' ';  
  const { width } = ctx.measureText(testLine);  
  if (width > maxWidth && line !== '') {  
    lines.push(line.trim());  
    line = word + ' ';  
  } else {  
    line = testLine;  
  }  
}  
lines.push(line.trim());  
return lines;

};

const [topText = '', bottomText = ''] = text.split('|').map(s => s.trim());

if (topText) {
const lines = wrapText(ctx, topText.toUpperCase(), canvas.width - 40);
const yStart = canvas.height * 0.12;

lines.forEach((line, i) => {  
  const y = yStart + i * (canvas.height * 0.08);  
  ctx.strokeText(line, canvas.width / 2, y);  
  ctx.fillText(line, canvas.width / 2, y);  
});

}

if (bottomText) {
const lines = wrapText(ctx, bottomText.toUpperCase(), canvas.width - 40);
const lineHeight = canvas.height * 0.08;
const totalHeight = lines.length * lineHeight;
const yStart = canvas.height - totalHeight - canvas.height * 0.05;

lines.forEach((line, i) => {  
  const y = yStart + i * lineHeight;  
  ctx.strokeText(line, canvas.width / 2, y);  
  ctx.fillText(line, canvas.width / 2, y);  
});

}
return canvas.toBuffer('image/png');
};
}

