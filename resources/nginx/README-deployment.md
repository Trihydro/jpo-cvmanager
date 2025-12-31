### Deployment Documentation for JPO CV Manager

This documentation provides instructions for deploying the JPO CV Manager to a VM with a specific domain name and an external PostgreSQL database. This setup uses NGINX as an SSL proxy for routing and SSL termination.

#### Prerequisites

- **Docker and Docker Compose**: Ensure you have Docker installed and running on your VM.
- **External PostgreSQL Database**: A PostgreSQL instance (version 15+ recommended) accessible from the VM.
- **SSL Certificates**: You must provide valid SSL certificates for your domain (e.g., from a corporate CA or other provider).
- **DNS Record**: A DNS A record or CNAME pointing your domain name to the VM's public IP address.

#### 1. Configure SSL Certificates

The NGINX configuration expects the provided SSL certificates in the `resources/nginx/ssl` directory. 

1.  Navigate to the NGINX resources directory:
    ```bash
    cd resources/nginx
    mkdir -p ssl
    ```
2.  Place your provided `server.crt` and `server.key` files in the `ssl` directory.
    - `resources/nginx/ssl/server.crt`
    - `resources/nginx/ssl/server.key`

#### 2. Environment Configuration

Create or update your `.env` file in the project root. You can use `sample.env` as a template. Configure the following key variables for deployment:

##### General and Domain Settings
```env
# The domain name of your deployment
WEBAPP_DOMAIN=cvmanager.example.com
KEYCLOAK_DOMAIN=cvmanager.example.com

# The public IP or internal IP of the VM where Docker is running
DOCKER_HOST_IP=<VM_IP_ADDRESS>
WEBAPP_HOST_IP=${DOCKER_HOST_IP}

# NGINX Resources path
NGINX_PROXY_RESOURCES=./resources/nginx
```

##### External PostgreSQL Settings
Configure these variables to point to your external database instead of the included container:
```env
# Connection details for the external Postgres instance
PG_DB_HOST=<EXTERNAL_PG_HOST>:<PORT>
PG_DB_NAME=<DATABASE_NAME>
PG_DB_USER=<DATABASE_USER>
PG_DB_PASS='<DATABASE_PASSWORD>'

# Enable SSL for the connection to the external database
PG_SSL_REQUIRED=True
```

##### Service Endpoints
Ensure the endpoints use the configured domain:
```env
KEYCLOAK_ENDPOINT=https://${WEBAPP_DOMAIN}/auth/
WEBAPP_ENDPOINT=https://${WEBAPP_DOMAIN}
API_ENDPOINT=https://${WEBAPP_DOMAIN}/api
```

#### 3. Update Docker Profiles

In your `.env` file, update the `COMPOSE_PROFILES` to include the necessary services but exclude the local postgres if you don't want it to run. However, since many services depend on the `basic` profile which includes `cvmanager_api` and `cvmanager_keycloak`, it is recommended to use specific service profiles or be aware that the `cvmanager_postgres` container may still start if the `basic` profile is used.

To run only the necessary services for an external DB deployment, you can use:
```env
COMPOSE_PROFILES=nginx_proxy,cvmanager_api,cvmanager_keycloak,webapp,addons
```

#### 4. Run the Deployment

Once the `.env` file and SSL certificates are in place, start the services using Docker Compose:

```bash
# From the project root
docker compose up -d --build
```

The `cvmanager_nginx_proxy` service will:
1. Generate `dhparam.pem` if it's missing.
2. Substitute environment variables in the `nginx-ssl.conf` template.
3. Start NGINX on ports 80 and 443.

#### 5. Verification

1.  **Browser Access**: Navigate to `https://cvmanager.example.com`. You should see the CV Manager login page.
2.  **SSL**: Verify that the SSL certificate is valid and issued to your domain.
3.  **Database Connection**: Check the logs for `cvmanager_api` and `cvmanager_keycloak` to ensure they successfully connected to the external database:
    ```bash
    docker compose logs cvmanager_api
    docker compose logs cvmanager_keycloak
    ```
4.  **Keycloak**: Ensure you can log in. Keycloak will automatically create its schema in the external database on the first run (using the `keycloak` schema if configured in the JDBC URL).

#### Troubleshooting

- **Database Connectivity**: Ensure the VM's IP is whitelisted in your external PostgreSQL's `pg_hba.conf` and that any firewalls allow traffic on the Postgres port (usually 5432).
- **SSL Certificate Mounts**: If NGINX fails to start, verify that the files exist at `resources/nginx/ssl/server.crt` and `resources/nginx/ssl/server.key`.
- **Domain Resolution**: Ensure your DNS is correctly configured. You can test this using `ping cvmanager.example.com` from a remote machine.
