const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const lines = content.split('\n');

const startIndex = lines.findIndex(l => l.includes('/* Alerta Pérdidas */'));
const endIndex = lines.findIndex((l, i) => i > startIndex && l.includes('</style>'));

if (startIndex !== -1 && endIndex !== -1) {
    const asyncCssLines = lines.slice(startIndex, endIndex);
    fs.writeFileSync(path.join(__dirname, 'style-async.css'), asyncCssLines.join('\n'));

    // Remove the async CSS from index.html
    lines.splice(startIndex, endIndex - startIndex);

    // Inject the async CSS loader just before </head>
    const headEndIndex = lines.findIndex(l => l.includes('</head>'));
    if (headEndIndex !== -1) {
        const loader = `    <!-- Async CSS -->\n    <link rel="preload" href="./style-async.css" as="style" onload="this.onload=null;this.rel='stylesheet'">\n    <noscript><link rel="stylesheet" href="./style-async.css"></noscript>`;
        lines.splice(headEndIndex, 0, loader);
    }

    fs.writeFileSync(indexPath, lines.join('\n'));
    console.log('Async CSS extracted successfully.');
} else {
    console.log('Could not find CSS boundaries.');
}
