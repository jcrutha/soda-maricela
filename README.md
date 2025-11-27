# Soda Maricela - Menubuilder Astro CSV

Proyecto Astro con integración Cloudflare Tunnel para desarrollo seguro.

## 🌐 URLs en Vivo

| Servicio | Dominio | Estado |
|----------|---------|--------|
| **Menubuilder** | https://sodamaricela.com | 🟢 En Túnel |
| **Dokploy Terminal** | https://terminal.devforhire.pro | 🔒 Seguro |

## 🚀 Inicio Rápido

### Opción 1: Menú Interactivo (Recomendado)
```bash
./tunnel-menu.sh
```

### Opción 2: Comandos Directos

**Iniciar Menubuilder (Astro + Túnel):**
```bash
./manage-tunnel.sh start
```
Acceso: https://sodamaricela.com | Local: http://localhost:4321

**Iniciar Dokploy (Requiere Token):**
```bash
./manage-dokploy-tunnel.sh start dokploy-secure-2024
```
Acceso: https://terminal.devforhire.pro | Local: http://localhost:3000

**Verificar Configuración:**
```bash
./check-tunnel.sh
```

## 📋 Comandos Disponibles

### Menubuilder
```bash
./manage-tunnel.sh {start|stop|status|logs}
```

### Dokploy (Seguro)
```bash
./manage-dokploy-tunnel.sh {start|stop|status|logs} [TOKEN]
```

## 🧞 Comandos Astro

| Command | Action |
|---------|--------|
| `npm install` | Instala dependencias |
| `npm run dev` | Dev server local en `localhost:4321` |
| `npm run build` | Build para producción en `./dist/` |
| `npm run preview` | Preview del build local |

## 📚 Documentación

- **[TUNNEL_READY.md](./TUNNEL_READY.md)** - Estado y resumen final
- **[TUNNEL_CONFIG.md](./TUNNEL_CONFIG.md)** - Configuración detallada
- **[TUNNEL_SETUP.md](./TUNNEL_SETUP.md)** - Setup original (referencia)

## 🔐 Seguridad

- ✅ Token requerido para Dokploy
- ✅ Túnel permanente (no temporal)
- ✅ Dominios separados
- ✅ Credenciales encriptadas

## 🐛 Troubleshooting

```bash
# Ver estado general
./check-tunnel.sh

# Ver logs detallados
./manage-dokploy-tunnel.sh logs
./manage-tunnel.sh logs

# Probar conectividad
curl https://sodamaricela.com
curl https://terminal.devforhire.pro
```

## 📞 Soporte

Para más información ver [TUNNEL_READY.md](./TUNNEL_READY.md)
