function generatePolaroid() {
    const image = document.getElementById('uploadImage').files[0];
    const borderColor = document.getElementById('borderColor').value;
    const text = document.getElementById('text').value;
    const textColor = document.getElementById('textColor').value;
    const textSize = parseInt(document.getElementById('textSize').value); // Convertir a número
    const emoji = document.getElementById('emoji').value; // Obtener el emoji seleccionado
  
    if (image) {
      const reader = new FileReader();
  
      reader.onload = function(e) {
        const imgElement = document.createElement('img');
        imgElement.src = e.target.result;
        imgElement.onload = function() {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          // Define el tamaño de la polaroid (500x500 píxeles)
          const polaroidWidth = 500;
          const polaroidHeight = 500;
  
          canvas.width = polaroidWidth;
          canvas.height = polaroidHeight;
  
          // Calcula el factor de zoom para ajustar la imagen
          const zoomFactor = Math.max(polaroidWidth / imgElement.width, polaroidHeight / imgElement.height);
          const imageWidth = imgElement.width * zoomFactor;
          const imageHeight = imgElement.height * zoomFactor;
  
          // Calcula la posición para centrar la imagen
          const offsetX = (polaroidWidth - imageWidth) / 2;
          const offsetY = (polaroidHeight - imageHeight) / 2;
  
          // Dibuja la imagen con el zoom y corte
          ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height, offsetX, offsetY, imageWidth, imageHeight);
  
          // Dibuja los bordes
          ctx.fillStyle = borderColor;
          ctx.fillRect(0, 0, polaroidWidth, 10);
          ctx.fillRect(polaroidWidth - 10, 0, 10, polaroidHeight);
          ctx.fillRect(0, polaroidHeight - 60, polaroidWidth, 60);
          ctx.fillRect(0, 0, 10, polaroidHeight);
  
          // Aplica el tamaño y color de texto en el canvas
          ctx.font = `${textSize}px Papyrus`;
          ctx.fillStyle = textColor;
  
          // Ajusta el tamaño y posición del texto para centrarlo
          const textWidth = ctx.measureText(text).width;
          const textX = (polaroidWidth - textWidth) / 2;
          const textY = polaroidHeight - 20;
  
          // Agrega el texto en la parte inferior, con el emoji seleccionado si existe
          ctx.fillText(`${emoji} ${text}`, textX, textY);
  
          // Agrega la polaroid generada al contenedor
          const generatedImageContainer = document.getElementById('generatedImageContainer');
          const generatedImage = document.getElementById('generatedImage');
          generatedImage.src = canvas.toDataURL('image/png');
          generatedImageContainer.style.display = 'block';
  
          // Actualiza el texto del precio de la polaroid
          const polaroidPrice = document.getElementById('polaroidPrice');
          polaroidPrice.innerText = (borderColor === '#ffffff' || borderColor === '#f0f0f0') ? 'La polaroid cuesta C$ 12.00' : 'La polaroid cuesta C$ 16.00';
  
          // Muestra el enlace de descarga
          const downloadLink = document.getElementById('downloadLink');
          downloadLink.href = canvas.toDataURL('image/png');
          downloadLink.download = 'polaroid.png';
          downloadLink.style.display = 'block';
  
          // Muestra el botón de compartir en WhatsApp
          const whatsappButton = document.getElementById('whatsappButton');
          whatsappButton.style.display = 'block';
        };
  
        imgElement.src = e.target.result;
      };
  
      reader.readAsDataURL(image);
    }
  }
  
  // Función para compartir la polaroid en WhatsApp
  function shareToWhatsApp() {
    const polaroidImage = document.getElementById('generatedImage');
    const encodedImage = encodeURIComponent(polaroidImage.src);
    const whatsappNumber = '+50558516688';
    const shareURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=¡Mira la polaroid que hice para ti!%0A%0A${encodedImage}`;
  
    window.open(shareURL, '_blank');

    // Función para compartir la polaroid con otras aplicaciones
async function shareToOtherApps() {
  if (navigator.share) {
    const polaroidImage = document.getElementById('generatedImage').src;
    const text = document.getElementById('text').value;
    const emoji = document.getElementById('emoji').value;

    const sharedContent = `${emoji} ${text}\n${polaroidImage}`;

    try {
      await navigator.share({
        title: 'Mi Foto Polaroid',
        text: sharedContent,
        url: polaroidImage,
      });
      console.log('Contenido compartido con éxito.');
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  } else {
    alert('Lo siento, tu navegador no admite la función de compartir.');
  }
}
  }
  