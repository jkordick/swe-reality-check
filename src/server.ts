import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// In-memory storage
interface Order {
  id: string;
  userId: string;
  product: string;
  quantity: number;
  status: string;
  createdAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

let orders: Order[] = [
  { id: 'ORD-1001', userId: 'USR-1001', product: 'Microsoft Windows 95', quantity: 3, status: 'delivered', createdAt: new Date('2026-01-15') },
  { id: 'ORD-1002', userId: 'USR-1001', product: 'Mechanical Keyboard', quantity: 1, status: 'shipped', createdAt: new Date('2026-02-01') },
  { id: 'ORD-1003', userId: 'USR-1002', product: 'USB-C Hub', quantity: 2, status: 'processing', createdAt: new Date('2026-02-05') },
  { id: 'ORD-1004', userId: 'USR-1003', product: '4K Monitor', quantity: 1, status: 'pending', createdAt: new Date('2026-02-08') },
  { id: 'ORD-1005', userId: 'USR-1002', product: 'Wireless Mouse', quantity: 5, status: 'pending', createdAt: new Date('2026-02-09') },
];

let users: User[] = [
  { id: 'USR-1001', name: 'Ada Lovelace', email: 'ada@computing.org', createdAt: new Date('2026-01-01') },
  { id: 'USR-1002', name: 'Grace Hopper', email: 'grace@navy.mil', createdAt: new Date('2026-01-10') },
  { id: 'USR-1003', name: 'Margaret Hamilton', email: 'margaret@nasa.gov', createdAt: new Date('2026-01-20') },
  { id: 'USR-1004', name: 'Katherine Johnson', email: 'katherine@nasa.gov', createdAt: new Date('2026-02-01') },
  { id: 'USR-1005', name: 'Hedy Lamarr', email: 'hedy@invention.org', createdAt: new Date('2026-02-05') },
];

// Health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Order endpoints
app.get('/api/orders', (_req: Request, res: Response) => {
  res.json({ orders });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const { userId, product, quantity, status } = req.body;
  
  if (!userId || !product || !quantity) {
    return res.status(400).json({ error: 'userId, product and quantity are required' });
  }

  // Verify user exists
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const order: Order = {
    id: `ORD-${Date.now()}`,
    userId,
    product,
    quantity: Number(quantity),
    status: status || 'pending',
    createdAt: new Date()
  };

  orders.push(order);
  res.status(201).json({ order });
});

app.put('/api/orders/:id', (req: Request, res: Response) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders[index] = { ...orders[index], ...req.body };
  res.json({ order: orders[index] });
});

app.delete('/api/orders/:id', (req: Request, res: Response) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders.splice(index, 1);
  res.json({ message: 'Order deleted' });
});

// User endpoints
app.get('/api/users', (_req: Request, res: Response) => {
  res.json({ users });
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// Get orders for a specific user
app.get('/api/users/:id/orders', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const userOrders = orders.filter(o => o.userId === req.params.id);
  res.json({ orders: userOrders });
});

app.post('/api/users', (req: Request, res: Response) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const user: User = {
    id: `USR-${Date.now()}`,
    name,
    email,
    createdAt: new Date()
  };

  users.push(user);
  res.status(201).json({ user });
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[index] = { ...users[index], ...req.body };
  res.json({ user: users[index] });
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(index, 1);
  res.json({ message: 'User deleted' });
});

// Serve frontend
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🖥️  Win95 Server running at http://localhost:${PORT}`);
});

export default app;
