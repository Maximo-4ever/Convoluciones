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

//   const kernel = [
//     [-1, -1, -1],
//     [-1, 8, -1],
//     [-1, -1, -1],
//   ];

//   const kernel = [
//     [0, -1, 0],
//     [-1, 5, -1],
//     [0, -1, 0],
//   ];

//   const kernel = [
//     [1, 0, -1],
//     [0, 0, 0],
//     [-1, 0, 1],
//   ];

  const sobelVertical = [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1],
  ];
  const sobelHorizontal = [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1],
  ];

  for (let y = 1; y < canvasFuente.height - 1; y++) {
    for (let x = 1; x < canvasFuente.width - 1; x++) {
      const index = ((y * canvasFuente.width) + x) * 4;

      // Convolucion sobel
      let casillaY1 = sobelVertical[0][0] * pixelesFuente[((((y-1) * canvasFuente.width) + (x-1)) * 4)];
      let casillaY2 = sobelVertical[0][1] * pixelesFuente[((((y-1) * canvasFuente.width) + (x)) * 4)];
      let casillaY3 = sobelVertical[0][2] * pixelesFuente[((((y-1) * canvasFuente.width) + (x+1)) * 4)];
      let casillaY4 = sobelVertical[1][0] * pixelesFuente[((((y) * canvasFuente.width) + (x-1)) * 4)];
      let casillaY5 = sobelVertical[1][1] * pixelesFuente[((((y) * canvasFuente.width) + (x)) * 4)];
      let casillaY6 = sobelVertical[1][2] * pixelesFuente[((((y) * canvasFuente.width) + (x+1)) * 4)];
      let casillaY7 = sobelVertical[2][0] * pixelesFuente[((((y+1) * canvasFuente.width) + (x-1)) * 4)];
      let casillaY8 = sobelVertical[2][1] * pixelesFuente[((((y+1) * canvasFuente.width) + (x)) * 4)];
      let casillaY9 = sobelVertical[2][2] * pixelesFuente[((((y+1) * canvasFuente.width) + (x+1)) * 4)];

      const resultadoY = casillaY1 + casillaY2 + casillaY3 + casillaY4 + casillaY5 + casillaY6 + casillaY7 + casillaY8 + casillaY9;
      
      // Convolucion sobel
      let casillaX1 = sobelHorizontal[0][0] * pixelesFuente[((((y-1) * canvasFuente.width) + (x-1)) * 4)];
      let casillaX2 = sobelHorizontal[0][1] * pixelesFuente[((((y-1) * canvasFuente.width) + (x)) * 4)];
      let casillaX3 = sobelHorizontal[0][2] * pixelesFuente[((((y-1) * canvasFuente.width) + (x+1)) * 4)];
      let casillaX4 = sobelHorizontal[1][0] * pixelesFuente[((((y) * canvasFuente.width) + (x-1)) * 4)];
      let casillaX5 = sobelHorizontal[1][1] * pixelesFuente[((((y) * canvasFuente.width) + (x)) * 4)];
      let casillaX6 = sobelHorizontal[1][2] * pixelesFuente[((((y) * canvasFuente.width) + (x+1)) * 4)];
      let casillaX7 = sobelHorizontal[2][0] * pixelesFuente[((((y+1) * canvasFuente.width) + (x-1)) * 4)];
      let casillaX8 = sobelHorizontal[2][1] * pixelesFuente[((((y+1) * canvasFuente.width) + (x)) * 4)];
      let casillaX9 = sobelHorizontal[2][2] * pixelesFuente[((((y+1) * canvasFuente.width) + (x+1)) * 4)];

      const resultadoX = casillaX1 + casillaX2 + casillaX3 + casillaX4 + casillaX5 + casillaX6 + casillaX7 + casillaX8 + casillaX9;

      let mag = Math.sqrt( (resultadoX*resultadoX) + (resultadoY*resultadoY) );
      mag = mag < 60 ? 0 : mag;

      pixelesDestino[index] = mag;    //R
      pixelesDestino[index+1] = mag;  //G
      pixelesDestino[index+2] = mag;  //B
      pixelesDestino[index+3] = 255;  //A

      // Kernel regular
    //   let casilla1 = kernel[0][0] * pixelesFuente[((((y-1) * canvasFuente.width) + (x-1)) * 4)];
    //   let casilla2 = kernel[0][1] * pixelesFuente[((((y-1) * canvasFuente.width) + (x)) * 4)];
    //   let casilla3 = kernel[0][2] * pixelesFuente[((((y-1) * canvasFuente.width) + (x+1)) * 4)];
    //   let casilla4 = kernel[1][0] * pixelesFuente[((((y) * canvasFuente.width) + (x-1)) * 4)];
    //   let casilla5 = kernel[1][1] * pixelesFuente[((((y) * canvasFuente.width) + (x)) * 4)];
    //   let casilla6 = kernel[1][2] * pixelesFuente[((((y) * canvasFuente.width) + (x+1)) * 4)];
    //   let casilla7 = kernel[2][0] * pixelesFuente[((((y+1) * canvasFuente.width) + (x-1)) * 4)];
    //   let casilla8 = kernel[2][1] * pixelesFuente[((((y+1) * canvasFuente.width) + (x)) * 4)];
    //   let casilla9 = kernel[2][2] * pixelesFuente[((((y+1) * canvasFuente.width) + (x+1)) * 4)];

    //   const resultado = casilla1 + casilla2 + casilla3 + casilla4 + casilla5 + casilla6 + casilla7 + casilla8 + casilla9;

    //   pixelesDestino[index] = resultado;     //R
    //   pixelesDestino[index+1] = resultado;   //G
    //   pixelesDestino[index+2] = resultado;   //B
    //   pixelesDestino[index+3] = 255;         //A

    //   pixelesDestino[index] = pixelesFuente[index];     //R
    //   pixelesDestino[index+1] = pixelesFuente[index+1]; //G
    //   pixelesDestino[index+2] = pixelesFuente[index+2]; //B
    //   pixelesDestino[index+3] = pixelesFuente[index+3]; //A
    }
  }
  ctxDestino.putImageData(imgDataDestino, 0,0)
};

image.onload = imageLoaded;
