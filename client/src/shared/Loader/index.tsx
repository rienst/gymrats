import { FC } from 'react'

type Props = { message?: string }

const Loader: FC<Props> = ({ message }) => {
  return (
    <div className="text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-3 mb-0">{message}</p>}
    </div>
  )
}

export default Loader
