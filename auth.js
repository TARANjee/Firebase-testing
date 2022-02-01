const registerBtn = document.querySelector('.registerBtn');
const signoutBtn = document.querySelector('#logout');
const loginBtn = document.querySelector('.loginBtn');
const googlebtn = document.querySelector('.googlebtn');
const fbBtn = document.querySelector('.fbBtn');
const defaultImgUrl = 'https://e7.pngegg.com/pngimages/1004/160/png-clipart-computer-icons-user-profile-social-web-others-blue-social-media.png';

var firebaseConfig = {
    apiKey: "AIzaSyAwpnVWqOQAokv3744opPkzi8P6XR6tG9w",
    authDomain: "fir-js-a96db.firebaseapp.com",
    databaseURL: "https://fir-js-a96db-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fir-js-a96db",
    storageBucket: "fir-js-a96db.appspot.com",
    messagingSenderId: "180362462228",
    appId: "1:180362462228:web:baca763a3c45b393a11301"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();



//------------------------ Ready Data -----------------------------

let username, email, password;
let user = {};

//------------------------ Insert Data In Firebase -----------------------------
if (loginBtn !== null) {
    loginBtn.addEventListener('click', async function () {

        email = document.getElementById('email').value;
        password = document.getElementById('password').value;

        if (validate_email(email) || validate_password(password) === false) {
            alert("email and password is Outta  Line !!")
            return;
        }

        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                // update(ref(database, 'user/' + user.uid), {
                //     last_login: Date.now()
                // });
                return firebase.database().ref('users/' + user.uid).update({
                    last_login: Date.now()
                });


            })
            .then(() => {
                alert('user is loggedin!!'); // avoid alert, it blocks user input!
                // update a div with an information message instead

                location.href = "index.htm";
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;

                alert(errorMessage)
            });
    });
}
if (registerBtn !== null) {
    registerBtn.addEventListener('click', async (e) => {

        email = document.getElementById('email').value;
        username = document.getElementById('username').value;
        password = document.getElementById('password').value;
        if (validate_email(email) || validate_password(password) === false) {
            alert("email and password is Outta  Line !!")
            return;
        }
        if (validate_field(username) === false) {
            alert("username is Outta  Line !!")
            return;
        }

        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                user = userCredential.user;
                return firebase.database().ref('users/' + user.uid).set({
                    username: username,
                    email: email,
                    profile_picture: defaultImgUrl,
                    userCreatedAt: Date.now()
                });

            }).then(() => {
                alert('User Created'); // avoid alert, it blocks user input!
                // update a div with an information message instead

                location.href = "index.htm";
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;

                alert(errorMessage)
            })

    });
}

if (signoutBtn !== null) {
    signoutBtn.addEventListener('click', (e) => {
        firebase.auth().signOut()
            .then(() => {
                alert('User logout'); // avoid alert, it blocks user input!
                // update a div with an information message instead

                location.href = "login.htm";
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;

                alert(errorMessage)
            })
    });
}


const signWithGoogle = async () => {


    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
        .signInWithPopup(provider)
        .then(async (result) => {

            var user = result.user;
            console.log(user)

            return firebase.database().ref('users/' + user.uid).set({
                username: user.displayName,
                email: user.email,
                profile_picture: user.photoURL,
                userCreatedAt: Date.now()

            });

        }).then(() => {
            alert('User Created'); // avoid alert, it blocks user input!
            // update a div with an information message instead

            location.href = "index.htm";
        })
        .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            alert(errorMessage)
        });

}


const signWithFb = async () => {
    console.log("fb")
    var provider = new firebase.auth.FacebookAuthProvider();

    await firebase.auth().signInWithPopup(provider)
        .then((res) => {
            console.log(res.user)
            const user = res.user;
           
            return firebase.database().ref('users/' + user.uid).set({
                username: user.displayName,
                email: user.email,
                profile_picture: user.photoURL,
                userCreatedAt: Date.now()

            });
            
        }).then(() => {
            alert('User Created'); // avoid alert, it blocks user input!
            // update a div with an information message instead

            location.href = "index.htm";
        })
        .catch((error) => {
            alert(error)
        })

}
if (googlebtn !== null)
    googlebtn.addEventListener('click', signWithGoogle);
if (fbBtn !== null)
    fbBtn.addEventListener('click', signWithFb);




// Validation
function validate_email(email) {
    const regex = "/^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/";
    const mail = String(email).toLowerCase()
    if (mail.match(regex))
        return true;
    else
        return false;

}
function validate_password(pass) {
    if (pass <= 6)
        return false;
    else
        return true;

}
function validate_field(field) {
    if (field === null)
        return false;
    if (field.length <= 0)
        return false;
    else
        return true

}



//------------------------ Select Process -----------------------------

document.getElementById('account').onclick = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
        
            const uid = user.uid;
            var Data = firebase.database().ref('users/' + uid);
            Data.on('value', (snapshot) => {
                const data = snapshot.val();
                console.log(data)
                document.querySelector('#profilePic').src = data.profile_picture
                document.getElementById('username').innerHTML = data.username
                document.getElementById('email').innerHTML = data.email
            });
            // if (user.providerData[0] === 'google.com' || user.providerData[0] === 'google.com') {


            //     document.querySelector('#profilePic').src = user.photoURL
            //     document.getElementById('username').innerHTML = user.displayName
            //     document.getElementById('email').innerHTML = user.email
            // }
        }
        else {
            // User is signed out
            // ...
            document.getElementById('hide').style.display = 'block';
            document.getElementById('view').style.display = 'none';
            console.log("user is signout")
        }
    });
}
document.getElementById('hide').style.display = 'none';


//------------------------ Delete Process -----------------------------

// document.getElementById('continue').onclick = () => {
//     Ready();
//     return remove(ref(database,'user/'+username));

// }

