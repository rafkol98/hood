//Sign out a user.
$(document).ready(function(e) {

    $(".nav_sign_out").one("click", function(e) {
        firebase.auth().signOut().then(function() {
            console.log('Signed Out');
          }, function(error) {
            console.error('Sign Out Error', error);
          });

    });

});



