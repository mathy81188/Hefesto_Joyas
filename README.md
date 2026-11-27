# Hefesto Joyas — Orfebrería Artesanal

Aplicación web SPA (Single Page Application) desarrollada en **React** y **Vite** para la gestión integral de un taller y tienda de joyería artesanal. Permite explorar un catálogo de piezas forjadas, filtrar por categoría y material, gestionar pedidos y encargos a medida con cotización dinámica, y administrar inventario, usuarios y estados de órdenes mediante control de acceso basado en roles.

---

## Características Principales

### 1. Catálogo Público (`Home`)
* Visualización de catálogo artesanal de 18 piezas en oro, plata y bronce con control de disponibilidad en tiempo real.
* Filtros combinables por **Categoría** (Anillos, Collares, Aros, Pulseras, Accesorios) y **Material** (Oro 18k, Plata 925, Bronce).
* Solicitud directa de piezas desde el catálogo con descuento automático de stock, acumulación inteligente de unidades repetidas y notificaciones modales (`AlertModal`).

### 2. Autenticación y Rutas Protegidas (`Login` & `AuthContext`)
* Registro de nuevos clientes e inicio de sesión con validación de credenciales.
* Cifrado de contraseñas en cliente utilizando **SHA-256** mediante la API nativa `crypto.subtle`.
* Persistencia de sesión activa con limpieza completa al cerrar sesión y protección de rutas según rol (`cliente` / `admin`).

### 3. Panel del Cliente (`ClientePanel`)
* **Mis Pedidos y Encargos:** Historial personal con seguimiento del estado de fabricación (`Pendiente`, `En forja`, `Listo para retirar`) y cancelación de pedidos pendientes con reposición automática de stock.
* **Solicitar Joya a Medida:** Formulario desplegable para cotizar y encargar piezas exclusivas desde cero, calculando el presupuesto en tiempo real según el metal, engarce de piedra y grabado personalizado.

### 4. Panel de Administración (`AdminPanel`)
* **ABM de Joyas:** Creación, edición (con panel de formulario fijo `sticky` para operar sin perder contexto de scroll) y eliminación de piezas del catálogo.
* **Gestión de Usuarios:** Alta de cuentas, cambio de roles (`cliente` / `admin`) y eliminación de registros.
* **Gestión de Pedidos:** Supervisión global de compras de catálogo y encargos a medida con actualización de estado en el taller.

---

## Credenciales de Prueba

La aplicación inicializa automáticamente datos semilla (`src/data/*.json`) en `localStorage` en la primera carga:

| Rol | Correo Electrónico | Contraseña | Acceso |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@hefesto.com` | `admin123` | Catálogo + Panel Admin (ABM Joyas, Usuarios, Pedidos) |
| **Cliente** | `cliente@hefesto.com` | `cliente123` | Catálogo + Panel Cliente (Pedidos y Encargos a Medida) |

*(También es posible crear nuevas cuentas de cliente desde la pantalla de registro).*

---

## Arquitectura y Estructura del Proyecto

El proyecto está organizado de forma modular separando vistas, estilos por componente, semillas de datos en JSON y servicios de persistencia (preparado para escalar a una API REST en Node.js / Express):
hefesto_joyas/
├── public/
│   ├── favicon.svg                  # Ícono vectorial de pestaña (HJ)
│   └── logo-hefesto.svg             # Logotipo vectorial de la barra de navegación
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── JoyaForm.jsx         # Formulario sticky de alta y edición de joyas
│   │   │   ├── JoyasTabla.jsx       # Tabla de inventario con acciones de edición y baja
│   │   │   ├── PedidosGestion.jsx   # Tabla global de pedidos y cambio de estado en taller
│   │   │   └── UsuariosGestion.jsx  # Alta, cambio de rol y baja de usuarios
│   │   ├── cliente/
│   │   │   ├── EncargoMedidaForm.jsx   # Acordeón desplegable del cotizador a medida
│   │   │   └── ListaPedidosCliente.jsx # Historial de pedidos y encargos del cliente
│   │   ├── AlertModal.jsx           # Modal reutilizable de confirmación y error
│   │   ├── AlertModal.css
│   │   ├── JoyaCard.jsx             # Tarjeta individual de producto
│   │   ├── JoyaCard.css
│   │   ├── Navbar.jsx               # Barra de navegación dinámica según rol
│   │   ├── Navbar.css
│   │   └── RutaProtegida.jsx        # Guardián de rutas por autenticación y rol
│   ├── pages/
│   │   ├── AdminPanel.jsx           # Contenedor del panel de administración (ABM)
│   │   ├── AdminPanel.css
│   │   ├── ClientePanel.jsx         # Contenedor del panel de cliente
│   │   ├── ClientePanel.css
│   │   ├── Home.jsx                 # Catálogo principal y filtros
│   │   ├── Home.css
│   │   ├── Login.jsx                # Acceso y registro de usuarios
│   │   └── Login.css
│   ├── context/
│   │   ├── AuthContext.jsx          # Estado global de autenticación
│   │   └── useAuth.js               # Hook personalizado de acceso al contexto
│   ├── data/
│   │   ├── joyas.json               # Catálogo inicial (18 piezas)
│   │   ├── pedidos.json             # Encargos iniciales de muestra
│   │   ├── tarifasTaller.json       # Tarifario base para cotización a medida
│   │   └── seedData.js              # Inicializador de semillas en localStorage
│   ├── services/
│   │   ├── authService.js           # Login, registro y manejo de sesión
│   │   ├── joyasService.js          # Operaciones CRUD de joyas
│   │   ├── pedidosService.js        # Creación, acumulación y baja de pedidos
│   │   └── usuariosService.js       # Gestión de usuarios y roles
│   ├── utils/
│   │   └── hashPassword.js          # Utilidad de hashing SHA-256
│   ├── App.jsx                      # Configuración de React Router
│   ├── App.css
│   ├── index.css                    # Variables de diseño (paleta oscura y dorada)
│   └── main.jsx                     # Punto de entrada de la aplicación
├── index.html
├── package.json
└── vite.config.js

## Instalación y Ejecución Local

Instalar dependencias: **npm install**
Iniciar el servidor de desarrollo: **npm run dev**

---

## Tecnologías Utilizadas

React 19 & React Router DOM

Vite

CSS3 (Variables CSS, Grid, Flexbox, position: sticky, filtros y pseudoelementos)

Web Storage API (localStorage / sessionStorage) & Web Crypto API (crypto.subtle)
