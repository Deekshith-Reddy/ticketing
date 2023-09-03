import { AuthProvider } from '../contexts/AuthContext'
import './App.css'
import Signup from './Signup'
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import Login from './Login'
import ForgotPassword from './ForgotPassword'
import UpdateProfile from './UpdateProfile'
import SubmitTicket from './SubmitTicket'

function App() {


  return (
    <Container className='d-flex align-items-center justify-content-center'
      style={{ minHeight: "100vh" }}>
      <div className='w-100' style={{ maxWidth: "400px" }}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route exact path='/' Component={Dashboard}></Route>
              <Route path='/submit-ticket' Component={SubmitTicket}></Route>
              <Route path='/update-profile' Component={UpdateProfile}></Route>
              <Route path='/signup' Component={Signup}></Route>
              <Route path='/login' Component={Login}></Route>
              <Route path='/forgot-password' Component={ForgotPassword}></Route>
            </Routes>

          </AuthProvider>
        </Router>
      </div>
    </Container>

  )

}

export default App
