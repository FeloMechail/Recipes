import { react } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/', { state: { e: null } });
  };

  return (
    <div className="grid grid-cols-2 w-full text-sm md:text-3xl md:px-20 py-5 ">
      <div className="md:text-left pl-5">
        <button onClick={handleClick}>
          <h1>RECIPES</h1>
        </button>
      </div>
    </div>
  );
};

export default Header;
