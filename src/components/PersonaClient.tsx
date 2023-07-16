import { useEffect, useState } from "react";
import { useTodos } from "../hooks/useTodos";

let personaClient: any;

export const PersonaComponent = (props) => {
  const [isClientLoaded, setClientLoaded] = useState(false);

  const startPersonaClient = () => {
    console.log("init persona client");
    const script = document.createElement("script");
    script.src = "https://app.sindarin.tech/PersonaClientPublic?apikey=416330de-e15d-4927-898c-339f346c4995";
    document.head.appendChild(script);

    script.addEventListener("load", async () => {
      console.log("persona client loaded");
      const apiKey = "abc";
      // @ts-ignore
      personaClient = new window.PersonaClient(apiKey);

      personaClient
        .init('123', 'todo-helper')
        .then(() => {
          console.log("personaClient initialized");
          personaClient.on("ready", () => {
            personaClient.sayText(`Let's manage your todos!`);
            setClientLoaded(true);
          });
        });
    });
  };

  useEffect(() => {
    if (isClientLoaded) {
      console.log('updatding state', props.todos)
      personaClient.updateState({
        todos: props.todos,
      });
    }
  }, [props.todos]);

  useEffect(() => {
    if (isClientLoaded) {
      personaClient.on("json", ({ detail }) => {
        if (detail.transcription) {
          return;
        }
        console.log("detail", detail);
        if (detail.addTodos) {
          console.log("addTodos", detail.addTodos);
          detail.addTodos.forEach((todoText) => {
            props.addTodo(todoText);
          });
        }
        if (detail.removeTodos) {
          console.log("remove", detail.removeTodos);
          detail.removeTodos.forEach((id) => {
            props.removeTodo(parseInt(id));
          });
        }
      })
    }
  }, [isClientLoaded]);

  return (
    <button onClick={startPersonaClient}>Start PersonaClient</button>
  );
}
