export default {
  command: ['kick', 'tendang'],
  tag: 'group',
  description: 'Mengeluarkan anggota dari grup.',
  owner: false,
  admin: true,
  botAdmin: true,
  group: true,
  public: false,
  premium: false,
  coin: 0,
  cooldown: 5000,

  async run(criv, { m, mentioned, quoted }) {
    let usersToKick = [];
    if (!mentioned) return m.reply('Siapa yang akan dikeluarkan?')
    if (mentioned) {
      usersToKick.push(mentioned);
    } else if (quoted && quoted.sender) {
      usersToKick.push(quoted.sender);
    }

    if (usersToKick.length === 0) {
      return;
    }

    let successCount = 0;
    let failedList = [];

    for (let userJid of usersToKick) {
      if (userJid === m.sender) {
        failedList.push(`${userJid.split('@')[0]} (Tidak bisa mengeluarkan diri sendiri)`);
        continue;
      }
      if (userJid === criv.user.id) {
        failedList.push(`${userJid.split('@')[0]} (Tidak bisa mengeluarkan bot)`);
        continue;
      }

      try {
        await criv.groupParticipantsUpdate(m.chat, [userJid], 'remove');
        successCount++;
      } catch (error) {
        failedList.push(`${userJid.split('@')[0]} (Error: ${error.message})`);
      }
    }

    let result = `Berhasil mengeluarkan ${successCount} anggota.\n`;
    if (failedList.length > 0) {
      result += `Gagal mengeluarkan ${failedList.length} anggota:\n- ${failedList.join('\n- ')}\n`;
    }

    await m.reply(result);
  }
};



