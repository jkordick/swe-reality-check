// Win95 Express App - Frontend JavaScript

// Notification history storage
let notificationHistory = [];
let unreadNotificationCount = 0;

// Order status progression
const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_ICONS = {
  pending: '⏳',
  processing: '⚙️',
  shipped: '🚚',
  delivered: '✅',
  error: '❌'
};

// In-app notification system
function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container') || createNotificationContainer();
  const notification = document.createElement('div');
  notification.className = `win95-notification ${type}`;
  notification.innerHTML = `
    <span class="notification-icon">${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
    <span class="notification-message">${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">×</button>
  `;
  container.appendChild(notification);
  setTimeout(() => notification.remove(), 4000);
}

function createNotificationContainer() {
  const container = document.createElement('div');
  container.id = 'notification-container';
  document.body.appendChild(container);
  return container;
}

// Order Status Notification System (Win95 style popup)
function showOrderStatusNotification(orderId, product, oldStatus, newStatus, isError = false) {
  const container = document.getElementById('notification-container') || createNotificationContainer();
  
  const popup = document.createElement('div');
  popup.className = 'order-notification-popup';
  
  const icon = isError ? STATUS_ICONS.error : STATUS_ICONS[newStatus] || '📦';
  const title = isError ? 'Order Update Failed' : 'Order Status Changed';
  const headerBg = 'linear-gradient(to right, #000080, #1084d0)';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'popup-header';
  header.style.background = headerBg;
  
  const headerTitle = document.createElement('span');
  headerTitle.textContent = title;
  header.appendChild(headerTitle);
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'win95-btn';
  closeBtn.style.cssText = 'padding: 0 4px; min-width: auto; font-size: 10px;';
  closeBtn.textContent = '×';
  closeBtn.onclick = function() { popup.remove(); };
  header.appendChild(closeBtn);
  
  popup.appendChild(header);
  
  // Create content
  const content = document.createElement('div');
  content.className = 'popup-content';
  
  const iconDiv = document.createElement('div');
  iconDiv.className = 'popup-icon';
  iconDiv.textContent = icon;
  content.appendChild(iconDiv);
  
  const details = document.createElement('div');
  details.className = 'popup-details';
  
  const titleDiv = document.createElement('div');
  titleDiv.className = 'popup-title';
  titleDiv.textContent = orderId;
  details.appendChild(titleDiv);
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'popup-message';
  messageDiv.textContent = product;
  details.appendChild(messageDiv);
  
  if (!isError) {
    const statusChange = document.createElement('div');
    statusChange.className = 'popup-status-change';
    
    const oldStatusSpan = document.createElement('span');
    oldStatusSpan.className = `status-${oldStatus}`;
    oldStatusSpan.textContent = oldStatus;
    statusChange.appendChild(oldStatusSpan);
    
    const arrow = document.createElement('span');
    arrow.className = 'status-arrow';
    arrow.textContent = '→';
    statusChange.appendChild(arrow);
    
    const newStatusSpan = document.createElement('span');
    newStatusSpan.className = `status-${newStatus}`;
    newStatusSpan.textContent = newStatus;
    statusChange.appendChild(newStatusSpan);
    
    details.appendChild(statusChange);
  } else {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'popup-message';
    errorMsg.style.color = '#800000';
    errorMsg.textContent = 'Failed to update order status';
    details.appendChild(errorMsg);
  }
  
  content.appendChild(details);
  popup.appendChild(content);
  
  // Create footer
  const footer = document.createElement('div');
  footer.className = 'popup-footer';
  
  const okBtn = document.createElement('button');
  okBtn.className = 'win95-btn';
  okBtn.textContent = 'OK';
  okBtn.onclick = function() { popup.remove(); };
  footer.appendChild(okBtn);
  
  popup.appendChild(footer);
  
  container.appendChild(popup);
  
  // Add to notification history
  addToNotificationHistory({
    type: isError ? 'error' : 'status-change',
    orderId,
    product,
    oldStatus,
    newStatus,
    timestamp: new Date()
  });
  
  // Auto-dismiss after 6 seconds
  setTimeout(() => {
    if (popup.parentElement) {
      popup.classList.add('removing');
      setTimeout(() => popup.remove(), 300);
    }
  }, 6000);
}

// Show notification for order creation
function showOrderCreatedNotification(orderId, product) {
  const container = document.getElementById('notification-container') || createNotificationContainer();
  
  const popup = document.createElement('div');
  popup.className = 'order-notification-popup';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'popup-header';
  
  const headerTitle = document.createElement('span');
  headerTitle.textContent = 'New Order Created';
  header.appendChild(headerTitle);
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'win95-btn';
  closeBtn.style.cssText = 'padding: 0 4px; min-width: auto; font-size: 10px;';
  closeBtn.textContent = '×';
  closeBtn.onclick = function() { popup.remove(); };
  header.appendChild(closeBtn);
  
  popup.appendChild(header);
  
  // Create content
  const content = document.createElement('div');
  content.className = 'popup-content';
  
  const iconDiv = document.createElement('div');
  iconDiv.className = 'popup-icon';
  iconDiv.textContent = '📦';
  content.appendChild(iconDiv);
  
  const details = document.createElement('div');
  details.className = 'popup-details';
  
  const titleDiv = document.createElement('div');
  titleDiv.className = 'popup-title';
  titleDiv.textContent = orderId;
  details.appendChild(titleDiv);
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'popup-message';
  messageDiv.textContent = product;
  details.appendChild(messageDiv);
  
  const statusChange = document.createElement('div');
  statusChange.className = 'popup-status-change';
  
  const statusSpan = document.createElement('span');
  statusSpan.className = 'status-pending';
  statusSpan.textContent = 'pending';
  statusChange.appendChild(statusSpan);
  
  details.appendChild(statusChange);
  content.appendChild(details);
  popup.appendChild(content);
  
  // Create footer
  const footer = document.createElement('div');
  footer.className = 'popup-footer';
  
  const okBtn = document.createElement('button');
  okBtn.className = 'win95-btn';
  okBtn.textContent = 'OK';
  okBtn.onclick = function() { popup.remove(); };
  footer.appendChild(okBtn);
  
  popup.appendChild(footer);
  
  container.appendChild(popup);
  
  addToNotificationHistory({
    type: 'created',
    orderId,
    product,
    timestamp: new Date()
  });
  
  setTimeout(() => {
    if (popup.parentElement) {
      popup.classList.add('removing');
      setTimeout(() => popup.remove(), 300);
    }
  }, 5000);
}

// Show notification for order deletion
function showOrderDeletedNotification(orderId, success = true) {
  const type = success ? 'success' : 'error';
  const message = success 
    ? `Order ${orderId} has been deleted successfully` 
    : `Failed to delete order ${orderId}`;
  
  showNotification(message, type);
  
  addToNotificationHistory({
    type: success ? 'deleted' : 'error',
    orderId,
    message: success ? 'Order deleted' : 'Delete failed',
    timestamp: new Date()
  });
}

// Notification History Management
function addToNotificationHistory(notification) {
  notificationHistory.unshift(notification);
  unreadNotificationCount++;
  
  // Keep only last 50 notifications
  if (notificationHistory.length > 50) {
    notificationHistory.pop();
  }
  
  updateNotificationIndicator();
  updateNotificationHistoryPanel();
}

function updateNotificationIndicator() {
  const indicator = document.getElementById('notification-indicator');
  const badge = document.getElementById('notification-badge');
  
  if (indicator && badge) {
    badge.textContent = unreadNotificationCount > 99 ? '99+' : unreadNotificationCount;
    
    if (unreadNotificationCount > 0) {
      indicator.classList.add('has-notifications');
    } else {
      indicator.classList.remove('has-notifications');
    }
  }
}

function toggleNotificationHistory() {
  const panel = document.getElementById('notification-history');
  if (panel) {
    panel.classList.toggle('visible');
    
    // Mark all as read when panel is opened
    if (panel.classList.contains('visible')) {
      unreadNotificationCount = 0;
      updateNotificationIndicator();
      updateNotificationHistoryPanel();
    }
  }
}

function updateNotificationHistoryPanel() {
  const content = document.getElementById('notification-history-content');
  if (!content) return;
  
  if (notificationHistory.length === 0) {
    content.innerHTML = '<div class="notification-history-empty">No notifications yet</div>';
    return;
  }
  
  content.innerHTML = notificationHistory.map((n, index) => {
    const time = new Date(n.timestamp).toLocaleTimeString();
    const typeLabel = n.type === 'status-change' ? 'Status Change' 
      : n.type === 'created' ? 'Order Created'
      : n.type === 'deleted' ? 'Order Deleted'
      : 'Error';
    const icon = n.type === 'error' ? '❌' 
      : n.type === 'created' ? '📦'
      : n.type === 'deleted' ? '🗑️'
      : '🔄';
    
    let message = '';
    if (n.type === 'status-change') {
      message = `${n.orderId}: ${n.oldStatus} → ${n.newStatus}`;
    } else if (n.type === 'created') {
      message = `${n.orderId}: ${n.product}`;
    } else if (n.type === 'deleted') {
      message = n.orderId;
    } else {
      message = n.message || n.orderId;
    }
    
    return `
      <div class="notification-history-item ${index < unreadNotificationCount ? 'unread' : ''}">
        <div class="item-header">
          <span class="item-type">${icon} ${typeLabel}</span>
          <span class="item-time">${time}</span>
        </div>
        <div class="item-message">${message}</div>
      </div>
    `;
  }).join('');
}

function clearNotificationHistory() {
  notificationHistory = [];
  unreadNotificationCount = 0;
  updateNotificationIndicator();
  updateNotificationHistoryPanel();
  toggleNotificationHistory();
}

// Close notification history when clicking elsewhere
document.addEventListener('click', (e) => {
  const panel = document.getElementById('notification-history');
  const indicator = document.getElementById('notification-indicator');
  if (panel && indicator && !panel.contains(e.target) && !indicator.contains(e.target)) {
    panel.classList.remove('visible');
  }
});

// Custom confirm dialog
function showConfirmDialog(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'win95-dialog-overlay';
    overlay.innerHTML = `
      <div class="win95-dialog">
        <div class="window-title">
          <span>Confirm</span>
        </div>
        <div class="dialog-content">
          <span class="dialog-icon">❓</span>
          <p>${message}</p>
        </div>
        <div class="dialog-buttons">
          <button class="win95-btn" id="dialog-ok">OK</button>
          <button class="win95-btn" id="dialog-cancel">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    overlay.querySelector('#dialog-ok').onclick = () => {
      overlay.remove();
      resolve(true);
    };
    overlay.querySelector('#dialog-cancel').onclick = () => {
      overlay.remove();
      resolve(false);
    };
  });
}

// API Base URL - adjust based on environment
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? '' 
  : ''; // For static deployment, we'll use mock data

// Mock mode for GitHub Pages (static deployment)
// True when NOT running locally (e.g., on github.io)
const MOCK_MODE = !(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

console.log('🖥️ Win95 App - MOCK_MODE:', MOCK_MODE, 'hostname:', window.location.hostname);

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
  console.log('🔧 Mock API:', method, endpoint);
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
          console.log('📦 Returning orders:', mockOrders.length);
          resolve({ orders: mockOrders });
          return;
        } else if (method === 'POST') {
          const order = {
            id: `ORD-${Date.now()}`,
            ...data,
            createdAt: new Date().toISOString()
          };
          mockOrders.push(order);
          resolve({ order });
          return;
        }
      }
      
      if (endpoint.startsWith('/api/orders/')) {
        const id = endpoint.split('/').pop();
        const index = mockOrders.findIndex(o => o.id === id);
        
        if (method === 'PUT') {
          if (index !== -1) {
            mockOrders[index] = { ...mockOrders[index], ...data };
            resolve({ order: mockOrders[index] });
          } else {
            resolve({ error: 'Not found' });
          }
          return;
        }
        
        if (method === 'DELETE') {
          if (index !== -1) {
            mockOrders.splice(index, 1);
            resolve({ message: 'Deleted' });
          } else {
            resolve({ error: 'Not found' });
          }
          return;
        }
      }
      
      // Users
      if (endpoint === '/api/users') {
        if (method === 'GET') {
          console.log('👤 Returning users:', mockUsers.length);
          resolve({ users: mockUsers });
          return;
        } else if (method === 'POST') {
          const user = {
            id: `USR-${Date.now()}`,
            ...data,
            createdAt: new Date().toISOString()
          };
          mockUsers.push(user);
          resolve({ user });
          return;
        }
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
          return;
        }
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
  
  // Clear existing rows
  tbody.replaceChildren();
  
  if (result.orders && result.orders.length > 0) {
    result.orders.forEach(order => {
      const user = usersCache.find(u => u.id === order.userId);
      const userName = user ? user.name : order.userId || 'Unknown';
      const nextStatus = getNextStatus(order.status);
      const canProgress = nextStatus !== null;
      
      const row = document.createElement('tr');
      
      // Order ID
      const idCell = document.createElement('td');
      idCell.textContent = order.id;
      row.appendChild(idCell);
      
      // User Name
      const userCell = document.createElement('td');
      userCell.textContent = userName;
      row.appendChild(userCell);
      
      // Product
      const productCell = document.createElement('td');
      productCell.textContent = order.product;
      row.appendChild(productCell);
      
      // Quantity
      const quantityCell = document.createElement('td');
      quantityCell.textContent = order.quantity;
      row.appendChild(quantityCell);
      
      // Status
      const statusCell = document.createElement('td');
      const statusSpan = document.createElement('span');
      statusSpan.className = `status-${order.status}`;
      statusSpan.textContent = order.status;
      statusCell.appendChild(statusSpan);
      row.appendChild(statusCell);
      
      // Actions
      const actionsCell = document.createElement('td');
      
      if (canProgress) {
        const progressBtn = document.createElement('button');
        progressBtn.className = 'action-btn';
        progressBtn.textContent = '⏩';
        progressBtn.title = `Advance to ${nextStatus}`;
        progressBtn.onclick = function() {
          updateOrderStatus(order.id, order.product, order.status, nextStatus);
        };
        actionsCell.appendChild(progressBtn);
      }
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'action-btn';
      deleteBtn.textContent = '🗑️';
      deleteBtn.onclick = function() {
        deleteOrder(order.id);
      };
      actionsCell.appendChild(deleteBtn);
      
      row.appendChild(actionsCell);
      tbody.appendChild(row);
    });
    statusEl.textContent = `${result.orders.length} order(s)`;
  } else {
    const emptyRow = document.createElement('tr');
    const emptyCell = document.createElement('td');
    emptyCell.colSpan = 6;
    emptyCell.className = 'empty-message';
    emptyCell.textContent = 'No orders found. Click "New Order" to create one.';
    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);
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
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  const statusEl = document.getElementById('orders-status');
  statusEl.textContent = 'Creating order...';
  
  const result = await apiCall('POST', '/api/orders', { userId, product, quantity: Number(quantity), status });
  
  if (result.order) {
    showOrderCreatedNotification(result.order.id, product);
  } else if (result.error) {
    showNotification('Failed to create order: ' + result.error, 'error');
  }
  
  hideNewOrderForm();
  await refreshOrders();
}

async function deleteOrder(id) {
  const confirmed = await showConfirmDialog('Are you sure you want to delete this order?');
  if (confirmed) {
    const statusEl = document.getElementById('orders-status');
    statusEl.textContent = 'Deleting order...';
    const result = await apiCall('DELETE', `/api/orders/${id}`);
    showOrderDeletedNotification(id, !result.error);
    await refreshOrders();
  }
}

// Get next status in progression
function getNextStatus(currentStatus) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= STATUS_ORDER.length - 1) {
    return null; // Already at final status or unknown status
  }
  return STATUS_ORDER[currentIndex + 1];
}

// Update order status
async function updateOrderStatus(orderId, product, currentStatus, newStatus) {
  const statusEl = document.getElementById('orders-status');
  statusEl.textContent = 'Updating order status...';
  
  const result = await apiCall('PUT', `/api/orders/${orderId}`, { status: newStatus });
  
  if (result.error) {
    showOrderStatusNotification(orderId, product, currentStatus, newStatus, true);
  } else {
    showOrderStatusNotification(orderId, product, currentStatus, newStatus, false);
  }
  
  await refreshOrders();
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
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  const statusEl = document.getElementById('users-status');
  statusEl.textContent = 'Creating user...';
  
  await apiCall('POST', '/api/users', { name, email });
  hideNewUserForm();
  await refreshUsers();
}

async function deleteUser(id) {
  const confirmed = await showConfirmDialog('Are you sure you want to delete this user?');
  if (confirmed) {
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
