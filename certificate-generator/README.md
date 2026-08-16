# CommunityHub AWS Lambda - Generador de Certificados

Este directorio contiene el código fuente de la función Serverless utilizada para generar los certificados de participación en formato PDF.

## Funcionalidad
La función utiliza la librería `pdfkit` para crear un archivo PDF en memoria y lo retorna codificado en `base64`. Esto permite que la API de Express (Node.js) delegue la pesada tarea de generar PDFs a AWS, evitando bloquear el hilo principal.

## Parámetros de Entrada (Event Body)
La función espera un JSON con la siguiente estructura:
```json
{
  "userName": "Juan Pérez",
  "eventName": "Taller de Node.js",
  "date": "15/09/2026"
}
```

## Salida
Retorna un JSON con el PDF codificado en base64:
```json
{
  "message": "Certificado generado exitosamente",
  "pdfBase64": "JVBERi0xLjMNCiXi48..."
}
```

## Despliegue en AWS
1. Ejecuta `npm install` dentro de este directorio para instalar `pdfkit`.
2. Selecciona los archivos `index.js`, `package.json` y la carpeta `node_modules`.
3. Comprímelos en un archivo `.zip`.
4. Sube el archivo `.zip` a la consola de AWS Lambda.
5. Configura un Trigger de API Gateway para exponer la función mediante HTTP.
