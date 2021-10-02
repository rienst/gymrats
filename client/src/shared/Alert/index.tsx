import { FC, useState, useRef } from 'react'

type Props = {
  type?: 'primary' | 'success' | 'warning' | 'danger'
  message?: string
  onDismiss?: () => any
}

const Alert: FC<Props> = ({ type = 'primary', message, onDismiss }) => {
  const [visible, setVisible] = useState(true)

  const alertRef = useRef(null)

  const alertClasses: string[] = ['alert', `alert-${type}`]

  if (onDismiss) {
    alertClasses.push('alert-dismissible')

    if (visible) {
      alertClasses.push('show')
    }
  }

  return (
    <>
      {message && (
        <div
          className={alertClasses.join(' ')}
          ref={alertRef}
          onTransitionEnd={event => {
            // After the alert fades out, it should fire the onDismiss callback

            // If there is no onDismiss callback, don't bother
            if (!onDismiss) {
              return
            }

            // If the transition is not on the alert, don't fire the callback
            // It is probably the button focussing or blurring
            if (alertRef.current !== event.target) {
              return
            }

            onDismiss()
          }}
          role="alert"
        >
          {message}
          {onDismiss && (
            <button
              className="btn-close"
              aria-label="Close"
              onClick={() => setVisible(() => false)}
            ></button>
          )}
        </div>
      )}
    </>
  )
}

export default Alert
