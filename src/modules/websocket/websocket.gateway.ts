import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Observable } from 'rxjs';
import { RedisService } from '../redis/redis.service';
import { Logger } from '@nestjs/common';
import { RedisCache } from 'src/utility/enums';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WebsocketGateway.name);
  constructor(private redisService: RedisService) {}

  async handleDisconnect(client: Socket) {
    const userId = this.getUserId(client);
    const redisKey = this.getRedisKey(userId);
    if (userId) {
      await this.redisService.instance.srem(redisKey, client.id);
      this.logger.log(`从 Redis 中移除 clientId: ${client.id}，用户: ${userId}`);

      const remainingMembers = await this.redisService.instance.scard(redisKey);
      if (remainingMembers === 0) {
        await this.redisService.instance.del(redisKey);
        this.logger.log(`移出websocket 用户空集合：${userId}`);
      }

      this.logger.log(`用户：${userId} 断开websocket链接：${client.id}`);
    }
  }

  async handleConnection(client: Socket) {
    const userId = this.getUserId(client);
    if (userId) {
      const redisKey = this.getRedisKey(userId);
      await this.redisService.instance.sadd(redisKey, client.id);
      this.logger.log(`用户：${userId} 连接websocket：${client.id}`);
    }
  }

  @SubscribeMessage('test')
  test(@MessageBody() data: any) {
    return new Observable((observer) => {
      observer.next({
        event: 'test',
        data: {
          msg: '测试1',
          data
        }
      });

      setTimeout(() => {
        observer.next({ event: 'test', data: '测试2' });
      }, 2000);

      setTimeout(() => {
        observer.next({ event: 'test', data: '测试3' });
      }, 4000);
    });
  }

  private getRedisKey(userId: string) {
    return `${RedisCache.SOCKET_ROOM}${userId}`;
  }

  private getUserId(client: Socket): string | null {
    return (client.handshake.query.userId as string) || null;
  }
}
