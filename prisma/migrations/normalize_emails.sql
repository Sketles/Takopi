-- Migración: Normalizar emails a lowercase
-- Fecha: 2025-01-20
-- Descripción: Convierte todos los emails en la tabla users a minúsculas
--              para evitar problemas de case-sensitivity en login

-- Actualizar todos los emails a lowercase
UPDATE users 
SET email = LOWER(TRIM(email))
WHERE email != LOWER(TRIM(email));

-- Opcional: Agregar constraint para forzar lowercase en el futuro
-- ALTER TABLE users ADD CONSTRAINT check_email_lowercase 
-- CHECK (email = LOWER(email));
