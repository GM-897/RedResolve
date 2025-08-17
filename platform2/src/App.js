import React from 'react';
import DashboardHeader from './components/DashboardHeader';
import IssuesList from './components/IssuesList';
import './App.css';

function App() {
  return (
    <div className="dashboard-app">
      <DashboardHeader />
      <main>
        <IssuesList />
      </main>
    </div>
  );
}

export default App;