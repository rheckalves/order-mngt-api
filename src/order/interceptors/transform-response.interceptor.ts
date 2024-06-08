import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (response?.data) {
          return {
            data: { ...response.data },
            timestamp: response.timestamp || new Date().toISOString(),
          };
        }

        return {
          data: response,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
