const fs = require('fs');
const path = require('path');

const files = ['index.html', 'aviso-legal.html', 'privacidad.html', 'cookies.html'];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Reemplazar imagen PNG del logo por SVG
    content = content.replace(/<img src="logo-icono\.png" alt="">/g, '<img src="logo-icono.svg" alt="LibreFiscal.es">');

    // 2. Reemplazar las fuentes externas por locales
    const preconnect1 = '<link rel="preconnect" href="https://fonts.googleapis.com">';
    const preconnect2 = '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
    const stylesheetLink = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Montserrat:wght@700;800&display=swap" rel="stylesheet">';

    const localFonts = `    <!-- Preload Fonts locales (Inter Reg, Montserrat Bold) -->
    <link rel="preload" href="./fonts/font-0.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="./fonts/font-5.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="./fonts.css">`;

    content = content.replace(preconnect1 + '\n    ' + preconnect2 + '\n    ' + stylesheetLink, localFonts);
    content = content.replace(preconnect1 + '\r\n    ' + preconnect2 + '\r\n    ' + stylesheetLink, localFonts);

    // Alternate search if spacing is different
    const oldFontsRegex = /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*<link\s*href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@400;600;700;800&amp;family=Montserrat:wght@700;800&amp;display=swap"\s*rel="stylesheet">/g;
    content = content.replace(oldFontsRegex, localFonts.trim());

    // 3. Fix Script 404 de AdSense / CMP
    const oldScriptBlock = `    <!-- Desactivado temporalmente hasta disponer de un pub-id real para evitar errores 404 -->
    <!--
    <script async src="https://fundingchoicesmessages.google.com/i/pub-XXXXXXXXXXXXXXXX/pubinfo.js"
        data-cfasync="false"></script>
    -->`;
    const newScriptBlock = `    <!-- Script de AdSense / CMP Auto-Carga actualizado a la API más reciente -->\n    <!-- Por favor, reemplaza ca-pub-XXXXXXXXXXXXXXXX con tu Publisher ID real -->\n    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>`;

    content = content.replace(oldScriptBlock, newScriptBlock);
    // Para las paginas que quizas no tenian el comentario:
    const oldScriptBlock2 = `<script async src="https://fundingchoicesmessages.google.com/i/pub-XXXXXXXXXXXXXXXX/pubinfo.js"
        data-cfasync="false"></script>`;
    content = content.replace(oldScriptBlock2, newScriptBlock);

    fs.writeFileSync(filePath, content);
    console.log(`Patched ${file}`);
});
