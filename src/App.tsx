import { DefaultTheme, ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./styles/theme";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import { FC, useState } from "react";
import GlobalStyles from "../src/styles/global";
import { TodoList } from "./components/TodoList";
import styled from "styled-components";
import useLocalStorage from "./hooks/useLocalStorage";
import { PersonaComponent } from "./components/PersonaClient";


const App: FC = () => {
  const [theme, setTheme] = useLocalStorage<DefaultTheme>("theme", lightTheme);
  const [todos, setTodos] = useState([]);

  const addTodo = (name: string): void => {
    const newTodo = {
      id: Date.now(),
      name,
      completed: false,
    };
    setTodos((prevState) => [...prevState, newTodo]);
  };

  const toggleTodo = (id: number): void => {
    setTodos((prevState) =>
      prevState.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      })
    );
  };

  const editTodo = (id: number, name: string): void => {
    setTodos((prevState) => {
      return prevState.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            name,
          };
        }
        return todo;
      });
    });
  };

  const removeTodo = (id: number): void => {
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const getItemsLeft = () => {
    return todos.reduce((counter, todo) => {
      if (!todo.completed) {
        return counter + 1;
      }
      return counter;
    }, 0);
  };

  const removeCompleted = (): void => {
    setTodos((prevState) => prevState.filter((todo) => !todo.completed));
  };

  const themeToggle = () => {
    const newTheme = theme === lightTheme ? darkTheme : lightTheme;
    setTheme(newTheme);
  };

  return (<>
    <ThemeProvider theme={theme}>
        <Header>📓 Todo List</Header>
        <PersonaComponent
          todos={todos}
          addTodo={addTodo}
          toggleTodo={toggleTodo}
          editTodo={editTodo}
          removeTodo={removeTodo}
          getItemsLeft={getItemsLeft}
          removeCompleted={removeCompleted}
          
          />

        <TodoList
          todos={todos}
          addTodo={addTodo}
          toggleTodo={toggleTodo}
          editTodo={editTodo}
          removeTodo={removeTodo}
          getItemsLeft={getItemsLeft}
          removeCompleted={removeCompleted}
        />
        
        <Footer>
          Double click on todo to edit <br />
          <a target="_blank" href="https://www.maxim-grinev-resume.ru/">
            © Maxim Grinev
          </a>
        </Footer>
        <ThemeToggle onClick={themeToggle}>
          <DarkModeIcon fontSize="medium" />
        </ThemeToggle>
        <GlobalStyles />
    </ThemeProvider>
    </>
  );
};

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
`;

export const Header = styled.h1`
  text-align: center;
  font-size: 48px;
  padding: 50px 0 50px 0;
`;

export const Footer = styled.h6`
  text-align: center;
  font-size: 14px;
  font-weight: 200;
  font-style: italic;
  opacity: 0.5;
  padding-top: 25px;
  padding-bottom: 25px;
`;

export const ThemeToggle = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
`;

export default App;
