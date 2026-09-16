function formatRupee(amount) {
    return '₹' + amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(parts[1], 10) - 1]} ${parseInt(parts[2], 10)}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const transactions = await FinanceAPI.transactions.getAll();
    const BASE_CAPITAL = FinanceAPI.BASE_CAPITAL;

    let totalAllIncome = 0;
    let totalAllExpense = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    const targetYearMonth = '2026-09';

    transactions.forEach(t => {
        if (t.type === 'income') {
            totalAllIncome += t.amount;
            if (t.date && t.date.startsWith(targetYearMonth)) {
                monthlyIncome += t.amount;
            }
        } else {
            totalAllExpense += t.amount;
            if (t.date && t.date.startsWith(targetYearMonth)) {
                monthlyExpense += t.amount;
            }
        }
    });

    const netBalance = BASE_CAPITAL + totalAllIncome - totalAllExpense;
    let savingsRate = 0;
    const monthlySaved = Math.max(0, monthlyIncome - monthlyExpense);
    if (monthlyIncome > 0) {
        savingsRate = Math.round((monthlySaved / monthlyIncome) * 100);
    }

    // Populate Headers
    document.getElementById('home-net-balance').innerText = formatRupee(netBalance);
    document.getElementById('home-income').innerText = formatRupee(monthlyIncome);
    document.getElementById('home-expenses').innerText = formatRupee(monthlyExpense);
    document.getElementById('home-savings-rate').innerText = `${savingsRate}%`;

    // Cash flow bar calculation
    const expensePercent = monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) * 100 : 0;
    const savedPercent = Math.max(0, 100 - expensePercent);
    const expenseBar = document.getElementById('flow-expense-bar');
    const savingsBar = document.getElementById('flow-savings-bar');
    if (expenseBar && savingsBar) {
        expenseBar.style.width = `${expensePercent.toFixed(1)}%`;
        savingsBar.style.width = `${savedPercent.toFixed(1)}%`;
        expenseBar.title = `Expenses (${expensePercent.toFixed(1)}%)`;
        savingsBar.title = `Saved (${savedPercent.toFixed(1)}%)`;
    }

    // Populate Recent Transactions (Top 5)
    const recentTbody = document.getElementById('home-recent-tbody');
    if (recentTbody) {
        recentTbody.innerHTML = '';
        const top5 = transactions.slice(0, 5);

        if (top5.length === 0) {
            recentTbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--text-muted); padding: 20px 0;">No recent transactions.</td></tr>`;
            return;
        }

        top5.forEach(item => {
            const tr = document.createElement('tr');
            const isIncome = item.type === 'income';
            const amountClass = isIncome ? 'income-val' : 'expense-val';
            const sign = isIncome ? '+' : '-';

            tr.innerHTML = `
                <td class="preview-date">${formatDate(item.date)}</td>
                <td class="preview-desc">${escapeHtml(item.description)}</td>
                <td class="preview-amount ${amountClass}">${sign}${formatRupee(item.amount)}</td>
            `;
            recentTbody.appendChild(tr);
        });
    }
});

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
