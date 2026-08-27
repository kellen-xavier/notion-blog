import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Valida o token usado para entrar no modo de preview do Next.js.
 *
 * Usa um segredo dedicado (`PREVIEW_TOKEN`) em vez de reusar o
 * `NOTION_TOKEN`. O `NOTION_TOKEN` é a credencial de acesso ao Notion e
 * trafega na query string das URLs de preview, ficando exposto em logs de
 * servidor, histórico de navegação e cabeçalhos `Referer`.
 *
 * Não há fallback para `NOTION_TOKEN`: se `PREVIEW_TOKEN` não estiver
 * definido, o modo preview fica desabilitado. Reusar o `NOTION_TOKEN` aqui
 * reabriria exatamente o vazamento que este helper existe para evitar.
 *
 * A comparação usa `crypto.timingSafeEqual` para não vazar o segredo por
 * diferença de tempo de resposta.
 *
 * Retorna `true` quando a requisição está autorizada. Quando não está,
 * já escreve a resposta de erro (401/404) e retorna `false`.
 */
export function isPreviewAuthorized(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  if (typeof req.query.token !== 'string') {
    res.status(401).json({ message: 'invalid token' })
    return false
  }

  const expected = process.env.PREVIEW_TOKEN

  if (!expected) {
    console.warn(
      'PREVIEW_TOKEN não definido: modo preview desabilitado. ' +
        'Defina PREVIEW_TOKEN nas variáveis de ambiente para habilitá-lo.'
    )
    res.status(404).json({ message: 'not authorized' })
    return false
  }

  const tokenBuf = Buffer.from(req.query.token)
  const expectedBuf = Buffer.from(expected)

  const matches =
    tokenBuf.length === expectedBuf.length &&
    crypto.timingSafeEqual(tokenBuf, expectedBuf)

  if (!matches) {
    // ainda gasta um timingSafeEqual mesmo com tamanhos diferentes, para
    // não vazar o tamanho do segredo pelo tempo de resposta
    if (tokenBuf.length !== expectedBuf.length) {
      crypto.timingSafeEqual(expectedBuf, expectedBuf)
    }
    res.status(404).json({ message: 'not authorized' })
    return false
  }

  return true
}
