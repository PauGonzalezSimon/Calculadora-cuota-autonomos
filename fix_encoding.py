import os
import glob
import re

html_files = glob.glob(r'c:\Users\pauj2\Desktop\pagina-autonomos\*.html') + \
             glob.glob(r'c:\Users\pauj2\Desktop\pagina-autonomos\landing\*.html')

replacements = {
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã±': 'ñ',
    'Ã ': 'Á',
    'Ã\x81': 'Á',
    'Ã‰': 'É',
    'Ã\x8d': 'Í',
    'Ã“': 'Ó',
    'Ãš': 'Ú',
    'Ã‘': 'Ñ',
    'Â¿': '¿',
    'Â¡': '¡',
    'â‚¬': '€',
    'â€“': '–',
    'â€”': '—',
    'â€˜': '‘',
    'â€™': '’',
    'â€œ': '“',
    'â€ ': '”'
}

for fpath in html_files:
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Try exact decode roundtrip because it was double-encoded
    try:
        content = content.encode('windows-1252').decode('utf-8')
    except Exception as e:
        for k, v in replacements.items():
            content = content.replace(k, v)
            
    # Remove BOM if there is any
    content = content.replace('\ufeff', '')
            
    # Remove existing meta charset
    content = re.sub(r'<meta\s+charset=["\']?utf-8["\']?\s*/?>\s*', '', content, flags=re.IGNORECASE)
    
    # Insert right after <head>
    content = re.sub(r'(<head\b[^>]*>)', r'\1\n    <meta charset="UTF-8">', content, count=1, flags=re.IGNORECASE)

    # 404 absolute paths
    if '404.html' in fpath:
        content = content.replace('href="fonts/', 'href="/fonts/')
        content = content.replace('src="logo-icono', 'src="/logo-icono')
        content = content.replace('href="logo-icono', 'href="/logo-icono')
    
    with open(fpath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)

print("Done fixing encoding and meta tags!")
