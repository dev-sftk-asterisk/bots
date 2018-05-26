var builder = require('botbuilder');

//crear un conector de tipo consola
var connector = new builder.ConsoleConnector().listen();

//crear un bot universal y ligarlo a la consola
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function(session) {
        session.send('Hola mundo!');
    }
])