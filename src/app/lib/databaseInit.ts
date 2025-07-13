import { connectDB } from './database';
import User from '../models/User';
import Vehicle from '../models/Vehicle';

export const initializeDatabase = async () => {
  try {
    await connectDB();
    
    if (process.env.NODE_ENV === 'development') {
      await User.sync({ alter: true });
      await Vehicle.sync({ alter: true });
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};