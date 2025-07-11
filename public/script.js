// import { get } from 'http';
import { firebaseConfig } from './config.js';


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


// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const expensesCollection = collection(db, "Expenses");

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('Service Worker Registered'))
        .catch(err => console.log('Service Worker Failed', err));
}


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
        //   <td>
        // <button class="delete" data-id="${expense.id}" style="
        //   background-color: #e74c3c;
        //   color: #fff;
        //   border: none;
        //   border-radius: 4px;
        //   padding: 6px 14px;
        //   cursor: pointer;
        //   font-weight: bold;
        //   transition: background 0.2s;
        // " onmouseover="this.style.backgroundColor='#c0392b'" onmouseout="this.style.backgroundColor='#e74c3c'">
        //   Delete
        // </button>
        //   </td>
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
        alert("Expense added successfully");
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

let exportCV = () => {
    let exportbtn = document.querySelector(".exportToCV");
    exportbtn.addEventListener('click', async () => {
        try {
            let expenses = await getDocs(expensesCollection);
            let csvContent = expenses.docs.map((doc) => {
                const data = doc.data()
                return {
                    Name: data.name,
                    Amount: data.amount,
                    Category: data.category,
                    Date: data.date,
                }
            })

            let header = 'Name,Amount,Category,Date';
            let rows = csvContent.map(row => {
                return `${row.Name},${row.Amount},${row.Category},${row.Date}`;
            })
            let csvString = [header, ...rows].join('\n');
            let blob = new Blob([csvString], { type: 'text/csv' });

            const url = document.createElement('a');
            url.href = URL.createObjectURL(blob);
            url.download = `Kisafi-Expenses-${new Date().toLocaleDateString()}.csv`;;
            url.click();
        } catch (error) {
            alert("Error exporting expenses");
            console.error("Error exporting expenses:", error);
        }
    })
}

// On page load
window.onload = () => {
    renderExpenses();
    searchbtn();
    categoryFilter();
    filterDate();
    exportCV();
};
