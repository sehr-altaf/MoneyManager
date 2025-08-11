import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";


function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const txRef = collection(db, "users", user.uid, "transactions");
    const unsubscribe = onSnapshot(txRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sorted);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const txRef = collection(db, "users", user.uid, "transactions");

    if (isEditing && editId) {
      await updateDoc(doc(txRef, editId), form);
      Swal.fire("Updated!", "Transaction has been updated.", "success");
      setIsEditing(false);
      setEditId(null);
    } else {
      await addDoc(txRef, form);
      Swal.fire("Added!", "Transaction has been added.", "success");
    }

    setForm({
      type: "expense",
      category: "",
      amount: "",
      date: "",
      description: "",
    });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!user) return;

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this transaction?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "users", user.uid, "transactions", id));
      Swal.fire("Deleted!", "Transaction has been removed.", "success");
    }
  };

  const handleEdit = (tx) => {
    setForm({
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      date: tx.date,
      description: tx.description,
    });
    setIsEditing(true);
    setEditId(tx.id);
    setShowModal(true);
  };

  const paginatedTx = transactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(transactions.length / pageSize);

  return (
    <div className="page-container">
      <div className="header-row">
        <h2 className="page-title">Recent Transactions</h2>
        <button className="add-button" onClick={() => setShowModal(true)}>
          + Add Transaction
        </button>
      </div>

      <div className="pagination-controls">
        <label>Rows per page:</label>
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
          {[10, 20, 40, 80].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTx.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.type}</td>
                <td>{tx.category}</td>
                <td>₹{tx.amount}</td>
                <td>{tx.date}</td>
                <td>{tx.description}</td>
                <td>
                  <button onClick={() => handleEdit(tx)}>Edit</button>
                  <button onClick={() => handleDelete(tx.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination buttons */}
      <div className="pagination-buttons">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? "Edit Transaction" : "Add Transaction"}</h3>
            <form onSubmit={handleSubmit} className="form">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Note"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="modal-buttons">
                <button type="submit">{isEditing ? "Update" : "Add"}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setEditId(null);
                    setForm({
                      type: "expense",
                      category: "",
                      amount: "",
                      date: "",
                      description: "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
