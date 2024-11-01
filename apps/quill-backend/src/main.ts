import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'

async function bootstrap() {
    const { PORT } = process.env

    const app = await NestFactory.create(AppModule)
    const globalPrefix = 'api'
    app.setGlobalPrefix(globalPrefix)
    app.enableCors({ origin: [`http://localhost:3000`], credentials: true })

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
