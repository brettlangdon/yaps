MOCHA_OPTS = --check-leaks
REPORTER = spec

clean:
	@rm -f coverage.html
	@rm -rf lib-cov

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --ui tdd --reporter $(REPORTER) $(MOCHA_OPTS)

test-cov: lib-cov
	@YAPS_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

test-coveralls: lib-cov
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@YAPS_COV=1 $(MAKE) test REPORTER=mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js
	$(MAKE) clean

lib-cov:
	@./node_modules/.bin/jscoverage lib lib-cov

.PHONY: clean lib-cov test test-cov
