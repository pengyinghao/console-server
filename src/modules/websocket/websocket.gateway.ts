import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Observable } from 'rxjs';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection {
  handleConnection(client: Socket) {
    console.log(client.id, '连接成功', client.handshake.query);
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('test')
  test(@MessageBody() data: any) {
    // this.server.to().emit('test', '指定人接收');

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
}
