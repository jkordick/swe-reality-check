// Win95 Express App - Frontend JavaScript

// API Base URL - adjust based on environment
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? '' 
  : ''; // For static deployment, we'll use mock data

// Mock mode for GitHub Pages (static deployment)
const MOCK_MODE = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');

// Mock data storage (for GitHub Pages demo)
let mockOrders = [
  { id: 'ORD-1001', userId: 'USR-1001', product: 'Microsoft Windows 95', quantity: 3, status: 'delivered', createdAt: '2026-01-15' },
  { id: 'ORD-1002', userId: 'USR-1001', product: 'Mechanical Keyboard', quantity: 1, status: 'shipped', createdAt: '2026-02-01' },
  { id: 'ORD-1003', userId: 'USR-1002', product: 'USB-C Hub', quantity: 2, status: 'processing', createdAt: '2026-02-05' },
  { id: 'ORD-1004', userId: 'USR-1003', product: '4K Monitor', quantity: 1, status: 'pending', createdAt: '2026-02-08' },
  { id: 'ORD-1005', userId: 'USR-1002', product: 'Wireless Mouse', quantity: 5, status: 'pending', createdAt: '2026-02-09' },
];

let mockUsers = [
  { id: 'USR-1001', name: 'Ada Lovelace', email: 'ada@computing.org', createdAt: '2026-01-01' },
  { id: 'USR-1002', name: 'Grace Hopper', email: 'grace@navy.mil', createdAt: '2026-01-10' },
  { id: 'USR-1003', name: 'Margaret Hamilton', email: 'margaret@nasa.gov', createdAt: '2026-01-20' },
  { id: 'USR-1004', name: 'Katherine Johnson', email: 'katherine@nasa.gov', createdAt: '2026-02-01' },
  { id: 'USR-1005', name: 'Hedy Lamarr', email: 'hedy@invention.org', createdAt: '2026-02-05' },
];

// Cache for users (used in order forms)
let usersCache = [];

// Window management
let highestZ = 100;
let draggedWindow = null;
let dragOffset = { x: 0, y: 0 };

// Clock
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// Start Menu
function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  menu.classList.toggle('visible');
}

// Close start menu when clicking elsewhere
document.addEventListener('click', (e) => {
  const startMenu = document.getElementById('start-menu');
  const startButton = document.querySelector('.start-button');
  if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
    startMenu.classList.remove('visible');
  }
});

// Window Management
function openWindow(name) {
  const win = document.getElementById(`window-${name}`);
  if (win) {
    win.style.display = 'flex';
    bringToFront(win);
    updateTaskbar();
    
    // Load data when opening windows
    if (name === 'orders') refreshOrders();
    if (name === 'users') refreshUsers();
  }
  document.getElementById('start-menu').classList.remove('visible');
}

function closeWindow(name) {
  const win = document.getElementById(`window-${name}`);
  if (win) {
    win.style.display = 'none';
    win.classList.remove('maximized');
    updateTaskbar();
  }
}

function minimizeWindow(name) {
  const win = document.getElementById(`window-${name}`);
  if (win) {
    win.style.display = 'none';
    updateTaskbar();
  }
}

function maximizeWindow(name) {
  const win = document.getElementById(`window-${name}`);
  if (win) {
    win.classList.toggle('maximized');
  }
}

function bringToFront(win) {
  highestZ++;
  win.style.zIndex = highestZ;
}

// Taskbar
function updateTaskbar() {
  const taskbarApps = document.getElementById('taskbar-apps');
  taskbarApps.innerHTML = '';
  
  const windows = document.querySelectorAll('.window');
  windows.forEach(win => {
    if (win.style.display !== 'none') {
      const name = win.id.replace('window-', '');
      const title = win.querySelector('.window-title span').textContent;
      const btn = document.createElement('button');
      btn.className = 'taskbar-app';
      btn.textContent = title;
      btn.onclick = () => {
        if (win.style.display === 'none') {
          win.style.display = 'flex';
        }
        bringToFront(win);
      };
      taskbarApps.appendChild(btn);
    }
  });
}

// Window Dragging
function startDrag(e, windowId) {
  const win = document.getElementById(windowId);
  if (win.classList.contains('maximized')) return;
  
  draggedWindow = win;
  bringToFront(win);
  
  const rect = win.getBoundingClientRect();
  dragOffset.x = e.clientX - rect.left;
  dragOffset.y = e.clientY - rect.top;
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
  e.preventDefault();
}

function drag(e) {
  if (!draggedWindow) return;
  
  let newX = e.clientX - dragOffset.x;
  let newY = e.clientY - dragOffset.y;
  
  // Keep window in bounds
  newX = Math.max(0, Math.min(newX, window.innerWidth - 100));
  newY = Math.max(0, Math.min(newY, window.innerHeight - 100));
  
  draggedWindow.style.left = newX + 'px';
  draggedWindow.style.top = newY + 'px';
}

function stopDrag() {
  draggedWindow = null;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
}

// API Functions (with mock fallback)
async function apiCall(method, endpoint, data = null) {
  if (MOCK_MODE) {
    return mockApiCall(method, endpoint, data);
  }
  
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { error: error.message };
  }
}

// Mock API for static deployment
function mockApiCall(method, endpoint, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Health
      if (endpoint === '/api/health') {
        resolve({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: Math.floor(Math.random() * 10000),
          note: 'Running in demo mode (GitHub Pages)'
        });
        return;
      }
      
      // Orders
      if (endpoint === '/api/orders') {
        if (method === 'GET') {
          resolve({ orders: mockOrders });
        } else if (method === 'POST') {
          const order = {
            id: `ORD-${Date.now()}`,
            ...data,
            createdAt: new Date().toISOString()
          };
          mockOrders.push(order);
          resolve({ order });
        }
        return;
      }
      
      if (endpoint.startsWith('/api/orders/')) {
        const id = endpoint.split('/').pop();
        const index = mockOrders.findIndex(o => o.id === id);
        
        if (method === 'DELETE') {
          if (index !== -1) {
            mockOrders.splice(index, 1);
            resolve({ message: 'Deleted' });
          } else {
            resolve({ error: 'Not found' });
          }
        }
        return;
      }
      
      // Users
      if (endpoint === '/api/users') {
        if (method === 'GET') {
          resolve({ users: mockUsers });
        } else if (method === 'POST') {
          const user = {
            id: `USR-${Date.now()}`,
            ...data,
            createdAt: new Date().toISOString()
          };
          mockUsers.push(user);
          resolve({ user });
        }
        return;
      }
      
      if (endpoint.startsWith('/api/users/')) {
        const id = endpoint.split('/').pop();
        const index = mockUsers.findIndex(u => u.id === id);
        
        if (method === 'DELETE') {
          if (index !== -1) {
            mockUsers.splice(index, 1);
            resolve({ message: 'Deleted' });
          } else {
            resolve({ error: 'Not found' });
          }
        }
        return;
      }
      
      resolve({ error: 'Unknown endpoint' });
    }, 200);
  });
}

// Orders Functions
async function refreshOrders() {
  const statusEl = document.getElementById('orders-status');
  statusEl.textContent = 'Loading orders...';
  
  // Also refresh users cache for display
  const usersResult = await apiCall('GET', '/api/users');
  if (usersResult.users) {
    usersCache = usersResult.users;
  }
  
  const result = await apiCall('GET', '/api/orders');
  const tbody = document.getElementById('orders-table-body');
  
  if (result.orders && result.orders.length > 0) {
    tbody.innerHTML = result.orders.map(order => {
      const user = usersCache.find(u => u.id === order.userId);
      const userName = user ? user.name : order.userId || 'Unknown';
      return `
      <tr>
        <td>${order.id}</td>
        <td>${userName}</td>
        <td>${order.product}</td>
        <td>${order.quantity}</td>
        <td><span class="status-${order.status}">${order.status}</span></td>
        <td>
          <button class="action-btn" onclick="deleteOrder('${order.id}')">🗑️</button>
        </td>
      </tr>
    `;
    }).join('');
    statusEl.textContent = `${result.orders.length} order(s)`;
  } else {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-message">No orders found. Click "New Order" to create one.</td></tr>';
    statusEl.textContent = 'No orders';
  }
}

async function showNewOrderForm() {
  // Populate user dropdown
  const userSelect = document.getElementById('order-user');
  if (usersCache.length === 0) {
    const result = await apiCall('GET', '/api/users');
    if (result.users) {
      usersCache = result.users;
    }
  }
  userSelect.innerHTML = '<option value="">-- Select User --</option>' + 
    usersCache.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
  
  document.getElementById('order-form').style.display = 'block';
}

function hideNewOrderForm() {
  document.getElementById('order-form').style.display = 'none';
  document.getElementById('order-user').value = '';
  document.getElementById('order-product').value = '';
  document.getElementById('order-quantity').value = '1';
  document.getElementById('order-status').value = 'pending';
}

async function createOrder() {
  const userId = document.getElementById('order-user').value;
  const product = document.getElementById('order-product').value;
  const quantity = document.getElementById('order-quantity').value;
  const status = document.getElementById('order-status').value;
  
  if (!userId || !product || !quantity) {
    alert('Please fill in all fields');
    return;
  }
  
  const statusEl = document.getElementById('orders-status');
  statusEl.textContent = 'Creating order...';
  
  await apiCall('POST', '/api/orders', { userId, product, quantity: Number(quantity), status });
  hideNewOrderForm();
  await refreshOrders();
}

async function deleteOrder(id) {
  if (confirm('Are you sure you want to delete this order?')) {
    const statusEl = document.getElementById('orders-status');
    statusEl.textContent = 'Deleting order...';
    await apiCall('DELETE', `/api/orders/${id}`);
    await refreshOrders();
  }
}

// Users Functions
async function refreshUsers() {
  const statusEl = document.getElementById('users-status');
  statusEl.textContent = 'Loading users...';
  
  const result = await apiCall('GET', '/api/users');
  const tbody = document.getElementById('users-table-body');
  
  if (result.users && result.users.length > 0) {
    tbody.innerHTML = result.users.map(user => `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <button class="action-btn" onclick="deleteUser('${user.id}')">🗑️</button>
        </td>
      </tr>
    `).join('');
    statusEl.textContent = `${result.users.length} user(s)`;
  } else {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-message">No users found. Click "New User" to create one.</td></tr>';
    statusEl.textContent = 'No users';
  }
}

function showNewUserForm() {
  document.getElementById('user-form').style.display = 'block';
}

function hideNewUserForm() {
  document.getElementById('user-form').style.display = 'none';
  document.getElementById('user-name').value = '';
  document.getElementById('user-email').value = '';
}

async function createUser() {
  const name = document.getElementById('user-name').value;
  const email = document.getElementById('user-email').value;
  
  if (!name || !email) {
    alert('Please fill in all fields');
    return;
  }
  
  const statusEl = document.getElementById('users-status');
  statusEl.textContent = 'Creating user...';
  
  await apiCall('POST', '/api/users', { name, email });
  hideNewUserForm();
  await refreshUsers();
}

async function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    const statusEl = document.getElementById('users-status');
    statusEl.textContent = 'Deleting user...';
    await apiCall('DELETE', `/api/users/${id}`);
    await refreshUsers();
  }
}

// Health Functions
async function checkHealth() {
  const statusEl = document.getElementById('health-status');
  const indicator = document.getElementById('health-indicator');
  const details = document.getElementById('health-details');
  
  statusEl.textContent = 'Checking health...';
  indicator.innerHTML = '<span class="health-icon">⏳</span><span class="health-text">Checking...</span>';
  
  const result = await apiCall('GET', '/api/health');
  
  if (result.status === 'healthy') {
    indicator.innerHTML = '<span class="health-icon">✅</span><span class="health-text">System Healthy</span>';
    statusEl.textContent = 'Healthy';
    details.textContent = JSON.stringify(result, null, 2);
  } else {
    indicator.innerHTML = '<span class="health-icon">❌</span><span class="health-text">System Error</span>';
    statusEl.textContent = 'Error';
    details.textContent = JSON.stringify(result, null, 2);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  updateTaskbar();
  
  if (MOCK_MODE) {
    console.log('🖥️ Running in demo mode (GitHub Pages static deployment)');
    console.log('📝 Data will be stored in memory only');
  }
});
