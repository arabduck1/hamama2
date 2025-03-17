const firebaseConfig = {
  apiKey: "AIzaSyBWREQxXLOsjsA-dsDphtRaVCXRh4rzs64",
  authDomain: "hamama2.firebaseapp.com",
  projectId: "hamama2",
  storageBucket: "hamama2.firebasestorage.app",
  messagingSenderId: "416551484899",
  appId: "1:416551484899:web:31be7a1064079f1e79f4d6"
};
  const app = firebase.initializeApp(firebaseConfig);
//יצירת אובייקט למשתמש בית יצירת משתמש
  function createuser(uid,email,name,age){
    this.uid = uid
    this.email = email
    this.name = name
    this.age = age
  }



//-------------------------------------פונקציית הרשמות משתמש----------------------------------------------------
function signup(){

    email = document.getElementById("emailsignup").value
    password = document.getElementById("passwordsignup").value
    name = document.getElementById("name").value
    age = document.getElementById("agesignup").value
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    console.log(user.uid);
    tempuser = new createuser(user.uid,email,name,age)
    console.log(tempuser)
    firebase.database().ref("users/"+user.uid).set(tempuser)
    email = document.getElementById("emailsignup").value = ''
    password = document.getElementById("passwordsignup").value = ''
    name = document.getElementById("name").value = ''
    age = document.getElementById("agesignup").value = ''
    
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
  });
}
//---------------------------------------------פונקציית התחברות משתמש------------------------------------------
function login() {
  email = document.getElementById("emailsignin").value;
  password = document.getElementById("passwordsignin").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
     
      var user = userCredential.user;
      console.log(user.uid);
      document.getElementById("datapage").innerHTML = `<a class="nav-link" href="data.html">שליטה בחממה</a>`;


      
      firebase.database().ref("users/" + user.uid).once("value")
        .then((snapshot) => {
          const userData = snapshot.val();
          const userName = userData.name;

          document.getElementById("nounce").textContent = "signed in";
          document.getElementById("nounce").style.display = "block";
          email = document.getElementById("emailsignin").value = '';
          password = document.getElementById("passwordsignin").value = '';
          
          
          document.getElementById("hellouser").innerHTML = `

              <p class="text-center fw-bold fs-3">HELLO ${userName}!</p>`;
            document.getElementById("userPanel").style.display = "block";

        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      document.getElementById("nounce").textContent = "wrong password";
      document.getElementById("nounce").style.display = "block";
    });
  }



  //---------------------------------------הצגת שם המשתמש במסך-----------------------------------
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var uid = user.uid;
      firebase.database().ref("users/" + user.uid).once("value")
      .then((snapshot) => {
        const userData = snapshot.val();
        const userName = userData.name;
        document.getElementById("hellouser").innerHTML = `
    
        <p class="text-center fw-bold fs-3">HELLO ${userName}!</p>`;
      document.getElementById("userPanel").style.display = "block";
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
      // ...
    } else {
      // User is signed out
      // ...
    }
  });


//-------------------------פונקציה להתנתקות של משתמש-------------------------------------------------
function logout() {
  firebase.auth().signOut()
    .then(() => {
      console.log("User signed out");

      // Update UI to hide user panel and show login/signup forms
      document.getElementById("nounce").textContent = "You have logged out.";
      document.getElementById("nounce").style.display = "block";
      document.getElementById("userPanel").style.display = "none";
      document.getElementById("hellouser").innerHTML = ` `
      document.getElementById("datapage").innerHTML = ` `;

    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}





//--------------------------databaseשמירת ערכי טמפ׳ לחות ואור ב ----------------------------------------------

function tempsave(){
  tempTX=document.getElementById("tempTX").value
  tempTX=parseInt(tempTX,10)
  toTX=tempTX.toString(2).split('').map(digit => parseInt(digit, 10));
  toTX.unshift(0,0);
  toTX=parseInt(toTX.join(''), 2);
  console.log(toTX)
  firebase.database().ref("RX/RX").set(toTX)

}
function datasave(){
  let humidTX = document.getElementById("humidTX").value;
  humidTX = parseInt(humidTX, 10);
  let binaryString = humidTX.toString(2).padStart(6, '0');
  let finalBinary = "01" + binaryString;
  let toTX = parseInt(finalBinary, 2);
  console.log(toTX);
  firebase.database().ref("RX/RX").set(toTX);
}
function lightsave(){
  let lightTX = document.getElementById("lightTX").value;
  lightTX = parseInt(lightTX, 10);
  let binaryString = lightTX.toString(2).padStart(6, '0');
  let finalBinary = "10" + binaryString;
  let toTX = parseInt(finalBinary, 2);
  console.log(toTX);
  firebase.database().ref("RX/RX").set(toTX);
}







var starCountRef = firebase.database().ref('RX/TX/A');
starCountRef.on('value', (snapshot) => {
  const data = snapshot.val();
  //updateStarCount(postElement, data);
  document.getElementById("lightreal").textContent = data
});

var starCountRef = firebase.database().ref('RX/data/temp');
starCountRef.on('value', (snapshot) => {
  const data = snapshot.val();
  //updateStarCount(postElement, data);
  document.getElementById("tempreal").textContent = data
});

var starCountRef = firebase.database().ref('RX/TX/C');
starCountRef.on('value', (snapshot) => {
  const data = snapshot.val();
  //updateStarCount(postElement, data);
  document.getElementById("humidreal").textContent = data
});




//--------------------------------בדיקה האם המשתמש מחובר אם לא מעבר לדף בית-----------------------------------
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      // If the user is not signed in, redirect to the login page
      window.location.href = "index.html";
    } else {
      console.log("User signed in:", user.email);
    }
  });




let imagetemp = document.getElementById("tempimage")

var starCountRef = firebase.database().ref('RX/TX/A');
starCountRef.on('value', (snapshot) => {
  const data = snapshot.val();
  //updateStarCount(postElement, data);
  document.getElementById("lightreal").textContent = data
});

var starCountRef = firebase.database().ref('RX/data/temp');
starCountRef.on('value', (snapshot) => {
  const data = snapshot.val();
  //updateStarCount(postElement, data);
  document.getElementById("tempreal").textContent = data
  addTemperature(data)
  if (data<10)
    imagetemp.src = "https://media.istockphoto.com/id/868098786/photo/thermometer-on-snow-shows-low-temperatures-zero-low-temperatures-in-degrees-celsius-and.jpg?s=612x612&w=0&k=20&c=jOZH4RSlX29thO6GNlvTUlYKUo_DK4xVxvXUTK7Jw5s="
  else
  if(data>=10 && data<30)
    imagetemp.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ9JVDQs141j2sE7dFCYfLFMyuVAPcuQIMMw&s"
  else
  imagetemp.src = "https://t4.ftcdn.net/jpg/05/18/43/73/360_F_518437397_j4c3cOSYK54AjCis5muIjPaHw2KBTCeH.jpg"
});

var starCountRef = firebase.database().ref('RX/TX/C');
starCountRef.on('value', (snapshot) => {
  const data = snapshot.val();
  //updateStarCount(postElement, data);
  document.getElementById("humidreal").textContent = data
});




const ctx = document.getElementById('tempChart').getContext('2d');
const tempData = [];
const labels = [];

const tempChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Temperature (°C)',
            data: tempData,
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            fill: true,
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'Temperature (°C)' } }
        }
    }
});


const ctx1 = document.getElementById('lightChart').getContext('2d');
const lightData = [];
const labels1 = [];

const lightChart = new Chart(ctx1, {
    type: 'line',
    data: {
        labels: labels1,
        datasets: [{
            label: 'light',
            data: lightData,
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            fill: true,
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'light' } }
        }
    }
});


const ctx2 = document.getElementById('humidChart').getContext('2d');
const humidData = [];
const labels2 = [];

const humidChart = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: labels2,
        datasets: [{
            label: 'light',
            data: humidData,
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            fill: true,
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'light' } }
        }
    }
});




function addTemperature(temp) {
    const now = new Date().toLocaleTimeString();
    labels.push(now);
    tempData.push(temp);
    if (labels.length > 10) { labels.shift(); tempData.shift(); }
    tempChart.update();
}











  