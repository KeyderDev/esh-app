# ESH-APP 

Este proyecto utiliza Laravel, Node, SocketIO, Vue y Vite.

## Requisitos

- Node.js (versión 20.15.0 recomendada)
- Composer
- PHP (version 8.3 recomendada)

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

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

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
```

## Donaciones

Si consideras este proyecto util, considera comprarme un cafe :)

<a href="https://www.buymeacoffee.com/keyyderr" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

