import { FC, useState, useRef, TransitionEvent } from 'react'

interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger'
  onDismiss?: () => any
}

const Alert: FC<Props> = ({ type = 'primary', onDismiss, children }) => {
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
    <div
      className={alertClasses.join(' ')}
      role="alert"
      ref={alertRef}
      onTransitionEnd={handleTransitionEnd}
    >
      <div>{children}</div>
      {onDismiss && (
        <button
          className="btn-close"
          aria-label="Close"
          onClick={handleDismiss}
        ></button>
      )}
    </div>
  )
}

export default Alert
