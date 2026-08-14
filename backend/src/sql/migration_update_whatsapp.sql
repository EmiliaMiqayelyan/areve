-- Run once on existing databases to update WhatsApp contact details.
UPDATE settings
SET
  business_phone = '041802122',
  whatsapp_url = 'https://wa.me/37441802122',
  telegram_url = 'https://t.me/+37441802122'
WHERE id = 1;
