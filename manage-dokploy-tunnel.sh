#!/bin/bash

# Script para gestionar Dokploy con túnel seguro Cloudflare
# Requiere token de seguridad para encender/apagar

TUNNEL_NAME="devforhire-main-tunnel"
DOKPLOY_PORT="3000"
DOKPLOY_URL="https://terminal.devforhire.pro"
LOCAL_URL="http://localhost:${DOKPLOY_PORT}"
TUNNEL_CREDENTIALS="/home/naezhoq/.cloudflared/6fe33c59-114e-4597-b555-5168dee7e9a9.json"
TUNNEL_CONFIG="/home/naezhoq/.cloudflared/config.yml"

# Token de seguridad para encender/apagar (cambiar por seguridad)
SECURITY_TOKEN="dokploy-secure-2024"

check_token() {
  if [ -z "$2" ] || [ "$2" != "$SECURITY_TOKEN" ]; then
    echo "❌ Token de seguridad inválido o no proporcionado"
    echo "Uso: $0 {start|stop|status|logs} [TOKEN]"
    return 1
  fi
  return 0
}

case "$1" in
  start)
    if check_token "$1" "$2"; then
      echo "🚀 Iniciando túnel Cloudflare para Dokploy..."
      echo "URL: $DOKPLOY_URL"
      
      if [ ! -f "$TUNNEL_CREDENTIALS" ]; then
        echo "❌ Error: Archivo de credenciales no encontrado"
        exit 1
      fi
      
      if [ ! -f "$TUNNEL_CONFIG" ]; then
        echo "❌ Error: Archivo de configuración no encontrado"
        exit 1
      fi
      
      cloudflared tunnel run --config "$TUNNEL_CONFIG" "$TUNNEL_NAME" &
      TUNNEL_PID=$!
      echo "✓ Túnel iniciado (PID: $TUNNEL_PID)"
      echo "Accede en: $DOKPLOY_URL"
    fi
    ;;
    
  stop)
    if check_token "$1" "$2"; then
      echo "🛑 Deteniendo túnel Cloudflare..."
      pkill -f "cloudflared tunnel run"
      echo "✓ Túnel detenido"
    fi
    ;;
    
  status)
    echo "=== ESTADO DOKPLOY ==="
    echo ""
    if ps aux | grep -F "cloudflared tunnel run" | grep -v grep > /dev/null; then
      echo "✓ Túnel: ACTIVO"
      echo "URL: $DOKPLOY_URL"
      ps aux | grep -F "cloudflared tunnel run" | grep -v grep | awk '{print "PID: " $2}'
    else
      echo "❌ Túnel: INACTIVO"
    fi
    echo ""
    if lsof -i :${DOKPLOY_PORT} 2>/dev/null | tail -1 > /dev/null; then
      echo "✓ Dokploy: CORRIENDO en $LOCAL_URL"
    else
      echo "❌ Dokploy: NO está corriendo en $LOCAL_URL"
    fi
    ;;
    
  logs)
    echo "📊 Métricas del túnel:"
    curl -s http://127.0.0.1:20243/metrics 2>/dev/null | head -30 || echo "⚠ No se pudo obtener métricas"
    ;;
    
  *)
    echo "=== Gestor de Túnel Dokploy (Seguro) ==="
    echo ""
    echo "Uso: $0 {start|stop|status|logs} [TOKEN]"
    echo ""
    echo "Comandos:"
    echo "  start TOKEN  - Encender túnel (requiere token de seguridad)"
    echo "  stop TOKEN   - Apagar túnel (requiere token de seguridad)"
    echo "  status       - Ver estado del túnel"
    echo "  logs         - Ver métricas"
    echo ""
    echo "Configuración:"
    echo "  Túnel: $TUNNEL_NAME"
    echo "  URL Pública: $DOKPLOY_URL"
    echo "  Puerto Local: $DOKPLOY_PORT"
    exit 1
    ;;
esac
