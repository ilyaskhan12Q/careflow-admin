
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'pharmacist', 'lab_technician', 'receptionist', 'patient');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
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

-- Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Patients table
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    patient_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    blood_type TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    medical_history JSONB DEFAULT '[]'::jsonb,
    allergies TEXT[],
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deceased')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Doctors table
CREATE TABLE public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    doctor_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    department TEXT,
    phone TEXT,
    email TEXT,
    license_number TEXT,
    qualification TEXT,
    experience_years INTEGER DEFAULT 0,
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    availability JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_number TEXT UNIQUE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    type TEXT DEFAULT 'consultation' CHECK (type IN ('consultation', 'follow_up', 'emergency', 'checkup')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    reason TEXT,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Medicines table
CREATE TABLE public.medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    generic_name TEXT,
    category TEXT,
    manufacturer TEXT,
    unit TEXT DEFAULT 'tablet',
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    minimum_stock INTEGER DEFAULT 10,
    expiry_date DATE,
    batch_number TEXT,
    storage_conditions TEXT,
    requires_prescription BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

-- Prescriptions table
CREATE TABLE public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_number TEXT UNIQUE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    diagnosis TEXT,
    notes TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dispensed', 'cancelled', 'expired')),
    valid_until DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Prescription items table
CREATE TABLE public.prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE NOT NULL,
    medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;

-- Lab tests table
CREATE TABLE public.lab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_code TEXT UNIQUE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    test_name TEXT NOT NULL,
    test_category TEXT,
    sample_type TEXT,
    sample_collected_at TIMESTAMP WITH TIME ZONE,
    sample_collected_by UUID REFERENCES auth.users(id),
    results JSONB,
    normal_range TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sample_collected', 'processing', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'critical')),
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lab_tests ENABLE ROW LEVEL SECURITY;

-- Invoices table
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded', 'cancelled')),
    payment_method TEXT,
    due_date DATE,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Invoice items table
CREATE TABLE public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    item_type TEXT CHECK (item_type IN ('consultation', 'medicine', 'lab_test', 'procedure', 'other')),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON public.medicines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lab_tests_updated_at BEFORE UPDATE ON public.lab_tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email), NEW.email);
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate patient code function
CREATE OR REPLACE FUNCTION public.generate_patient_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.patient_code IS NULL THEN
        NEW.patient_code := 'PAT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_patient_code_trigger BEFORE INSERT ON public.patients FOR EACH ROW EXECUTE FUNCTION public.generate_patient_code();

-- RLS Policies

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Patients policies
CREATE POLICY "Staff can view patients" ON public.patients FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'receptionist') OR
    public.has_role(auth.uid(), 'lab_technician') OR
    public.has_role(auth.uid(), 'pharmacist')
);
CREATE POLICY "Staff can insert patients" ON public.patients FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'receptionist')
);
CREATE POLICY "Staff can update patients" ON public.patients FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'receptionist')
);
CREATE POLICY "Patients can view own record" ON public.patients FOR SELECT USING (user_id = auth.uid());

-- Doctors policies
CREATE POLICY "Anyone authenticated can view doctors" ON public.doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage doctors" ON public.doctors FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Doctors can update own profile" ON public.doctors FOR UPDATE USING (user_id = auth.uid());

-- Appointments policies
CREATE POLICY "Staff can view appointments" ON public.appointments FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'receptionist')
);
CREATE POLICY "Staff can manage appointments" ON public.appointments FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'receptionist')
);
CREATE POLICY "Doctors can view own appointments" ON public.appointments FOR SELECT USING (
    doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
);

-- Medicines policies
CREATE POLICY "Staff can view medicines" ON public.medicines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Pharmacists can manage medicines" ON public.medicines FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'pharmacist')
);

-- Prescriptions policies
CREATE POLICY "Staff can view prescriptions" ON public.prescriptions FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'pharmacist')
);
CREATE POLICY "Doctors can create prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'doctor')
);
CREATE POLICY "Doctors can update own prescriptions" ON public.prescriptions FOR UPDATE USING (
    doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()) OR
    public.has_role(auth.uid(), 'admin')
);

-- Prescription items policies
CREATE POLICY "Staff can view prescription items" ON public.prescription_items FOR SELECT USING (
    prescription_id IN (SELECT id FROM public.prescriptions)
);
CREATE POLICY "Doctors can manage prescription items" ON public.prescription_items FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'doctor')
);

-- Lab tests policies
CREATE POLICY "Staff can view lab tests" ON public.lab_tests FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'lab_technician')
);
CREATE POLICY "Staff can create lab tests" ON public.lab_tests FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'lab_technician')
);
CREATE POLICY "Lab technicians can update lab tests" ON public.lab_tests FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'lab_technician')
);

-- Invoices policies
CREATE POLICY "Staff can view invoices" ON public.invoices FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'receptionist')
);
CREATE POLICY "Staff can manage invoices" ON public.invoices FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'receptionist')
);

-- Invoice items policies
CREATE POLICY "Staff can view invoice items" ON public.invoice_items FOR SELECT USING (
    invoice_id IN (SELECT id FROM public.invoices)
);
CREATE POLICY "Staff can manage invoice items" ON public.invoice_items FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'receptionist')
);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lab_tests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prescriptions;
