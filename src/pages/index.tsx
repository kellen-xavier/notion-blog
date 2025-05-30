import Header from '../components/header'
import ExtLink from '../components/ext-link'
import sharedStyles from '../styles/shared.module.css'

export default function Index() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={sharedStyles.layout}>
        <img
          src="/vercel-and-notion.png"
          height="85"
          width="250"
          alt="Vercel + Notion"
        />
        <h1>Meu Blog</h1>
        <h2>It's not possible. No, it's necessary.</h2>

        <div className="explanation">
          <p>
            Descrição breve ... mas é backup das minhas docs. Dica? Escreva!{' '}
            <ExtLink href="https://github.com/kellen-xavier/notion-blog">
              Readme do projeto
            </ExtLink>{' '}
          </p>
        </div>
      </div>
    </>
  )
}
