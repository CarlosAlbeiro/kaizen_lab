-- Script de creación de base de datos para Mi Negocio Website (Cascarón)
-- Motor recomendado: PostgreSQL

-- LIMPIEZA
DROP TABLE IF EXISTS brands CASCADE;--
--catalog_categories
DROP TABLE IF EXISTS categories CASCADE;--
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS profile CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS services CASCADE;
--service_categories
DROP TABLE IF EXISTS site_sections CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS whatsapp_config CASCADE;

-- 0. Usuarios para autenticación
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1. Configuración de visibilidad de secciones
CREATE TABLE site_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_name VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Perfil profesional
CREATE TABLE profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    fullname VARCHAR(200),
    bio TEXT,
    image_url TEXT,
    site_icon_url TEXT,
    stats_years VARCHAR(20) DEFAULT '8+',
    stats_clients VARCHAR(20) DEFAULT '500+',
    stats_products VARCHAR(20) DEFAULT '120+',
    stats_awards VARCHAR(20) DEFAULT '15',
    tiktok_video_url TEXT,
    -- WhatsApp automation settings
    auto_response_active BOOLEAN DEFAULT true,
    wa_msg_advice TEXT DEFAULT 'Hola! He visto tu perfil y me gustaría recibir asesoría.',
    wa_msg_product TEXT DEFAULT 'Hola! Me interesa este producto: {product}',
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Información de contacto
CREATE TABLE contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    whatsapp TEXT,
    instagram_url TEXT,
    instagram_active BOOLEAN DEFAULT true,
    tiktok_url TEXT,
    tiktok_active BOOLEAN DEFAULT true,
    facebook_url TEXT,
    facebook_active BOOLEAN DEFAULT true,
    youtube_url TEXT,
    youtube_active BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Marcas de productos
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Categorías unificadas
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('service', 'product')),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Colecciones (vinculadas a una categoría de tipo 'product')
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Servicios
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Productos del catálogo (ahora vinculados a collections, no directamente a categories)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    reference VARCHAR(100),
    notes TEXT,
    description TEXT,
    price DECIMAL(10, 2),
    image_url TEXT,
    is_promotion BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Solicitudes de asesoría (WhatsApp)
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) NOT NULL,
    location TEXT,
    request_date DATE DEFAULT CURRENT_DATE,
    request_time TIME DEFAULT CURRENT_TIME,
    status VARCHAR(20) DEFAULT 'pendiente',
    -- Legal and tracking fields
    consent_given BOOLEAN DEFAULT false,
    ip_address VARCHAR(50),
    policy_version VARCHAR(20) DEFAULT 'v1.0',
    source VARCHAR(50) DEFAULT 'web',
    product_info TEXT,
    product_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Clientes
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    city VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 11. Configuración de WhatsApp (Estado del Cliente Web)
CREATE TABLE whatsapp_config (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'disconnected',
    qr_code TEXT,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES recomendados para las nuevas relaciones
CREATE INDEX idx_collections_category_id ON collections(category_id);
CREATE INDEX idx_products_collection_id ON products(collection_id);

-- DATOS INICIALES
INSERT INTO users (username, password) VALUES ('admin', '$2b$10$LAiUy84l0hoZEzX3rk1vRu4VpmU9WYMFP5SS5FmfCftFE19nnwRRy'); -- pass: admin123 (demo)

INSERT INTO site_sections (section_name, is_active) VALUES 
('hero', true), ('services', true), ('catalog', true), ('profile', true), ('contact', true);

INSERT INTO profile (name, bio, is_active) VALUES 
('Mi Negocio', 'Descripción breve de tu negocio y lo que haces para tus clientes...', true);

INSERT INTO contact_info (phone, email, address, instagram_url) VALUES 
('+57 300 000 0000', 'contacto@minegocio.com', 'Ciudad, País', 'https://instagram.com/minegocio');

INSERT INTO whatsapp_config (status) VALUES ('disconnected');