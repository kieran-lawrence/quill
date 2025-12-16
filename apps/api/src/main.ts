import 'dotenv/config'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import session from 'express-session'
import { DataSource } from 'typeorm'
import { SessionEntity } from '@repo/api'
import { TypeormStore } from 'connect-typeorm'
import passport from 'passport'

async function bootstrap() {
    const { PORT, COOKIE_SECRET, COOKIE_MAX_AGE, SESSION_NAME } = process.env

    const app = await NestFactory.create(AppModule)
    const globalPrefix = 'api'
    const sessionRepo = app.get(DataSource).getRepository(SessionEntity)
    app.setGlobalPrefix(globalPrefix)
    app.enableCors({ origin: [`http://localhost:3000`], credentials: true })
    app.use(
        session({
            secret: COOKIE_SECRET,
            resave: true,
            name: SESSION_NAME,
            saveUninitialized: true,
            cookie: { maxAge: Number(COOKIE_MAX_AGE) },
            store: new TypeormStore().connect(sessionRepo),
        }),
    )
    app.use(passport.initialize())
    app.use(passport.session())
    try {
        await app.listen(PORT, () =>
            Logger.log(
                `🚀 Quill [Backend] is running on: http://localhost:${PORT}/${globalPrefix}`,
            ),
        )
    } catch (err) {
        Logger.error(`🔥 Oh noez, something went wrong! 🔥`, err)
    }
}

void bootstrap()
