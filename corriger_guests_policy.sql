-- Politique pour autoriser les utilisateurs anonymes à s'ajouter à la table des invités.
-- Exécutez cette commande dans votre éditeur SQL Supabase.

CREATE POLICY "Allow anon insert on guests"
ON public.guests FOR INSERT
TO anon
WITH CHECK (true);
