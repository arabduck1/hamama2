
window.addEventListener('load', pull);
  function pull(){
  firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        var starCountRef = firebase.database().ref('users/' + uid+ '/datatouart');
        starCountRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(data)
  });
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
}