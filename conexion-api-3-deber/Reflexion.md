## Ventajas y Desventajas de usar JSON Server

# Ventajas:
1. Es fácil y rápido de usar.
2. Sirve para practicar un CRUD sin crear un backend real.
3. Ideal para trabajos de clase y pruebas.

# Desventajas:
1. No es seguro ni funciona para producción.
2. Los datos son simples y no maneja lógica avanzada.
3. No tiene login ni permisos.

# Cuándo lo usaría: prácticas, prototipos y ejercicios.
# Cuándo no: proyectos reales o con lógica compleja.

## ¿Para qué usamos useNavigate?
Lo usamos para movernos entre páginas (por ejemplo, volver al listado después de guardar).
Es un hook porque necesita trabajar dentro del flujo de React y del Router. Una función normal no puede acceder al contexto del navegador.

## Qué mejoras haría en la app
1. Crear un hook para manejar formularios y no repetir código.
2. Poner las funciones de fetch en un archivo de servicios.
3. Mejorar mensajes de error y validaciones.
4. Ordenar mejor las carpetas del proyecto.