import { Box, List, ThemeIcon, Title } from '@mantine/core';
import { CheckCircleFillIcon, XCircleFillIcon } from '@primer/octicons-react';
import useSWR from 'swr';
import './App.css';
import AddTodo from './components/AddTodo';
import axios from 'axios';

export interface Todo {
  id: number;
  title: string;
  body: string;
  done: boolean;
}

export const ENDPOINT = 'http://localhost:4000';

const fetcher = (url: string) =>
  fetch(`${ENDPOINT}/${url}`).then((r) => r.json());

function App() {
  const { data, mutate } = useSWR<Todo[]>('api/todos', fetcher);

  async function markTodoAdDone(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: 'PATCH',
    }).then((r) => r.json());

    mutate(updated);
  }

  const removeData = async (id: number) => {
    try {
      const deleted = await axios.delete(`${ENDPOINT}/api/todos/${id}/delete`);
      console.log('To do successfully deleted');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          padding: '2rem',
          width: '100%',
          maxWidth: '40rem',
          margin: '0 auto',
          background: '#23DEB7',
          borderRadius: '20px',
          marginTop: '5rem',
        })}
      >
        <Title order={1} color="theme.white" align="center">
          TO DO LIST
        </Title>
        <List spacing="xs" size="md" mb={12} center color="white">
          {data?.map((todo) => {
            return (
              <List.Item
                onClick={() => markTodoAdDone(todo.id)}
                key={`todo_list__${todo.id}`}
                icon={
                  todo.done ? (
                    <ThemeIcon color="teal" size={24} radius="xl">
                      <CheckCircleFillIcon size={20} />
                    </ThemeIcon>
                  ) : (
                    <ThemeIcon color="gray" size={24} radius="xl">
                      <CheckCircleFillIcon size={20} />
                    </ThemeIcon>
                  )
                }
              >
                {todo.title}
                {todo.body}
              </List.Item>
            );
          })}
        </List>

        <AddTodo mutate={mutate} />
      </Box>
    </>
  );
}

export default App;
