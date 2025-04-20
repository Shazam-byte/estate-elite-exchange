-- Create the properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  agent_id UUID NOT NULL,
  property_type TEXT NOT NULL DEFAULT 'house',
  listing_type TEXT NOT NULL DEFAULT 'sale',
  status TEXT NOT NULL DEFAULT 'pending',
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  area NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT valid_property_type CHECK (property_type IN ('house', 'apartment', 'condo', 'townhouse', 'land', 'commercial')),
  CONSTRAINT valid_listing_type CHECK (listing_type IN ('sale', 'rent'))
);

-- Create the users table with role-based access control
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT valid_role CHECK (role IN ('user', 'agent', 'admin'))
);

-- Create the favorites table for users to save properties
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, property_id)
);

-- Create the messages table for communication between users and agents
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create the appointments table for property viewings
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT valid_appointment_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Add some sample users
INSERT INTO users (id, email, role, name, phone, created_at) VALUES
  ('d7bed21c-5a38-4c46-9d75-22e27cc3f0e0', 'admin@example.com', 'admin', 'Admin User', '+1234567890', NOW()),
  ('d7bed21c-5a38-4c46-9d75-22e27cc3f0e1', 'agent1@example.com', 'agent', 'John Agent', '+1234567891', NOW()),
  ('d7bed21c-5a38-4c46-9d75-22e27cc3f0e2', 'agent2@example.com', 'agent', 'Jane Agent', '+1234567892', NOW()),
  ('d7bed21c-5a38-4c46-9d75-22e27cc3f0e3', 'user1@example.com', 'user', 'Bob User', '+1234567893', NOW()),
  ('d7bed21c-5a38-4c46-9d75-22e27cc3f0e4', 'user2@example.com', 'user', 'Alice User', '+1234567894', NOW());

-- Add sample properties
INSERT INTO properties (
  title,
  description,
  price,
  location,
  image_urls,
  agent_id,
  property_type,
  listing_type,
  status,
  bedrooms,
  bathrooms,
  area
) VALUES
  (
    'Luxury Waterfront Villa',
    'Beautiful 4-bedroom villa with stunning ocean views and modern amenities. Features include a private pool, smart home technology, and a gourmet kitchen.',
    1500000,
    'Miami Beach, FL',
    ARRAY[
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd812'
    ],
    'd7bed21c-5a38-4c46-9d75-22e27cc3f0e1',
    'house',
    'sale',
    'approved',
    4,
    3,
    3500
  ),
  (
    'Modern Downtown Apartment',
    'Stylish 2-bedroom apartment in the heart of the city. Walking distance to restaurants, shops, and public transport.',
    750000,
    'Downtown Miami, FL',
    ARRAY[
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0268'
    ],
    'd7bed21c-5a38-4c46-9d75-22e27cc3f0e2',
    'apartment',
    'sale',
    'approved',
    2,
    2,
    1200
  ),
  (
    'Cozy Suburban Home',
    'Family-friendly 3-bedroom home with a large backyard. Recently renovated kitchen and bathrooms.',
    450000,
    'Coral Gables, FL',
    ARRAY[
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36995'
    ],
    'd7bed21c-5a38-4c46-9d75-22e27cc3f0e1',
    'house',
    'sale',
    'approved',
    3,
    2,
    2000
  ),
  (
    'Luxury Penthouse',
    'Stunning penthouse with panoramic city views. Features include a private terrace and high-end finishes.',
    2000000,
    'Brickell, Miami, FL',
    ARRAY[
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c751'
    ],
    'd7bed21c-5a38-4c46-9d75-22e27cc3f0e2',
    'apartment',
    'sale',
    'pending',
    3,
    3.5,
    2800
  );

-- Add sample favorites
INSERT INTO favorites (user_id, property_id, created_at) VALUES
  ('d7bed21c-5a38-4c46-9d75-22e27cc3f0e3', (SELECT id FROM properties WHERE title = 'Luxury Waterfront Villa'), NOW()),
  ('d7bed21c-5a38-4c46-9d75-22e27cc3f0e4', (SELECT id FROM properties WHERE title = 'Modern Downtown Apartment'), NOW());

-- Add sample messages
INSERT INTO messages (sender_id, receiver_id, property_id, content, created_at) VALUES
  (
    'd7bed21c-5a38-4c46-9d75-22e27cc3f0e3',
    'd7bed21c-5a38-4c46-9d75-22e27cc3f0e1',
    (SELECT id FROM properties WHERE title = 'Luxury Waterfront Villa'),
    'Hi, I''m interested in viewing this property. When would be a good time?',
    NOW()
  ),
  (
    'd7bed21c-5a38-4c46-9d75-22e27cc3f0e1',
    'd7bed21c-5a38-4c46-9d75-22e27cc3f0e3',
    (SELECT id FROM properties WHERE title = 'Luxury Waterfront Villa'),
    'Hello! I can show you the property this weekend. Would Saturday at 2 PM work for you?',
    NOW()
  );

-- Add sample appointments
INSERT INTO appointments (
  property_id,
  user_id,
  agent_id,
  appointment_date,
  status,
  notes,
  created_at
) VALUES
  (
    (SELECT id FROM properties WHERE title = 'Luxury Waterfront Villa'),
    'd7bed21c-5a38-4c46-9d75-22e27cc3f0e3',
    'd7bed21c-5a38-4c46-9d75-22e27cc3f0e1',
    NOW() + INTERVAL '2 days',
    'confirmed',
    'Client is particularly interested in the ocean views and smart home features.',
    NOW()
  ),
  (
    (SELECT id FROM properties WHERE title = 'Modern Downtown Apartment'),
    'd7bed21c-5a38-4c46-9d75-22e27cc3f0e4',
    'd7bed21c-5a38-4c46-9d75-22e27cc3f0e2',
    NOW() + INTERVAL '3 days',
    'pending',
    'Client requested a virtual tour first.',
    NOW()
  ); 