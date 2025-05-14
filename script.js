let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let complaints = JSON.parse(localStorage.getItem('complaints')) || [];

function showSection(id) {
  const sections = document.querySelectorAll('section');
  sections.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  clearMessages();
  if (id === 'dashboard') updateDashboard();
  if (id === 'profile') updateProfile();
}

function clearMessages() {
  ['loginError', 'registerError', 'complaintError', 'complaintSuccess'].forEach(id => {
    document.getElementById(id).innerText = '';
  });
}

function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  if (!email || !password) {
    document.getElementById('loginError').innerText = 'Email dan password wajib diisi.';
    return;
  }
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert('Login berhasil! Selamat datang, ' + user.name);
    showSection('dashboard');
  } else {
    document.getElementById('loginError').innerText = 'Email atau password salah.';
  }
}

function register() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const passwordConfirm = document.getElementById('regPasswordConfirm').value.trim();

  if (!name || !email || !password || !passwordConfirm) {
    document.getElementById('registerError').innerText = 'Semua kolom wajib diisi.';
    return;
  }
  if (password !== passwordConfirm) {
    document.getElementById('registerError').innerText = 'Password dan konfirmasi tidak sama.';
    return;
  }
  if (users.find(u => u.email === email)) {
    document.getElementById('registerError').innerText = 'Email sudah terdaftar.';
    return;
  }
  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registrasi berhasil! Silakan login.');
  showSection('login');
}

function updateDashboard() {
  if (!currentUser) {
    alert('Silakan login terlebih dahulu.');
    showSection('login');
    return;
  }
  const userComplaints = complaints.filter(c => c.email === currentUser.email);
  document.getElementById('totalComplaints').innerText = userComplaints.length;
  document.getElementById('processingComplaints').innerText = userComplaints.filter(c => c.status === 'Diproses').length;
  document.getElementById('completedComplaints').innerText = userComplaints.filter(c => c.status === 'Selesai').length;
  const listEl = document.getElementById('complaintList');
  listEl.innerHTML = '';
  userComplaints.slice(-3).reverse().forEach(c => {
    const div = document.createElement('div');
    div.classList.add('complaint-item');
    div.innerHTML = `
      <p><b>Kategori:</b> ${c.category}</p>
      <p><b>Lokasi:</b> ${c.location}</p>
      <p><b>Deskripsi:</b> ${c.description}</p>
      <p><b>Status:</b> ${c.status}</p>
    `;
    listEl.appendChild(div);
  });
}

function submitComplaint() {
  if (!currentUser) {
    alert('Silakan login terlebih dahulu.');
    showSection('login');
    return;
  }
  const category = document.getElementById('category').value;
  const location = document.getElementById('location').value.trim();
  const description = document.getElementById('description').value.trim();
  if (!category || !location || !description) {
    document.getElementById('complaintError').innerText = 'Semua kolom wajib diisi.';
    return;
  }
  const newComplaint = {
    id: Date.now(),
    email: currentUser.email,
    category,
    location,
    description,
    status: 'Diproses',
  };
  complaints.push(newComplaint);
  localStorage.setItem('complaints', JSON.stringify(complaints));
  document.getElementById('complaintSuccess').innerText = 'Pengaduan berhasil dikirim!';
  document.getElementById('category').value = '';
  document.getElementById('location').value = '';
  document.getElementById('description').value = '';
  updateDashboard();
}

function updateProfile() {
  if (!currentUser) {
    alert('Silakan login terlebih dahulu.');
    showSection('login');
    return;
  }
  document.getElementById('profileName').innerText = currentUser.name;
  document.getElementById('profileEmail').innerText = currentUser.email;
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  alert('Anda telah logout.');
  showSection('login');
}

// On page load, check if user already logged in
window.onload = () => {
  const savedUser = JSON.parse(localStorage.getItem('currentUser'));
  if (savedUser) {
    currentUser = savedUser;
    showSection('dashboard');
  }
};
