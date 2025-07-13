import User from '../models/User';
import { Op } from 'sequelize';
import { CreateUserData, UpdateUserData, UserResponse } from '../types/index';

export class UserService {
  async createUser(userData: CreateUserData): Promise<UserResponse> {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) throw new Error('Email já está em uso');
   
    const user = await User.create(userData);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<UserResponse | null> {
    const user = await User.findByPk(id);
    if (!user) return null;
   
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateUser(id: number, userData: UpdateUserData): Promise<UserResponse | null> {
    const user = await User.findByPk(id);
    if (!user) return null;
    
    if (userData.email) {
      const exists = await User.findOne({
        where: {
          email: userData.email,
          id: { [Op.ne]: id }
        }
      });
      if (exists) throw new Error('Email já está em uso');
    }
    
    await user.update(userData);
    await user.reload();
   
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await User.findByPk(id);
    if (!user) return false;
   
    await user.destroy();
    return true;
  }

  async validatePassword(user: User, plainPassword: string): Promise<boolean> {
    return await user.validatePassword(plainPassword);
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await User.findAll();
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}

export const userService = new UserService();