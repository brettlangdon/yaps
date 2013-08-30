MOCHA_OPTS = --check-leaks
REPORTER = spec

clean:
	@rm -f coverage.html
	@rm -rf lib-cov

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --ui tdd --reporter $(REPORTER) $(MOCHA_OPTS)

test-cov: lib-cov
	@YAPS_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@./node_modules/.bin/jscoverage lib lib-cov

.PHONY: clean lib-cov test test-cov
