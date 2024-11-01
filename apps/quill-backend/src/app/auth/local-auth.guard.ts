import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        return !!req.session.user
    }
}
