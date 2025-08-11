import React from "react";


const BalanceCards = ({ income, expense, balance }) => {
  return (
    <div className="balance-cards">
      <div className="balance-card income">
         <h4>Income</h4>
        <p> RS {income}</p>
      </div>
      <div className="balance-card expense">
        <h4>Expense</h4>
        <p>RS {expense}</p>
      </div>
      <div className="balance-card balance">
        <h4>Balance</h4>
        <p>RS {balance}</p>
      </div>
    </div>
  );
};

export default BalanceCards;
