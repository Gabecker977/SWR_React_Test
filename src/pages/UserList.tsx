import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { mutate as mutateGlobal } from 'swr';
import { useFetch } from '../hooks/useFetch';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  city: string;
}
// Choese a random name to change the user name
const randomName = () => {
  const names = ['Bartolomeu', 'João', 'Maria', 'José', 'Pedro', 'Paulo', 'Lucas', 'Mateus', 'Marcos', 'Judas', 'Simão', 'André', 'Tiago', 'Tadeu', 'Tomé', 'Filipe', 'Bartolomeu', 'Matias', 'Levi', 'Matias', 'Judas', 'Judas Iscariotes',
  ];
  return names[Math.floor(Math.random() * names.length)];
}
const UserList: React.FC = () => {
  const { data, mutate } = useFetch<User[]>('users');

  const handleNameChange = useCallback((id: number) => {
    const name = randomName();
    api.patch(`users/${id}`, { name: name });
    
    const updatedUsers = data?.map(user => {
      console.log(user);
      
     if (user.id === id) {
        return {
          ...user,
          name: name ,
          city: user.city
        };
      }

      return user;
    })

    //atualiza a lista no cache
    mutate(updatedUsers, false)
    //atualiza os detalhes do usuário no cache
    const city = data?.find(user => user.id === id)?.city;
    mutateGlobal(`users/${id}`, { id, name: name, city})
    //mutateGlobal(`users/${id}`, { id, name: name, })
  }, [data, mutate]);

  if (!data) {
    return <p>Carregando...</p>
  }

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>
          <Link to={`/users/${user.id}`}>
            {user.name}
          </Link>
          <button type="button" onClick={() => handleNameChange(user.id)}>
            Alterar nome
          </button>
        </li>
      ))}
    </ul>
  );
}

export default UserList;