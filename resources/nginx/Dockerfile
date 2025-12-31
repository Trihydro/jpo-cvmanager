FROM nginx:alpine

# The official nginx image supports environment variable substitution in templates
# placed in /etc/nginx/templates/*.template.
# We mount the config in docker-compose, but we can also copy it here as a default.

# Ensure we have openssl for dhparam generation if needed by the script
RUN apk add --no-network --no-cache openssl || apk add --no-cache openssl

# Ensure gen_dhparam.sh is executable when mounted
COPY gen_dhparam.sh /docker-entrypoint.d/gen_dhparam.sh
RUN chmod +x /docker-entrypoint.d/gen_dhparam.sh

# The gen_dhparam.sh script will be executed by the entrypoint because it's in /docker-entrypoint.d/
