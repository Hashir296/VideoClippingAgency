// Simulated transactional email hook. Swap the body for Resend / SendGrid / SES.
export async function sendAuditConfirmation(lead) {
  await new Promise((r) => setTimeout(r, 50));
  console.log(`[email:simulated] audit confirmation -> ${lead.email} (lead ${lead._id})`);
  return { queued: true, to: lead.email, template: 'audit-confirmation' };
}

export async function sendContactReceipt(contact) {
  console.log(`[email:simulated] contact receipt -> ${contact.email}`);
  return { queued: true };
}
