import { BadRequestException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import * as path from 'path'
import * as fileSystem from 'fs'
import { diskStorage } from 'multer'

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    return bcrypt.hash(password, salt)
}
export async function compareHash(
    rawPassword: string,
    hashedPassword: string,
): Promise<boolean> {
    return bcrypt.compare(rawPassword, hashedPassword)
}

export const multerOptions = {
    dest: process.env.FILE_UPLOAD_DESTINATION,
    fileFilter: (_, file, callbackFn) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            // Allow storage of file
            callbackFn(null, true)
        } else {
            // Reject file
            callbackFn(
                new BadRequestException(
                    `Unsupported file type ${path.extname(file.originalname)}`,
                ),
                false,
            )
        }
    },
    storage: diskStorage({
        // Destination storage path details
        destination: (_, __, callbackFn) => {
            const uploadPath = process.env.FILE_UPLOAD_DESTINATION
            // Create folder if doesn't exist
            if (!fileSystem.existsSync(uploadPath)) {
                fileSystem.mkdirSync(uploadPath)
            }
            callbackFn(null, uploadPath)
        },
        // File modification details
        filename: (_, file, callbackFn) => {
            // Calling the callback passing the random name generated with the original extension
            callbackFn(null, `${Date.now()}${path.extname(file.originalname)}`)
        },
    }),
}
