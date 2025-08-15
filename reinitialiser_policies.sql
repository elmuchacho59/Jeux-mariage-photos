-- 1. Supprimer TOUTES les anciennes règles pour la table 'uploads' pour repartir à zéro.
DROP POLICY IF EXISTS "Public Photos Access" ON public.uploads;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.uploads;
DROP POLICY IF EXISTS "Allow anon insert" ON public.uploads;
DROP POLICY IF EXISTS "Allow anon select" ON public.uploads;

-- 2. Recréer la règle pour autoriser l'écriture (l'upload) par les utilisateurs anonymes.
CREATE POLICY "Allow anon insert" ON public.uploads FOR INSERT TO anon WITH CHECK (true);

-- 3. Recréer la règle pour autoriser la lecture par les utilisateurs anonymes.
CREATE POLICY "Allow anon select" ON public.uploads FOR SELECT TO anon USING (true);
