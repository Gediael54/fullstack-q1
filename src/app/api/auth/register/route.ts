import { NextRequest, NextResponse } from 'next/server';
import User from '../../../models/User';
import { connectDB } from '../../../lib/database';
import { generateToken } from '../../../lib/authUtils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user);

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.name === 'SequelizeValidationError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
