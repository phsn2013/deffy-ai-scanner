-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create brokers table
CREATE TABLE public.brokers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  affiliate_link TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  features TEXT[],
  rating NUMERIC(3, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on brokers
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;

-- RLS policies for brokers
CREATE POLICY "Anyone can view active brokers"
ON public.brokers
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Admins can view all brokers"
ON public.brokers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert brokers"
ON public.brokers
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update brokers"
ON public.brokers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete brokers"
ON public.brokers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_brokers_updated_at
BEFORE UPDATE ON public.brokers
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert some initial broker data
INSERT INTO public.brokers (name, description, logo_url, website_url, affiliate_link, features, rating, display_order)
VALUES 
  ('Quotex', 'Plataforma de trading intuitiva com análise técnica avançada', 'https://placehold.co/200x80/10b981/white?text=Quotex', 'https://quotex.com', 'https://quotex.com/pt/sign-up', ARRAY['Análise Técnica', 'Depósito Mínimo Baixo', 'App Mobile', 'Suporte 24/7'], 4.5, 1),
  ('IQ Option', 'Corretora líder mundial em opções binárias e forex', 'https://placehold.co/200x80/3b82f6/white?text=IQ+Option', 'https://iqoption.com', 'https://iqoption.com/landing/start-trading', ARRAY['Plataforma Premiada', 'Conta Demo Grátis', 'Torneios', 'Educação Gratuita'], 4.7, 2),
  ('Pocket Option', 'Trading social e análise de mercado em tempo real', 'https://placehold.co/200x80/8b5cf6/white?text=Pocket+Option', 'https://po.trade', 'https://po.trade/pt/cabinet/demo-quick-high-low', ARRAY['Trading Social', 'Bônus de Depósito', 'Indicadores Grátis', 'Saques Rápidos'], 4.3, 3);
