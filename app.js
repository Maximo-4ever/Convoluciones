const image = new Image();
image.src = "https://thispersondoesnotexist.com/image";

image.crossOrigin = "Anonymous";
const imageLoaded = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, image.width, image.height);

  blancoYNegro(canvas);
  const resultado = document.getElementById("resultado");
  convolucionar(canvas, resultado);
};

const blancoYNegro = (canvas) => {
  const ctx = canvas.getContext("2d");
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixeles = imgData.data;

  for (let p = 0; p < pixeles.length; p += 4) {
    const r = pixeles[p];
    const g = pixeles[p + 1];
    const b = pixeles[p + 2];

    const gris = (r + g + b) / 3;
    pixeles[p] = gris;
    pixeles[p + 1] = gris;
    pixeles[p + 2] = gris;
  }
  ctx.putImageData(imgData, 0, 0);
};

const convolucionar = (canvasFuente, canvasDestino) => {
  const ctxFuente = canvasFuente.getContext("2d");
  const imgDataFuente = ctxFuente.getImageData(0,0,canvasFuente.width,canvasFuente.height);
  const pixelesFuente = imgDataFuente.data;

  canvasDestino.width = canvasFuente.width;
  canvasDestino.height = canvasFuente.height;

  const ctxDestino = canvasDestino.getContext("2d");
  const imgDataDestino = ctxDestino.getImageData(0,0,canvasDestino.width,canvasDestino.height);
  const pixelesDestino = imgDataDestino.data;

  // Nucleos
  const sobelVertical = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];
  const sobelHorizontal = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ];

  for (let y = 1; y < canvasFuente.height - 1; y++) {
    for (let x = 1; x < canvasFuente.width - 1; x++) {
      const index = ((y * canvasFuente.width) + x) * 4;
      let totalY = 0;
      let totalX = 0;
      for (let kernelY = 0; kernelY < 3; kernelY++) {
        for (let kernelX = 0; kernelX < 3; kernelX++) {
          totalY += sobelVertical[kernelY][kernelX] * pixelesFuente[((((y+kernelY-1) * canvasFuente.width) + (x+kernelX-1)) * 4)];
          totalX += sobelHorizontal[kernelY][kernelX] * pixelesFuente[((((y+kernelY-1) * canvasFuente.width) + (x+kernelX-1)) * 4)];
          
        }        
      }
      let mag = Math.sqrt( (totalX*totalX) + (totalY*totalY) );
      mag = mag < 40 ? 0 : mag;
      pixelesDestino[index] = mag;    //R
      pixelesDestino[index+1] = mag;  //G
      pixelesDestino[index+2] = mag;  //B
      pixelesDestino[index+3] = 255;  //A
    }
  }
  ctxDestino.putImageData(imgDataDestino, 0,0)
};

image.onload = imageLoaded;
