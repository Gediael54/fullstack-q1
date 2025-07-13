import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import Vehicle from '../../../models/Vehicle';
import User from '../../../models/User';
import { connectDB } from '../../../lib/database';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';

function parseVehicleId(params: Record<string, string>) {
  if (!params?.id) return { error: 'Vehicle ID is required' };
  const id = parseInt(params.id, 10);
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

export const GET = withAuth(async (request: AuthenticatedRequest, context: { params?: Record<string, string> }) => {
  try {
    await connectDB();

    const params = context.params;
    if (!params) {
      return NextResponse.json({ error: 'Params missing' }, { status: 400 });
    }

    const vehicleIdOrError = parseVehicleId(params);
    if ('error' in vehicleIdOrError) {
      return NextResponse.json({ error: vehicleIdOrError.error }, { status: 400 });
    }
    const { id: vehicleId } = vehicleIdOrError;

    const vehicle = await findUserVehicle(vehicleId, request.user!.id);

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ vehicle }, { status: 200 });
  } catch (error) {
    console.error('Get vehicle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const PUT = withAuth(async (request: AuthenticatedRequest, context: { params?: Record<string, string> }) => {
  try {
    await connectDB();

    const params = context.params;
    if (!params) {
      return NextResponse.json({ error: 'Params missing' }, { status: 400 });
    }

    const vehicleIdOrError = parseVehicleId(params);
    if ('error' in vehicleIdOrError) {
      return NextResponse.json({ error: vehicleIdOrError.error }, { status: 400 });
    }
    const { id: vehicleId } = vehicleIdOrError;

    const { name, plate, status } = await request.json();

    const vehicle = await Vehicle.findOne({
      where: { id: vehicleId, userId: request.user!.id },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    if (name !== undefined) {
      if (!name || name.trim().length < 2 || name.trim().length > 100) {
        return NextResponse.json(
          { error: 'Name must be between 2 and 100 characters' }, 
          { status: 400 }
        );
      }
    }

    if (plate !== undefined) {
      if (!plate || plate.length !== 7) {
        return NextResponse.json(
          { error: 'Plate must have exactly 7 characters' }, 
          { status: 400 }
        );
      }
      
      if (!/^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(plate.toUpperCase())) {
        return NextResponse.json(
          { error: 'Invalid plate format. Use ABC1234 or ABC1D23' }, 
          { status: 400 }
        );
      }
      
      const normalizedPlate = plate.toUpperCase();
      if (normalizedPlate !== vehicle.plate) {
        const existingVehicle = await Vehicle.findOne({
          where: {
            plate: normalizedPlate,
            userId: request.user!.id,
            id: { [Op.ne]: vehicleId }, 
          },
        });

        if (existingVehicle) {
          return NextResponse.json(
            { error: 'You already have a vehicle with this plate' }, 
            { status: 409 }
          );
        }
      }
    }

    if (status !== undefined) {
      if (!['active', 'inactive'].includes(status)) {
        return NextResponse.json(
          { error: 'Status must be either "active" or "inactive"' }, 
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (plate !== undefined) updateData.plate = plate.toUpperCase();
    if (status !== undefined) updateData.status = status;

    await vehicle.update(updateData);

    
    const updatedVehicle = await findUserVehicle(vehicleId, request.user!.id);

    return NextResponse.json(
      { 
        message: 'Vehicle updated successfully', 
        vehicle: updatedVehicle 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update vehicle error:', error);

    if (error.name === 'SequelizeValidationError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (request: AuthenticatedRequest, context: { params?: Record<string, string> }) => {
  try {
    await connectDB();

    const params = context.params;
    if (!params) {
      return NextResponse.json({ error: 'Params missing' }, { status: 400 });
    }

    const vehicleIdOrError = parseVehicleId(params);
    if ('error' in vehicleIdOrError) {
      return NextResponse.json({ error: vehicleIdOrError.error }, { status: 400 });
    }
    const { id: vehicleId } = vehicleIdOrError;

    const vehicle = await Vehicle.findOne({
      where: { id: vehicleId, userId: request.user!.id },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    await vehicle.destroy();

    return NextResponse.json({ message: 'Vehicle deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});