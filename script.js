document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('date');
  const weekInput = document.getElementById('week');
  const form = document.getElementById('laserForm');

  dateInput.addEventListener('change', function() {
    const date = new Date(this.value);
    const weekNumber = getWeekNumber(date);
    weekInput.value = weekNumber;
  });

  function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Replace this URL with your Google Apps Script web app URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzbdqlUuMG_TYCuC3IYrY_rFq7mLIV6rdrH3fqzORM8lblEp1M7qgSyx86nNZUV_ouD/exec';

    fetch(scriptURL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      alert('Data submitted successfully');
      form.reset();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was an error submitting the data: ' + error.message);
    });
  });
});
