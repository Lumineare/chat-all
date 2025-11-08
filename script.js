// Ambil elemen DOM
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
    database.ref('messages').push(newMessage)
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
    database.ref('messages').push(newMessage)
      .then(() => console.log("Gambar berhasil dikirim"))
      .catch(e => console.error("Error mengirim gambar:", e));
  };
  reader.readAsDataURL(file);
}

// Fungsi untuk menampilkan pesan dari Firebase
database.ref('messages').on('value', (snapshot) => {
  messagesDiv.innerHTML = '';
  const data = snapshot.val();
  if (data) {
    Object.entries(data).forEach(([key, msg]) => {
      addMessageToDOM(msg);
    });
  }
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Fungsi untuk menambahkan pesan ke DOM
function addMessageToDOM(msg) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');
  msgDiv.classList.add(msg.sender === getUsername() ? 'sent' : 'received');

  // Tambahkan avatar dan nama pengirim di pesan
  const userInfo = document.createElement('div');
  userInfo.classList.add('user-info');

  const avatar = document.createElement('div');
  avatar.classList.add('avatar');
  avatar.textContent = msg.sender.charAt(0).toUpperCase();

  const nameSpan = document.createElement('span');
  nameSpan.textContent = msg.sender;

  userInfo.appendChild(avatar);
  userInfo.appendChild(nameSpan);

  if (msg.type === 'image') {
    const img = document.createElement('img');
    img.src = msg.content;
    msgDiv.appendChild(img);
  } else {
    msgDiv.textContent = msg.content;
  }

  // Tambahkan nama dan avatar sebelum isi pesan
  msgDiv.insertBefore(userInfo, msgDiv.firstChild);
  messagesDiv.appendChild(msgDiv);
}

// Fungsi untuk mendapatkan nama pengguna saat ini
function getUsername() {
  return usernameInput.value.trim() || 'Anonim';
}

// Tunggu DOM selesai dimuat
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
