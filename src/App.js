import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import CreateActivity from './CreateActivity';
import CompleteActivity from './CompleteActivity';

function App() {
  
  return (
    <BrowserRouter>
      <div>
        <Link to="/">Home</Link>
      </div>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/create" element={<CreateActivity/>}/>
        <Route exact path="/complete" element={<CompleteActivity/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
