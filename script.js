// Functionality

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let expenseChart;
let lineChart;
let goal = 0;

// ADD TRANSACTION
function addTransaction() {

    const description = document.getElementById("description").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const transaction = {
        id: Date.now(),
        description,
        amount,
        type,
        category,
        date
    };

    transactions.push(transaction);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateUI();
    updateChart();
    updateLineChart();
}

// UPDATE UI
function updateUI() {

    let income = 0;
    let expense = 0;

    const list = document.getElementById("transactionList");
    list.innerHTML = "";

    transactions.forEach(t => {

        if (t.type === "income") income += t.amount;
        else expense += t.amount;

        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                ${t.description} (${t.category})
                <small>${t.date}</small>
            </div>
            <div>₹${t.amount}</div>
        `;

        list.appendChild(li);
    });

    document.getElementById("income").innerText = `₹${income}`;
    document.getElementById("expense").innerText = `₹${expense}`;
    document.getElementById("balance").innerText = `₹${income - expense}`;

    updateGoal();
}

// PIE CHART
function updateChart() {

    const categoryTotals = {};

    transactions.forEach(t => {
        if (t.type === "expense") {
            categoryTotals[t.category] =
                (categoryTotals[t.category] || 0) + t.amount;
        }
    });

    const ctx = document.getElementById("expenseChart");

    if (expenseChart) expenseChart.destroy();

    expenseChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ["#ef4444","#f97316","#eab308","#22c55e"]
            }]
        }
    });
}

// LINE CHART
function updateLineChart() {

    const monthly = {};

    transactions.forEach(t => {
        if (t.type === "expense") {

            const month = new Date(t.date).getMonth();

            monthly[month] = (monthly[month] || 0) + t.amount;
        }
    });

    const ctx = document.getElementById("lineChart");

    if (lineChart) lineChart.destroy();

    lineChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: Object.keys(monthly),
            datasets: [{
                label: "Expenses",
                data: Object.values(monthly),
                borderColor: "#ef4444"
            }]
        }
    });
}

// GOAL
function setGoal() {
    goal = Number(document.getElementById("goalAmount").value);
    updateGoal();
}

function updateGoal() {

    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    const savings = income - expense;

    let percent = goal ? (savings / goal) * 100 : 0;
    if (percent > 100) percent = 100;

    document.getElementById("goalText").innerText =
        `Saved ₹${savings} / ₹${goal}`;

    document.getElementById("progress").style.width = percent + "%";
}

// DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// INIT
window.onload = () => {
    updateUI();
    updateChart();
    updateLineChart();
};