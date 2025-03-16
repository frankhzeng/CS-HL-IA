import logo from './logo.svg';
import './App.css';
import ActivityList from './ActivityList';
import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import CreateActivity from './CreateActivity';

function App() {
  
  return (
    <BrowserRouter>
      <div>
        <Link to="/">Home</Link>
      </div>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/create" element={<CreateActivity/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
