let deletebtn = () => {
    let deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            let id = Number(this.dataset.id); 
            let expenses = JSON.parse(localStorage.getItem('Expenses')) || [];
            let updatedExpenses = expenses.filter(expense => expense.id !== id); 
            localStorage.setItem('Expenses', JSON.stringify(updatedExpenses));
            renderExpenes();
        });
    });
};

let renderExpenes = () => {
    let table = document.querySelector('tbody');
    table.innerHTML = '';

    JSON.parse(localStorage.getItem('Expenses')).forEach(expense => {
        let newRow = document.createElement('tr');
        newRow.innerHTML = `
        <td>${expense.name}</td>
        <td>${expense.amount}</td>
        <td>${expense.category}</td>
        <td><button class="delete" data-id=${expense.id} >Delete</button></td>
        `
        table.appendChild(newRow);
    });

    deletebtn();
}

window.onload = renderExpenes

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();

    const id =  Date.now();
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('categories').value;
    const total = document.querySelector('span')


    let Expenses = JSON.parse(localStorage.getItem('Expenses')) || []

    const expense = {
        id: id,
        name: name,
        amount: amount,
        category: category
    }

    Expenses.push(expense);

    localStorage.setItem('Expenses', JSON.stringify(Expenses));

    renderExpenes();
})