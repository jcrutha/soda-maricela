# Configuración de Tunel Cloudflare para menubuilder-astro-csv

## 📋 Estado Actual

- **Proyecto**: menubuilder-astro-csv
- **Servidor Local**: http://localhost:4321 (Astro dev server)
- **URL Pública**: https://menubuilder-astro.naezhoq.online
- **Tunel Cloudflare**: Activo ✓

## 🚀 Iniciar Servicios

### Opción 1: Script automático
```bash
./manage-tunnel.sh start
```

### Opción 2: Manual
En dos terminales separadas:

**Terminal 1 - Servidor Astro:**
```bash
npm run dev
```

**Terminal 2 - Tunel Cloudflare:**
```bash
cloudflared tunnel run
```

## 🛑 Detener Servicios

```bash
./manage-tunnel.sh stop
```

O manualmente:
```bash
pkill -f "npm run dev"
pkill -f "cloudflared tunnel run"
```

## 📊 Ver Estado

```bash
./manage-tunnel.sh status
```

## 📈 Ver Logs/Métricas

```bash
./manage-tunnel.sh logs
```

O directamente:
```bash
curl http://127.0.0.1:20243/metrics
```

## 🔧 Configuración del Tunel

**Archivo**: `~/.cloudflared/config.yml`

```yaml
tunnel: menubuilder-astro
credentials-file: /home/naezhoq/.cloudflared/c7413148-5398-41eb-a2f6-de6470f364f5.json

ingress:
  - hostname: menubuilder-astro.naezhoq.online
    service: http://localhost:4321
  - service: http_status:404
```

**ID del Tunel**: `c7413148-5398-41eb-a2f6-de6470f364f5`

## ✅ Verificación

Para probar que todo funciona:

```bash
# Localmente
curl http://localhost:4321

# A través del tunel
curl https://menubuilder-astro.naezhoq.online
```

## 🐛 Troubleshooting

### El tunel no se conecta
- Verifica que Cloudflare CLI está instalado: `which cloudflared`
- Verifica las credenciales: `ls -la ~/.cloudflared/c7413148-5398-41eb-a2f6-de6470f364f5.json`
- Reinicia el tunel

### Puerto 4321 en uso
```bash
lsof -i :4321
kill -9 <PID>
```

### Ver procesos activos
```bash
ps aux | grep -E "npm|cloudflared"
```

## 📝 Notas

- El tunel NO usa puertos públicos expuestos, todo va a través de Cloudflare
- Las conexiones están encriptadas (HTTPS)
- El servidor local es inaccesible desde afuera sin el tunel
- Los procesos corren en background y pueden estar en sesiones de nohup

## 🎯 Puertos Utilizados Internamente

- **Localhost 4321**: Servidor Astro dev
- **Localhost 20242**: Tunel Cloudflare anterior (si existe)
- **Localhost 20243**: Métricas del tunel actual
