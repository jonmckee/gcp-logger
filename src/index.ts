import correlation from 'correlation-id'
import type {Logger} from 'winston';
import {createLogger, format, transports} from "winston";
import {LoggingWinston} from '@google-cloud/logging-winston'

const {withId, getId} = correlation

export const withCorrelationId = (handler: (req: any, res: any) => void) => (req: any, res: any) => {
    const existingId = req.headers['correlation-id'] as string

    if (Boolean(existingId)) {
        withId(existingId, () => handler(req, res))
    } else {
        withId(() => {
            req.headers['correlation-id'] = getId()

            handler(req, res)
        })
    }
}

const logger: Logger = createLogger({
    format: format.combine(
        format((info: any) => {
            info.correlationId = getId()

            return info
        })(),
        format.json()
    ),
    transports: [new transports.Console(), new LoggingWinston()]
})

export default logger
