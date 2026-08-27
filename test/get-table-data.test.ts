import test from 'node:test'
import assert from 'node:assert/strict'

import loadTable from '../src/lib/notion/getTableData'

test('loadTable lança erro claro quando o Notion não retorna a tabela (collectionBlock undefined)', async () => {
  // O guard dispara antes de qualquer chamada de rede, então este teste não
  // depende de credenciais nem do Notion.
  await assert.rejects(
    () => loadTable(undefined as any, true),
    /NOTION_TOKEN|BLOG_INDEX_ID|collection_view/
  )
})
