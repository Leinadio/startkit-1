import { memoryBus } from "@/lib/events/memory-bus"
import type { EventBusAdapter } from "@/lib/events/types"

export const eventBus: EventBusAdapter = memoryBus
