#!/bin/bash

# Script de verificación rápida de configuración de túneles

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        VERIFICACIÓN CONFIGURACIÓN TÚNELES                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 1. Verificar cloudflared
echo "📦 Verificando Cloudflare CLI..."
if command -v cloudflared &> /dev/null; then
    VERSION=$(cloudflared --version)
    echo "✓ $VERSION"
else
    echo "❌ cloudflared no está instalado"
    exit 1
fi

echo ""

# 2. Verificar configuración
echo "🔧 Verificando configuración..."
if [ -f ~/.cloudflared/config.yml ]; then
    echo "✓ config.yml existe"
    echo ""
    echo "Contenido:"
    cat ~/.cloudflared/config.yml | sed 's/^/  /'
else
    echo "❌ config.yml no encontrado"
    exit 1
fi

echo ""

# 3. Verificar credenciales
echo "🔐 Verificando credenciales..."
CRED_FILE="/home/naezhoq/.cloudflared/6fe33c59-114e-4597-b555-5168dee7e9a9.json"
if [ -f "$CRED_FILE" ]; then
    echo "✓ Archivo de credenciales existe"
else
    echo "❌ Archivo de credenciales no encontrado: $CRED_FILE"
    exit 1
fi

echo ""

# 4. Verificar scripts
echo "📝 Verificando scripts..."
for script in manage-dokploy-tunnel.sh manage-tunnel.sh; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            echo "✓ $script (ejecutable)"
        else
            echo "⚠ $script (NO ejecutable)"
        fi
    else
        echo "❌ $script no encontrado"
    fi
done

echo ""

# 5. Verificar puertos disponibles
echo "🔌 Verificando puertos disponibles..."
for port in 3000 4321; do
    if lsof -i :$port &> /dev/null; then
        echo "⚠ Puerto $port EN USO"
    else
        echo "✓ Puerto $port disponible"
    fi
done

echo ""

# 6. Verificar estado actual
echo "🌐 Estado Actual de Procesos..."
if ps aux | grep -F "cloudflared tunnel run" | grep -v grep > /dev/null; then
    echo "✓ Túnel Cloudflare: ACTIVO"
else
    echo "❌ Túnel Cloudflare: INACTIVO"
fi

if lsof -i :4321 &> /dev/null; then
    echo "✓ Astro: ACTIVO"
else
    echo "❌ Astro: INACTIVO"
fi

echo ""

# 7. Resumen de configuración
echo "╔════════════════════════════════════════════════════════════╗"
echo "║            RESUMEN DE CONFIGURACIÓN                       ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║ DOKPLOY                                                    ║"
echo "║   URL: https://terminal.devforhire.pro                     ║"
echo "║   Puerto Local: http://localhost:3000                      ║"
echo "║   Script: ./manage-dokploy-tunnel.sh start [TOKEN]         ║"
echo "║                                                            ║"
echo "║ MENUBUILDER (ASTRO)                                        ║"
echo "║   URL: https://sodamaricela.com                            ║"
echo "║   Puerto Local: http://localhost:4321                      ║"
echo "║   Script: ./manage-tunnel.sh start                         ║"
echo "║                                                            ║"
echo "║ TÚNEL                                                      ║"
echo "║   Nombre: devforhire-main-tunnel                           ║"
echo "║   Config: ~/.cloudflared/config.yml                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "✅ Verificación completada. Listo para usar."
