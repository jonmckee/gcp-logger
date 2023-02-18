import correlator from "correlation-id";
import winston from "winston";

const withCorrelationId = (handler) => (req, res) => {
    const existingId = req.headers['correlation-id']

    if (existingId) {
        correlator.withId(existingId, () => handler(req, res))
    } else {
        correlator.withId(() => {
            req.headers['correlation-id'] = correlator.getId()

            handler(req, res)
        })
    }
}

const createLogger = () => winston.createLogger({
    format: winston.format.combine(
        winston.format((info) => {
            info.correlationId = correlator.getId()

            return info
        })(),
        winston.format.json()
    ),
    transports: [new winston.transports.Console()],
})

export {
    createLogger,
    withCorrelationId
}