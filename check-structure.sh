#!/bin/bash
echo "=== Estructura de páginas ==="
ls -la src/pages/
echo ""
echo "=== Contenido de [lang] ==="
ls -la src/pages/[lang]/ 2>/dev/null || echo "No existe [lang]"
echo ""
echo "=== Archivos en raíz de pages ==="
find src/pages -maxdepth 1 -type f
