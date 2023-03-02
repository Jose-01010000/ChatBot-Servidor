// const express = require('express');
// const bodyParser = require('body-parser');
// const { WebhookClient } = require('dialogflow-fulfillment');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.post('/webhook', (req, res) => {
// 	const agent = new WebhookClient({ request: req, response: res });

// 	function welcome(agent) {
// 		agent.add(`Bienvenido a nuestro chatbot por voz. ¿En qué puedo ayudarte?`);
// 	}

// 	function fallback(agent) {
// 		agent.add(`Lo siento, no entiendo lo que estás diciendo. Por favor, inténtalo de nuevo.`);
// 	}

// 	let intentMap = new Map();
// 	intentMap.set('Default Welcome Intent', welcome);
// 	intentMap.set('Default Fallback Intent', fallback);

// 	agent.handleRequest(intentMap);
// });

// app.listen(PORT, () => {
// 	console.log(`El servidor del chatbot está corriendo en el puerto ${PORT}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const dialogflow = require("dialogflow");
const uuid = require("uuid");

const app = express();

const sessionClient = new dialogflow.SessionsClient();
const sessionId = uuid.v4();
const projectId = "chatbot-378305"; // Ingresa aquí el ID de tu proyecto en Dialogflow
const credentials = {
  client_email: 'josepuello112000@gmail.com',
  private_key: '85Ny!m@FC!'
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const { message } = req.body;

  console.log(message);

  if (!message) {
    res.status(400).send({ error: "Mensaje vacío" });
    return;
  }

  try {
    const sessionPath = sessionClient.sessionPath(projectId, credentials);
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: "es",
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({ fulfillmentText: result.fulfillmentText });
  } catch (error) {
    res.status(400).send({ error: `Error del servidor ${error}` });
  }
});

app.listen(3000, () => console.log("Servidor iniciado en el puerto 3000"));
