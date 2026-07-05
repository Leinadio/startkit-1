export interface AnalyticsAdapter {
  track(userId: string, event: string, props?: Record<string, unknown>): void
}