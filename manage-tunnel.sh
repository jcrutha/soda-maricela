#!/bin/bash

# Script para gestionar solo el túnel de Cloudflare.
TUNNEL_CONFIG="/home/naezhoq/.cloudflared/config.yml"
PUBLIC_URL="https://sodamaricela.com"
LOCAL_URL="http://localhost:4324"

case "$1" in
  start)
    echo "🔗 Iniciando túnel Cloudflare..."
    # Ejecuta cloudflared en segundo plano
    cloudflared tunnel run --config "$TUNNEL_CONFIG" devforhire-main-tunnel &
    TUNNEL_PID=$!
    echo "✓ Túnel iniciado (PID: $TUNNEL_PID)"
    sleep 2

    echo ""
    echo "======================================"
    echo "✓ Túnel ACTIVO"
    echo "Local:  $LOCAL_URL"
    echo "Público: $PUBLIC_URL"
    echo "======================================"
    ;;

  stop)
    echo "🛑 Deteniendo túnel Cloudflare..."
    # Mata solo el proceso del túnel de cloudflared
    pkill -f "cloudflared tunnel run"
    echo "✓ Túnel detenido"
    ;;

  *)
    echo "=== Gestor de Túnel Temporal ==="
    echo ""
    echo "Uso: $0 {start|stop}"
    echo ""
    echo "Configuración:"
    echo "  URL Pública: $PUBLIC_URL"
    echo "  URL Local: $LOCAL_URL"
    echo "  Túnel: devforhire-main-tunnel"
    exit 1
    ;;
esac
