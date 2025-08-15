-- Ce script réinitialise les permissions de votre bucket de stockage "photos"
-- pour les configurer de manière sécurisée et fonctionnelle.
-- Exécutez ce bloc de code en entier dans l'éditeur SQL de Supabase.

-- Étape 1 : Supprimer l'ancienne politique "catch-all" si elle existe.
DROP POLICY IF EXISTS "Public Photos Access" ON storage.objects;

-- Étape 2 : Créer une politique pour autoriser la LECTURE (SELECT) publique des images.
-- C'est cette règle qui va corriger les images cassées.
CREATE POLICY "Public Read Access" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'photos');

-- Étape 3 : Créer une politique pour autoriser l'ÉCRITURE (INSERT) de nouvelles images.
-- C'est cette règle qui permet le téléversement (upload).
CREATE POLICY "Public Insert Access" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'photos');
