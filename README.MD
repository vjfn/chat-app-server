//levantar el proyecto
tsc -w
nodemon dist

//SERVER-Commandos
tsc index.ts

node index.js

nodemon

//Cuando nodemon se resiste...
npm install -g nodemon

//CLIENTE frontend
ionic serve


socket.io:
npm i ngx-socket-io


// Servidor que wachea cambios
terminal 1:
tsc -w index.ts

terminal 2:
nodemon index.js

<!-- Instalar el typscript -->
<!-- Instalar el typscript -->
npm install -g typescript

<!-- Crear el index.js a traves del index.ts -->
tsc index.ts

<!-- Crear el ts tsconfig.json para darle parametros de inicio al tsc -->
 tsc --init  

<!-- Iniciamos el watch de tsc para que haga la compilacion automaticamente-->
tsc -w

<!-- Modulos utilizados -->
npm install express //crear servidor web yservidor rest
npm install body-parser // recibir informacion del post y transformarlo en un objeto de .js
npm install cors //peticiones cross-domain
npm install mongoose //interacciones con la base de datos
npm install express-fileupload //recibir peticiones de imagenes y gestionarlas
npm install jsonwebtoken //web token para mantener de forma pasiva la sesion activa del usuario
npm install bcrypt //encriptar las contraseñas de los usuarios y tener almacenadas las contraseñas de forma segura

npm install uniqid //extension generador de id unica 


npm install express body-parser cors mongoose express-fileupload jsonwebtoken bcrypt



npm install @types/express --save-dev //instalacion del tipado

npm install @types/mongoose --save-dev //instalacion del tipado

npm install @types/bcrypt --save-dev //instalacion del tipado

npm install @types/jsonwebtoken --save-dev //instalacion del tipado

npm install @types/express-fileupload --save-dev //instalacion del tipado

npm install @types/uniqid --save-dev //instalacion del tipado

npm i --save-dev @types/cors //instalacion del tipado

