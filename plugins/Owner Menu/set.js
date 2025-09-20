export default {
  command: ['set'],
  tag: 'owner',
  owner: true,
  public: true,
  coin: 0,
  cooldown: 5000,

  async run(criv, { m, db, text }) {
    const sys = m.db.system;

    if (!text) {
      return m.reply(
        `Gunakan:\n` +
        `> *.set publicon/off*\n` +
        `> *.set privateon/off*\n` +
        `> *.set resmeon/off*\n` +
        `> *.set autoreadon/off*\n` +
        `> *.set autoaion/off*\n` + 
        `> *.set main/on | mainoff*\n` +
        `> *.set lang [kode]*\n` +
        `> *.set cek*`
      );
    }

    const cmd = text.toLowerCase().trim();
    let teks = '';

    const actions = {
      publicon:   () => { sys.public = true; sys.maintenance = false; teks = '✅ Bot public diaktifkan'; },
      publicoff:  () => { sys.public = false; teks = '❌ Bot public dimatikan'; },
      privateon:  () => { sys.public = false; sys.maintenance = false; teks = '🔒 Private mode diaktifkan'; },
      privateoff: () => { sys.public = true; sys.maintenance = false; teks = '🔓 Private mode dimatikan'; },
      resmeon:    () => { sys.responseToMe = true; teks = '✅ Respon ke diri sendiri diaktifkan'; },
      resmeoff:   () => { sys.responseToMe = false; teks = '❌ Respon ke diri sendiri dimatikan'; },
      autoreadon: () => { sys.autoRead = true; teks = '👀 Auto read diaktifkan'; },
      autoreadoff:() => { sys.autoRead = false; teks = '🙈 Auto read dimatikan'; },
      autoaion:   () => { sys.autoAI = true; teks = '🤖 Auto AI diaktifkan'; },   
      autoaioff:  () => { sys.autoAI = false; teks = '🚫 Auto AI dimatikan'; },  
      main:       () => { sys.maintenance = true; teks = '🛠️ Bot dalam mode perawatan'; },
      maintenance:() => { sys.maintenance = true; teks = '🛠️ Bot dalam mode perawatan'; },
      mainoff:    () => { sys.maintenance = false; teks = '✅ Bot sudah mulai bekerja'; },
      cek:        () => {
        teks =
          `⚙️ *Status Bot:*\n\n` +
          `> *Public:* ${sys.public ? '✅' : '❌'}\n` +
          `> *Private:* ${!sys.public ? '✅' : '❌'}\n` +
          `> *Respon Diri Sendiri:* ${sys.responseToMe ? '✅' : '❌'}\n` +
          `> *Auto Read:* ${sys.autoRead ? '✅' : '❌'}\n` +
          `> *Auto AI:* ${sys.autoAI ? '✅' : '❌'}\n` +
          `> *Bahasa:* ${sys.lang}\n` +
          `> *Maintenance:* ${sys.maintenance ? '✅' : '❌'}`;
      },
      status:     () => actions.cek()
    };

    if (cmd.startsWith('lang ')) {
      sys.lang = cmd.split(' ')[1]?.toLowerCase() || sys.lang;
      teks = `🌐 Bahasa bot diubah ke: ${sys.lang}`;
    } else if (actions[cmd]) {
      actions[cmd]();
    } else {
      return m.reply('❌ Input tidak dikenali. Ketik *.set* untuk bantuan.');
    }

    await db.write();
    return m.reply(teks);
  }
};