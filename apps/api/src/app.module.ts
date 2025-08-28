import { UserModule } from './modules/users/user.module';
import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino/LoggerModule';
import { DatabaseModule } from 'src/database/database.module';
import { TicketModule } from './modules/tickets/ticket.module';
import { OrderModule } from './modules/orders/order.module';
import { ProductModule } from './modules/products/product.module';
import { HealthModule } from './modules/health/health.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    OrderModule,
    TicketModule,
    UserModule,
    ProductModule,
    HealthModule,
    UploadModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
        autoLogging: true,
        transport: undefined,
        redact: {
          paths: [
            'request.headers',
            'response.headers',
            'hostname',
            'pid',
            'time',
          ],
          remove: true,
        },
        customProps: () => ({
          context: 'NestApplication',
        }),
        customSuccessMessage: () => {
          return 'request completed';
        },
        customReceivedMessage() {
          return `request made`;
        },
        customAttributeKeys: {
          req: 'request',
          res: 'response',
          err: 'error',
          responseTime: 'timeTaken',
        },
        customLogLevel: (_req, res, err) => {
          if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
          if (res.statusCode >= 500 || err) return 'error';
          return 'info';
        },
      },
      exclude: [
        { method: RequestMethod.GET, path: 'healthz' },
        { method: RequestMethod.GET, path: 'user/me' },
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
  ],
})
export class AppModule { }
