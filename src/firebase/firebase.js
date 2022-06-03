const{ initializeApp} =require("firebase/app");
const { getAnalytics }= require("firebase/analytics");
const{ getStorage, uploadBytes, ref, getDownloadURL}= require("firebase/storage")
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqDRbXhnoCVAPwETw6pZVwY1gjbBgGYoY",
  authDomain: "prueba-408d2.firebaseapp.com",
  projectId: "prueba-408d2",
  storageBucket: "prueba-408d2.appspot.com",
  messagingSenderId: "939713514095",
  appId: "1:939713514095:web:a40987f108700af0eb9b9a",
  measurementId: "G-6DSZ4TXS62"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(analytics)
console.log(firebaseConfig)
const storage = getStorage(app)

// Initialize Firebase
module.exports = {storage, uploadBytes, ref, getDownloadURL}
