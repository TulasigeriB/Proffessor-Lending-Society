    window.addEventListener('DOMContentLoaded', () => {
    // Get member details from localStorage
    const memberDetails = JSON.parse(localStorage.getItem('memberDetails'));
    if (!memberDetails) {
        navigate.navigate('login');
        return;
    }

    // Update username in UI
    document.getElementById('userName').textContent = memberDetails.name;

    // Fetch transactions
    function fetchTransactions(filters = {}) {
        const queryParams = new URLSearchParams();
        if (filters.type && filters.type !== 'all') queryParams.append('type', filters.type);
        if (filters.date) queryParams.append('date', filters.date);

        const settings = {
            "async": true,
            "crossDomain": true,
            "url": `http://localhost:3000/api/transactions/${memberDetails.member_id}?${queryParams}`,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            }
        };

        $.ajax(settings)
            .done(function(transactions) {
                renderTransactions(transactions);
            })
            .fail(function(error) {
                console.error('Error:', error);
                alert('Failed to fetch transactions');
            });
    }

    // Render transactions to table
    function renderTransactions(transactions) {
        const tbody = document.getElementById('transactionsList');
        tbody.innerHTML = '';

        if (!transactions || transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="no-data">
                        No transactions found
                    </td>
                </tr>
            `;
            return;
        }

        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td>${transaction.transaction_id}</td>
                <td>${formatTransactionType(transaction.type)}</td>
                <td>${transaction.description || '-'}</td>
                <td class="${transaction.amount >= 0 ? 'amount-credit' : 'amount-debit'}">
                    ₹${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td>
                    <span class="status-badge">
                        ${transaction.type}
                    </span>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Format transaction type for display
    function formatTransactionType(type) {
        const types = {
            'loan': 'Loan',
            'repayment': 'Loan Repayment',
            'share_purchase': 'Share Purchase',
            'share_sale': 'Share Sale',
            'dividend': 'Dividend'
        };
        return types[type] || type;
    }

    // Handle filters
    const typeFilter = document.getElementById('typeFilter');
    const dateFilter = document.getElementById('dateFilter');

    [typeFilter, dateFilter].forEach(filter => {
        filter.addEventListener('change', () => {
            const filters = {
                type: typeFilter.value,
                date: dateFilter.value
            };
            fetchTransactions(filters);
        });
    });

    // Handle logout
    window.handleLogout = function() {
        localStorage.removeItem('memberDetails');
        navigate.navigate('login');
    };

    // Initial load
    fetchTransactions();
});