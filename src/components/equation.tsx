import { renderToString, ParseError } from 'katex'

export function render(expression: string, displayMode: boolean): string {
  try {
    return renderToString(expression, { displayMode: displayMode })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(e)
    }
    // Em erro de sintaxe do KaTeX, mostramos a mensagem; para qualquer
    // outro erro, devolvemos string vazia para nunca retornar undefined.
    if (e instanceof ParseError) {
      return e.message
    }
    return ''
  }
}

const Equation = ({ children, displayMode = true }) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: render(children, displayMode),
      }}
    />
  )
}

export default Equation
