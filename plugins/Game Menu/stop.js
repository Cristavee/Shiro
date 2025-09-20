import { stopUserGame } from '../../lib/game.js'

  export default {
  command: ['skip', 'stop'],
  tag: '',
  public: true,
      
    async run(criv, { m, sender }) {
    const success = stopUserGame(sender)
    if (success) {
      await m.reply('Game kamu telah dihentikan.')
    } else {
      return
    }
  }
}