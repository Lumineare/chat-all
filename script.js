import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// Konfigurasi Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyAuTnzeqL4MewumZLrsaKe3Mo4osmwnsoA",
  authDomain: "chat-89990.firebaseapp.com",
  projectId: "chat-89990",
  storageBucket: "chat-89990.firebasestorage.app",
  messagingSenderId: "169196104649",
  appId: "1:169196104649:web:677ded8a2bb6117f069618",
  measurementId: "G-81BR3WPV20"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Referensi ke node 'messages' di database
const messagesRef = ref(database, 'messages');

let messageInput, sendBtn, messagesDiv, usernameInput, imageInput, uploadImageBtn;

// Fungsi untuk mengirim pesan teks
function sendMessage() {
  const text = messageInput.value.trim();
  if (text) {
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
  }
}

// Fungsi untuk mengirim foto
function sendImage() {
  const file = imageInput.files[0];
  if (!file) return;

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

// Fungsi untuk menampilkan pesan dari Firebase
onValue(messagesRef, (snapshot) => {
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

// Fungsi untuk menambahkan pesan ke DOM
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

// Fungsi untuk mendapatkan nama pengguna saat ini
function getUsername() {
  return usernameInput.value.trim() || 'Anonim';
}

// Tunggu DOM selesai dimuat sebelum mengakses elemen
document.addEventListener('DOMContentLoaded', () => {
  messageInput = document.getElementById('messageInput');
  sendBtn = document.getElementById('sendBtn');
  messagesDiv = document.getElementById('messages');
  usernameInput = document.getElementById('usernameInput');
  imageInput = document.getElementById('imageInput');
  uploadImageBtn = document.getElementById('uploadImageBtn');

  // Event listener
  sendBtn.addEventListener('click', sendMessage);
  uploadImageBtn.addEventListener('click', () => imageInput.click());
  imageInput.addEventListener('change', sendImage);

  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
});
