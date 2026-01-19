# 🥤 Soda Maricela - Guía de Administración

Bienvenido al panel de control del sitio web de **Soda Maricela**. Esta guía está diseñada para ayudarle a gestionar el sitio, actualizar el menú y realizar tareas de mantenimiento sin complicaciones.

---

## 📋 Tareas Comunes (SOPs)

### 1. 🛠️ Modo Mantenimiento
Use esto cuando necesite "cerrar" el sitio web temporalmente para hacer cambios importantes o reparaciones.

**Activar Mantenimiento (Cerrar sitio):**
El sitio mostrará una página de "Estamos cocinando algo nuevo" y no será accesible.
```bash
npm run maintenance_on
```

**Desactivar Mantenimiento (Abrir sitio):**
El sitio volverá a la normalidad y será visible para todos.
```bash
npm run maintenance_off
```

### 2. 📝 Actualizar el Menú
El menú se maneja en archivos de texto simples. No necesita saber programar, solo siga el formato existente.

*   **Menú en Español:** `src/data/menu.es.json`
*   **Menú en Inglés:** `src/data/menu.en.json`

**Cómo editar:**
1.  Abra el archivo.
2.  Encontrará secciones como "Desayunos", "Casados", etc.
3.  Para cambiar un precio, busque `"price_crc": 3500` y cambie el número.
4.  Para cambiar un nombre o descripción, edite el texto entre comillas.
    *   *Ejemplo:* `"name": "Nuevo Plato"`

> **⚠️ Importante:** Tenga cuidado de no borrar las comas (`,`) al final de las líneas ni las llaves (`{` `}`).

### 3. 🖼️ Imágenes
*   Las imágenes del sitio están en la carpeta `src/assets`.
*   Las imágenes públicas (como logos o iconos fijos) pueden estar en `public/assets`.

### 4. 🚀 Publicar Cambios
Después de hacer cambios (como editar el menú), necesita "reconstruir" el sitio para que los clientes vean la actualización.

**Comando para aplicar cambios:**
```bash
docker compose up -d --build
```

---

## 📂 ¿Dónde está cada cosa?

Aquí un mapa simple de las carpetas importantes:

*   **`src/`**: ¡Aquí está todo lo importante!
    *   `data/`: Los menús (precios, platos).
    *   `pages/`: Las páginas del sitio web.
    *   `components/`: Partes reusables (encabezados, pies de página).
*   **`public/`**: Archivos que se ven directamente (robots.txt, iconos).
*   **`scripts/`**: Herramientas automáticas (como el script de mantenimiento).
*   **`infra/`**: Configuración de servidores (Caddy, Docker) - *Solo para técnicos*.
*   **`archive/`**: Archivos viejos guardados por seguridad.

---

## ⚙️ Información Técnica (Para Desarrolladores)

Esta sección contiene detalles sobre la infraestructura y despliegue para el equipo técnico.

### Arquitectura
*   **Frontend**: Astro (Estático + SSR híbrido)
*   **Servidor Web**: Caddy (Maneja SSL y Mantenimiento)
*   **Contenedor**: Docker
*   **Orquestación**: Docker Compose

### Comandos de Desarrollo
*   `npm run dev`: Inicia el servidor de desarrollo local.
*   `npm run build`: Genera el sitio estático en `dist/`.

### Estructura de Mantenimiento
El script `scripts/maintenance.sh` intercambia el archivo `Caddyfile` activo:
1.  **Normal**: Usa `infra/caddy/Caddyfile.live`.
2.  **Mantenimiento**: Usa `infra/caddy/Caddyfile.maintenance` (redirige todo a `maintenance.html`).

### Red y Seguridad
*   El contenedor `astro-sodamaricela` expone el puerto 80 internamente.
*   Se recomienda usar un proxy inverso (Traefik, Nginx o Cloudflare Tunnel) frente al contenedor.
