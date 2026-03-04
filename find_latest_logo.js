const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\pauj2\\.gemini\\antigravity\\brain\\70272a9c-b264-45cc-a3c2-8d70449d1e8e";

const files = fs.readdirSync(brainDir).filter(f => f.endsWith('.png'));

files.sort((a, b) => {
    return fs.statSync(path.join(brainDir, b)).mtimeMs - fs.statSync(path.join(brainDir, a)).mtimeMs;
});

if (files.length > 0) {
    console.log("Latest Media PNG: " + files[0]);
    console.log("Size: " + fs.statSync(path.join(brainDir, files[0])).size);
    // Copiar la imagen
    fs.copyFileSync(path.join(brainDir, files[0]), path.join(__dirname, 'logo-icono.png'));
    fs.copyFileSync(path.join(brainDir, files[0]), path.join(__dirname, 'landing', 'logo-icono.png'));
    console.log("Copied to logo-icono.png in roots!");
}
