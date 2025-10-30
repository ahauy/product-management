const ctx1 = document.getElementById('myChart1');

  new Chart(ctx1, {
    type: 'polarArea',
    data: {
      labels: ['Facebook', 'TikTok', 'Youtube'],
      datasets: [{
        label: '# of Votes',
        data: [600, 800, 1000],
        backgroundColor: [
          "rgba(54, 162, 235, 2)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 106, 86, 1)"
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const ctx2 = document.getElementById('myChart2');

  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['Facebook', 'TikTok', 'Youtube'],
      datasets: [{
        label: '# of Votes',
        data: [600, 800, 1000],
        backgroundColor: [
          "rgba(54, 162, 235, 2)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 106, 86, 1)"
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
      y: {
        beginAtZero: true
      }
    }
    }
  });
