import { renderToString, ParseError } from 'katex'

function render(expression: string, displayMode: boolean): string {
  let result: string
  try {
    result = renderToString(expression, { displayMode: displayMode })
  } catch (e) {
    result = e instanceof ParseError ? e.message : 'Invalid equation'
    if (process.env.NODE_ENV !== 'production') {
      console.error(e)
    }
  }
  return result
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
