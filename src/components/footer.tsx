import ExtLink from './ext-link'

export default function Footer() {
  return (
    <footer>
      <span>Kellen Xavier</span>
      <span>
        {' '}
        <ExtLink href="https://github.com/kellen-xavier/notion-blog">
          | Código-fonte no GitHub
        </ExtLink>
      </span>
    </footer>
  )
}
