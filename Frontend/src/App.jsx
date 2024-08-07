import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";

// import of components
import Navbar from './components/navbar/Navbar';
import MainChallenge from './components/challenges/MainChallenge'
import CreateChallenge from './components/challenges/CreateChallenge';
import LoginPage from './components/Login/loginPage';
import UserChallengePage from './components/UserChallenges/userChallengesPage';
import ChallengeDetailsPage from './components/challenges/ChallengeDetails/ChallengeDetails';

function App() {

  return (
    <Router>
          <Navbar />
          <Routes>
            <Route exact path='/challenge' element={<MainChallenge />} />
            <Route exact path='/challenge/create' element={<CreateChallenge />} />
            <Route exact path='/challenges/:id' element={<ChallengeDetailsPage />} />
            <Route exact path='/login' element={<LoginPage />} />
            <Route exact path='/userchallenges' element={<UserChallengePage/>} />

          </Routes>
        </Router>
  )
}

export default App;
