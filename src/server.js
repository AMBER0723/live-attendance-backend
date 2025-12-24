import express from 'express';
import dotenv from 'dotenv'; 
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import classRoutes from './routes/class.routes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 
connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/class", classRoutes);

app.get('/',(req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});