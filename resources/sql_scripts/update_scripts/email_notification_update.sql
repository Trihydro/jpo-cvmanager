-- Run this SQL update script if you already have a deployed CV Manager PostgreSQL database
-- This file assumes that the email_type and user_email_notification tables exist, and that the email_type
-- table has an entry for 'Support Requests'.

DO $$
DECLARE 
    error_email_type_id INT;
BEGIN
    SELECT email_type_id INTO error_email_type_id FROM cvmanager.email_type WHERE email_type = 'Support Requests';

    INSERT INTO cvmanager.user_email_notification (user_id, email_type_id)
    SELECT user_id, error_email_type_id 
    FROM cvmanager.users
    WHERE receive_error_emails = B'1';
	
	ALTER TABLE cvmanager.users DROP Column receive_error_emails;

END $$;