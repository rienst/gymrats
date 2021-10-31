import { FC } from 'react'

type ButtonVariant =
  | 'primary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'light'
  | 'outline-primary'
  | 'outline-danger'
  | 'outline-success'
  | 'outline-warning'
  | 'outline-light'

export interface ButtonProps {
  variant?: ButtonVariant
  block?: boolean
  onClick: () => void
  loading?: boolean
}

const Button: FC<ButtonProps> = ({
  variant = 'primary',
  block = false,
  onClick,
  children,
  loading = false,
}) => {
  const classes: string[] = ['btn', `btn-${variant}`]

  if (block) {
    classes.push('d-block', 'w-100')
  }

  return (
    <button className={classes.join(' ')} onClick={onClick} disabled={loading}>
      {loading ? (
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
