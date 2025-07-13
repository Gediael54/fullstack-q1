import { PaginationParams } from '../types';

export const successResponse = (data: any, status: number = 200) => {
  return Response.json(data, { status });
};

export const errorResponse = (message: string, status: number = 400) => {
  return Response.json({ error: message }, { status });
};

export const validateRequiredFields = (data: any, fields: string[]) => {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePlate = (plate: string) => {
  const plateRegex = /^[A-Z]{3}[-]?[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  return plateRegex.test(plate.toUpperCase());
};

export const validateYear = (year: number) => {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear + 1;
};

export const getPaginationParams = (url: string): PaginationParams => {
  const searchParams = new URL(url).searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
};

export const handleSequelizeError = (error: any) => {
  if (error.name === 'SequelizeValidationError') {
    return errorResponse(error.errors[0].message, 400);
  }
  
  if (error.name === 'SequelizeUniqueConstraintError') {
    return errorResponse('Resource already exists', 409);
  }
  
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return errorResponse('Invalid reference', 400);
  }
  
  console.error('Sequelize error:', error);
  return errorResponse('Database error', 500);
};