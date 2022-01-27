
//------------------------ Configuration-----------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
import { getDatabase, ref, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-auth.js";
const registerBtn = document.querySelector('.registerBtn');
const signoutBtn = document.querySelector('#signout');
const loginBtn = document.querySelector('.loginBtn');



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
const auth = getAuth(app)



//------------------------ Ready Data -----------------------------

let username, email, password;


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
                const user = userCredential.user;
                
                 set(ref(database, 'user/' + user.uid),{
                    username: username,
                    email: email
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

// document.getElementById('continue').onclick = () => {
//     Ready();
//     const selectData = ref(database, 'user/' + username);
//     onValue(selectData, (snapshot) => {
//         const data = snapshot.val(); // data = all data on firebase
//         document.getElementById('password').value = data.password;
//     })

// }

//------------------------ Update Process -----------------------------

// document.getElementById('continue').onclick = () => {

//     const postData = {
//         username: username,
//         password: ps,
//     };

//     //   Get a key for a new Post.
//     //   const newPostKey = push(child(ref(db), 'posts')).key;

//     // Write the new post's data simultaneously in the posts list and the user's post list.
//     const updates = {};
//     updates['user/' + username] = postData;

//     return update(ref(database), updates);
//     alert('updated')
// }

//------------------------ Delete Process -----------------------------

// document.getElementById('continue').onclick = () => {
//     Ready();
//     return remove(ref(database,'user/'+username));

// }

