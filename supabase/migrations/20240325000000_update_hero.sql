-- Update hero content to match new quote style
UPDATE hero
SET 
  title = 'Building Better Telangana Together',
  subtitle = 'ANIL ERAVATHRI, Member of Legislative Assembly',
  image_url = 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1500'
WHERE id = (SELECT id FROM hero LIMIT 1); 