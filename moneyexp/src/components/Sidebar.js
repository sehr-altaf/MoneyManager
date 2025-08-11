import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

function Sidebar() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">💸 Expense Tracker</h2>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/dashboard">📊 Dashboard</Link>
          </li>
          <li>
            <Link to="/transactions">💰 Transactions</Link>
          </li>
          <li>
            <Link to="/categories">📂 Categories</Link>
          </li>
        </ul>
      </nav>
      {/* <button onClick={handleLogout} className="logout-button">
        🚪 Logout
      </button> */}
    </aside>
  );
}

export default Sidebar;
