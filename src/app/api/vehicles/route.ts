import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../lib/database';
import { withAuth, AuthenticatedRequest } from '../../middleware/authMiddleware';
import { User, Vehicle } from '../../models';
import { VehicleListResponse, VehicleResponse } from '../../types';

interface VehicleData {
  id: number;
  name: string;
  plate: string;
  status: 'active' | 'inactive';
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    await connectDB();
   
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
   
    const whereClause: any = { userId: request.user!.id };
   
    if (status && (status === 'active' || status === 'inactive')) {
      whereClause.status = status;
    }
   
    const vehicles = await Vehicle.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const safeVehicles: VehicleData[] = vehicles.map(vehicle => {
      const vehicleData = vehicle.toJSON ? vehicle.toJSON() : vehicle;
      return {
        id: vehicleData.id,
        name: vehicleData.name,
        plate: vehicleData.plate,
        status: vehicleData.status || 'active',
        userId: vehicleData.userId,
        createdAt: vehicleData.createdAt || new Date(),
        updatedAt: vehicleData.updatedAt || new Date(),
      };
    });
   
    return NextResponse.json<VehicleListResponse>(
      {
        vehicles: safeVehicles,
        count: safeVehicles.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get vehicles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    await connectDB();
   
    const { name, plate, status = 'active' } = await request.json();
   
    if (!name || !plate) {
      return NextResponse.json(
        { error: 'Name and plate are required' },
        { status: 400 }
      );
    }
   
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }
   
    if (plate.length < 7 || plate.length > 10) {
      return NextResponse.json(
        { error: 'Plate must be between 7 and 10 characters' },
        { status: 400 }
      );
    }

    if (status && !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either active or inactive' },
        { status: 400 }
      );
    }
   
    const existingVehicle = await Vehicle.findOne({
      where: {
        plate: plate.toUpperCase(),
        userId: request.user!.id
      }
    });
   
    if (existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle with this plate already exists' },
        { status: 409 }
      );
    }
   
    const vehicle = await Vehicle.create({
      name: name.trim(),
      plate: plate.toUpperCase(),
      status: status || 'active',
      userId: request.user!.id,
    });
   
    const createdVehicle = await Vehicle.findByPk(vehicle.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email'],
        },
      ],
    });

    // Garantir que o veículo criado tenha a estrutura correta
    const safeVehicle: VehicleData = createdVehicle ? {
      id: createdVehicle.id,
      name: createdVehicle.name,
      plate: createdVehicle.plate,
      status: createdVehicle.status || 'active',
      userId: createdVehicle.userId,
      createdAt: createdVehicle.createdAt || new Date(),
      updatedAt: createdVehicle.updatedAt || new Date(),
    } : {
      id: vehicle.id,
      name: vehicle.name,
      plate: vehicle.plate,
      status: vehicle.status || 'active',
      userId: vehicle.userId,
      createdAt: vehicle.createdAt || new Date(),
      updatedAt: vehicle.updatedAt || new Date(),
    };
   
    return NextResponse.json<VehicleResponse>(
      {
        message: 'Vehicle created successfully',
        vehicle: safeVehicle,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create vehicle error:', error);
   
    if (error.name === 'SequelizeValidationError') {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
   
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json(
        { error: 'Vehicle with this plate already exists' },
        { status: 409 }
      );
    }
   
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});