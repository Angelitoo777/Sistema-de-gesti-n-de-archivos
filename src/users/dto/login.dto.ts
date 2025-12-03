import { z } from 'zod';

export const LoginDto = z.object({
  email: z.string().email('Debes ingresar un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginDtoType = z.infer<typeof LoginDto>;
