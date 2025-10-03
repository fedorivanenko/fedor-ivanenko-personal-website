'use client';
import { useState, useEffect } from 'react';

interface Item {
  id: number;
  name: string;
}

export default function StreamList() {
  const [items, setItems] = useState<Item[]>([]);
  
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/items');
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        const item: Item = JSON.parse(decoder.decode(value));
        setItems(prev => [...prev, item]);
      }
    })();
  }, []);
  
  return items.map(i => <div key={i.id}>{i.name}</div>);
}