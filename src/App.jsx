import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FoodPage from './foodpage';
import Home from './home';


function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/food" element={<FoodPage />} />
        </Routes>
      </Router>
  );
}

export default App;
