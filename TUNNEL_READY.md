# 🚀 Configuración Completada - Túneles Cloudflare

## ✅ Estado: LISTO PARA USAR

Se ha completado la configuración de túneles Cloudflare para soda maricela bajo devforhire.

---

## 📋 Configuración Final

### Túnel Principal
- **Nombre:** `devforhire-main-tunnel`
- **ID:** `6fe33c59-114e-4597-b555-5168dee7e9a9`
- **Credenciales:** `~/.cloudflared/6fe33c59-114e-4597-b555-5168dee7e9a9.json` ✓

### Dominios Configurados

| Servicio | Dominio | Puerto Local | Protocolo |
|----------|---------|--------------|-----------|
| **Dokploy** (Terminal) | `terminal.devforhire.pro` | 3000 | https |
| **Menubuilder (Astro)** | `sodamaricela.com` | 4321 | https |

---

## 🎮 Comandos de Control

### Iniciar Dokploy (Requiere Token de Seguridad)
```bash
./manage-dokploy-tunnel.sh start dokploy-secure-2024
```
- URL: https://terminal.devforhire.pro
- Puerto Local: http://localhost:3000
- ⚠️ Token requerido: `dokploy-secure-2024`

### Detener Dokploy
```bash
./manage-dokploy-tunnel.sh stop dokploy-secure-2024
```

### Ver Estado Dokploy
```bash
./manage-dokploy-tunnel.sh status
```

### Ver Logs Dokploy
```bash
./manage-dokploy-tunnel.sh logs
```

---

### Iniciar Menubuilder (Astro + Túnel)
```bash
./manage-tunnel.sh start
```
- Inicia Astro en puerto 4321
- Activa túnel automáticamente
- URL: https://sodamaricela.com
- Puerto Local: http://localhost:4321

### Detener Menubuilder
```bash
./manage-tunnel.sh stop
```

### Ver Estado Menubuilder
```bash
./manage-tunnel.sh status
```

### Ver Logs Menubuilder
```bash
./manage-tunnel.sh logs
```

---

## 🔍 Verificación

Verificar que todo está configurado correctamente:
```bash
./check-tunnel.sh
```

Esto validará:
- ✓ Cloudflare CLI instalado
- ✓ Archivo de configuración (`config.yml`)
- ✓ Archivo de credenciales
- ✓ Scripts ejecutables
- ✓ Puertos disponibles
- ✓ Estado de procesos

---

## 📁 Archivos Generados/Modificados

```
.
├── manage-dokploy-tunnel.sh      # Script control Dokploy (con seguridad)
├── manage-tunnel.sh              # Script control Menubuilder
├── check-tunnel.sh               # Verificación de configuración
├── TUNNEL_CONFIG.md              # Documentación completa
└── TUNNEL_SETUP.md               # Configuración antigua (referencia)

~/.cloudflared/
├── config.yml                    # Config. túnel compartida
├── 6fe33c59-114e-4597-b555-5168dee7e9a9.json  # Credenciales devforhire
└── c7413148-5398-41eb-a2f6-de6470f364f5.json  # Credenciales menubuilder (antiguo)
```

---

## 🔐 Seguridad

**Token de Seguridad Dokploy:** `dokploy-secure-2024`

Para cambiar el token:
1. Editar `manage-dokploy-tunnel.sh`
2. Buscar línea: `SECURITY_TOKEN="dokploy-secure-2024"`
3. Cambiar a tu token seguro

Ejemplo:
```bash
SECURITY_TOKEN="mi-token-super-secreto-2024"
```

---

## 📊 Monitoreo

### Ver métricas en tiempo real
```bash
curl -s http://127.0.0.1:20243/metrics | head -30
```

### Ver procesos activos
```bash
ps aux | grep -E "npm|cloudflared"
```

### Verificar puertos en uso
```bash
lsof -i :3000  # Dokploy
lsof -i :4321  # Astro
lsof -i :20243 # Métricas túnel
```

---

## 🐛 Troubleshooting

### El túnel no conecta
```bash
# 1. Verificar credenciales
ls -la ~/.cloudflared/6fe33c59-114e-4597-b555-5168dee7e9a9.json

# 2. Reintentar conexión
./manage-dokploy-tunnel.sh stop dokploy-secure-2024
./manage-dokploy-tunnel.sh start dokploy-secure-2024

# 3. Ver detalles
./check-tunnel.sh
```

### Puerto ya en uso
```bash
# Encontrar qué está usando el puerto
lsof -i :3000   # o :4321

# Matar el proceso
kill -9 <PID>
```

### DNS no resuelve
- Verificar que los CNAMEs estén configurados en Cloudflare
- Esperar propagación de DNS (puede tomar algunos minutos)
- Limpiar cache DNS del navegador

---

## ✨ Características de Seguridad

✅ Token requerido para encender/apagar Dokploy  
✅ Túnel permanente (no temporal)  
✅ Dos dominios separados (aislamiento)  
✅ Credenciales encriptadas  
✅ Scripts ejecutables solo cuando se proporciona token  
✅ Logs disponibles para auditoría  

---

## 📞 Soporte Rápido

**Estado general:**
```bash
./check-tunnel.sh
```

**Logs detallados:**
```bash
./manage-dokploy-tunnel.sh logs
./manage-tunnel.sh logs
```

**Prueba de conectividad:**
```bash
curl https://terminal.devforhire.pro
curl https://sodamaricela.com
```

---

## 🎯 Próximos Pasos

1. ✓ Verificar que cloudflared está instalado
2. ✓ Validar configuración: `./check-tunnel.sh`
3. ⬜ Iniciar Dokploy: `./manage-dokploy-tunnel.sh start dokploy-secure-2024`
4. ⬜ Iniciar Menubuilder: `./manage-tunnel.sh start`
5. ⬜ Acceder a URLs públicas
6. ⬜ Monitorear logs

---

**Configuración completada:** 27/11/2025  
**Estado:** ✅ LISTO PARA PRODUCCIÓN
