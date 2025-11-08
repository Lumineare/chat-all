// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuTnzeqL4MewumZLrsaKe3Mo4osmwnsoA",
  authDomain: "chat-89990.firebaseapp.com",
  projectId: "chat-89990",
  storageBucket: "chat-89990.firebasestorage.app",
  messagingSenderId: "169196104649",
  appId: "1:169196104649:web:677ded8a2bb6117f069618",
  measurementId: "G-81BR3WPV20"
};

// Initialize Firebase app and database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messagesRef = ref(database, 'messages');

let messageInput, sendBtn, messagesDiv, usernameInput, imageInput, uploadImageBtn;

// Function to send text message
function sendMessage() {
  console.log("Fungsi sendMessage dipanggil");
  const text = messageInput.value.trim();
  if (text) {
    console.log("Mengirim pesan:", text);
    const newMessage = {
      content: text,
      type: 'text',
      sender: getUsername(),
      timestamp: Date.now()
    };
    push(messagesRef, newMessage)
      .then(() => console.log("Pesan berhasil dikirim"))
      .catch(e => console.error("Error mengirim pesan:", e));
    messageInput.value = '';
  } else {
    console.log("Input kosong, tidak mengirim.");
  }
}

// Function to send image
function sendImage() {
  console.log("Fungsi sendImage dipanggil");
  const file = imageInput.files[0];
  if (!file) {
    console.log("Tidak ada file yang dipilih");
    return;
  }

  console.log("Mengirim gambar:", file.name);
  const reader = new FileReader();
  reader.onload = function(e) {
    const newMessage = {
      content: e.target.result,
      type: 'image',
      sender: getUsername(),
      timestamp: Date.now()
    };
    push(messagesRef, newMessage)
      .then(() => console.log("Gambar berhasil dikirim"))
      .catch(e => console.error("Error mengirim gambar:", e));
  };
  reader.readAsDataURL(file);
}

// Function to display messages from Firebase
onValue(messagesRef, (snapshot) => {
  console.log("Menerima data dari Firebase:", snapshot.val());
  messagesDiv.innerHTML = '';
  const data = snapshot.val();
  if (data) {
    Object.entries(data).forEach(([key, msg]) => {
      addMessageToDOM(msg);
    });
  }
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}, {
  onlyOnce: false
});

// Function to add message to DOM
function addMessageToDOM(msg) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');
  msgDiv.classList.add(msg.sender === getUsername() ? 'sent' : 'received');

  if (msg.type === 'image') {
    const img = document.createElement('img');
    img.src = msg.content;
    msgDiv.appendChild(img);
  } else {
    msgDiv.textContent = `${msg.sender}: ${msg.content}`;
  }

  messagesDiv.appendChild(msgDiv);
}

// Function to get current username
function getUsername() {
  return usernameInput.value.trim() || 'Anonim';
}

// Wait for DOM to load before accessing elements
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM selesai dimuat");

  messageInput = document.getElementById('messageInput');
  sendBtn = document.getElementById('sendBtn');
  messagesDiv = document.getElementById('messages');
  usernameInput = document.getElementById('usernameInput');
  imageInput = document.getElementById('imageInput');
  uploadImageBtn = document.getElementById('uploadImageBtn');

  if (!messageInput || !sendBtn || !messagesDiv || !usernameInput || !imageInput || !uploadImageBtn) {
    console.error("Salah satu elemen DOM tidak ditemukan!");
    return;
  }

  console.log("Semua elemen DOM ditemukan");

  // Attach event listeners
  sendBtn.addEventListener('click', sendMessage);
  uploadImageBtn.addEventListener('click', () => {
    console.log("Tombol upload gambar diklik");
    imageInput.click();
  });
  imageInput.addEventListener('change', sendImage);

  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      console.log("Tombol Enter ditekan");
      sendMessage();
    }
  });

  console.log("Event listener berhasil dipasang");
});
