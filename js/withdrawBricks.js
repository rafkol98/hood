$("#btn_withdrawBricks").click(function(){
  $(".loader").show();
  var quantity = $('#enterAmountOfBricks').val();
  var available_quantity;
  var address;
  console.log(quantity);
  if(!quantity){
    alert('Please Enter Amount to withdraw!!');
    return;
  }
  // var userId = firebase.auth().currentUser.uid;
  firebase.auth().onAuthStateChanged(function (user){
    if(user){
      var userId = user.uid;
      firebase.database().ref('/profiles/').child(userId).once('value').then(function(snapshot) {
        // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        available_quantity = snapshot.val().currentBricks;
        address = snapshot.val().wallet.walletId;
        // console.log(snapshot.val().wallet.walletId);
        if(quantity > available_quantity){
          alert('Not enough bricks available!');
          return;
        }
        $.ajax({
          type: 'post',
          url: '/hoodProject/coinpayments/create_withdrawal.php',
          data: {address: address, amount: quantity},
          success: function(resp){
            resp = JSON.parse(resp);
            if(resp.error == 'ok'){
              console.log(resp);
              setInterval(function(){ 
                $.ajax({
                  type: 'post',
                  url: '/hoodProject/coinpayments/get_withdrawal.php',
                  data: {id: resp.result.id},
                  // data: {id: 'CWEH7TX3UGEFS5YIGMVAUBRSEO'},
                  success: function(resp2){
                    resp2 = JSON.parse(resp2);
                    console.log(resp2);
                    if(resp2.error == 'ok'){
                      if(resp2.result.status == -1){
                        alert("Withdrawal was cancelled!!");
                        window.location.href = "withdrawBricks.html";
                      } else if(resp2.result.status == 2) {
                        firebase.auth().onAuthStateChanged(function (user){
                          if(user){
                            var database = firebase.database();
                            var userId = user.uid;
                            var ref = database.ref('/profiles/').child(userId).child("currentBricks");
                            console.log(firebase.database.ServerValue);
                            ref.set(firebase.database.ServerValue.increment(-quantity), function(error) {
                              if (error) {
                                alert("Problem Withrdrawing Bricks." + error);
                              } else{
                                alert("Bricks withdrawn successfully.");
                                window.location.href = "withdrawBricks.html";
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
    }
  });
});

$("#btn_testWithdraw").click(function(){
  setInterval(function(){ 
    $.ajax({
      type: 'post',
      url: '/hoodProject/coinpayments/get_withdrawal.php',
      // data: {id: resp.result.id},
      data: {id: 'CWEH1Q261SFSJ6ZYT1OG6ZHXB6'},
      success: function(resp2){
        resp2 = JSON.parse(resp2);
        console.log(resp2);
        // if(resp2.error == 'ok'){
        //   if(resp2.result.status == -1){
        //     alert("Withdrawal was cancelled!!");
        //     window.location.href = "withdrawBricks.html";
        //   } else if(resp2.result.status == 2) {
        //     firebase.auth().onAuthStateChanged(function (user){
        //       if(user){
        //         var database = firebase.database();
        //         var userId = user.uid;
        //         var ref = database.ref('/profiles/').child(userId).child("currentBricks");
        //         console.log(firebase.database.ServerValue);
        //         ref.set(firebase.database.ServerValue.increment(-quantity), function(error) {
        //           if (error) {
        //             alert("Problem Withrdrawing Bricks." + error);
        //           } else{
        //             alert("Bricks withdrawn successfully.");
        //             window.location.href = "withdrawBricks.html";
        //           }
        //         });
        //       }
        //     });
        //   }
        // }
      }
    });
  }, 3000);
});