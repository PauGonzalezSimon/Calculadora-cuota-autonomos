const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'index.html',
    'landings/index.html' // we might have landing/index.html
];

for (const file of ['index.html', 'landing/index.html']) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Remove Google Fonts CDN
    content = content.replace(/<!-- Google Fonts CDN -->[\s\S]*?<style>/, '<style>');

    // Add exactly what they asked for preload of fonts before CSS styles
    const preloadFonts = `
    <!-- Preload para LCP estricto -->
    <link rel="preload" href="/fonts/font-0.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/font-5.woff2" as="font" type="font/woff2" crossorigin>
    <style>
        @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url(/fonts/font-0.woff2) format('woff2');
        }
        @font-face {
            font-family: 'Montserrat';
            font-style: normal;
            font-weight: 800;
            font-display: swap;
            src: url(/fonts/font-5.woff2) format('woff2');
        }
`;
    // replace <style> with preload + definitions
    if (!content.includes('font-0.woff2')) {
        content = content.replace(/<style>/, preloadFonts);
    }

    // Inline CSS for H1 to optimize LCP
    content = content.replace(/<h1>/, '<h1 style="font-size: 1.6rem; font-weight: 800; text-align: center; color: #0f172a; margin-bottom: 1.5rem; line-height: 1.2; letter-spacing: -0.025em; font-family: \'Montserrat\', system-ui, sans-serif;">');

    // Remove unused divs to reduce DOM:
    // Some tooltips can be simplified if they are empty
    // Wrap header and curve more efficiently, or remove empty containers.

    // Simplificar DOM
    content = content.replace(/<div class="logo-icon-wrapper" role="img" aria-label="LibreFiscal.es">[\s]*<img src="logo-icono.webp" alt="LibreFiscal.es" width="48" height="48">[\s]*<\/div>/g, '<img src="logo-icono.webp" alt="LibreFiscal.es" class="logo-icon-wrapper" width="48" height="48">');
    content = content.replace(/<div class="col-full" id="ccaa_container">/g, '<div id="ccaa_container" style="grid-column: 1/-1;">');

    fs.writeFileSync(filePath, content);
    console.log(`Patched LCP and DOM in ${file}`);
}
