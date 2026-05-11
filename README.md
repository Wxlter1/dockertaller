# Taller de Desarrollo para Propuesta de Título

Plantilla de proyecto basada en FastAPI, diseñada para cumplir una propuesta de título con los criterios típicos de: estructura modular, documentación automática, pruebas, persistencia y despliegue en contenedores.

## Qué incluye

- API modular con `app/main.py`, `app/api/v1/api.py` y `app/api/v1/endpoints/items.py`
- Configuración centralizada en `app/core/config.py`
- Capa de persistencia con SQLAlchemy y SQLite/Postgres
- Modelos y esquemas separados (`app/db/models.py`, `app/schemas/item.py`)
- Servicios de negocio (`app/services/item_service.py`)
- Documentación automática en `/docs` y `/redoc`
- React frontend y Node backend para la interfaz web y la integración con el sistema Python
- **Backend Node con TypeORM**: Gestión robusta de la base de datos con TypeScript y ORM
- Entidades TypeORM: `ParkingSpot` y `ParkingDetection`
- **Mapa interactivo SVG del campus** con visualización de 6 sectores y su ocupación en tiempo real
- Código de color dinámico: verde (disponible) → rojo (lleno)
- Endpoints avanzados:
  - `GET /api/parking/status`: Estado actual de plazas
  - `POST /api/parking/detections`: Recibir detecciones
  - `GET /api/parking/summary`: Métricas agregadas
  - `GET /api/parking/sectors/summary`: Estadísticas por sector
  - `GET /api/parking/detections/:spotCode`: Histórico de plaza
- Docker + Docker Compose para despliegue reproducible
- Pruebas básicas con `pytest` y `httpx`

## Estructura propuesta

- `app/main.py`: instancia FastAPI y registra routers
- `app/api/v1/api.py`: ruta principal de la versión API
- `app/api/v1/endpoints`: endpoints REST
- `app/core`: configuración y variables de entorno
- `app/db`: sesión, base y modelos
- `app/schemas`: validación y serialización con Pydantic
- `app/services`: lógica de negocio y operaciones CRUD

## Cómo ejecutar

### Opción rápida con Docker Compose

```bash
docker compose up --build
```

- Python FastAPI: `http://localhost:8000`
- React + Node UI: `http://localhost:3000`
- Documentación FastAPI: `http://localhost:8000/docs`

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

## Características del Frontend React

- **Mapa interactivo del campus**: Visualiza 6 sectores (A-F) con su estado de ocupación
- **Indicador de ocupación**: Colores dinámicos según el nivel de ocupación:
  - Verde: 0-30% (Disponible)
  - Lima: 30-50% (Poco ocupado)
  - Amarillo: 50-70% (Moderado)
  - Naranja: 70-90% (Casi lleno)
  - Rojo: 90-100% (Lleno)
- **Tabla de estado**: Detalle de cada plaza de estacionamiento
- **Resumen en tiempo real**: Métricas agregadas del campus
- **Simulador de detecciones**: Envía datos de prueba para probar el sistema
- **Actualización periódica**: Se refresca cada 3 segundos

## Arquitectura Backend Node + TypeORM

El backend Node utiliza TypeORM para proporcionar una capa de persistencia type-safe:

### Estructura
- `backend-node/src/entities/`: Clases decoradas de TypeORM
  - `ParkingSpot.ts`: Entidad para plazas de estacionamiento
  - `ParkingDetection.ts`: Entidad para histórico de detecciones
- `backend-node/src/routes/parking.ts`: Rutas Express con lógica de negocio
- `backend-node/src/config/database.ts`: Configuración y conexión TypeORM

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

## Propuesta de título y justificación

Esta plantilla es adecuada para un informe de propuesta de título porque:

- separa presentación, negocio y datos en capas claras;
- utiliza documentación automática de FastAPI para describir la API;
- incluye un ejemplo CRUD completo con validación y manejo de errores;
- permite desplegar en contenedores para entornos de producción;
- ofrece una base clara para agregar nuevas entidades y requerimientos.
