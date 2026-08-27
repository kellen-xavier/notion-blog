import rpc from './rpc'

export default async function getNotionUsers(ids: string[]) {
  const { results = [] } = await rpc('getRecordValues', {
    requests: ids.map((id: string) => ({
      id,
      table: 'notion_user',
    })),
  })

  const users: any = {}

  for (const result of results) {
    const { value } = result || { value: {} }
    // A API do Notion passou a devolver um único campo "name" em vez de
    // "given_name"/"family_name" separados. Mantemos o formato antigo como
    // fallback por segurança.
    const { given_name, family_name, name } = value
    let full_name = name || given_name || ''

    if (!name && family_name) {
      full_name = `${full_name} ${family_name}`.trim()
    }
    users[value.id] = { full_name }
  }

  return { users }
}
