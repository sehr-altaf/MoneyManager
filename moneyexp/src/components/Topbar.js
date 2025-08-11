import react from "react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();
 


return (
    <div className="Topbar">
      <h1>Recent Transactions</h1>
    </div>
  );
};
export default Topbar;