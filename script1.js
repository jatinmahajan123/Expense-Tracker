document.addEventListener("DOMContentLoaded", () => {
    const incomeForm = document.getElementById("income-form");
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalIncomeEl = document.getElementById("total-income");
    const totalAmountEl = document.getElementById("total-amount");
    const balanceEl = document.getElementById("balance");
    const filterCategory = document.getElementById("filter-category");
    const themeToggle = document.getElementById("theme-toggle");

    let expenses = [];
    let totalIncome = 0;

    // Set max date for expense date input to prevent future dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').setAttribute('max', today);

    // Check localStorage for theme preference
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeToggle.textContent = "🌞"; // Sun icon for dark mode
        themeToggle.setAttribute("aria-label", "Switch to Light Theme");
    }

    // Toggle theme between light and dark
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        if (document.body.classList.contains("dark-theme")) {
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "🌞";
            themeToggle.setAttribute("aria-label", "Switch to Light Theme");
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙";
            themeToggle.setAttribute("aria-label", "Switch to Dark Theme");
        }
    });

    // Add income
    incomeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const incomeAmount = parseFloat(document.getElementById("income-amount").value);
        if (!isNaN(incomeAmount) && incomeAmount > 0) {
            totalIncome += incomeAmount;
            totalIncomeEl.textContent = totalIncome.toFixed(2);
            balanceEl.textContent = (totalIncome - calculateTotalExpenses()).toFixed(2);
            incomeForm.reset();
        }
    });

    // Add expense
    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const expenseName = document.getElementById("expense-name").value;
        const expenseAmount = parseFloat(document.getElementById("expense-amount").value);
        const expenseCategory = document.getElementById("expense-category").value;
        const expenseDate = document.getElementById("expense-date").value;

        if (!expenseName || !expenseAmount || !expenseCategory || !expenseDate || isNaN(expenseAmount) || expenseAmount <= 0) {
            alert("Please fill in all fields with valid data.");
            return;
        }

        const newExpense = {
            id: Date.now(),
            name: expenseName,
            amount: expenseAmount,
            category: expenseCategory,
            date: expenseDate,
        };

        expenses.push(newExpense);
        renderExpenses();
        expenseForm.reset();
    });

    // Calculate total expenses
    function calculateTotalExpenses() {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    // Render expenses based on filter
    function renderExpenses() {
        const filteredExpenses = filterCategory.value === "All" ? expenses : expenses.filter((expense) => expense.category === filterCategory.value);
        expenseList.innerHTML = "";

        filteredExpenses.forEach((expense) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td><button class="delete-btn" aria-label="Delete Expense" onclick="deleteExpense(${expense.id})">Delete</button></td>
            `;
            expenseList.appendChild(tr);
        });

        totalAmountEl.textContent = calculateTotalExpenses().toFixed(2);
        balanceEl.textContent = (totalIncome - calculateTotalExpenses()).toFixed(2);
    }

    // Delete expense
    window.deleteExpense = (id) => {
        expenses = expenses.filter((expense) => expense.id !== id);
        renderExpenses();
    };

    // Filter expenses by category
    filterCategory.addEventListener("change", renderExpenses);
});
