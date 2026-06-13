import { logger } from "../logger/loggerService"

export const trackEvent = (eventName: string, properties?: Record<string, any>): void => {
  const timestamp = new Date().toISOString()
  
  // Log tracking details for local verification
  logger.info(`[Analytics Event] "${eventName}"`, {
    timestamp,
    ...properties,
  })

  // Future SaaS integration configurations (e.g. Mixpanel, Amplitude, Segment)
  // if (import.meta.env.PROD) {
  //   mixpanel.track(eventName, properties);
  //   amplitude.getInstance().logEvent(eventName, properties);
  // }
}
