all: index.html do.css minigfm.js

do.css:
	wget https://jncraton.github.io/docss/do.min.css

minigfm.js:
	wget -O $@ https://cdn.jsdelivr.net/npm/@oblivionocean/minigfm@latest/dist/index.min.js

lint:
	npx prettier@3.6.2 --check .
	
format:
	npx prettier@3.6.2 --write .

test: index.html
	pytest --browser firefox --browser chromium

favicon.ico:
	convert -size 48x48 xc:"#008030" -font "Noto-Mono" -pointsize 40 -fill white -gravity north -annotate 0 "#c" -define icon:auto-resize=16,32,48 favicon.ico

dev-deps:
	pip3 install pytest-playwright==0.7.1 && playwright install

clean:
	rm -rf .pytest_cache __pycache__ favicon* do.min.css minigfm.js
