import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", type: "expense" });
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const catRef = query(
      collection(db, "users", user.uid, "categories"),
      orderBy("name")
    );
    const unsubscribe = onSnapshot(catRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      Swal.fire("Error", "Category name cannot be empty", "error");
      return;
    }

    await addDoc(collection(db, "users", user.uid, "categories"), form);
    setForm({ name: "", type: "expense" });
    setShowModal(false);
    Swal.fire("Added!", "Category has been added.", "success");
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "users", user.uid, "categories", id));
      Swal.fire("Deleted!", "Category has been removed.", "success");
    }
  };

  const handleEdit = async (cat) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Category",
      html: `
        <input id="swal-input1" class="swal2-input" value="${cat.name}" placeholder="Category Name">
        <select id="swal-input2" class="swal2-input">
          <option value="income" ${cat.type === "income" ? "selected" : ""}>Income</option>
          <option value="expense" ${cat.type === "expense" ? "selected" : ""}>Expense</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        const name = document.getElementById("swal-input1").value.trim();
        const type = document.getElementById("swal-input2").value;
        if (!name) {
          Swal.showValidationMessage("Category name cannot be empty");
        }
        return { name, type };
      },
    });

    if (formValues) {
      await updateDoc(doc(db, "users", user.uid, "categories", cat.id), formValues);
      Swal.fire("Updated!", "Category has been updated.", "success");
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className="category-page">
      <div className="category-header">
        <h2>Categories</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Category</button>
      </div>

      <div className="table-wrapper">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.type}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(cat)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(cat.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
      <div className="pagination">
        <span>Items per page:</span>
        <select value={itemsPerPage} onChange={(e) => {
          setItemsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}>
          {[10, 20, 40, 80].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Category</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Category Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <div className="modal-actions">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;


