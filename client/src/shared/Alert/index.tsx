import { FC, useState, useRef, TransitionEvent } from 'react'

interface Props {
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

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (!onDismiss) {
      return
    }

    // If the transition is not on the alert, don't fire the callback
    // It is probably a transition of the button focussing or blurring
    if (alertRef.current !== event.target) {
      return
    }

    onDismiss()
  }

  const handleDismiss = () => {
    setVisible(false)
  }

  return (
    <>
      {message && (
        <div
          className={alertClasses.join(' ')}
          ref={alertRef}
          onTransitionEnd={handleTransitionEnd}
          role="alert"
        >
          {message}
          {onDismiss && (
            <button
              className="btn-close"
              aria-label="Close"
              onClick={handleDismiss}
            ></button>
          )}
        </div>
      )}
    </>
  )
}

export default Alert
