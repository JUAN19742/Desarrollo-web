# Reflexión sobre la implementación

## ¿Cómo mejoraría la implementación de `useFetch`?
1. Añadiría  para cancelar peticiones previas
2. Expondría para permitir revalidaciones después de POST/PUT/DELETE.  
3. Usaría un caché simple (Map) por sesión para evitar llamadas redundantes.  

## En el form de creación/edición: cómo evitar manejar cada campo individualmente
- Utilizar un único estado `form` (objeto) y un `handleChange` genérico:
  ```js
  const [form, setForm] = useState({ title:'', body:'', userId:'' });
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  ```
