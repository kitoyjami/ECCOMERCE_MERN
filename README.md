# Backend E-commerce & Sistema de Gestión (ERP)

Este repositorio aloja el servidor backend para una plataforma integral que combina un **E-commerce completo** con un sistema de **Planificación de Recursos Empresariales (ERP)**. El sistema maneja ventas online, inventario, logística, órdenes de servicio, clientes y personal.

Está construido sobre el stack **MERN** (MongoDB, Express.js, React -frontend separado-, Node.js) y sigue una arquitectura MVC.

## 🛠 Tecnologías y Librerías

El proyecto utiliza un conjunto robusto de dependencias para seguridad, manejo de datos y utilidades:

* **Core:** `Node.js`, `Express.js`
* **Base de Datos:** `MongoDB`, `Mongoose`
* **Seguridad:** `bcrypt` (hashing), `jsonwebtoken` (JWT Auth), `cors`
* **Manejo de Archivos:** `Multer`, `Cloudinary` (almacenamiento en la nube), `Jimp` (procesamiento de imágenes)
* **Utilidades:** `body-parser`, `cookie-parser`, `morgan` (logging), `slugify`, `uniqid`, `nodemailer` (emails)
* **Validación:** `express-validator`

## 🚀 Instalación y Configuración

Sigue estos pasos para levantar el servidor en tu entorno local.

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <CARPETA_DEL_PROYECTO>

```

### 2. Instalar dependencias

```bash
npm install
# O si usas yarn
yarn install

```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto. Basado en la configuración de la base de datos y servicios externos, deberías definir las siguientes variables:

```env
PORT=4000
MONGODB_URL=<TU_URI_DE_CONEXION_MONGODB>

# Configuración de Seguridad
JWT_SECRET=<TU_CLAVE_SECRETA_JWT>

# Configuración de Correo (Gmail/Nodemailer)
MAIL_ID=<TU_EMAIL_GMAIL>
MP=<TU_CONTRASEÑA_DE_APLICACION_GMAIL>

# Configuración de Cloudinary (Imágenes)
CL_NAME=<TU_CLOUD_NAME>
API_KEY=<TU_API_KEY>
API_SECRET=<TU_API_SECRET>

```

### 4. ⚠️ Corrección Necesaria antes de Iniciar

Actualmente, el archivo `routes/authRoute.js` contiene errores de sintaxis que impedirán el inicio del servidor.

* Abre `routes/authRoute.js`.
* Elimina la línea suelta que dice `createUser` (aprox. línea 14).
* Elimina el carácter `|` al final de la línea de la ruta `/edit` (aprox. línea 37).

### 5. Ejecutar el Servidor

Tienes dos scripts configurados en el `package.json`:

* **Modo Desarrollo:** (Reinicio automático con Nodemailer)
```bash
npm run server

```


* **Modo Producción:**
```bash
npm start

```



El servidor iniciará por defecto en `http://localhost:4000` (o el puerto definido en `.env`).

## 📡 Endpoints de la API

La API es extensa y modular. Aquí tienes un resumen de los prefijos principales definidos en `index.js`:

### 👤 Usuarios y Autenticación

Prefijo: `/api/user`

* Registro, Login, Logout, Refresh Token.
* Gestión de contraseña (Olvido/Reset).
* Gestión de Carrito de Compras (`/cart`) y Órdenes (`/cart/cash-order`).
* Lista de Deseos (`/wishlist`).
* Gestión de Direcciones.

### 🛒 E-commerce (Catálogo)

* **Productos:** `/api/product` (CRUD, Calificaciones, Filtros).
* **Categorías:** `/api/category`.
* **Marcas:** `/api/brand`.
* **Colores:** `/api/color`.
* **Cupones:** `/api/coupon`.
* **Blogs:** `/api/blog` y `/api/bcategory` (Categorías de blog).
* **Consultas (Enquiries):** `/api/enquiry`.

### 🛠 ERP y Gestión de Servicios

Módulos operativos para la gestión interna del negocio:

* **Órdenes de Servicio:** `/api/orden-servicio` (Creación, Seguimiento de estado, Asignación).
* **Clientes:** `/api/cliente` (Gestión de cartera de clientes).
* **Personal (Workers):** `/api/worker` y `/api/wcategory`.
* **Asistencia:** `/api/attendance`.
* **Parte Diario:** `/api/dailyreport`.
* **Servicios:** `/api/servicio`.

### 📦 Logística e Inventario Avanzado

Módulo especializado para especificaciones técnicas y proveedores:

* **Productos Logísticos:** `/api/productos`, `/api/tipos`, `/api/categorias`, `/api/subcategorias` (Estructura jerárquica para inventario técnico).
* **Proveedores:** `/api/proveedores`.
* **Unidades:** `/api/unidades`.
* **Rendición de Cuentas:** `/api/rendicion-cuenta`.

### ⚙️ Utilidades y Configuración

* **Subida de Archivos:** `/api/upload` (Imágenes de productos/blogs).
* **Perfiles y Tablas Maestras:** `/api/profile`, `/api/profile-master-tables`, `/api/perfilsubtype`.
* **Bancos y Gastos:** `/api/banco`, `/api/tipo-gasto`.

## 📂 Estructura del Proyecto

```text
/
├── config/             # Conexión DB y configuración de Tokens
├── controller/         # Lógica de negocio (ProductCtrl, UserCtrl, etc.)
├── middlewares/        # Middlewares (Auth, Uploads, ErrorHandler)
├── models/             # Esquemas de Mongoose
│   ├── Logistica/      # Modelos específicos de logística
│   └── ...             # Modelos generales (User, Product, Order...)
├── routes/             # Definición de rutas de la API
│   ├── Logistica/      # Rutas específicas de logística
│   └── ...             # Rutas generales
├── utils/              # Validaciones y helpers (Cloudinary)
├── index.js            # Punto de entrada de la aplicación
└── package.json        # Dependencias y scripts

```

## 🔒 Notas de Seguridad y CORS

El servidor está configurado para aceptar peticiones (CORS) de los siguientes orígenes:

* `http://localhost:5173`
* `http://localhost:5174`
* `https://www.crsleon.info`

Asegúrate de que tu frontend esté corriendo en uno de estos puertos o actualiza el array `allowedOrigins` en `index.js`.

---

*Generado automáticamente basado en el código fuente.*
