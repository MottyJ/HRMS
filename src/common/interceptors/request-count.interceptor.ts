import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import type { Redis } from 'ioredis';
import { Observable } from 'rxjs';
import { REDIS_CLIENT } from 'src/redis/redis.module';

@Injectable()
export class RequestCountInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestCountInterceptor.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = ctx.switchToHttp().getRequest<{ params: { id: string } }>();
    const id = req.params.id;

    if (id) {
      await this.redis.incr(`patient:request_count:${id}`).catch((error) => {
        if (error instanceof Error) {
          this.logger.error(
            `Failed to track request for patient ${id}`,
            error.stack,
          );
        } else {
          this.logger.error(
            `Failed to track request for patient ${id}`,
            String(error),
          );
        }
      });
    }
    return next.handle();
  }
}
