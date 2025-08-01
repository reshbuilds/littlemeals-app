import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Child {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  birthdate?: string;
}

interface ChildrenContextType {
  children: Child[];
  addChild: (child: Omit<Child, 'id'>) => void;
  removeChild: (childId: string) => void;
  updateChild: (childId: string, updates: Partial<Child>) => void;
}

const ChildrenContext = createContext<ChildrenContextType | undefined>(undefined);

// Default mock data - in production this would come from database
const defaultChildren: Child[] = [
  { id: '1', name: 'Sam', age: 4, avatar: '👦', birthdate: '2020-03-15' },
  { id: '2', name: 'Sebbie', age: 2, avatar: '👶', birthdate: '2022-08-22' },
  { id: '3', name: 'Dee-Dee-Dee', age: 6, avatar: '🧒', birthdate: '2018-11-10' }
];

export const ChildrenProvider: React.FC<{ children: ReactNode }> = ({ children: reactChildren }) => {
  const [children, setChildren] = useState<Child[]>(defaultChildren);

  const addChild = (childData: Omit<Child, 'id'>) => {
    const newChild: Child = {
      ...childData,
      id: Date.now().toString(), // Simple ID generation - use proper UUID in production
    };
    setChildren(prev => [...prev, newChild]);
  };

  const removeChild = (childId: string) => {
    setChildren(prev => prev.filter(child => child.id !== childId));
  };

  const updateChild = (childId: string, updates: Partial<Child>) => {
    setChildren(prev => 
      prev.map(child => 
        child.id === childId ? { ...child, ...updates } : child
      )
    );
  };

  return (
    <ChildrenContext.Provider value={{ children, addChild, removeChild, updateChild }}>
      {reactChildren}
    </ChildrenContext.Provider>
  );
};

export const useChildren = () => {
  const context = useContext(ChildrenContext);
  if (context === undefined) {
    throw new Error('useChildren must be used within a ChildrenProvider');
  }
  return context;
};