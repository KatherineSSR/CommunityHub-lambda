const PDFDocument = require('pdfkit');

exports.handler = async (event) => {
  try {
    // API Gateway pasa el body como un string, debemos parsearlo.
    let body = event.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    } else if (!body) {
      body = event;
    }

    const { userName = "Participante", eventName = "Evento de CommunityHub", date = new Date().toLocaleDateString() } = body;

    // Crear un documento PDF en memoria
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape'
    });

    // Capturar los datos del PDF en un buffer
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);

        // Retornar el PDF como un string base64
        resolve({
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" // CORS
          },
          body: JSON.stringify({
            message: "Certificado generado exitosamente",
            pdfBase64: pdfData.toString('base64')
          })
        });
      });

      // Dibujar el certificado
      // Borde exterior
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
      // Borde interior
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();

      // Titulo
      doc.fontSize(40).fillColor('#2c3e50').text('Certificado de Participación', {
        align: 'center'
      });
      doc.moveDown(1);

      // Texto introductorio
      doc.fontSize(20).fillColor('#34495e').text('Este certificado se otorga a:', {
        align: 'center'
      });
      doc.moveDown(1);

      // Nombre del usuario
      doc.fontSize(35).fillColor('#2980b9').text(userName, {
        align: 'center',
        underline: true
      });
      doc.moveDown(1);

      // Razón
      doc.fontSize(20).fillColor('#34495e').text(`Por su destacada participación en el evento:`, {
        align: 'center'
      });
      doc.moveDown(0.5);

      // Nombre del evento
      doc.fontSize(25).fillColor('#e67e22').text(eventName, {
        align: 'center'
      });
      doc.moveDown(2);

      // Fecha
      doc.fontSize(15).fillColor('#7f8c8d').text(`Fecha de emisión: ${date}`, {
        align: 'center'
      });

      // Finalizar el documento
      doc.end();
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: "Error interno generando el certificado",
        error: error.message
      })
    };
  }
};
