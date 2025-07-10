require("dotenv").config();

// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "expense-tracker-3b989.firebaseapp.com",
    projectId: "expense-tracker-3b989",
    storageBucket: "expense-tracker-3b989.appspot.com",
    messagingSenderId: "1032810430328",
    appId: "1:1032810430328:web:967f1415ef56fe29fc128d",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const expensesCollection = collection(db, "Expenses");

// Render expenses from Firestore
const renderExpenses = async (filteredExpenses = null) => {
    const table = document.querySelector("tbody");
    table.innerHTML = "";

    const querySnapshot = await getDocs(expensesCollection);
    const allExpenses = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
    }));

    const expenses = filteredExpenses || allExpenses;

    expenses.forEach((expense) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
      <td>${expense.date}</td>
      <td>${expense.name}</td>
      <td>${expense.amount}</td>
      <td>${expense.category}</td>
      <td>
        <button class="delete" data-id="${expense.id}">Delete</button>
      </td>
    `;
        table.appendChild(newRow);
    });

    deletebtn();
    totalExpenses(expenses);
};

const totalExpenses = (expenses) => {
    let total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    document.querySelector(".total").innerText = total;
};

const deletebtn = () => {
    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", async function () {
            const id = this.dataset.id;
            if (confirm("Are you sure you want to delete this expense?")) {
                await deleteDoc(doc(db, "Expenses", id));
                renderExpenses();
            }
        });
    });
};

// Form submit handler
const form = document.getElementById("form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("categories").value;

    const expense = {
        date: new Date().toLocaleString(),
        name,
        amount,
        category,
    };

    try {
        await addDoc(expensesCollection, expense);
        form.reset();
        renderExpenses();
    } catch (err) {
        console.error("Error adding expense:", err);
        alert("Error adding expense");
    }
});

// Search by name or category
const searchbtn = () => {
    const srchinpt = document.getElementById("search");
    srchinpt.addEventListener("input", async function () {
        const str = this.value.toLowerCase();
        const querySnapshot = await getDocs(expensesCollection);
        const expenses = querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
        }));

        const filteredExpenses = expenses.filter(
            (exp) =>
                exp.name.toLowerCase().includes(str) ||
                exp.category.toLowerCase().includes(str)
        );

        renderExpenses(filteredExpenses);
    });
};

// Filter by category
const categoryFilter = () => {
    const categorySelect = document.getElementById("srchcategories");
    categorySelect.addEventListener("change", async () => {
        const selected = categorySelect.value;
        const querySnapshot = await getDocs(expensesCollection);
        const expenses = querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
        }));

        if (!selected) return renderExpenses();

        const filtered = expenses.filter((exp) => exp.category === selected);
        renderExpenses(filtered);
    });
};

// Sort by date
const filterDate = () => {
    const dateSelect = document.getElementById("srchdate");
    dateSelect.addEventListener("change", async () => {
        const order = dateSelect.value;
        const querySnapshot = await getDocs(expensesCollection);
        let expenses = querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
        }));

        expenses.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return order === "new" ? dateB - dateA : dateA - dateB;
        });

        renderExpenses(expenses);
    });
};

// On page load
window.onload = () => {
    renderExpenses();
    searchbtn();
    categoryFilter();
    filterDate();
};
