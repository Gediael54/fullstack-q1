import User from './User';
import Vehicle from './Vehicle';

User.hasMany(Vehicle, {
  foreignKey: 'userId',
  as: 'vehicles',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Vehicle.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export { User, Vehicle };

export const syncModels = async () => {
  try {
    await User.sync({ alter: true });
    await Vehicle.sync({ alter: true });
    
    console.log('All models synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
    throw error;
  }
};