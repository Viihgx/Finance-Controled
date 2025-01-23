const express = require('express');
const cors = require('cors'); 
const app = express();

app.use(cors());

app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);
const userRoutes = require('./routes/user');
app.use('/user', userRoutes);
const expensesRoutes = require('./routes/expenses');
app.use('/expenses', expensesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});