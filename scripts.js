document.addEventListener("DOMContentLoaded", function () {
    // Load header and footer content
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            const header = document.getElementById('header-placeholder');
            if (header) header.innerHTML = data;
        })
        .catch(error => console.error('Error fetching header:', error));

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const footer = document.getElementById('footer-placeholder');
            if (footer) footer.innerHTML = data;
        })
        .catch(error => console.error('Error fetching footer:', error));

    // Attach login form event listener only if login form exists
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const roleElement = document.querySelector('input[name="role"]:checked');
            const role = roleElement ? roleElement.value : null;

            if (role === 'user' && username === 'user' && password === 'userpass') {
                window.location.assign('assets.html');
            } else if (role === 'admin' && username === 'admin' && password === 'adminpass') {
                window.location.assign('xyz.html');
            } else {
                displayError('Invalid username or password. Please try again.');
            }
        });
    }

    const assetAllocationForm = document.getElementById('assetAllocationForm');
    if (assetAllocationForm) {
        assetAllocationForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                assetNo: document.getElementById('assetNo').value,
                employeeNo: document.getElementById('employeeNo').value,
                employeeName: document.getElementById('employeeName').value,
                userDepartment: document.getElementById('userDepartment').value,
                userSection: document.getElementById('userSection').value,
                building: document.getElementById('building').value,
                issueDate: document.getElementById('issueDate').value,
                assetType: document.getElementById('assettype').value,
                make: document.getElementById('make').value,
                model: document.getElementById('model').value,
                warrantyPeriod: document.getElementById('warrantyPeriod').value,
                warrantyStartDate: document.getElementById('warrantyStartDate').value,
                warrantyEndDate: document.getElementById('warrantyEndDate').value,
            };

            try {
                const response = await fetch('http://localhost:5000/api/assets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const result = await response.text();
                alert(result);
                document.getElementById('userDetails').reset();
                document.getElementById('assetAllocationForm').reset();
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });
    }

    document.getElementById('updateAssetForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const assetNo = document.getElementById('updateAssetNo').value;
        const newEmployeeNo = document.getElementById('newEmployeeNo').value;

        try {
            const response = await fetch(`http://localhost:5000/api/assets/${assetNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newEmployeeNo }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert('Asset updated successfully');
            document.getElementById('updateAssetForm').reset();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    document.getElementById('fetchHistoryForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const assetNo = document.getElementById('historyAssetNo').value.trim();

        if (!assetNo) {
            alert('Please enter an Asset No to fetch history.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/assets/history/${assetNo}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const history = await response.json();
            populateHistoryTable(history);
            document.getElementById('fetchHistoryForm').reset();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    // Function to populate the history table
    function populateHistoryTable(history) {
        const historyResults = document.getElementById('historyResults');
        historyResults.innerHTML = ''; // Clear previous results

        if (history.length === 0) {
            historyResults.innerHTML = '<tr><td colspan="4" class="text-center">No history found for this asset.</td></tr>';
            return;
        }

        history.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.assetNo}</td>
                <td>${entry.newEmployeeNo}</td>
                <td>${new Date(entry.allocationDate).toLocaleString()}</td>
            `;
            historyResults.appendChild(row);
        });
    }
    // <td>${entry.previousEmployeeNo}</td>

    document.getElementById('searchBtn').addEventListener('click', async () => {
        const assetNo = document.getElementById('searchAssetNo').value.trim();

        if (!assetNo) {
            alert('Please enter an Asset No to search.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/assets/${assetNo}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const assetData = await response.json();
            autoFillAssetData(assetData);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    function autoFillAssetData(asset) {
        document.getElementById('assetNo').value = asset.assetNo;
        document.getElementById('assettype').value = asset.assetType;
        document.getElementById('make').value = asset.make;
        document.getElementById('model').value = asset.model;
        document.getElementById('warrantyPeriod').value = asset.warrantyPeriod;
        document.getElementById('warrantyStartDate').value = asset.warrantyStartDate;
        document.getElementById('warrantyEndDate').value = asset.warrantyEndDate;
        document.getElementById('issueDate').value = asset.issueDate;
        document.getElementById('employeeNo').value = asset.employeeNo; // Assuming this is also part of the asset data
        document.getElementById('employeeName').value = asset.employeeName; // Assuming this is also part of the asset data
        document.getElementById('userDepartment').value = asset.userDepartment; // Assuming this is also part of the asset data
        document.getElementById('userSection').value = asset.userSection; // Assuming this is also part of the asset data
        document.getElementById('building').value = asset.building; // Assuming this is also part of the asset data
    }
});

// Display error messages in the designated container
function displayError(message) {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    } else {
        console.error(message);
    }
}

