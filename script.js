document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the values from the form inputs
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('categories').value;

    // Create a new table row
    const table = document.querySelector('.modern-table tbody');
    const newRow = table.insertRow();

    // Insert new cells for each piece of data
    newRow.insertCell(0).textContent = name;
    newRow.insertCell(1).textContent = amount;
    newRow.insertCell(2).textContent = date;

    // Clear the form inputs
    document.getElementById('form').reset();
})