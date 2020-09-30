// Count the total bricks that were raised.
function countTotalBricks() {

    var database = firebase.database();
    var sumTotal = 0;
    var bronze, silver, gold;

    var array =[];
    // var flag = false;
    for (var i = 1; i <= 3; i++) { 
        
        // Find just the last child for each tier.
        database.ref(`Logistics/History/Pool${i}`).limitToLast(1).once('value').then(function (snapshot) {
            snapshot.forEach(function (child) {
                var bricksSpread = child.child("moneySpread").val();

                array.push(bricksSpread);
                console.log(array);
                sumTotal = sumTotal + bricksSpread;
                console.log("sumTotal" + sumTotal);
                $("#bricksTotal").html(sumTotal);
                
            });

            if(array.length!=0){
                console.log("in");
        
            var ctx = document.getElementById('totalBricksCanvas').getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'doughnut',
            
                // The data for our dataset
                data: {
                    labels: ['BRONZE', 'SILVER', 'GOLD'],
                    datasets: [{
                        label: 'People',
                        backgroundColor: ['#FA9F5B','#FF783C','#fa5700'],
                        borderColor: 'black',
                        data: array
                    }]
                },
            
                // Configuration options go here
                options: {
                    title:{
                        display:false,
                        text:'',
                        fontColor: 'white',
                        fontSize:30
            
                    },
                    legend:{
                        display:true,
                        position:'bottom',
                        
                    },
                }
            });
            
        
            }
        });
    }

    




}

