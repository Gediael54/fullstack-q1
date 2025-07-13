import { NextResponse } from 'next/server';
import Vehicle from '../../../../models/Vehicle';
import User from '../../../../models/User';
import { connectDB } from '../../../../lib/database';
import { withAuth, AuthenticatedRequest } from '../../../../middleware/authMiddleware';

function parseVehicleId(params?: Record<string, string>) {
  if (!params?.id) return { error: 'Vehicle ID is required' };
  const id = parseInt(params.id);
  if (isNaN(id)) return { error: 'Invalid vehicle ID' };
  return { id };
}

async function findUserVehicle(vehicleId: number, userId: number) {
  return Vehicle.findOne({
    where: { id: vehicleId, userId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email'],
      },
    ],
  });
}

export const PATCH = withAuth(async (request: AuthenticatedRequest, context: { params?: Record<string, string> }) => {
  try {
    await connectDB();

    const vehicleIdOrError = parseVehicleId(context.params);
    if ('error' in vehicleIdOrError) {
      return NextResponse.json({ error: vehicleIdOrError.error }, { status: 400 });
    }
    const { id: vehicleId } = vehicleIdOrError;

    const { status } = await request.json();

    if (!status || !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "active" or "inactive"' },
        { status: 400 }
      );
    }

    const vehicle = await Vehicle.findOne({
      where: {
        id: vehicleId,
        userId: request.user!.id,
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    await vehicle.update({ status });

    const updatedVehicle = await findUserVehicle(vehicleId, request.user!.id);

    return NextResponse.json(
      {
        message: `Vehicle ${status === 'active' ? 'activated' : 'archived'} successfully`,
        vehicle: updatedVehicle,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update vehicle status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
