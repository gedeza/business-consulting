
import React, { useState, useEffect } from 'react';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import { encrypt, decrypt } from '../utils/encryption';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      try {
        setClients(JSON.parse(decrypt(savedClients)));
      } catch (e) {
        console.error("Error parsing clients from local storage:", e);
        setClients([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('clients', encrypt(JSON.stringify(clients)));
  }, [clients]);

  const handleSaveClient = (client) => {
    if (client.id) {
      // Update existing client
      setClients(clients.map(c => (c.id === client.id ? client : c)));
    } else {
      // Add new client
      setClients([...clients, { ...client, id: Date.now() }]);
    }
  };

  const handleDeleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  const handleSelectClient = (client) => {
    setEditingClient(client);
  };

  return (
    <div className="container mt-5">
      <h2>Client Management</h2>
      <ClientForm onSaveClient={handleSaveClient} editingClient={editingClient} setEditingClient={setEditingClient} />
      <ClientList clients={clients} onSelectClient={handleSelectClient} onDeleteClient={handleDeleteClient} />
    </div>
  );
};

export default ClientManagement;
