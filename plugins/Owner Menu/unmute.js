export default {
  command: ['unmute'],
  tag: 'owner',
  group: true,
  owner: true,
  admin: false,
  botAdmin: false,
async run(criv, { m, system }) {
    if (!system.isMuted(m.chat)) {
      return m.reply('Grup ini sudah tidak dalam keadaan mute.')
    }
      await system.unMute(m.chat)
    m.reply('Grup ini telah di-*unmute*. Bot akan kembali merespons pesan di sini.')
  }
}