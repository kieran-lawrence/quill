export type NestJSError = {
    status: number
    data?: {
        message?: string
        statusCode?: number
    }
    message?: string
    error?: string
    statusCode?: number
}
