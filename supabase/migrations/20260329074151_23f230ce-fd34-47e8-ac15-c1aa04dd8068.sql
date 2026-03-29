
-- ============================================================
-- MannPasandd Kirana Exchange — Full Database Schema
-- ============================================================

-- ENUMS
CREATE TYPE public.location_type AS ENUM ('city', 'region', 'strait');
CREATE TYPE public.buyer_type AS ENUM ('one_time', 'frequent', 'ratib');
CREATE TYPE public.app_role AS ENUM ('customer', 'vendor', 'admin');
CREATE TYPE public.base_unit AS ENUM ('gm', 'kg', 'piece', 'litre', 'ml');
CREATE TYPE public.order_status AS ENUM ('placed', 'confirmed', 'packed', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled');
CREATE TYPE public.payment_method AS ENUM ('online', 'cod', 'credit');

-- ============================================================
-- 1. LOCATIONS
-- ============================================================
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type location_type NOT NULL DEFAULT 'city',
  country TEXT NOT NULL DEFAULT 'India',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. CURRENCIES
-- ============================================================
CREATE TABLE public.currencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  currency_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  exchange_rate_to_inr DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  is_base BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. LANGUAGES
-- ============================================================
CREATE TABLE public.languages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  rtl BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. DELIVERY PARTNERS
-- ============================================================
CREATE TABLE public.delivery_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  fuel_type TEXT,
  is_default_for_strait BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  phone TEXT,
  buyer_type buyer_type NOT NULL DEFAULT 'one_time',
  preferred_currency_id UUID REFERENCES public.currencies(id),
  preferred_language_id UUID REFERENCES public.languages(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Roles in separate table per security best practices
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'customer',
  UNIQUE (user_id, role)
);

-- ============================================================
-- 6. ADDRESSES
-- ============================================================
CREATE TABLE public.addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  full_address TEXT NOT NULL,
  city TEXT,
  pincode TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 7. STORES
-- ============================================================
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location_id UUID REFERENCES public.locations(id),
  address TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  service_radius_km DOUBLE PRECISION NOT NULL DEFAULT 5.0,
  credit_radius_km DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 8. CATEGORIES
-- ============================================================
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.categories(id),
  icon_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 9. PRODUCTS
-- ============================================================
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  base_unit base_unit NOT NULL DEFAULT 'piece',
  base_price_inr DOUBLE PRECISION NOT NULL DEFAULT 0,
  min_order_qty INTEGER NOT NULL DEFAULT 1,
  max_order_qty INTEGER NOT NULL DEFAULT 100,
  description TEXT,
  image_url TEXT,
  season_tag TEXT,
  religion_tag TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 10. STORE PRODUCTS
-- ============================================================
CREATE TABLE public.store_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  vendor_price_inr DOUBLE PRECISION NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  min_order_qty INTEGER,
  max_order_qty INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, product_id)
);

-- ============================================================
-- 11. ORDERS
-- ============================================================
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id),
  address_id UUID REFERENCES public.addresses(id),
  status order_status NOT NULL DEFAULT 'placed',
  payment_method payment_method NOT NULL DEFAULT 'cod',
  delivery_partner_id UUID REFERENCES public.delivery_partners(id),
  total_inr DOUBLE PRECISION NOT NULL DEFAULT 0,
  currency_id UUID REFERENCES public.currencies(id),
  total_display TEXT,
  placed_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  packed_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  out_for_delivery_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  driver_name TEXT,
  driver_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 12. ORDER ITEMS
-- ============================================================
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  store_product_id UUID NOT NULL REFERENCES public.store_products(id),
  product_name TEXT NOT NULL,
  quantity_in_base_unit DOUBLE PRECISION NOT NULL,
  unit_price_inr DOUBLE PRECISION NOT NULL,
  line_total_inr DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_store_products_updated_at BEFORE UPDATE ON public.store_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- BUSINESS LOGIC: get_nearby_stores (Haversine)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_nearby_stores(user_lat DOUBLE PRECISION, user_lng DOUBLE PRECISION, radius_km DOUBLE PRECISION DEFAULT 5.0)
RETURNS TABLE(store_id UUID, store_name TEXT, distance_km DOUBLE PRECISION) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.name,
    (6371 * acos(
      cos(radians(user_lat)) * cos(radians(s.latitude)) *
      cos(radians(s.longitude) - radians(user_lng)) +
      sin(radians(user_lat)) * sin(radians(s.latitude))
    )) AS distance_km
  FROM public.stores s
  WHERE s.is_active = true
    AND (6371 * acos(
      cos(radians(user_lat)) * cos(radians(s.latitude)) *
      cos(radians(s.longitude) - radians(user_lng)) +
      sin(radians(user_lat)) * sin(radians(s.latitude))
    )) <= radius_km
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- ============================================================
-- BUSINESS LOGIC: check_credit_eligibility
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_credit_eligibility(user_lat DOUBLE PRECISION, user_lng DOUBLE PRECISION)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.stores s
    WHERE s.is_active = true
      AND (6371 * acos(
        cos(radians(user_lat)) * cos(radians(s.latitude)) *
        cos(radians(s.longitude) - radians(user_lng)) +
        sin(radians(user_lat)) * sin(radians(s.latitude))
      )) <= s.credit_radius_km
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- ============================================================
-- TRIGGER: Ratib username validation
-- ============================================================
CREATE OR REPLACE FUNCTION public.validate_ratib_username()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.buyer_type = 'ratib' THEN
    IF NEW.display_name IS NULL OR position('rtb' IN lower(NEW.display_name)) = 0 THEN
      RAISE EXCEPTION 'Ratib buyers must have "rtb" in their display name';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_ratib_before_insert
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_ratib_username();

-- ============================================================
-- SECURITY DEFINER: has_role function
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User Roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Addresses
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own addresses" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own addresses" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own addresses" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- Locations (public read)
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read locations" ON public.locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage locations" ON public.locations FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Currencies (public read)
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read currencies" ON public.currencies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage currencies" ON public.currencies FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Languages (public read)
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read languages" ON public.languages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage languages" ON public.languages FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Delivery Partners (public read)
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read delivery_partners" ON public.delivery_partners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage delivery_partners" ON public.delivery_partners FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Categories (public read)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read categories" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Products (public read)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Stores (public read)
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read stores" ON public.stores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Vendors manage own store" ON public.stores FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Admins manage stores" ON public.stores FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Store Products (public read)
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read store_products" ON public.store_products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Vendors manage own store_products" ON public.store_products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins manage store_products" ON public.store_products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Customers insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Vendors read store orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND owner_id = auth.uid())
);
CREATE POLICY "Vendors update store orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND customer_id = auth.uid())
);
CREATE POLICY "Users insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND customer_id = auth.uid())
);
CREATE POLICY "Vendors read store order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    JOIN public.stores s ON o.store_id = s.id
    WHERE o.id = order_id AND s.owner_id = auth.uid()
  )
);
CREATE POLICY "Admins manage order_items" ON public.order_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- SEED DATA
-- ============================================================

-- Locations
INSERT INTO public.locations (name, type, country, latitude, longitude) VALUES
  ('Pune', 'city', 'India', 18.5204, 73.8567),
  ('Mumbai', 'city', 'India', 19.0760, 72.8777),
  ('Satara', 'city', 'India', 17.6805, 74.0183),
  ('Karad', 'city', 'India', 17.2875, 74.1845),
  ('Sangli', 'city', 'India', 16.8524, 74.5815),
  ('Kolhapur', 'city', 'India', 16.7050, 74.2433),
  ('Strait of Hormuz', 'strait', 'International', 26.5940, 56.2500);

-- Currencies
INSERT INTO public.currencies (currency_code, name, exchange_rate_to_inr, is_base, is_active) VALUES
  ('INR', 'Indian Rupee', 1.0, true, true),
  ('AED', 'UAE Dirham', 22.5, false, true),
  ('USD', 'US Dollar', 83.5, false, true);

-- Languages
INSERT INTO public.languages (code, name, native_name, rtl, is_active) VALUES
  ('en', 'English', 'English', false, true),
  ('hi', 'Hindi', 'हिन्दी', false, true),
  ('mr', 'Marathi', 'मराठी', false, true),
  ('ar', 'Arabic', 'العربية', true, true),
  ('ur', 'Urdu', 'اردو', true, true);

-- Delivery Partners
INSERT INTO public.delivery_partners (name, tagline, fuel_type, is_default_for_strait) VALUES
  ('Greencharged Porters', 'EV & CNG fleet', 'EV/CNG', false),
  ('World Peace Airbenders', 'Air delivery', 'Air', true);

-- Categories
INSERT INTO public.categories (name, icon_url) VALUES
  ('Groceries', '🛒'),
  ('Personal Care', '🧴'),
  ('Cleaning', '🧹'),
  ('Household Appliances', '🔌'),
  ('Household Clothes', '👕'),
  ('Prayer Needs', '🪔'),
  ('Seasonal Items', '🎋'),
  ('Bakery Materials', '🧁'),
  ('Ready to Eat', '🍱');
