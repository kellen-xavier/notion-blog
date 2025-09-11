import rpc from './rpc'

interface GetRecordValuesResponse {
  results?: Array<{
    value?: {
      id: string
      given_name?: string
      family_name?: string
    }
  }>
}

export default async function getNotionUsers(ids: string[]) {
  const { results = [] } = (await rpc('getRecordValues', {
    requests: ids.map((id: string) => ({
      id,
      table: 'notion_user',
    })),
  })) as GetRecordValuesResponse

  const users: any = {}

  for (const result of results) {
    const { value } = result || { value: {} }
    const { id = '', given_name = '', family_name = '' } = value as { id: string; given_name?: string; family_name?: string }
    let full_name = given_name || ''

    if (family_name) {
      full_name = `${full_name} ${family_name}`
    }
    users[id] = { full_name }
  }

  return { users }
}
