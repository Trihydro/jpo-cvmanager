ALTER TABLE cvmanager.users
        ADD receive_error_emails bit(1) NOT NULL
    DEFAULT B'0';