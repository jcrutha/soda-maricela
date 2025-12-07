# 🥤 Soda Maricela - Infraestructura & Despliegue v2.0

Documentación técnica de bajo nivel para el despliegue de `menubuilder-astro-csv` en arquitectura Docker Swarm-like (Docker + Traefik + Cloudflared).

## 🏗 Arquitectura de Sistema

El tráfico fluye a través de 4 capas de aislamiento. La seguridad se basa en un modelo "Zero Trust" donde ningún puerto de aplicación está expuesto a la IP pública.

```mermaid
[Internet] --(HTTPS/443)--> [Cloudflare Edge] --(Tunnel)--> [VPS: cloudflared] --(localhost:80)--> [Traefik Proxy] --(Internal Docker Network)--> [Contenedor Astro]
```

## Componentes Core

### Ingress (Cloudflared)
Configura túnel en modo catch-all → envía tráfico a http://localhost:80.

### Enrutamiento (Traefik)
Escucha en puerto 80 del host, enruta por SNI.

### Red (dokploy-network)
Bridge aislado. Todas las apps deben vivir aquí.

## 🚀 Scripts de Gestión (ubicados en $HOME)

~/deploy-dev.sh
~/set-maintenance.sh
~/deploy-prod.sh

## 🔌 Conexiones Internas (DB y APIs)

PostgreSQL: tourpilot-postgres:5432
Redis: dokploy-redis:6379

Ejemplo .env:
DATABASE_URL=postgres://user:pass@tourpilot-postgres:5432/db_name

## 🔧 Despliegue Manual (Fallback)

docker run -d \
  --name NOMBRE_APP \
  --network dokploy-network \
  --restart always \
  -l "traefik.enable=true" \
  -l "traefik.docker.network=dokploy-network" \
  -l "traefik.http.routers.NOMBRE_ROUTER.rule=Host(\`tudominio.com\`)" \
  -l "traefik.http.routers.NOMBRE_ROUTER.entrypoints=web" \
  -l "traefik.http.services.NOMBRE_ROUTER.loadbalancer.server.port=4323" \
  IMAGEN:TAG

## 🐛 Troubleshooting

### Error 1033
sudo systemctl restart cloudflared

### 404
Verificar labels, contenedor y red.

### 502
docker logs -f app-dev

### DNS roto
CNAME → 42c09c72-9319-4eed-9b56-413bd47e1089.cfargotunnel.com

## 📂 Directorios

/etc/cloudflared/config.yml
~/menubuilder-astro-csv/
Dockerfile
Caddyfile
