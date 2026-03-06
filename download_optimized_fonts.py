import urllib.request
import re
import os

url = 'https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Montserrat:wght@800&display=swap'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        css = response.read().decode('utf-8')
    print('CSS downloaded.')
except Exception as e:
    print('Error downloading CSS:', e)
    exit(1)

# Extract latin subsets
inter_url = None
mont_url = None

blocks = css.split('}')
for block in blocks:
    if 'latin' in block and 'url(' in block:
        m = re.search(r'url\((https://[^)]+\.woff2)\)', block)
        if m:
            if 'Inter' in block and not inter_url:
                inter_url = m.group(1)
            elif 'Montserrat' in block and not mont_url:
                mont_url = m.group(1)

print('Inter url:', inter_url)
print('Mont url:', mont_url)

fpath0 = r'c:\Users\pauj2\Desktop\pagina-autonomos\fonts\font-0.woff2'
fpath5 = r'c:\Users\pauj2\Desktop\pagina-autonomos\fonts\font-5.woff2'

if inter_url and mont_url:
    urllib.request.urlretrieve(inter_url, fpath0)
    urllib.request.urlretrieve(mont_url, fpath5)
    print(f'font-0.woff2 is now {os.path.getsize(fpath0)} bytes')
    print(f'font-5.woff2 is now {os.path.getsize(fpath5)} bytes')
else:
    print('Failed to find URLs in CSS')
