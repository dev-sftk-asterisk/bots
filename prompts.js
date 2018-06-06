var restify = require('restify');
var builder = require('botbuilder');

//Levantar restify
var server = new restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening at %s', server.name, server.url);
});

//Conectar con un canal de chat tipo Skype, FB Messenger, etc...
var connector = new builder.ChatConnector({
    appId: BOT_APP_ID,
    appPassword: BOT_PASSWORD
});

//Crear un UniversalBot
var bot = new builder.UniversalBot(connector);

//Escuchar los mensajes de los usuarios a traves de la ruta /api/messages
server.post('/api/messages', connector.listen());

// Dialogos
bot.dialog('/', [
    function (session, results, next) {
        builder.Prompts.text(session, '¿Cómo te llamas?');
    },
    function (session, results) {
        session.dialogData.nombre = results.response;
        builder.Prompts.number(session, `Ok, ${session.dialogData.nombre}. ¿Cuál es tu edad?`);
    },
    function (session, results) {
        session.dialogData.edad = results.response;
        builder.Prompts.time(session, `¿Qué hora es?`);
    },
    function (session, results) {        
        let userTime = builder.EntityRecognizer.resolveTime([results.response]);
        let hours = userTime.getHours();
        let minutes = userTime.getMinutes();
        session.dialogData.hora = hours + ':' + minutes;

        builder.Prompts.choice(session, '¿Cuál prefieres?', 'Mar|Montaña');
    },
    function (session, results) {
        session.dialogData.preferencia = results.response.entity;
        builder.Prompts.confirm(session, '¿Quieres ver un resumen?');
    },
    function (session, results) {
        if (results.response) {
            session.endDialog(`Me contaste que tu nombre es **${session.dialogData.nombre}**, tienes **${session.dialogData.edad}** años, son las **${session.dialogData.hora}** y prefieres **${session.dialogData.preferencia}**`);
        }
        else {
            session.endDialog('Adios!');
        }
    }
]);