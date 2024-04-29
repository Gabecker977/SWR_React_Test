import useSWR from 'swr'
import api from '../services/api';
import { revalidateEvents } from 'swr/dist/_internal';
import { on } from 'events';

export function useFetch<Data = any, Error = any>(url: string) {
  const { data, error, mutate } = useSWR<Data, Error>(url, async (url: string) => {
    const response = await api.get(url);
    const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(1000)
    return response.data;
    
  },{
    revalidateOnReconnect: true,
    revalidateOnFocus: true,
  })
  
  return { data, error, mutate }
}