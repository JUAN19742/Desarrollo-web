## Resumen del trabajo
En este repositorio he tomado el proyecto `conexion-api` y he extraído la lógica repetida de consumo de APIs en React hacia **custom hooks** para mejorar la reutilización y la claridad del código.

Los hooks implementados:
- `useFetch`: hook genérico para realizar peticiones HTTP con `fetch`, manejo de estado (`loading`, `error`, `data`) y posibilidad de `refetch`.
- `usePosts`: hook específico para cargar la lista de posts (envolviendo a `useFetch`).
- `usePostDetail`: hook específico para cargar el detalle de un post por `id`.

## Qué cambié / añadí
- Añadí `src/hooks/useFetch.js` con la lógica reutilizable.
- Añadí `src/hooks/usePosts.js` y `src/hooks/usePostDetail.js`.
- Añadí este `README.md`.

> Importante: No modifiqué el repo original en `ericmaster/curso-desarrollo-web`. Este trabajo está en un nuevo repositorio para no afectar el original.

## Reflexión personal
Al realizar esta tarea aprendí que:
- Extraer lógica en hooks reduce la duplicación y mejora la mantenibilidad.
- Manejar el ciclo de vida de las peticiones (AbortController y cancelar peticiones) evita errores si el componente se desmonta.
- Separar responsabilidades
