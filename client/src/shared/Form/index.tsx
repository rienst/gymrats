import { FC } from 'react'

const Form: FC = ({ children }) => {
  // I know, but it looks better with a capital
  return <form>{children}</form>
}

export { default as Field } from './Field'

export default Form
