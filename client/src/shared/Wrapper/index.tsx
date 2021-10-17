import { FC } from 'react'

const Wrapper: FC = ({ children }) => {
  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-8 col-md-7 col-lg-6 col-xl-5 col-xxl-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wrapper
