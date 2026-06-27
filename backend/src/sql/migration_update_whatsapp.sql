-- Run once on existing databases to update WhatsApp contact details.
UPDATE settings
SET
  business_phone = '+374 41 83 21 22',
  whatsapp_url = 'https://wa.me/37441832122'
WHERE id = 1;
