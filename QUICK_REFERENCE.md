# Referencia Rápida - Túneles Cloudflare

## 🎯 Lo Esencial

### Menubuilder (sodamaricela.com)
```bash
./manage-tunnel.sh start      # Iniciar
./manage-tunnel.sh stop       # Detener
./manage-tunnel.sh status     # Estado
./manage-tunnel.sh logs       # Logs
```

### Dokploy (terminal.devforhire.pro) - ⚠️ Requiere Token
```bash
./manage-dokploy-tunnel.sh start dokploy-secure-2024   # Iniciar
./manage-dokploy-tunnel.sh stop dokploy-secure-2024    # Detener
./manage-dokploy-tunnel.sh status                      # Estado
./manage-dokploy-tunnel.sh logs                        # Logs
```

## 🚀 Inicio Rápido
```bash
./tunnel-menu.sh              # Menú interactivo
./check-tunnel.sh             # Verificar configuración
```

## 📍 URLs
- **Menubuilder:** https://sodamaricela.com
- **Dokploy:** https://terminal.devforhire.pro

## 🔒 Token Dokploy
```
dokploy-secure-2024
```

## 📊 Monitoreo
```bash
ps aux | grep cloudflared     # Ver procesos
lsof -i :3000 -i :4321        # Ver puertos en uso
curl http://127.0.0.1:20243/metrics  # Métricas
```

## 🐛 Problemas
```bash
./check-tunnel.sh             # Diagnosticar
pkill cloudflared             # Matar procesos
npm run dev                   # Iniciar Astro solo
```

---
**Última actualización:** 27/11/2025  
**Estado:** ✅ Listo
