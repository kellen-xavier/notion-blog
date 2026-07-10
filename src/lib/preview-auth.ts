import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Valida o token usado para entrar no modo de preview do Next.js.
 *
 * Preferimos um segredo dedicado (`PREVIEW_TOKEN`) em vez de reusar o
 * `NOTION_TOKEN`. O `NOTION_TOKEN` é a credencial de acesso ao Notion e
 * trafega na query string das URLs de preview, ficando exposto em logs de
 * servidor, histórico de navegação e cabeçalhos `Referer`.
 *
 * Para não quebrar deploys existentes, quando `PREVIEW_TOKEN` não está
 * definido fazemos fallback para o comportamento antigo (comparar com
 * `NOTION_TOKEN`), registrando um aviso no servidor. Assim que o segredo
 * dedicado for configurado, o fallback deixa de ser usado.
 *
 * Retorna `true` quando a requisição está autorizada. Quando não está,
 * já escreve a resposta de erro (401/404) e retorna `false`.
 */
export function isPreviewAuthorized(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  const previewToken = process.env.PREVIEW_TOKEN
  const expected = previewToken || process.env.NOTION_TOKEN

  if (!previewToken) {
    console.warn(
      'PREVIEW_TOKEN não definido: usando NOTION_TOKEN como fallback. ' +
        'Defina PREVIEW_TOKEN para não expor o token do Notion nas URLs de preview.'
    )
  }

  if (typeof req.query.token !== 'string') {
    res.status(401).json({ message: 'invalid token' })
    return false
  }

  if (!expected || req.query.token !== expected) {
    res.status(404).json({ message: 'not authorized' })
    return false
  }

  return true
}
