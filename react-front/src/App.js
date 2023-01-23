import React from 'react';
import MainPage from './components/pages/MainPage'
import DataContextProvider from './contexts/DataContext'

export default function App() {
  return (
    <DataContextProvider>
      <MainPage />
    </DataContextProvider>
  );
}