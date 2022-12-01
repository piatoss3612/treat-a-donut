SHELL=cmd.exe

start_dev: migrate front

front:
	@echo Starting frontend...
	npm start

compile:
	@echo Compiling smart contract...
	chdir ./src/truffle && truffle compile
	@echo Done!

test:
	@echo Testing smart contract...
	chdir ./src/truffle && truffle test
	@echo Done!

console:
	@echo Starting truffle console...
	chdir ./src/truffle && truffle console

dashboard:
	@echo Opening truffle dashboard...
	chdir ./src/truffle && truffle dashbaord

migrate:
	@echo Migrate to ganache network...
	chdir ./src/truffle && truffle migrate --reset
	@echo Done!

deploy:
	@echo Deploying smart contract on truffle dashboard...
	chdir ./src/truffle && truffle migrate --network dashboard