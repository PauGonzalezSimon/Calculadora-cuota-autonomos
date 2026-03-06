import re
import os

print('Fixing index.html...')
index_path = r'c:\Users\pauj2\Desktop\pagina-autonomos\index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the trailing garbage if any
html = re.sub(r'```?\.\s*$', '', html)

# Fix logo and links
html = html.replace('src="logo-icono.webp"', 'src="/logo-icono.webp"')
html = html.replace('href="index.html"', 'href="/"')
html = html.replace('href="aviso-legal.html"', 'href="/aviso-legal.html"')
html = html.replace('href="privacidad.html"', 'href="/privacidad.html"')
html = html.replace('href="cookies.html"', 'href="/cookies.html"')

# Consolidate style blocks
style1_end = html.find('</style>')
style2_start = html.find('<style>', style1_end + 1)

if style1_end != -1 and style2_start != -1:
    between_styles = html[style1_end+8 : style2_start]
    html = html[:style1_end] + html[style2_start+7:]
    
    new_style_end = html.find('</style>')
    html = html[:new_style_end+8] + '\n' + between_styles.strip() + '\n' + html[new_style_end+8:]

with open(index_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(html)
print('index.html fixed!')

print('Fixing 404.html...')
err_path = r'c:\Users\pauj2\Desktop\pagina-autonomos\404.html'
with open(err_path, 'r', encoding='utf-8') as f:
    err_html = f.read()

if not err_html.startswith('---'):
    err_html = '---\n---\n' + err_html

with open(err_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(err_html)
print('404.html fixed!')

print('Done')
