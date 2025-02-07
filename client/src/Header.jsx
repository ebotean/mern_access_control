import { NavLink } from "react-router";
import StatusLight from "./ui/StatusLight";

const Header = () => {
  return (
    <div id="header" className="flex flex-col">
      <h1 className="w-full">Access Management</h1>
      <div id="actionTab" className="py-4 flex gap-4">
        <NavLink to="/" end>
          <button className="p-2 bg-slate-200 border border-slate-400 font-bold">
            Now
            <StatusLight color="green" />
          </button>
        </NavLink>
        <NavLink to="/logs" end>
          <button className="p-2 bg-slate-300 border border-slate-400 font-bold">Last accesses</button>
        </NavLink>
      </div>
    </div>
  )
};

export default Header;