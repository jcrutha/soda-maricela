#!/bin/bash

# Quick Start - Inicio rápido de túneles

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║          CLOUDFLARE TUNNEL - QUICK START               ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

PS3='Selecciona una opción: '
options=(
    "🚀 Iniciar Dokploy (terminal.devforhire.pro)"
    "🛑 Detener Dokploy"
    "📊 Ver estado Dokploy"
    "📝 Ver logs Dokploy"
    ""
    "🚀 Iniciar Menubuilder (sodamaricela.com)"
    "🛑 Detener Menubuilder"
    "📊 Ver estado Menubuilder"
    "📝 Ver logs Menubuilder"
    ""
    "✅ Verificar configuración"
    "❌ Salir"
)

select opt in "${options[@]}"
do
    case $REPLY in
        1)
            echo ""
            echo "Ingresa el token de seguridad para Dokploy:"
            read -s TOKEN
            ./manage-dokploy-tunnel.sh start "$TOKEN"
            ;;
        2)
            echo ""
            echo "Ingresa el token de seguridad para Dokploy:"
            read -s TOKEN
            ./manage-dokploy-tunnel.sh stop "$TOKEN"
            ;;
        3)
            ./manage-dokploy-tunnel.sh status
            ;;
        4)
            ./manage-dokploy-tunnel.sh logs
            ;;
        5)
            continue
            ;;
        6)
            echo "🚀 Iniciando Menubuilder..."
            ./manage-tunnel.sh start
            ;;
        7)
            echo "🛑 Deteniendo Menubuilder..."
            ./manage-tunnel.sh stop
            ;;
        8)
            ./manage-tunnel.sh status
            ;;
        9)
            ./manage-tunnel.sh logs
            ;;
        10)
            continue
            ;;
        11)
            echo "Ejecutando verificación..."
            ./check-tunnel.sh
            ;;
        12)
            echo "👋 Saliendo..."
            exit 0
            ;;
        *)
            echo "❌ Opción no válida"
            ;;
    esac
    
    echo ""
    read -p "Presiona Enter para continuar..."
    echo ""
done
