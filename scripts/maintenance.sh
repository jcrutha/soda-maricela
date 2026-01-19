#!/bin/bash

# Script robusto para activar/desactivar modo mantenimiento
# Usando configuración de Caddy y reconstrucción de Docker

CADDY_DIR="infra/caddy"
CADDY_LIVE="$CADDY_DIR/Caddyfile.live"
CADDY_MAINT="$CADDY_DIR/Caddyfile.maintenance"
CADDY_TARGET="$CADDY_DIR/Caddyfile"

# Asegurar que existan los archivos de configuración
if [ ! -f "$CADDY_LIVE" ]; then
    echo "⚠️  Creando respaldo de configuración Caddy..."
    cp "$CADDY_TARGET" "$CADDY_LIVE"
fi

case "$1" in
    "on")
        echo "🔒 Activando modo mantenimiento..."
        
        # 1. Copiar configuración de mantenimiento
        cp "$CADDY_MAINT" "$CADDY_TARGET"
        
        # 2. Reiniciar contenedor para aplicar cambios (sin reconstruir)
        echo "🔄 Aplicando nueva configuración..."
        docker compose restart sodamaricela
        
        echo "✅ Modo mantenimiento ACTIVADO"
        echo "   El sitio ahora redirige todo el tráfico a la página de mantenimiento."
        ;;
        
    "off")
        echo "🔓 Desactivando modo mantenimiento..."
        
        # 1. Restaurar configuración original
        if [ -f "$CADDY_LIVE" ]; then
            cp "$CADDY_LIVE" "$CADDY_TARGET"
        else
            echo "❌ Error: No se encuentra $CADDY_LIVE"
            exit 1
        fi
        
        # 2. Reiniciar contenedor para aplicar cambios (sin reconstruir)
        echo "🔄 Restaurando configuración original..."
        docker compose restart sodamaricela
        
        echo "✅ Modo mantenimiento DESACTIVADO"
        echo "   El sitio ha vuelto a la normalidad."
        ;;
        
    *)
        echo "Uso: $0 {on|off}"
        exit 1
        ;;
esac