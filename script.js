import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNpwp0DYJ6Tlnoh1qON9SkQCr1rvenMHs",
    authDomain: "expense-tracker-3b989.firebaseapp.com",
    projectId: "expense-tracker-3b989",
    storageBucket: "expense-tracker-3b989.firebasestorage.app",
    messagingSenderId: "1032810430328",
    appId: "1:1032810430328:web:967f1415ef56fe29fc128d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ====================APP LOGIC====================


document.getElementById('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = Date.now();
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('categories').value;


    let Expenses = JSON.parse(localStorage.getItem('Expenses')) || []

    const expense = {
        id: id,
        date: new Date().toLocaleString(),
        name: name,
        amount: amount,
        category: category
    }

    try {
        await addDoc(db.collection('Expenses'), expense);
        alert('Expense added successfully!');
        renderExpenses();
    } catch (error) {
        alert('Error adding expense');
        console.error('Error adding expense:', error);
    }

    let renderExpenses = (filteredExpenses) => {
        let table = document.querySelector('tbody');
        table.innerHTML = '';


        if (!filteredExpenses) {
            JSON.parse(localStorage.getItem('Expenses')).forEach(expense => {
                let newRow = document.createElement('tr');
                newRow.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.name}</td>
            <td>${expense.amount}</td>
            <td>${expense.category}</td>
            <td>
                <button 
                class="delete" 
                data-id="${expense.id}" 
                style="
                    background-color: #e74c3c; 
                    color: #fff; 
                    border: none; 
                    border-radius: 4px; 
                    padding: 6px 14px; 
                    cursor: pointer; 
                    font-size: 14px;
                    transition: background 0.2s;
                "    
                onmouseover="this.style.backgroundColor='#c0392b'"
                onmouseout="this.style.backgroundColor='#e74c3c'"
                >
                Delete
                </button>
            </td>    
            `
                table.appendChild(newRow);
            });
        } else {
            filteredExpenses.forEach(expense => {
                let newRow = document.createElement('tr');
                newRow.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.name}</td>
            <td>${expense.amount}</td>
            <td>${expense.category}</td>
            <td>
                <button 
                class="delete" 
                data-id="${expense.id}" 
                style="
                    background-color: #e74c3c; 
                    color: #fff; 
                    border: none; 
                    border-radius: 4px; 
                    padding: 6px 14px; 
                    cursor: pointer; 
                    font-size: 14px;
                    transition: background 0.2s;
                "    
                onmouseover="this.style.backgroundColor='#c0392b'"
                onmouseout="this.style.backgroundColor='#e74c3c'"
                >
                Delete
                </button>
            </td>    
            `
                table.appendChild(newRow);
            });
        }

        deletebtn();
        totalExpenses();
}

    window.onload = () => {
        renderExpenses();
        searchbtn();
        categoryFilter();
        filterDate();
    }
    // Expenses.push(expense);

    // localStorage.setItem('Expenses', JSON.stringify(Expenses));

    // renderExpenses();
})

let searchbtn = () => {
    let srchinpt = document.getElementById('search');
    srchinpt.addEventListener('input', function () {
        str = this.value.toLowerCase();
        let expenses = JSON.parse(localStorage.getItem('Expenses')) || [];
        let filteredExpenses = expenses.filter(
            expenses => expenses.name.toLowerCase().includes(str)
        )
        renderExpenses(filteredExpenses);
    })
}

let filterDate = () => {
    let dateSelect = document.getElementById('srchdate');
    dateSelect.addEventListener('change', () => {
        let selectDate = dateSelect.value;
        let expenses = JSON.parse(localStorage.getItem('Expenses')) || [];
        let filteredDate = [...expenses].sort((a, b) => {
            if (selectDate === 'new') {
                return new Date(b.date) - new Date(a.date);
            } else if (selectDate === 'old') {
                return new Date(a.date) - new Date(b.date);
            } else {
                return 0;
            }
        })
        renderExpenses(filteredDate);
    })
}

let categoryFilter = () => {
    let categorySelect = document.getElementById('srchcategories');
    categorySelect.addEventListener('change', () => {
        let selectedCategory = categorySelect.value;
        let expenses = JSON.parse(localStorage.getItem('Expenses')) || []
        let filteredCategory = expenses.filter(expense =>
            expense.category === selectedCategory
        )
        console.log(filteredCategory);
        if (selectedCategory === '') {
            renderExpenses();
        } else {
            renderExpenses(filteredCategory);
        }
    })
}

let deletebtn = () => {
    let deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (confirm('Are you sure you want to delete this expense?')) {
                let id = Number(this.dataset.id);
                let expenses = JSON.parse(localStorage.getItem('Expenses')) || [];
                let updatedExpenses = expenses.filter(expense => expense.id !== id);
                localStorage.setItem('Expenses', JSON.stringify(updatedExpenses));
                renderExpenses();
            }
        });
    });
};

let totalExpenses = () => {
    let total = 0;
    JSON.parse(localStorage.getItem('Expenses')).forEach(expense => {
        total += Number(expense.amount)
    })
    document.querySelector('.total').innerText = total;
}
