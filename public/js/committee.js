window.addEventListener('DOMContentLoaded', () => {
    // Get member details from localStorage
    const memberDetails = JSON.parse(localStorage.getItem('memberDetails'));
    if (memberDetails) {
        document.getElementById('userName').textContent = memberDetails.name;
    }

    // Fetch and render committee members
    fetchCommitteeMembers();
});

async function fetchCommitteeMembers() {
    try {
        const response = await fetch('/api/committee');
        if (!response.ok) {
            throw new Error('Failed to fetch committee members');
        }
        const committeeMembers = await response.json();
        renderCommitteeMembers(committeeMembers);
    } catch (error) {
        console.error('Error:', error);
        const container = document.querySelector('.commitee-container');
        container.innerHTML = `
            <div class="error-message">
                Failed to load committee members. Please try again later.
            </div>
        `;
    }
}

function renderCommitteeMembers(members) {
    const container = document.querySelector('.commitee-container');
    container.innerHTML = '';

    if (!members || members.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                No committee members found
            </div>
        `;
        return;
    }

    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'comm-cards';
        card.innerHTML = `
            <div class="card-item">
                <p class="label">Name</p>
                <p class="value">${member.name}</p>
            </div>
            <div class="card-item">
                <p class="label">Role</p>
                <p class="value">${member.role.charAt(0).toUpperCase() + member.role.slice(1)}</p>
            </div>
            <div class="card-item">
                <p class="label">Department</p>
                <p class="value">${member.department || '-'}</p>
            </div>
            <div class="card-item">
                <p class="label">Institution</p>
                <p class="value">${member.institution || '-'}</p>
            </div>
            <div class="card-item">
                <p class="label">Start Date</p>
                <p class="value">${new Date(member.start_date).toLocaleDateString()}</p>
            </div>
            <div class="card-item">
                <p class="label">End Date</p>
                <p class="value">${member.end_date ? new Date(member.end_date).toLocaleDateString() : '-'}</p>
            </div>
            <div class="card-item">
                <p class="label">Status</p>
                <p class="value">${member.status.charAt(0).toUpperCase() + member.status.slice(1)}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Handle logout
window.handleLogout = function() {
    localStorage.removeItem('memberDetails');
    navigate('login');
}; 