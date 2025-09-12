export default {
  command: ['set'],
  tag: 'owner',
  owner: true,
  public: true,
  coin: 0,
  cooldown: 5000,

  async run(criv, { m, text }) {
    if (!text) {
      return m.reply(
        'Gunakan:\n' +
        '> *.set publicon* → bot bisa digunakan semua orang\n' +
        '> *.set publicoff* → bot tidak bisa digunakan semua orang\n' +
        '> *.set privateon* → hanya chat pribadi yang bisa pakai bot\n' +
        '> *.set privateoff* → nonaktifkan private mode\n' +
        '> *.set resmeon* → bot merespon perintah dari dirinya sendiri\n' +
        '> *.set resmeoff* → bot tidak merespon perintah dari dirinya sendiri\n' +
        '> *.set autoreadon* → bot langsung membaca pesan yang masuk\n' +
        '> *.set autoreadoff* → bot tidak auto read pesan\n' +
        '> *.set lang [kode]* → ubah bahasa bot (contoh: indonesia, english)\n' +
        '> *.set cek* → lihat pengaturan saat ini'
      );
    }

    let teks = '';
    const set = text.toLowerCase();

    switch (set) {
      case 'publicon': {
        criv.public = true;
        criv.private = false;
        teks = 'Bot sekarang bisa digunakan semua orang (public mode)';
      } break;

      case 'publicoff': {
        criv.public = false;
        criv.private = true;
        teks = 'Bot sekarang tidak bisa digunakan semua orang (private mode aktif)';
      } break;

      case 'privateon': {
        criv.private = true;
        criv.public = false;
        teks = 'Private mode diaktifkan: hanya chat pribadi yang bisa pakai bot';
      } break;

      case 'privateoff': {
        criv.private = false;
        criv.public = true;
        teks = 'Private mode dimatikan: bot bisa digunakan semua orang';
      } break;

      case 'responmeon':
      case 'resmeon': {
        criv.resMe = true;
        teks = 'Bot sekarang merespon perintah dari dirinya sendiri';
      } break;

      case 'responmeoff':
      case 'resmeoff': {
        criv.resMe = false;
        teks = 'Bot sekarang tidak merespon perintah dari dirinya sendiri';
      } break;

      case 'autoreadon': {
        criv.autoRead = true;
        teks = 'Bot sekarang akan langsung membaca pesan yang masuk';
      } break;

      case 'autoreadoff': {
        criv.autoRead = false;
        teks = 'Bot sekarang tidak akan auto read pesan yang masuk';
      } break;

      case 'cek':
      case 'status': {
        teks = `⚙️ Pengaturan Saat Ini:\n` +
               `> *Public:* ${criv.public ? '✅ Aktif' : '❌ Tidak Aktif'}\n` +
               `> *Private:* ${criv.private ? '✅ Aktif' : '❌ Tidak Aktif'}\n` +
               `> *Respon Perintah Sendiri:* ${criv.resMe ? '✅ Aktif' : '❌ Tidak Aktif'}\n` +
               `> *Auto Read Pesan:* ${criv.autoRead ? '✅ Aktif' : '❌ Tidak Aktif'}\n` +
               `> *Bahasa:* ${criv.lang}`;
      } break;

      default:
        if (set.startsWith('lang ')) {
          const lang = text.split(' ')[1];
          if (!lang) return m.reply('Masukkan kode bahasa. Contoh: .set lang indonesia');
          criv.lang = lang.toLowerCase();
          teks = `Bahasa bot diubah menjadi: ${criv.lang}`;
        } else {
          return m.reply('Input tidak dikenali.\nGunakan: .set publicon/off, privateon/off, resmeon/off, autoreadon/off, lang [kode], cek.');
        }
    }

    return m.reply(teks);
  }
};
