import { Catch, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const error = exception.getError();

    if (error.toString().includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        message: error
          .toString()
          .substring(0, error.toString().indexOf('Empty response') - 1),
      });
    }

    if (typeof error === 'object' && 'status' in error && 'message' in error) {
      const status = isNaN(+error.status) ? 400 : error.status;
      return response.status(status).json(error);
    }

    response.status(400).json({
      status: 400,
      message: error,
    });
  }
}
