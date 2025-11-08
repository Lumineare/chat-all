const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesDiv = document.getElementById('messages');
const usernameInput = document.getElementById('usernameInput');
const imageInput = document.getElementById('imageInput');
const uploadImageBtn = document.getElementById('uploadImageBtn');

const messagesRef = firebase.database().ref('messages');

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
    messagesRef.push(newMessage);
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
    messagesRef.push(newMessage);
  };
  reader.readAsDataURL(file);
}

// Fungsi untuk menampilkan pesan dari Firebase
messagesRef.on('child_added', (snapshot) => {
  const msg = snapshot.val();
  addMessageToDOM(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
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

// Event listener
sendBtn.addEventListener('click', sendMessage);
uploadImageBtn.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', sendImage);

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});