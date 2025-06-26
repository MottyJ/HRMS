import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import type { Redis } from 'ioredis';
import { REDIS_CLIENT } from 'src/redis/redis.module';

@Injectable()
export class RequestCountInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestCountInterceptor.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest<{ params: { id: string } }>();
    const id = req.params.id;
    if (id) {
      this.logger.log(`incrementing counter for ${id}`);
      await this.redis.incr(`patient:request_count:${id}`);
      const newVal = await this.redis.get(`patient:request_count:${id}`);
      this.logger.log(`counter for ${id} now = ${newVal}`);
    }
    return next.handle();
  }
}
