.PHONY: run build deploy

run:
	npm run dev

build:
	npx nuxt generate
	touch docs/.nojekyll

deploy: build
	git checkout main
	git add -A
	git commit -m "deploy $$(openssl rand -hex 6)"
	git push origin main
