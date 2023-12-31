import { AuthProvider } from '../contexts/AuthContext'
import './App.css'
import Signup from './Signup'
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Dashboard'
import Login from './Login'
import ForgotPassword from './ForgotPassword'
import UpdateProfile from './UpdateProfile'
import SubmitTicket from './SubmitTicket'
import TicketViewer from './TicketViewer'
import ErrComponent from './ErrComponent'
import TicketStatus from './TicketStatus'


function App() {


  return (
    <Container className=' align-items-center'
      style={{ minHeight: "100vh" }}>
      <div className='w-100' >
        <h2 className='title text-center mb-5'><a href="/">Ticketing</a></h2>
        <Router>
          <AuthProvider>
            <Routes>
              <Route exact path='/' Component={Dashboard}></Route>
              <Route path='/submit-ticket' Component={SubmitTicket}></Route>
              <Route path='/update-profile/' Component={UpdateProfile}></Route>
              <Route path='/signup' Component={Signup}></Route>
              <Route path='/login' Component={Login}></Route>
              <Route path='/forgot-password' Component={ForgotPassword}></Route>
              <Route path='/ticket-viewer/:id' Component={TicketViewer}></Route>
              <Route path='/ticket-status/:id' Component={TicketStatus}></Route>

              <Route path="*" Component={ErrComponent}></Route>
            </Routes>

          </AuthProvider>
        </Router>

      </div>
    </Container>

  )

}

export default App
