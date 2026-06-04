// ==========================================
// 1. CLOCK & GREETING
// ==========================================
function updateClock() {
    const now = new Date();
    
    // Jam
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    
    // Tanggal
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
    
    // Greeting Otomatis
    let greeting = 'Good Evening';
    const hr = now.getHours();
    if (hr < 12) greeting = 'Good Morning';
    else if (hr < 18) greeting = 'Good Afternoon';
    
    document.getElementById('greetingText').childNodes[0].nodeValue = greeting + ', ';
}
setInterval(updateClock, 1000);
updateClock();

// ==========================================
// Challenge 1: Custom Name di Greeting (dengan auto-placeholder CSS)
// ==========================================
const userNameElement = document.getElementById('userName');
const savedName = localStorage.getItem('userName');

// Set nama dari Local Storage jika ada. 
// Jika tidak ada, biarkan string kosong ('') agar efek abu-abu dari CSS otomatis muncul.
if (savedName) {
    userNameElement.textContent = savedName;
} else {
    userNameElement.textContent = ''; 
}

// Simpan nama saat selesai mengetik (blur/klik di luar area teks)
userNameElement.addEventListener('blur', () => {
    const currentText = userNameElement.textContent.trim();
    
    if (currentText === '') {
        // Jika user menghapus semua teks, hapus dari storage. 
        // Elemen yang kosong akan otomatis memunculkan teks abu-abu lagi.
        localStorage.removeItem('userName');
        userNameElement.textContent = ''; 
    } else {
        // Simpan nama baru ke storage
        localStorage.setItem('userName', currentText);
    }
});

// ==========================================
// 2. THEME TOGGLE (Challenge 2)
// ==========================================
const themeBtn = document.getElementById('themeToggleBtn');
let isDark = localStorage.getItem('theme') === 'dark';

if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeBtn.textContent = '☀️ Mode Terang';
}

themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeBtn.textContent = '☀️ Mode Terang';
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeBtn.textContent = '🌙 Mode Gelap';
    }
});

// ==========================================
// 3. FOCUS TIMER (25 Menit)
// ==========================================
let timerInterval;
let timeLeft = 25 * 60;
const timerDisplay = document.getElementById('timerDisplay');

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
}

document.getElementById('startTimerBtn').addEventListener('click', () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("Waktu fokus 25 menit telah selesai!");
            }
        }, 1000);
    }
});

document.getElementById('stopTimerBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('resetTimerBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// ==========================================
// 4. TO-DO LIST (CRUD & Local Storage)
// ==========================================
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    todoList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');
        
        // Klik text untuk mark as done
        const span = document.createElement('span');
        span.textContent = task.text;
        span.style.cursor = 'pointer';
        span.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
        });

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        // Tombol Edit
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', () => {
            const newText = prompt("Edit task:", task.text);
            if (newText && newText.trim() !== '') {
                // Prevent Duplicate pada saat edit
                if(tasks.some((t, i) => t.text.toLowerCase() === newText.trim().toLowerCase() && i !== index)) {
                    alert("Task tersebut sudah ada!");
                    return;
                }
                tasks[index].text = newText.trim();
                saveTasks();
            }
        });

        // Tombol Delete
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'delete-btn';
        delBtn.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
        });

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);
        li.appendChild(span);
        li.appendChild(actions);
        todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    
    // Challenge 3: Prevent duplicate tasks
    if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
        alert("Task ini sudah ada di daftar!");
        return;
    }

    if (text) {
        tasks.push({ text, completed: false });
        todoInput.value = '';
        saveTasks();
    }
});
renderTasks();

// ==========================================
// 5. QUICK LINKS (Local Storage)
// ==========================================
const linkForm = document.getElementById('linkForm');
const linkNameInput = document.getElementById('linkNameInput');
const linkUrlInput = document.getElementById('linkUrlInput');
const linksContainer = document.getElementById('linksContainer');

// Data default jika kosong
let links = JSON.parse(localStorage.getItem('quickLinks')) || [
    { name: 'Google', url: 'https://google.com' },
    { name: 'GitHub', url: 'https://github.com' }
];

function saveLinks() {
    localStorage.setItem('quickLinks', JSON.stringify(links));
    renderLinks();
}

function renderLinks() {
    linksContainer.innerHTML = '';
    links.forEach((link, index) => {
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.name;
        a.className = 'quick-link';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        
        // Hapus link dengan klik kanan
        a.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if(confirm(`Hapus Quick Link "${link.name}"?`)) {
                links.splice(index, 1);
                saveLinks();
            }
        });

        linksContainer.appendChild(a);
    });
}

linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();
    
    // Pastikan URL valid
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    if (name && url) {
        links.push({ name, url });
        linkNameInput.value = '';
        linkUrlInput.value = '';
        saveLinks();
    }
});
renderLinks();