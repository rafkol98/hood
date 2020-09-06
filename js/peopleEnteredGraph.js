function peopleEnteredCall(num) { // Graph that plots how many people entered the last 10 mins.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            var database = firebase.database();
            var userId = user.uid;
            database.ref('Graphs/Pool' + num).once('value').then(function (snapshot) {

                var chartTitles = [];
                var chartData = [];

                snapshot.forEach(function (child) {
                    var timestamp = Number(child.key);
                    var date = new Date(timestamp);
                    var peopleEntered = child.val();


                    // add the total players and date to arrays.
                    chartTitles.push(date);
                    chartData.push(peopleEntered);
                });


                var comparePlayers = document.getElementById('peopleEntered10').getContext('2d');
                var chart = new Chart(comparePlayers, { // The type of chart we want to create
                    type: 'line',

                    // The data for our dataset
                    data: {
                        labels: chartTitles,
                        datasets: [
                            {
                                label: 'People Joined 5 Last Minutes',
                                backgroundColor: ['rgb(249, 87, 0)'],
                                borderColor: 'black',
                                data: chartData
                            }
                        ]
                    },

                    // Configuration options go here
                    options: {
                        title: {
                            display: true,
                            text: 'TRAFFIC INDICATOR CHART',
                            fontColor: 'white',
                            fontSize: 20

                        },
                        legend: {
                            display: false,
                            position: 'bottom',
                            labels: {
                                fontColor: '#fff'
                            }
                        },

                        scales: {
                            xAxes: [
                                {
                                    ticks: {
                                        display: false // this will remove only the label
                                    }
                                }
                            ],

                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });

            });
        }
    });
}
