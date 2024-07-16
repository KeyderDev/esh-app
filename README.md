# Proyecto Laravel con Vite y Vue.js

Este es un proyecto que utiliza Laravel para el backend y Vue.js junto con Vite para el frontend.

## Requisitos

- Node.js (versión 20.15.0 recomendada)
- Composer
- PHP

## Instalación

Sigue los siguientes pasos para configurar el proyecto en tu entorno local:

2. Instala las dependencias de Node.js:

    ```bash
    npm install
    ```

3. Instala las dependencias de PHP:

    ```bash
    composer install
    ```

4. Copia el archivo de configuración `.env` y genera una nueva clave de aplicación:

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. Configura tu base de datos en el archivo `.env`.

6. Ejecuta las migraciones de la base de datos:

    ```bash
    php artisan migrate
    php artisan db:seed
    ```

## Uso

Para iniciar el servidor de desarrollo, ejecuta:

```bash
npm run dev
php artisan serve
