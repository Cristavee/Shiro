export default {
  command: ['transfer', 'kirimkoin', 'tf'],
  tag: 'main',
  public: true,
  cooldown: 3000,
  coin: 0,

  async run(criv, { m, sender, system, args, getName }) {
    try {
      if (args.length < 2 && !m.quoted) {
        return m.reply(
          `Usage: ${m.prefix}transfer [amount] @[tag_user] or reply to a message.\n` +
          `Example: ${m.prefix}transfer 100 @${sender.split('@')[0]}`
        );
      }

      const amount = parseInt(args[0]);
      if (isNaN(amount) || amount <= 0) {
        return m.reply('Jumlah koin harus berupa angka positif.');
      }

      // Tentukan penerima
      let recipientJid = null;
      if (m.mentionedJids?.length) {
        recipientJid = m.mentionedJids[0];
      } else if (m.quoted?.sender) {
        recipientJid = m.quoted.sender;
      } else if (args[1]) {
        const num = args[1].replace(/[^0-9]/g, '');
        if (num.length >= 10) recipientJid = num + '@s.whatsapp.net';
      }

      if (!recipientJid) {
        return m.reply('Tolong tag pengguna yang ingin dikirim koin, atau reply pesannya.');
      }

      if (!system.db.data.users[recipientJid]) {
        return m.reply('Pengguna tujuan belum terdaftar dalam database.');
      }

      const decodedRecipientJid = criv.decodeJid(recipientJid);
      const decodedSenderJid = criv.decodeJid(sender);

      if (decodedRecipientJid === decodedSenderJid) {
        return m.reply('Kamu tidak bisa mengirim koin ke diri sendiri!');
      }

      const senderCoins = system.getCoin(decodedSenderJid);
      if (senderCoins < amount) {
        return m.reply(
          `💰 Koin kamu tidak cukup. Kamu memiliki ${senderCoins.toLocaleString('id-ID')}, ` +
          `tetapi ingin mengirim ${amount.toLocaleString('id-ID')}.`
        );
      }

      // Transfer koin
      const senderSuccess = system.subtractCoinIfEnough(decodedSenderJid, amount);
      if (!senderSuccess) {
        return m.reply('Gagal mengurangi koin pengirim. Periksa saldo dan coba lagi.');
      }

      system.addCoin(decodedRecipientJid, amount);
      await system.saveDb();

      const recipientName = await getName(decodedRecipientJid);
      const senderName = await getName(decodedSenderJid);
      const newSenderCoins = system.getCoin(decodedSenderJid);
      const newRecipientCoins = system.getCoin(decodedRecipientJid);

      // Kirim notifikasi ke chat pengirim
      await criv.sendMessage(m.chat, {
        text: `🎉 Berhasil! Kamu mengirim *${amount.toLocaleString('id-ID')} koin* ke @${decodedRecipientJid.split('@')[0]} (${recipientName}).\n\n` +
              `💰 Saldo koinmu sekarang: *${newSenderCoins.toLocaleString('id-ID')}*`,
        mentions: [decodedRecipientJid]
      }, { quoted: m });

      // Kirim notifikasi ke penerima
      await criv.sendMessage(decodedRecipientJid, {
        text: `*${senderName}* baru saja mengirimmu *${amount.toLocaleString('id-ID')} koin*!\n` +
              `💰 Saldo koinmu sekarang: *${newRecipientCoins.toLocaleString('id-ID')}*`,
        footer: '_BECEA_',
        mentions: [decodedSenderJid]
      });

    } catch (err) {
      console.error('Error transfer:', err);
      m.reply('❌ Terjadi kesalahan saat transfer koin.');
    }
  }
};