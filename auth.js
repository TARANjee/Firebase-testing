
//------------------------ Configuration-----------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
import { getDatabase, ref, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, FacebookAuthProvider, onAuthStateChanged, linkWithPopup, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-auth.js";

const registerBtn = document.querySelector('.registerBtn');
const signoutBtn = document.querySelector('#signout');
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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);


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

        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                update(ref(database, 'user/' + user.uid), {
                    last_login: Date.now()
                });

                alert('user is loggedin!!');
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

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                user = userCredential.user;

                set(ref(database, 'user/' + user.uid), {
                    username: username,
                    email: email,
                    userCreatedAt: Date.now(),
                    photoURL: defaultImgUrl
                });

                alert('user is created!!');
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
        signOut(auth)
            .then(() => {
                alert("signout successfully");

            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;

                alert(errorMessage)
            })
    });
}
const signWithGoogle = async () => {
    console.log("google")
    const previousUser = auth.currentUser;
    const provider = new GoogleAuthProvider(auth);
    // if (previousUser) {
    //     await linkWithPopup(previousUser, provider)
    //     .then((res) => {
    //         const secondAccountCred = res.user;

    //         console.log(secondAccountCred)

    //     }).catch((error) => {
    //         alert(error)
    //     })
    // } else {
    await signInWithPopup(auth, provider)
        .then((res) => {
            
            const data=res.user;
            set(ref(database, 'user/' +data.uid), {
                username: data.displayName,
                email: data.email,
                photoURL:data.photoURL
            });
        }).catch((error) => {
            alert(error)
        })
    // }
}
const signWithFb = async () => {
    console.log("fb")
    const previousUser = auth.currentUser;
    const provider = new FacebookAuthProvider(auth);
    // if (previousUser) {
    //     await linkWithPopup(previousUser, provider)
    //         .then((res) => {
    //             const secondAccountCred = res.user;

    //             console.log(secondAccountCred)

    //         }).catch((error) => {
    //             alert(error)
    //         })
    // } else {
    await signInWithPopup(auth, provider)
        .then((res) => {
            console.log(res.user)
            const data=res.user;
            set(ref(database, 'user/' + data.uid), {
                username: data.displayName,
                email:data.email,
                photoURL: data.photoURL
            });
        }).catch((error) => {
            alert(error)
        })
    // }
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

document.getElementById('account').onclick = async () => {

    await onAuthStateChanged(auth, (user) => {
        if (user) {

            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;

                const selectData = ref(database, 'user/' + uid);
                onValue(selectData, (snapshot) => {
                    const data = snapshot.val(); // data = all data on firebase
                    document.querySelector('#profilePic').src = data.photoURL?data.photoURL:defaultImgUrl
                    document.getElementById('username').innerHTML = data.username
                    document.getElementById('email').innerHTML = data.email

                })
            


            // ...
        } else {
            // User is signed out
            // ...
            document.getElementById('hide').style.display = 'block';
            document.getElementById('view').style.display = 'none';
            console.log("user is signout")
        }
    });
}

document.getElementById('logout').onclick = async () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        alert("logout successful")
        window.location.href = 'login.htm'
    }).catch((error) => {
        // An error happened.
        alert(error)
    });
}
document.getElementById('hide').style.display = 'none';


//------------------------ Delete Process -----------------------------

// document.getElementById('continue').onclick = () => {
//     Ready();
//     return remove(ref(database,'user/'+username));

// }

