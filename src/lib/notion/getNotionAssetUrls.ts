import fetch from 'node-fetch'
import { API_ENDPOINT } from './server-constants'

/**
 * Define a permissão de acesso ao asset
 */
interface PermissionRecord {
  table: string
  id: string
}

/**
 * Requisição para assinar um arquivo do Notion
 */
export interface AssetRequest {
  url: string
  permissionRecord: PermissionRecord
}

/**
 * Resposta da API contendo a URL assinada
 */
export interface SignedFileUrl {
  url: string
  signedUrl: string
}

/**
 * Faz a requisição para o endpoint privado do Notion para assinar uma ou mais URLs de arquivos.
 *
 * @param assets - Lista de arquivos a serem assinados
 * @returns Lista de URLs assinadas
 */
export async function getSignedFileUrls(
  assets: AssetRequest[]
): Promise<SignedFileUrl[]> {
  if (!process.env.NOTION_TOKEN) {
    throw new Error('NOTION_TOKEN não definido no ambiente')
  }

  if (!assets || assets.length === 0) {
    return []
  }

  const res = await fetch(`${API_ENDPOINT}/getSignedFileUrls`, {
    method: 'POST',
    headers: {
      cookie: `token_v2=${process.env.NOTION_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ urls: assets }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('[Notion] Erro ao assinar assets:', res.status, errorText)
    throw new Error(`Erro ao obter signed URLs do Notion: ${res.status}`)
  }

  const json = await res.json()
  return json.signedUrls ?? []
}
