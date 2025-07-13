import { z } from 'zod';

export const vehicleSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .refine(val => val.trim().length > 0, 'Nome não pode estar vazio'),
  plate: z
    .string()
    .min(7, 'Placa deve ter exatamente 7 caracteres')
    .max(7, 'Placa deve ter exatamente 7 caracteres')
    .regex(/^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/, 'Formato inválido. Use ABC1234 ou ABC1D23')
    .transform(val => val.toUpperCase()),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;