# Taller de Desarrollo

### Opción rápida con Docker Compose

```bash
docker compose up --build
```

- React UI: `http://localhost:5173`
- Node API: `http://localhost:3000`
- Python FastAPI: `http://localhost:8000`
- Documentación FastAPI: `http://localhost:8000/docs`

El repositorio incluye `docker-compose.yml` en la raíz y `.env.example` con las variables necesarias.

### Opción local para desarrollo

1. Instalar dependencias Python
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Instalar dependencias Node + React
   ```bash
   cd backend-node
   npm install
   cd ..\frontend
   npm install
   ```
3. Iniciar el backend Node (puede conectarse al Python local)
   ```bash
   cd backend-node
   npm start
   ```
4. Iniciar el frontend React en modo desarrollo
   ```bash
   cd ..\frontend
   npm run dev
   ```

### Agregar nuevas entidades

1. Crear archivo en `backend-node/src/entities/MiEntidad.ts`:
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mi_entidad')
export class MiEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
}
```

2. Agregar a `backend-node/src/config/database.ts` en el array `entities`
3. Compilar y reiniciar: `npm run build && npm start`
