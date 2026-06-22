export function isAllowedEmailProvider(email: string) {
  const allowedDomains = ['gmail.com', 'outlook.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return allowedDomains.includes(domain);
}
