import { HttpRequest, HttpResponse, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { environment } from '../../environments/environment';

describe('authInterceptor', () => {
  it('should add the Authorization header with Basic credentials', async () => {
    const req = new HttpRequest('GET', '/test');

    const next: HttpHandlerFn = (r: HttpRequest<any>) => {
      return of(new HttpResponse({
        status: 200,
        body: {},
        headers: r.headers
      }));
    };

    const result: HttpEvent<any> = await firstValueFrom(authInterceptor(req, next));

    if (result instanceof HttpResponse) {
      const expectedCredentials = `Basic ${btoa(`${environment.username}:${environment.password}`)}`;

      expect(result.headers.has('Authorization')).toBeTrue();
      expect(result.headers.get('Authorization')).toEqual(expectedCredentials);
    } else {
      fail('Interceptor did not return an HttpResponse');
    }
  });
});
