import { z } from 'zod';

export const CreateUserDto = z.object({
  email: z.string().email('Debes ingresar un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .optional(),
});

export type CreateUserDtoType = z.infer<typeof CreateUserDto>;
