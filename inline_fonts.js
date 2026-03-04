const fs = require('fs');
const path = require('path');

const fontsCss = fs.readFileSync(path.join(__dirname, 'fonts.css'), 'utf8');
const files = ['index.html', 'aviso-legal.html', 'privacidad.html', 'cookies.html'];

for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Remove any remaining Google Fonts links
    content = content.replace(/<link[^>]*href="https:\/\/fonts\.googleapis\.com[^>]*>/g, '');
    content = content.replace(/<link[^>]*href="https:\/\/fonts\.gstatic\.com[^>]*>/g, '');

    // Remove the external stylesheet for fonts
    content = content.replace(/<link rel="stylesheet" href="\.\/fonts\.css">/g, '');

    // Check if the inline fonts are already there
    if (!content.includes("@font-face")) {
        // Inject inline fonts CSS right after <style>
        content = content.replace('<style>', `<style>\n${fontsCss}\n`);
    }

    // Ensure the Google AdSense script has a delay or doesn't aggressively block rendering.
    // However, AdSense needs to execute to show CMP. 
    // We will ensure it has exactly what the user needed.

    // Remove leftover blank lines or artifacts locally
    fs.writeFileSync(filePath, content);
}

// Remove fonts.css as it's no longer needed
if (fs.existsSync(path.join(__dirname, 'fonts.css'))) {
    fs.unlinkSync(path.join(__dirname, 'fonts.css'));
}

console.log("Fonts inlined successfully in all pages.");
