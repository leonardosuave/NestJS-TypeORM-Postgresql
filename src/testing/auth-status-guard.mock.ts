import { CanActivate, ExecutionContext } from '@nestjs/common';

export const authStatusGuardMock: CanActivate = {
  canActivate: jest.fn((context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    request.userStatus = true; // simulando o status do usuário
    return true; // permitindo o acesso
  }),
};

// Precisa simular a request com a estrutura final que o guard devolve, no caso o userStatus: true
export const requestAuthStatusGuardMock = {
  headers: {
    authorization: 'Bearer mockToken',
  },
  userStatus: true, // Este campo será modificado pelo AuthStatusGuard
};
