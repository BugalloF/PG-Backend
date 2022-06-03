const{ initializeApp} =require("firebase/app");
const{ getStorage, uploadBytes, ref, getDownloadURL}= require("firebase/storage")
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = { 
  apiKey : "AIzaSyDqDRbXhnoCVAPwETw6pZVwY1gjbBgGYoY" , 
  authDomain : "prueba-408d2.firebaseapp.com" , 
  IDdelproyecto : "prueba-408d2" , 
  StorageBucket : "prueba-408d2.appspot.com" , 
  mensajeríaSenderId : "939713514095" , 
  IDdeaplicación : "1:939713514095:web:a40987f108700af0eb9b9a" , 
  IDdemedición : "G-6DSZ4TXS62" 
}; 
// const firebaseConfig = {

//   apiKey: "AIzaSyD6SlIY838LFqMVEnJkWb8ny3KxtqhzobU",

//   authDomain: "upload-66659.firebaseapp.com",

//   projectId: "upload-66659",

//   storageBucket: "upload-66659.appspot.com",

//   messagingSenderId: "782687491283",

//   appId: "1:782687491283:web:9cde9bd52372d6242af026"

// };
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

// Initialize Firebase
module.exports = {storage,uploadBytes,ref, getDownloadURL}
// const analytics = getAnalytics(app);