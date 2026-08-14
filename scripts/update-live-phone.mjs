const BASE = 'https://arevecollections.am/api';

const login = await fetch(`${BASE}/admin/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@areve.com', password: 'Areve200515!!' }),
});
if (!login.ok) {
  console.error('LOGIN FAILED:', login.status, await login.text());
  process.exit(1);
}
const { token } = await login.json();

const getRes = await fetch(`${BASE}/admin/settings`, {
  headers: { Authorization: `Bearer ${token}` },
});
if (!getRes.ok) {
  console.error('GET SETTINGS FAILED:', getRes.status, await getRes.text());
  process.exit(1);
}
const settings = await getRes.json();
console.log('BEFORE:', {
  businessPhone: settings.businessPhone,
  whatsappUrl: settings.whatsappUrl,
  telegramUrl: settings.telegramUrl,
});

settings.businessPhone = '041802122';
settings.whatsappUrl = 'https://wa.me/37441802122';
settings.telegramUrl = 'https://t.me/+37441802122';

const putRes = await fetch(`${BASE}/admin/settings`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify(settings),
});
console.log('PUT:', putRes.status, await putRes.text());

const verify = await fetch(`${BASE}/settings`);
const pub = await verify.json();
console.log('AFTER:', {
  businessPhone: pub.businessPhone,
  whatsappUrl: pub.whatsappUrl,
  telegramUrl: pub.telegramUrl,
});
