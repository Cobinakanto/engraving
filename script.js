document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const weekInput = document.getElementById('week');

    if (dateInput && weekInput) {
        dateInput.addEventListener('change', function() {
            const date = new Date(this.value);
            const weekNumber = getWeekNumber(date);
            weekInput.value = weekNumber;
        });
    }

    const form = document.getElementById('productionForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            sendToGoogleSheets(data);
        });
    }
});

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

function sendToGoogleSheets(data) {
    fetch('https://script.google.com/macros/s/AKfycbzfijJ2gzT_QJN-5s1yog_baDCRx7jdRGsNMwruJwKnW3dZo9uIS0scaoHgu0BxX7DT/exec', {
        method: 'POST',
        mode: 'no-cors', // This line is important
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.type === 'opaque') {
            // With 'no-cors', we can't access the response content,
            // but if we reach here, it likely succeeded
            console.log('Data likely submitted successfully');
            alert('Data submitted successfully!');
        } else {
            throw new Error('Unexpected response type');
        }
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert('An error occurred while submitting the data: ' + error.message);
    });
}