firebase.auth().onAuthStateChanged(function (user){
    if(user){

    var database = firebase.database();
    var userId = user.uid;
    database.ref('Logistics/History/Pool1').limitToLast(1).once('value').then(function(snapshot) {
    snapshot.forEach(function(child) {
    var numberMouktijies = child.child("numberMouktijies").val();
    var numberPeoplePayed = child.child("numberOfPeople").val();
         
    
    console.log("alo d"+numberMouktijies);

    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',

        // The data for our dataset
        data: {
            labels: ['No. of people who entered normally', 'No. of people who entered with a ticket'],
            datasets: [{
                label: 'People',
                backgroundColor: ['rgb(249, 87, 0)','blue','orange'],
                borderColor: 'black',
                data: [numberPeoplePayed,numberMouktijies]
            }]
        },

        // Configuration options go here
        options: {}
    });

    });
});
}});