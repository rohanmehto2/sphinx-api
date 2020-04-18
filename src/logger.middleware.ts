import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function) {
        if (req.url != '/') {
            Logger.log(req.url, req.method);
        }
        next();
    };
}
