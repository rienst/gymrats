import { FC } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'
import AuthProvider from './shared/AuthContext'
import LogIn from './LogIn'
import SignUp from './SignUp'
import NotVerified from './NotVerified'
import VerifyEmail from './VerifyEmail'
import Dashboard from './Dashboard'
import './index.scss'

const App: FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/not-verified" component={NotVerified} />
          <Route exact path="/verify-email" component={VerifyEmail} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
