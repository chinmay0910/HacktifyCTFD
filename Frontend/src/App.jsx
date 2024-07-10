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


function App() {

  return (
    <Router>
          <Navbar />
          <Routes>
            <Route exact path='/challenge' element={<MainChallenge />} />
            <Route exact path='/challenge/create' element={<CreateChallenge />} />

          </Routes>
        </Router>
  )
}

export default App;
