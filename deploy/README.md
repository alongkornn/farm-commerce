# Frontend Deployment

| Branch | GitHub Environment | Server directory | Container |
|---|---|---|---|
| `dev` | `development` | `/opt/farm-commerce/dev` | `farm-frontend-dev` |
| `stg` | `staging` | `/opt/farm-commerce/stg` | `farm-frontend-stg` |
| `uat` | `uat` | `/opt/farm-commerce/uat` | `farm-frontend-uat` |
| `prod` | `production` | `/opt/farm-commerce/prod` | `farm-frontend-prod` |

Create the server directories and shared proxy network:

```bash
docker network inspect proxy >/dev/null 2>&1 || docker network create proxy
sudo mkdir -p /opt/farm-commerce/{dev,stg,uat,prod}
sudo chown -R deploy:deploy /opt/farm-commerce
```

Create GitHub Environments named `development`, `staging`, `uat`, and
`production`. Add these secrets to each environment:

- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY`
- `SERVER_KNOWN_HOSTS`
- `DEPLOY_PATH`
- `APP_ENV_FILE`
- `GHCR_USERNAME`
- `GHCR_TOKEN`

Add the non-secret Environment variable `NEXT_PUBLIC_API_URL`. It is embedded
into the browser bundle while the Docker image is built.

Example development values:

```text
DEPLOY_PATH=/opt/farm-commerce/dev
NEXT_PUBLIC_API_URL=https://api-dev.nexdev-tech.com/api/v1
```

Example development `APP_ENV_FILE`:

```env
COMPOSE_PROJECT_NAME=farm-frontend-dev
APP_CONTAINER_NAME=farm-frontend-dev
APP_URL=https://farm-dev.nexdev-tech.com
IMAGE=ghcr.io/alongkornn/farm-commerce:dev
```

Pushes deploy automatically:

```text
dev  -> development
stg  -> staging
uat  -> uat
prod -> production
```

Manual rollback:

```bash
cd /opt/farm-commerce/ENVIRONMENT
./scripts/rollback.sh
```
