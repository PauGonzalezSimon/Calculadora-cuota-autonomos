const fs = require('fs');
const path = require('path');

const avisoLegalContent = `<h1>Aviso Legal</h1>
<p><strong>1. Datos Identificativos</strong><br>
Titular: Pablo José González Simón<br>
DNI: 23324173B<br>
Dirección: Calle Tormes 4, 46190, Ribarroja del Turia, Valencia<br>
Correo electrónico: pauj2015gs@gmail.com</p>

<p><strong>2. Finalidad de la web</strong><br>
La presente página web (librefiscal.es) y sus subdominios tienen como finalidad ofrecer una herramienta gratuita de estimación y cálculo de la cuota de la Seguridad Social para trabajadores autónomos en España en base al sistema de ingresos reales aplicable en 2026. Los resultados obtenidos tienen carácter meramente orientativo y formativo, no constituyendo en ningún caso asesoramiento legal, fiscal o laboral vinculante ni una relación contractual.</p>

<p><strong>3. Propiedad intelectual</strong><br>
Todos los derechos de propiedad intelectual, lógicos y diseño de la presente página son propiedad de Pablo José González Simón o de terceros que han autorizado su uso. Queda terminantemente prohibida la reproducción, distribución o comunicación pública, total o parcial, de los contenidos de esta web sin autorización expresa.</p>

<p><strong>4. Exención de responsabilidad</strong><br>
El titular no se hace responsable de las posibles discrepancias que puedan existir entre los cálculos orientativos mostrados y los importes finales requeridos por la Agencia Tributaria o la Tesorería General de la Seguridad Social (TGSS), así como tampoco de decisiones particulares que el usuario tome en base a esta herramienta. Es responsabilidad del usuario contrastar su situación tributaria y de seguridad social mediante organismos oficiales o profesionales competentes.</p>
<a href="/" class="back-btn">← Volver al inicio</a>`;

const privacidadContent = `<h1>Política de Privacidad</h1>
<p><strong>1. Responsable del Tratamiento</strong><br>
El responsable del tratamiento de los datos es Pablo José González Simón (DNI: 23324173B), con domicilio en Calle Tormes 4, 46190, Ribarroja del Turia, Valencia. Correo de contacto: pauj2015gs@gmail.com.</p>

<p><strong>2. Recopilación de Datos y Finalidad</strong><br>
La gestión de la privacidad en librefiscal.es es estricta: no recopilamos, no almacenamos ni enviamos datos económicos personales a servidores de terceros.<br>
Todos los ingresos, gastos y selecciones introducidos en la calculadora de autónomos se procesan de forma local y efímera en el propio navegador web del usuario. Ninguno de estos datos cruza internet ni se guarda en bases de datos.<br>
Si un usuario decide contactar voluntariamente a través del correo electrónico facilitado en el Aviso Legal, sus datos (dirección de correo y nombre) serán utilizados única y exclusivamente para dar respuesta a su consulta.</p>

<p><strong>3. Terceros y Publicidad</strong><br>
Para sostener la infraestructura de forma gratuita, la plataforma se apoya en el servicio de publicidad externa Google AdSense. Este proveedor puede recopilar información técnica de navegación mediante cookies para mostrar anuncios. Las prácticas de privacidad y opciones de configuración de este servicio se detallan en la Política de Cookies. No se utilizan herramientas de analítica web como Google Analytics.</p>

<p><strong>4. Derechos del Usuario</strong><br>
El usuario puede ejercer sus derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición enviando un correo a pauj2015gs@gmail.com.</p>
<a href="/" class="back-btn">← Volver al inicio</a>`;

const cookiesContent = `<h1>Política de Cookies</h1>
<p><strong>1. ¿Qué son las cookies?</strong><br>
Las cookies son pequeños archivos de texto que las páginas web que visitas instalan en tu terminal (navegador digital local) para hacer más eficiente la experiencia o mostrar contenido personalizado.</p>

<p><strong>2. Cookies utilizadas en este sitio</strong><br>
Esta web no utiliza cookies propias ni herramientas de analítica (como Google Analytics) orientadas al rastreo de usuarios. Únicamente se emplean cookies de terceros con fines publicitarios:</p>
<ul>
    <li><strong>Google AdSense:</strong> Utilizamos los servicios de monetización de Google para la publicación de anuncios. Google y sus proveedores externos asociados utilizan cookies para mostrar anuncios relevantes al usuario basándose en visitas anteriores a esta u otras páginas web, conforme al marco normativo TCF v2.2 de IAB Europe.</li>
</ul>

<p><strong>3. Herramienta de Gestión del Consentimiento (CMP)</strong><br>
En cumplimiento con las directrices europeas y los mandatos de Google, al entrar por primera vez se muestra un panel central de gestión del consentimiento (CMP). Desde dicho panel, el usuario puede otorgar, denegar o configurar de forma granular el tratamiento de sus datos y el uso de cookies publicitarias.</p>

<p><strong>4. Cómo desactivar las cookies desde el navegador</strong><br>
El usuario puede bloquear o eliminar las cookies en cualquier momento configurando las opciones de privacidad de su navegador:</p>
<ul>
    <li><strong>Google Chrome:</strong> Configuración > Privacidad y seguridad > Cookies y otros datos de sitios.</li>
    <li><strong>Mozilla Firefox:</strong> Opciones > Privacidad y seguridad > Cookies y datos del sitio.</li>
    <li><strong>Safari:</strong> Preferencias > Privacidad > Bloquear todas las cookies.</li>
    <li><strong>Edge:</strong> Configuración > Cookies y permisos del sitio.</li>
</ul>
<a href="/" class="back-btn">← Volver al inicio</a>`;

const filesToUpdate = [
    { name: 'aviso-legal.html', content: avisoLegalContent },
    { name: 'privacidad.html', content: privacidadContent },
    { name: 'cookies.html', content: cookiesContent },
    { name: 'landing/aviso-legal.html', content: avisoLegalContent },
    { name: 'landing/privacidad.html', content: privacidadContent },
    { name: 'landing/cookies.html', content: cookiesContent }
];

for (const file of filesToUpdate) {
    const filePath = path.join(__dirname, file.name);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${file.name} (not found)`);
        continue;
    }

    let fileHtml = fs.readFileSync(filePath, 'utf8');

    // Remplazar lo que está dentro de <div class="card">...</div>
    const regex = /<div class="card">[\s\S]*?<\/div>\s*<\/div>/i;
    const replacement = `<div class="card">\n            ${file.content}\n        </div>\n    </div>`;

    fileHtml = fileHtml.replace(regex, replacement);
    fs.writeFileSync(filePath, fileHtml);
    console.log(`Updated ${file.name}`);
}

console.log('All legal texts updated!');
