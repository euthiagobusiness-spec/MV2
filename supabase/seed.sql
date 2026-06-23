insert into public.companies (
  id,
  name,
  logo_url,
  primary_color,
  secondary_color,
  instagram_url,
  whatsapp,
  email,
  address,
  privacy_policy_text,
  terms_text
) values (
  '00000000-0000-4000-8000-000000000001',
  'MV2 Temporada',
  null,
  '#0f766e',
  '#14b8a6',
  'https://instagram.com/mv2temporada',
  '5512999990000',
  'contato@mv2temporada.com.br',
  'Maranduba, Ubatuba/SP',
  'A MV2 Temporada coleta apenas os dados necessarios para identificacao do responsavel pela reserva, comunicacao operacional e cumprimento de regras de hospedagem. Os dados nao sao vendidos e podem ser corrigidos ou excluidos mediante solicitacao, observadas obrigacoes legais.',
  'Ao concluir o check-in, o hospede declara ciencia das regras da casa, regras do condominio, horarios de entrada e saida, uso responsavel das areas comuns e eventuais multas por descumprimento.'
) on conflict (id) do update set
  name = excluded.name,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  instagram_url = excluded.instagram_url,
  whatsapp = excluded.whatsapp,
  email = excluded.email,
  address = excluded.address,
  privacy_policy_text = excluded.privacy_policy_text,
  terms_text = excluded.terms_text;

insert into public.properties (
  id,
  company_id,
  name,
  slug,
  cover_image_url,
  gallery_images,
  address,
  condominium_name,
  max_guests,
  checkin_time,
  checkout_time,
  wifi_name,
  wifi_password,
  parking_info,
  access_instructions,
  house_rules,
  condominium_rules,
  appliance_manual,
  amenities,
  emergency_contacts,
  is_active
) values (
  '00000000-0000-4000-8000-000000000010',
  '00000000-0000-4000-8000-000000000001',
  'Apartamento Maranduba Vista Verde',
  'maranduba-vista-verde',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  '["https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Rua Sargento Rubens Leite, Maranduba, Ubatuba/SP',
  'Condominio Maranduba',
  6,
  '15:00',
  '11:00',
  'MV2-Maranduba',
  'maranduba2026',
  'Uma vaga demarcada por apartamento. Mantenha o veiculo dentro da vaga e informe a placa no check-in.',
  'Ao chegar, apresente seu nome na portaria e informe que esta hospedado pela MV2 Temporada. A chave fica no cofre digital ao lado da porta do apartamento. A senha sera enviada no WhatsApp no dia do check-in.',
  '["Nao fumar dentro do apartamento.","Nao exceder o numero de hospedes informado na reserva.","Evite som alto e respeite o horario de silencio.","Cuide dos itens do apartamento como se fossem seus.","Nao mova moveis entre ambientes ou para areas externas."]'::jsonb,
  '["Silencio das 22h as 8h.","Piscina apenas com traje adequado e ducha previa.","Visitantes devem ser autorizados previamente.","Garagem exclusiva para veiculo cadastrado.","Descarte o lixo nos pontos indicados pelo condominio."]'::jsonb,
  '[{"title":"TV","description":"Use o controle principal para ligar. Aplicativos de streaming exigem login proprio do hospede."},{"title":"Ar-condicionado","description":"Mantenha portas e janelas fechadas durante o uso. Desligue ao sair."},{"title":"Chuveiro","description":"Ajuste a temperatura com o registro fechado e evite mudar a chave com agua corrente."},{"title":"Lixo","description":"Use sacos bem fechados e descarte na lixeira externa indicada pela portaria."}]'::jsonb,
  '["Cozinha equipada","Roupas de cama","Utensilios basicos","Ventilador","TV","Vaga de garagem"]'::jsonb,
  '[{"label":"Suporte MV2","value":"+55 12 99999-0000"},{"label":"Pronto atendimento Ubatuba","value":"192"},{"label":"Policia Militar","value":"190"},{"label":"Bombeiros","value":"193"},{"label":"Farmacia proxima","value":"Farmacia Maranduba"}]'::jsonb,
  true
) on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  cover_image_url = excluded.cover_image_url,
  address = excluded.address,
  wifi_name = excluded.wifi_name,
  wifi_password = excluded.wifi_password,
  is_active = excluded.is_active;

insert into public.reservations (
  id,
  property_id,
  guest_name,
  guest_email,
  guest_phone,
  checkin_date,
  checkout_date,
  channel,
  external_reservation_code,
  status,
  guest_portal_token,
  checkin_completed
) values (
  '00000000-0000-4000-8000-000000000020',
  '00000000-0000-4000-8000-000000000010',
  'Ana Souza',
  'ana.souza@example.com',
  '5512988887777',
  '2026-07-10',
  '2026-07-14',
  'Reserva direta',
  'MV2-001',
  'confirmed',
  'demo-maranduba-2026',
  false
) on conflict (id) do update set
  guest_name = excluded.guest_name,
  guest_email = excluded.guest_email,
  guest_phone = excluded.guest_phone,
  checkin_date = excluded.checkin_date,
  checkout_date = excluded.checkout_date,
  guest_portal_token = excluded.guest_portal_token;

insert into public.local_guide_items (
  id,
  company_id,
  category,
  title,
  description,
  address,
  google_maps_url,
  whatsapp_url,
  instagram_url,
  image_url,
  recommended,
  sort_order
) values
  ('00000000-0000-4000-8000-000000000030','00000000-0000-4000-8000-000000000001','Praias','Praia da Maranduba','Praia ampla, com mar mais tranquilo, quiosques e bom acesso para familias.','Praia da Maranduba, Ubatuba/SP','https://maps.google.com/?q=Praia+da+Maranduba',null,null,'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',true,1),
  ('00000000-0000-4000-8000-000000000031','00000000-0000-4000-8000-000000000001','Restaurantes','Restaurante Peixe com Banana','Boa opcao para almoco com frutos do mar, pratos brasileiros e ambiente familiar.','Ubatuba/SP','https://maps.google.com/?q=restaurante+ubatuba',null,'https://instagram.com','https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',true,2),
  ('00000000-0000-4000-8000-000000000032','00000000-0000-4000-8000-000000000001','Mercados','Mercado Maranduba','Mercado de apoio para compras rapidas, bebidas, itens de praia e cafe da manha.','Av. Marginal, Maranduba','https://maps.google.com/?q=mercado+maranduba',null,null,'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=80',false,3),
  ('00000000-0000-4000-8000-000000000033','00000000-0000-4000-8000-000000000001','Passeios','Passeio de escuna em Ubatuba','Roteiros para ilhas e praias com saidas em dias de mar adequado. Reserve com antecedencia.','Centro de Ubatuba','https://maps.google.com/?q=passeio+escuna+ubatuba','https://wa.me/5512999990000',null,'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',true,4),
  ('00000000-0000-4000-8000-000000000034','00000000-0000-4000-8000-000000000001','Emergencia','Pronto atendimento','Contato de emergencia para atendimento medico. Em risco imediato, ligue 192.','Ubatuba/SP','https://maps.google.com/?q=pronto+atendimento+ubatuba',null,null,'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80',false,5)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  description = excluded.description,
  image_url = excluded.image_url,
  recommended = excluded.recommended,
  sort_order = excluded.sort_order;

insert into public.extra_services (
  id,
  company_id,
  title,
  description,
  price,
  image_url,
  whatsapp_message,
  is_active
) values
  ('00000000-0000-4000-8000-000000000040','00000000-0000-4000-8000-000000000001','Late check-out','Saida estendida mediante disponibilidade para aproveitar melhor o ultimo dia.',120,'https://images.unsplash.com/photo-1496412705862-e0088f16f791?auto=format&fit=crop&w=900&q=80','Ola, gostaria de solicitar late check-out para minha reserva.',true),
  ('00000000-0000-4000-8000-000000000041','00000000-0000-4000-8000-000000000001','Kit praia','Cadeira, guarda-sol e cooler para deixar o dia de praia mais simples.',85,'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=900&q=80','Ola, gostaria de solicitar o kit praia para minha reserva.',true),
  ('00000000-0000-4000-8000-000000000042','00000000-0000-4000-8000-000000000001','Decoracao romantica','Preparacao especial para aniversarios, lua de mel ou surpresa de casal.',180,'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80','Ola, gostaria de solicitar decoracao romantica para minha reserva.',true)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  whatsapp_message = excluded.whatsapp_message,
  is_active = excluded.is_active;
