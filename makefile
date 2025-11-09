all: index.html do.min.css ugfm.min.js reveal.js

do.min.css:
	wget https://jncraton.github.io/docss/do.min.css

ugfm.min.js:
	wget -O $@ https://jncraton.github.io/ugfm/ugfm.min.js

lint:
	npx prettier@3.6.2 --check .
	
format:
	npx prettier@3.6.2 --write .

test: index.html lint
	pytest --browser firefox --browser chromium

favicon.ico:
	convert -size 48x48 xc:"#008030" -font "Noto-Mono" -pointsize 40 -fill white -gravity north -annotate 0 "#c" -define icon:auto-resize=16,32,48 favicon.ico

reveal.js:
	git clone --depth=1 --branch 5.2.1 https://github.com/hakimel/reveal.js

dev-deps:
	pip3 install pytest-playwright==0.7.1 && playwright install

clean:
	rm -rf .pytest_cache __pycache__ favicon* do.min.css ugfm.min.js reveal.js
