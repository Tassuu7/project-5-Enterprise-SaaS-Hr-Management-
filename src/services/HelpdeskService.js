/**
 * WorkSphere Enterprise HRMS - Helpdesk & Grievance Ticketing Service
 * Layer: Business Logic (Services)
 */

const helpdeskRepository = require('../repositories/HelpdeskRepository');
const db = require('../database/connection');
const { ValidationError, NotFoundError } = require('../core/AppError');

class HelpdeskService {
  async createTicket(data, tenantId = 'org_tenant_enterprise_001') {
    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;
    return helpdeskRepository.create({
      tenant_id: tenantId,
      ticket_number: ticketNumber,
      employee_id: data.employeeId,
      category: data.category || 'HR_QUERY',
      subject: data.subject,
      description: data.description,
      priority: data.priority || 'MEDIUM',
      status: 'OPEN',
    });
  }

  async addMessage(ticketId, senderUserId, message, isInternal = 0) {
    const ticket = await helpdeskRepository.findById(ticketId);
    if (!ticket) throw new NotFoundError('HelpdeskTicket', ticketId);

    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.run(
      'INSERT INTO ticket_messages (id, ticket_id, sender_user_id, message, is_internal_note) VALUES (?, ?, ?, ?, ?)',
      [msgId, ticketId, senderUserId, message, isInternal]
    );

    await helpdeskRepository.update(ticketId, { updated_at: new Date().toISOString() });
    return { messageId: msgId, status: 'SENT' };
  }

  async getTicketDetails(ticketId) {
    const ticket = await helpdeskRepository.findById(ticketId);
    if (!ticket) throw new NotFoundError('HelpdeskTicket', ticketId);

    const messages = await db.all(
      `SELECT m.*, u.first_name, u.last_name, u.role
       FROM ticket_messages m
       JOIN users u ON m.sender_user_id = u.id
       WHERE m.ticket_id = ?
       ORDER BY m.created_at ASC`,
      [ticketId]
    );

    ticket.messages = messages;
    return ticket;
  }
}

module.exports = new HelpdeskService();
