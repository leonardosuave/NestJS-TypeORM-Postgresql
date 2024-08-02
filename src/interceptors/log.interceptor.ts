import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

// next.handle() -> Chama a rota desejada.
// pipe() -> Pega o retorno da rota chamada no next.hendle() e executa outra operação, no caso mostra o tempo de execução. Após isso pega o retorno da chama e retorna no response do request.

export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const dt = Date.now();
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();

        console.log(`Method: ${request.method} - URL: ${request.url}`);
        console.log(`Execution time: ${Date.now() - dt}`);
      }),
    );
  }
}
