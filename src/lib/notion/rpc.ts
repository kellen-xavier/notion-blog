import fetch, { Response } from 'node-fetch'
import { API_ENDPOINT, NOTION_TOKEN } from './server-constants'

export default async function rpc(fnName: string, body: any) {
  if (!NOTION_TOKEN) {
    throw new Error('NOTION_TOKEN is not set in env')
  }
  const res = await fetch(`${API_ENDPOINT}/${fnName}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: `token_v2=${NOTION_TOKEN}`,
    },
    body: JSON.stringify(body),
  })

  if (res.ok) {
    const data = await res.json()
    if (data && data.recordMap) unwrapRecordMap(data.recordMap)
    return data
  } else {
    throw new Error(await getError(res))
  }
}

// A API privada do Notion passou a envolver cada entrada de recordMap
// (block, collection, collection_view, notion_user, ...) num nível extra:
// { value: { value: <dados reais>, role: <permissão> } }, em vez do formato
// antigo { value: <dados reais>, role: <permissão> } que o resto do código
// (getBlogIndex, getTableData, getPostPreview, [slug].tsx, getPageData)
// espera. Normalizamos aqui, uma única vez na origem, em vez de mudar
// `.value.type` para `.value.value.type` em cada consumidor.
function unwrapRecordMap(recordMap: any) {
  for (const tableName of Object.keys(recordMap)) {
    const table = recordMap[tableName]
    if (!table || typeof table !== 'object') continue

    for (const id of Object.keys(table)) {
      const entry = table[id]
      const wrapped = entry && entry.value

      const isDoubleWrapped =
        wrapped &&
        typeof wrapped === 'object' &&
        'value' in wrapped &&
        'role' in wrapped

      if (isDoubleWrapped) {
        entry.value = wrapped.value
      }
    }
  }
}

export async function getError(res: Response) {
  return `Notion API error (${res.status}) \n${getJSONHeaders(
    res
  )}\n ${await getBodyOrNull(res)}`
}

export function getJSONHeaders(res: Response) {
  return JSON.stringify(res.headers.raw())
}

export async function getBodyOrNull(res: Response) {
  try {
    return await res.text()
  } catch (err) {
    return null
  }
}

export function values(obj: any) {
  const vals: any = []

  Object.keys(obj).forEach((key) => {
    vals.push(obj[key])
  })
  return vals
}
