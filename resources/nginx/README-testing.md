### Local Testing Documentation for NGINX SSL Proxy

This documentation provides instructions for setting up and testing the NGINX SSL proxy locally. The NGINX proxy serves as the entry point for the JPO CV Manager, handling SSL termination and routing requests to the webapp, API, and Keycloak services.

#### Prerequisites

- **Docker and Docker Compose**: Ensure you have Docker installed and running on your machine.
- **OpenSSL**: Required for generating self-signed certificates.
- **Root/Administrator Access**: Needed to modify the local `hosts` file.

#### 1. Generate Self-Signed Certificates

The NGINX configuration expects SSL certificates in the `resources/nginx/ssl` directory. You can generate these for local testing using the following commands:

```bash
# Navigate to the nginx resources directory
cd resources/nginx

# Create the ssl directory if it doesn't exist
mkdir -p ssl

# Generate a self-signed certificate and private key with SAN
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/server.key -out ssl/server.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=cvmanager.local.com" \
  -addext "subjectAltName = DNS:cvmanager.local.com"
```

*Note: Ensure the `CN` (Common Name) and `subjectAltName` match the `WEBAPP_DOMAIN` defined in your `.env` file. Modern browsers and libraries (like Python's `requests`) require the `subjectAltName` extension for proper hostname verification.*

#### 2. Configure Local Domain

To access the services using the configured domain name (e.g., `cvmanager.local.com`), you need to update your local `hosts` file.

**For Linux/macOS:**
Add the following line to `/etc/hosts`:
```
<WSL_IP_ADDRESS> cvmanager.local.com
```

**For Windows:**
Add the following line to `C:\Windows\System32\drivers\etc\hosts` (run Notepad as Administrator):
```
<WSL_IP_ADDRESS> cvmanager.local.com
```

*Note: Replace `<WSL_IP_ADDRESS>` with your actual WSL2 IP address. You can find this by running `hostname -I` in your WSL terminal.*

#### 3. Environment Configuration

Ensure your `.env` file is properly configured. You can use `sample.env` as a template. Key variables for the NGINX setup include:

```env
DOCKER_HOST_IP=<WSL_IP_ADDRESS>
WEBAPP_DOMAIN=cvmanager.local.com
WEBAPP_HOST_IP=${DOCKER_HOST_IP}
NGINX_PROXY_RESOURCES=./resources/nginx
PG_SSL_REQUIRED=False
```

*Note: `PG_SSL_REQUIRED=False` is required when connecting to the local Postgres container, as it does not have SSL enabled.*

#### 4. Run the Setup

To test the NGINX proxy, you only need to start the NGINX service along with its dependencies (WebApp, API, Keycloak, and Postgres). Use the following command to start the necessary services:

```bash
# From the project root
docker compose --profile nginx_proxy --profile basic --profile webapp up --build
```

*Note: The `basic` profile includes `cvmanager_api`, `cvmanager_keycloak`, and `cvmanager_postgres`.*

Alternatively, if you want to run everything:
```bash
docker compose up --build
```

The `cvmanager_nginx_proxy` service will:
1. Generate `dhparam.pem` using the `gen_dhparam.sh` script if it's missing.
2. Substitute environment variables in the `nginx-ssl.conf` template.
3. Start NGINX on ports 80 and 443.

The `cvmanager_api` service is also configured to trust the generated `server.crt` certificate. This is necessary because the API communicates with Keycloak over HTTPS using the local domain name. Since the certificate is self-signed, it must be added to the API's truststore to avoid SSL verification errors.

#### 5. Verification

Once the services are up and running, you can verify the setup:

- **HTTP Redirection**: Navigate to `http://cvmanager.local.com`. It should automatically redirect you to `https://cvmanager.local.com`.
- **HTTPS Access**: Navigate to `https://cvmanager.local.com`. Since you are using a self-signed certificate, your browser will show a security warning. You can proceed past this warning to access the webapp.
- **API Routes**: Verify that `https://cvmanager.local.com/api/` routes to the CV Manager API.
- **Auth Routes**: Verify that `https://cvmanager.local.com/auth/` routes to the Keycloak instance.

#### Important Note on Service Endpoints

When using the NGINX proxy, all services are accessed through the same domain and port (443). Ensure your `.env` file reflects this. Specifically, the `KEYCLOAK_ENDPOINT` **must include a trailing slash** to ensure correct routing by the proxy and proper URL construction by the API:

```env
KEYCLOAK_ENDPOINT=https://cvmanager.local.com/auth/
WEBAPP_ENDPOINT=https://cvmanager.local.com
API_ENDPOINT=https://cvmanager.local.com/api
```

#### Troubleshooting

- **Certificate Errors**: If NGINX fails to start, check the logs (`docker compose logs cvmanager_nginx_proxy`) to ensure `server.crt` and `server.key` are correctly mounted in `/etc/ssl/certs/` and `/etc/ssl/private/` respectively.
- **Domain Resolution**: If you cannot reach the domain, ensure your `hosts` file was saved correctly and that you are not behind a VPN/proxy that interferes with local resolution.
- **Port Conflicts**: Ensure ports 80 and 443 are not being used by other services on your host machine.
