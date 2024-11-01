import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import * as ExpressSession from 'express-session'
import { DataSource } from 'typeorm'
import { Session } from './utils/typeorm'
import { TypeormStore } from 'connect-typeorm'

async function bootstrap() {
    const { PORT, COOKIE_SECRET, COOKIE_MAX_AGE } = process.env

    const app = await NestFactory.create(AppModule)
    const globalPrefix = 'api'
    const sessionRepo = app.get(DataSource).getRepository(Session)
    app.setGlobalPrefix(globalPrefix)
    app.enableCors({ origin: [`http://localhost:3000`], credentials: true })
    app.use(
        ExpressSession({
            secret: COOKIE_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: Number(COOKIE_MAX_AGE) },
            store: new TypeormStore().connect(sessionRepo),
        }),
    )
    try {
        await app.listen(PORT, () =>
            Logger.log(
                `🚀 Application is running on: http://localhost:${PORT}/${globalPrefix}`,
            ),
        )
    } catch (err) {
        Logger.error(`🔥 Oh noez, something went wrong! 🔥`, err)
    }
}
bootstrap()
