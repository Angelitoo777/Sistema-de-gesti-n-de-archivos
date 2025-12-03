import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodObject, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
      return value;
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));

        throw new BadRequestException({
          message: 'Validation failed',
          errors: errors,
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
