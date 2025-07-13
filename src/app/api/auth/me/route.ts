import { NextRequest, NextResponse } from 'next/server';
import User from '../../../models/User';
import { connectDB } from '../../../lib/database';
import { verifyToken } from '../../../lib/authUtils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Token não fornecido' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ success: false, message: 'Token inválido' }, { status: 401 });
    }

    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'name', 'email']
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 });
  }
}
