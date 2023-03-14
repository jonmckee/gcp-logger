import {getId, withId} from 'correlation-id'
import {createLogger, format, transports} from "winston";
import {LoggingWinston} from '@google-cloud/logging-winston'

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

export default createLogger({
    format: format.combine(
        format((info: any) => {
            info.correlationId = getId()

            return info
        })(),
        format.json()
    ),
    transports: [new transports.Console(), new LoggingWinston()]
})
