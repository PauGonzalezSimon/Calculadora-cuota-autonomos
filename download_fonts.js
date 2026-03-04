const fs = require('fs');
const https = require('https');
const path = require('path');

const FONTS_DIR = path.join(__dirname, 'fonts');
const CSS_URL = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Montserrat:wght@700;800&display=swap";

if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR);
}

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

https.get(CSS_URL, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
    let cssData = '';
    res.on('data', chunk => cssData += chunk);
    res.on('end', async () => {
        const urlRegex = /url\((https:\/\/fonts\.gstatic\.com\/s\/[^)]+)\)/g;
        let match;
        let fontIndex = 0;
        
        while ((match = urlRegex.exec(cssData)) !== null) {
            const fontUrl = match[1];
            const fontName = `font-${fontIndex++}.woff2`;
            const fontPath = path.join(FONTS_DIR, fontName);
            
            console.log(`Downloading ${fontUrl} to ${fontName}`);
            await downloadFile(fontUrl, fontPath);
            
            // Replace external URL with local path in CSS
            cssData = cssData.replace(fontUrl, `./fonts/${fontName}`);
        }
        
        fs.writeFileSync(path.join(__dirname, 'fonts.css'), cssData);
        console.log('Fonts downloaded and fonts.css generated.');
    });
});
