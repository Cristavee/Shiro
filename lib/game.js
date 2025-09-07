import { decodeJid } from './helpers.js'
import stringSimilarity from 'string-similarity'
import system from './system.js'

const replyGames = {}

function normalizeText(text) {
  return text
    ?.toUpperCase()
    .replace(/\s+/g, ' ')        
    .replace(/[^\w\s]/g, '')      
    .replace(/\u00A0/g, ' ')     
    .trim()
}

function addReplyGame(id, options) {
  const { timeout = 60_000 } = options

  const game = {
    ...options,
    sender: decodeJid(options.sender),
    chatId: decodeJid(options.chatId),
    _timeout: setTimeout(() => {
      options.onTimeout?.()
      delete replyGames[id]
    }, timeout)
  }

  system.gamePlayed(game.sender)

  replyGames[id] = game
}

async function handleReplyGame(m) {
  const quotedId =
    m.message?.extendedTextMessage?.contextInfo?.stanzaId ||
    m.quoted?.key?.id

  if (!quotedId || !replyGames[quotedId]) return false
  const game = replyGames[quotedId]
  const decodedGameChatId = decodeJid(game.chatId)
  const decodedMChat = decodeJid(m.chat)

  if (decodedGameChatId !== decodedMChat) {
    console.warn('[REPLY DETECTED] Chat ID mismatch!')
    console.log('[DEBUG] Expected:', decodedGameChatId, '| Got:', decodedMChat)
    return false
  }

  const userAnswer = normalizeText(
    m.text || m.message?.conversation || m.message?.extendedTextMessage?.text || ''
  )
  const correctAnswer = normalizeText(game.answer || '')
  const similarity = stringSimilarity.compareTwoStrings(userAnswer, correctAnswer)

  console.log('User Answer:', userAnswer, '| Expected:', correctAnswer, '| Similarity:', similarity)

  if (similarity >= 0.85) {
    clearTimeout(game._timeout)

    
    await game.onCorrect?.(m)
      await system.gameWin(m.sender || m.key?.participant || m.key?.remoteJid)
    delete replyGames[quotedId]
  } else {
    await game.onWrong?.(m)
  }

  return true
}

function stopUserGame(sender) {
  const cleanSender = decodeJid(sender)
  const entry = Object.entries(replyGames).find(
    ([_, game]) => decodeJid(game.sender) === cleanSender
  )
  if (!entry) return false

  const [key, game] = entry
  clearTimeout(game._timeout)
  delete replyGames[key]
  return true
}

export { addReplyGame, handleReplyGame, stopUserGame, replyGames }


