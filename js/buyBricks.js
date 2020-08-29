$(".bricks").click(function(){
  $(".loader").show();
  var quantity = $(this).data('quantity');
  $.ajax({
    type: 'post',
    url: '/hoodProject/coinpayments/create_transaction.php',
    data: {quantity: quantity},
    success: function(resp){
      resp = JSON.parse(resp);
      if(resp.error == 'ok'){
        console.log(resp);
        var win = window.open(resp.result.checkout_url, '_blank');
        if (win) {
            //Browser has allowed it to be opened
            win.focus();
        } else {
            //Browser has blocked it
            alert('Please allow popups for this website');
        }
        setInterval(function(){ 
          $.ajax({
            type: 'post',
            url: '/hoodProject/coinpayments/get_transaction.php',
            data: {id: resp.result.txn_id},
            // data: {id: 'CPEH66KEDJA78BICZOUAMUVABS'},
            success: function(resp2){
              resp2 = JSON.parse(resp2);
              console.log(resp2);
              if(resp2.error == 'ok'){
                if(resp2.result.status >= 100 || resp2.result.status == 2){
                  firebase.auth().onAuthStateChanged(function (user){
                    if(user){
                      var database = firebase.database();
                      var userId = user.uid;

                  
                      //add bricks to logistics.
                      const addToLogistics = database.ref('Logistics/Bricks');
                      addToLogistics.child('bricksTotalBought').transaction(function(bricksTotalBought) {
                            return (bricksTotalBought|| 0) + quantity});


                      var ref = database.ref('/profiles/').child(userId).child("transactions").child(resp.result.txn_id);
                      ref.set({
                        bricks: quantity,
                        coin: resp2.result.coin,
                        payment_address: resp2.result.payment_address,
                        received: resp2.result.receivedf,
                        status: resp2.result.status_text,
                        time_completed: resp2.result.time_completed,
                        },function(error) {
                          if (error) {
                            console.log("Problem storing transaction details." + error);
                          } else{
                            console.log("Transaction saved successfully." + error);
                            // window.location.href = "loggedIn.html";
                          }
                        }
                      );
                      ref = database.ref('/profiles/').child(userId).child("currentBricks");
                      console.log(firebase.database.ServerValue);
                      ref.set(firebase.database.ServerValue.increment(quantity), function(error) {
                        if (error) {
                          alert("Problem Incrementing Bricks." + error);
                        } else{
                          alert("Bricks added successfully." + error);
                          window.location.href = "buyBricks.html";
                        }
                      });
                    }
                  });
                }
              }
            }
          });
        }, 3000);
      }
    }
  });
});

$('#test-transaction').click(function(){
  var quantity = 10;
  $.ajax({
    type: 'post',
    url: '/hoodProject/coinpayments/get_transaction.php',
    // data: {id: resp.result.txn_id},
    data: {id: 'CPEH66KEDJA78BICZOUAMUVABS'},
    success: function(resp2){
      resp2 = JSON.parse(resp2);
      console.log(resp2);
      console.log(resp2.result.status);
      if(resp2.error == 'ok'){
        if(resp2.result.status >= 100 || resp2.result.status == 2){
          firebase.auth().onAuthStateChanged(function (user){
            if(user){
              var database = firebase.database();
              var userId = user.uid;
              var ref = database.ref('/profiles/').child(userId).child("transactions").child('CPEH66KEDJA78BICZOUAMUVABT');
              ref.set({
                bricks: quantity,
                coin: resp2.result.coin,
                payment_address: resp2.result.payment_address,
                received: resp2.result.receivedf,
                status: resp2.result.status_text,
                time_completed: resp2.result.time_completed,
                },function(error) {
                  if (error) {
                    console.log("Problem storing wallet's details." + error);
                  } else{
                    console.log("Wallet saved successfully." + error);
                    // window.location.href = "loggedIn.html";
                  }
                }
              );
            }
          });
        }
      }
    }
  });
});