
export default {
  command: ['transfer', 'kirimkoin', 'tf'],
  tag: 'main',
  description: 'Kirim koin ke pengguna lain.',
  public: true,
  cooldown: 3000,
  coin: 0,

  async run(criv, { m, sender, system, args, getName, mentioned }) {
    if (args.length < 2 && !m.quoted) {
      return m.reply(`Usage: ${m.prefix}transfer [amount] @[tag_user] or reply to a message.\nExample: ${m.prefix}transfer 100 @${sender.split('@')[0]}`);
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0) {
      return m.reply('The amount of coins must be a positive number.');
    }

    let recipientJid = null;

 if (m.mentionedJids && m.mentionedJids.length > 0) {
  recipientJid = m.mentionedJids[0];
   } else if (m.quoted?.sender) {
  recipientJid = m.quoted.sender;
  } else if (args[1]) {
  const num = args[1].replace(/[^0-9]/g, '');
  if (num.length >= 10) recipientJid = num + '@s.whatsapp.net';
}

    if (!recipientJid) {
      return m.reply('Please tag the user you want to send coins to, or reply to their message.');
    }
      
    if (!system.db.data.users[recipientJid]) {
     return m.reply('Pengguna tujuan belum terdaftar dalam database.');
    }
      
    const decodedRecipientJid = criv.decodeJid(recipientJid);
    const decodedSenderJid = criv.decodeJid(sender);

    if (decodedRecipientJid === decodedSenderJid) {
      return m.reply('You cannot send coins to yourself!');
    }

    const senderCoins = system.getCoin(decodedSenderJid);
    if (senderCoins < amount) {
      return m.reply(`💰 Your coins are insufficient. You have ${senderCoins.toLocaleString('id-ID')}, but you want to send ${amount.toLocaleString('id-ID')}.`);
    }

    const senderSuccess = system.subtractCoinIfEnough(decodedSenderJid, amount);
    if (!senderSuccess) {
      return m.reply('Failed to deduct coins from sender. An error occurred or insufficient funds (double check).');
    }

    system.addCoin(decodedRecipientJid, amount);
    await system.saveDb();

    const recipientName = await getName(decodedRecipientJid);
    const newSenderCoins = system.getCoin(decodedSenderJid);
    const newRecipientCoins = system.getCoin(decodedRecipientJid);
    const senderName = await getName(decodedSenderJid);

    await criv.sendMessage(m.chat, {
      text: `🎉 Success! You sent *${amount.toLocaleString('id-ID')} coins* to @${decodedRecipientJid.split('@')[0]} (${recipientName}).\n\n` +
            `💰 Your current coins: *${newSenderCoins.toLocaleString('id-ID')}*\n`,
      mentions: [decodedRecipientJid]
    }, { quoted: m });
    
    if (decodedRecipientJid !== decodedSenderJid) {
      await criv.sendMessage(decodedRecipientJid, { 
        text: `*${senderName}* just sent you *${amount.toLocaleString('id-ID')} coins*!\n\nYour current coins: *${newRecipientCoins.toLocaleString('id-ID')}*`,
        footer: `_BECEA_`, 
        mentions: [decodedSenderJid] 
      });
    }
  }
};
