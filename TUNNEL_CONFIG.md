# Configuración de Túneles Cloudflare

## 📋 Resumen

El proyecto utiliza **Cloudflare Tunnel** (`devforhire-main-tunnel`) con dos configuraciones:

| Servicio | Dominio | Puerto Local | Script |
|----------|---------|--------------|--------|
| **Dokploy** | `terminal.devforhire.pro` | 3000 | `manage-dokploy-tunnel.sh` |
| **Menubuilder (Astro)** | `sodamaricela.com` | 4321 | `manage-tunnel.sh` |

---

## 🚀 Iniciando Servicios

### Opción 1: Dokploy (Con Seguridad - Requiere Token)

```bash
# Ver estado
./manage-dokploy-tunnel.sh status

# Encender (requiere token de seguridad)
./manage-dokploy-tunnel.sh start dokploy-secure-2024

# Apagar (requiere token de seguridad)
./manage-dokploy-tunnel.sh stop dokploy-secure-2024

# Ver logs
./manage-dokploy-tunnel.sh logs
```

**Acceso:**
- URL: https://terminal.devforhire.pro
- Puerto Local: http://localhost:3000

### Opción 2: Menubuilder Astro (Túnel Temporal)

```bash
# Iniciar servidor + túnel
./manage-tunnel.sh start

# Detener
./manage-tunnel.sh stop

# Ver estado
./manage-tunnel.sh status

# Ver logs
./manage-tunnel.sh logs
```

**Acceso:**
- URL: https://sodamaricela.com
- Puerto Local: http://localhost:4321

---

## 🔐 Token de Seguridad Dokploy

El token actual es: `dokploy-secure-2024`

**Cambiar token:**
1. Editar `manage-dokploy-tunnel.sh`
2. Cambiar valor de `SECURITY_TOKEN`

Ejemplo:
```bash
SECURITY_TOKEN="tu-nuevo-token-seguro"
```

---

## 📊 Métricas del Túnel

```bash
# Obtener métricas en tiempo real
curl -s http://127.0.0.1:20243/metrics | head -30
```

---

## 🔧 Configuración Cloudflare

**Archivo:** `~/.cloudflared/config.yml`

```yaml
tunnel: devforhire-main-tunnel
credentials-file: /home/naezhoq/.cloudflared/6fe33c59-114e-4597-b555-5168dee7e9a9.json

ingress:
  - hostname: terminal.devforhire.pro
    service: http://localhost:3000
  - hostname: sodamaricela.com
    service: http://localhost:4321
  - service: http_status:404
```

---

## 🐛 Troubleshooting

### Puerto 3000 o 4321 en uso
```bash
# Encontrar qué está usando el puerto
lsof -i :3000
lsof -i :4321

# Matar el proceso
kill -9 <PID>
```

### Túnel no se conecta
```bash
# Verificar que Cloudflare CLI está instalado
which cloudflared

# Verificar credenciales
ls -la ~/.cloudflared/6fe33c59-114e-4597-b555-5168dee7e9a9.json

# Reiniciar túnel
./manage-dokploy-tunnel.sh stop dokploy-secure-2024
./manage-dokploy-tunnel.sh start dokploy-secure-2024
```

### Ver procesos activos
```bash
ps aux | grep -E "npm|cloudflared"
```

---

## 📝 Notas de Seguridad

⚠️ **Para Producción:**
1. Cambiar el token de seguridad
2. Usar variables de entorno en lugar de valores hardcodeados
3. Implementar logging más detallado
4. Considerar autenticación adicional en Cloudflare
5. Rotación periódica del token

---

## 🎯 Puertos Internos

| Descripción | Puerto |
|-------------|--------|
| Dokploy | 3000 |
| Menubuilder Astro | 4321 |
| Métricas Túnel | 20243 |

---

## ✅ Verificación Rápida

```bash
# Paso 1: Verificar estado
./manage-dokploy-tunnel.sh status

# Paso 2: Acceder a URLs
curl https://terminal.devforhire.pro
curl https://sodamaricela.com

# Paso 3: Ver métricas
./manage-dokploy-tunnel.sh logs
```
