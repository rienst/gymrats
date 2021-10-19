import { FC } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { AuthProvider } from './shared/useAuth'
import LogIn from './LogIn'
import SignUp from './SignUp'
import Welcome from './Welcome'
import VerifyEmail from './VerifyEmail'
import Dashboard from './Dashboard'
import './styles/index.scss'

const App: FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/log-in" component={LogIn} />
          <Route exact path="/sign-up" component={SignUp} />
          <Route exact path="/welcome" component={Welcome} />
          <Route exact path="/verify-email" component={VerifyEmail} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
