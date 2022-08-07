import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // in case the request is an http
    const request = context.switchToHttp().getRequest();

    // in case the request is a web socket
    const wsClient = context.switchToWs().getClient();

    const wsToken = wsClient?.handshake?.auth?.token;
    const tokenFromQuery = request?.query?.['access-token'];
    const tokenFromHeader =
      request?.headers?.['Authorization'] ??
      request?.headers?.['authorization'];

    const token = tokenFromQuery
      ? // if an access token in the query
        tokenFromQuery
      : tokenFromHeader
      ? // else if an access token in the header
        tokenFromHeader
      : // else if its a web socket
        wsToken;

    // [TODO] call auth-service to verify the access token
    return true;
  }
}
