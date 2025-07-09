document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();

    try {
        const name = document.getElementById('name').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('categories').value;

        const expense = {
            name: name,
            amount: amount,
            category: category
        };

        localStorage.setItem('Expenses', JSON.stringify(expense))

        alert('Expense saved successfully!');
    } catch (error) {
        alert('An error occurred while saving the expense. Please try again.');
        console.error('Error saving expense:', error);
    }


})