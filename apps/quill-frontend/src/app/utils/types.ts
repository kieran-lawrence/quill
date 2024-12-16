export type NestJSError = {
    status: number
    data?: {
        message?: string
        statusCode?: number
    }
}
