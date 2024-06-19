const conteudoInput = document.getElementById("conteudo");
const corInput = document.getElementById("cor");
const logoInput = document.getElementById("logo");
const gerarButton = document.getElementById("gerar");
const resultadoDiv = document.getElementById("resultado");

gerarButton.addEventListener("click", () => {
  const conteudo = conteudoInput.value;
  const cor = corInput.value;
  const logo = logoInput.files[0];

  if (!conteudo) {
    alert("Por favor, insira o conteúdo do QR Code.");
    return;
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${conteudo}&color=${cor.substring(
    1
  )}`;

  if (logo) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const logoBase64 = event.target.result;
      localStorage.setItem("logo", logoBase64);
      gerarQRCodeComLogo(qrCodeUrl, logoBase64);
    };
    reader.readAsDataURL(logo);
  } else {
    const logoBase64 = localStorage.getItem("logo");
    if (logoBase64) {
      gerarQRCodeComLogo(qrCodeUrl, logoBase64);
    } else {
      gerarQRCodeSimples(qrCodeUrl);
    }
  }
});

function gerarQRCodeSimples(url) {
    resultadoDiv.innerHTML = `
      <img src="${url}" alt="QR Code">
      <a href="${url}" download="qrcode.png">Baixar QR Code</a>
    `;
  }
  
  function gerarQRCodeComLogo(url, logoBase64) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.crossOrigin = "Anonymous";
    const qrCodeImg = new Image();
    qrCodeImg.crossOrigin = "Anonymous";
    qrCodeImg.onload = () => {
      canvas.width = qrCodeImg.width;
      canvas.height = qrCodeImg.height;
      ctx.drawImage(qrCodeImg, 0, 0);
  
      const logoImg = new Image();
      logoImg.crossOrigin = "Anonymous";
      logoImg.onload = () => {
        const logoSize = qrCodeImg.width * 0.2;
        ctx.drawImage(
          logoImg,
          (qrCodeImg.width - logoSize) / 2,
          (qrCodeImg.height - logoSize) / 2,
          logoSize,
          logoSize
        );
        const dataUrl = canvas.toDataURL();
        resultadoDiv.innerHTML = `
          <img src="${dataUrl}" alt="QR Code com Logo">
          <a href="${dataUrl}" download="qrcode_personalizado.png">Baixar QR Code com Logo</a>
        `;
      };
      logoImg.src = logoBase64;
    };
    qrCodeImg.src = url;
  }
  