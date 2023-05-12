import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

const CONDENSE_PROMPT = `Dada la siguiente conversación y una pregunta de seguimiento, reformula la pregunta de seguimiento para que sea una pregunta independiente.

Historial del chat:
{chat_history}
Pregunta de seguimiento: {question}
Pregunta independiente:`;

const QA_PROMPT = `Eres un asistente de inteligencia artificial útil. Utiliza las siguientes piezas de contexto para responder a la pregunta al final.
Si no conoces la respuesta, simplemente di que no la sabes. NO trates de inventar una respuesta.
Si la pregunta no está relacionada con el contexto, responde educadamente que estás programado para responder solo a preguntas que están relacionadas con el contexto.

{context}

Pregunta: {question}
Respuesta útil en markdown:`;

export const makeChain = (vectorstore: PineconeStore) => {
  const model = new OpenAI({
    temperature: 0, // increase temepreature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
    },
  );
  return chain;
};
