/**
 * WorkSphere Enterprise HRMS - Asynchronous Domain Event Bus
 * Layer: Core
 */

const EventEmitter = require('events');
const logger = require('./Logger');

class DomainEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
    this.initDefaultListeners();
  }

  publish(eventName, payload) {
    const eventData = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      eventName,
      occurredAt: new Date().toISOString(),
      payload,
    };
    logger.debug(`[EventBus] Emitting event: ${eventName}`, { eventId: eventData.eventId });
    this.emit(eventName, eventData);
    this.emit('*', eventData);
    return eventData;
  }

  subscribe(eventName, handler) {
    this.on(eventName, async (data) => {
      try {
        await handler(data);
      } catch (err) {
        logger.error(`[EventBus] Error executing subscriber for ${eventName}`, err);
      }
    });
  }

  initDefaultListeners() {
    this.on('EMPLOYEE_ONBOARDED', (data) => {
      logger.info(`[EventBus Handler] Welcome email triggered for employee ${data.payload.employeeId}`);
    });
    this.on('PAYROLL_DISBURSED', (data) => {
      logger.info(`[EventBus Handler] Payslip notification dispatch for batch ${data.payload.batchId}`);
    });
    this.on('LEAVE_STATUS_CHANGED', (data) => {
      logger.info(`[EventBus Handler] Leave notification for request ${data.payload.requestId}`);
    });
  }
}

module.exports = new DomainEventBus();
