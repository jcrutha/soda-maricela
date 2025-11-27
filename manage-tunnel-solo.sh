#!/bin/bash

# Script para gestionar el tunel Cloudflare
# Solo gestiona el túnel, asume que Astro ya está corriendo en el puerto 4321.

TUNNEL_NAME="sodamaricela-dev"
# La URL pública es la que usarás para acceder al túnel, aunque te dará un link temporal
PUBLIC_URL="https://sodamaricela.com" 
LOCAL_URL="http://localhost:4323"

case "$1" in
  start)
    echo "Iniciando tunel Cloudflare..."
    
    # El comando 'cloudflared tunnel run' puede ser simplificado por 'cloudflared tunnel --url'
    # Usaremos el comando más simple para un túnel temporal de desarrollo
    cloudflared tunnel --url $LOCAL_URL &
    
    sleep 2
    echo "✓ Túnel iniciado"
    echo "Asegúrate que Astro está corriendo en $LOCAL_URL"
    echo "Accede con el link temporal proporcionado por Cloudflare."
    ;;
    
  stop)
    echo "Deteniendo el proceso del tunel Cloudflare..."
    pkill -f "cloudflared tunnel --url"
    echo "✓ Túnel detenido"
    ;;
    
  status)
    echo "=== ESTADO ==="
    echo "Cloudflare tunnel:"
    ps aux | grep -F "cloudflared tunnel --url" | grep -v grep || echo "❌ No está ejecutándose"
    ;;
    
  logs)
    echo "Logs del túnel (puede que no funcione con túneles ad-hoc):"
    curl -s http://127.0.0.1:20243/metrics 2>/dev/null | head -20
    ;;
    
  *)
    echo "Uso: $0 {start|stop|status|logs}"
    exit 1
    ;;
esac
