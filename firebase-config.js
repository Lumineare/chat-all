<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAuTnzeqL4MewumZLrsaKe3Mo4osmwnsoA",
    authDomain: "chat-89990.firebaseapp.com",
    projectId: "chat-89990",
    storageBucket: "chat-89990.firebasestorage.app",
    messagingSenderId: "169196104649",
    appId: "1:169196104649:web:677ded8a2bb6117f069618",
    measurementId: "G-81BR3WPV20"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>