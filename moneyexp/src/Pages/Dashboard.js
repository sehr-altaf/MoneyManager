import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import BalanceCards from "../components/BalanceCards";
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";


function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const txRef = collection(db, "users", user.uid, "transactions");
    const unsubscribe = onSnapshot(txRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
    });

    return () => unsubscribe();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchText =
      tx.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.type?.toLowerCase().includes(searchQuery.toLowerCase());

    const txDate = new Date(tx.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchDate = (!start || txDate >= start) && (!end || txDate <= end);

    return matchText && matchDate;
  });

  const income = filteredTransactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const expense = filteredTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const balance = income - expense;

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>

        <div className="filter-bar">
          <SearchBar setSearchQuery={setSearchQuery} />
          <div className="date-filters">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <BalanceCards income={income} expense={expense} balance={balance} />

        <section className="chart-section">
          <div className="chart-card">
            <PieChart transactions={filteredTransactions} />
          </div>
          <div className="chart-card">
            <BarChart transactions={filteredTransactions} />
          </div>
        </section>

        <section className="transaction-table-section">
          <h2>Recent Transactions</h2>
          <div className="table-container">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.category}</td>
                    <td>{tx.type}</td>
                    <td>₹{tx.amount}</td>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-controls">
            <span>Items per page:</span>
            <select value={itemsPerPage} onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}>
              {[10, 20, 40, 80].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
