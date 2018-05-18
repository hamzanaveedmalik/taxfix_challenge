# taxfix_challenge

Build an API using Node.js that can convert currencies with the help of the European Central Bank exchange rates.

## USING TOOLS
* Node.js
* Express
* MongoDB
* Sublime Text
* MacOS Terminal

## WEBSERVER TEST URL (GET METHOD)

### Display European Central Bank exchange rates (Parsing HTML)
http://localhost:3000/currency

### Perform convert currencies
http://localhost:3000/currency/calc?from=KRW&to=EUR&amount=10000
http://localhost:3000/currency/calc?from=EUR&to=USD&amount=20

### Display stored convert currencies log
http://localhost:3000/currency/logs

## RUNNIG PROGRAM

* git clone this project
* run "docker-compose build" at project root folder
* run "docker-compose up"
* run webbrowser
* connect to http://localhost:3000 in webbrowser
