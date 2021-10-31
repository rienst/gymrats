import { FC, ChangeEvent } from 'react'

interface Props {
  type: string
  id: string
  name: string
  label: string
  value: string
  onChange: (event: ChangeEvent<any>) => void
  error?: string
}

const Field: FC<Props> = ({
  type,
  id,
  name,
  label,
  value,
  onChange,
  error,
}) => {
  const inputClasses: string[] = ['form-control']

  if (error) {
    inputClasses.push('is-invalid')
  }

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>

      <input
        className={inputClasses.join(' ')}
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
      />

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  )
}

export default Field
