import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CreateOrderValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const createOrderDto = request.body;

    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    if (!createOrderDto.use_default_address) {
      if (!createOrderDto.billing_address) {
        throw new BadRequestException(
          'Billing address is required when use_default_address is false or not provided',
        );
      }
      if (!createOrderDto.shipping_address) {
        throw new BadRequestException(
          'Shipping address is required when use_default_address is false or not provided',
        );
      }
    }

    return next.handle().pipe(tap(() => console.log('Validation completed')));
  }
}
