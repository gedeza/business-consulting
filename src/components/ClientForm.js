
import React, { useState, useEffect } from 'react';

const ClientForm = ({ onSaveClient, editingClient, setEditingClient }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [physicalAddress, setPhysicalAddress] = useState('');

  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name || '');
      setEmail(editingClient.email || '');
      setCompany(editingClient.company || '');
      setPhone(editingClient.phone || '');
      setPhysicalAddress(editingClient.physicalAddress || '');
    } else {
      setName('');
      setEmail('');
      setCompany('');
      setPhone('');
      setPhysicalAddress('');
    }
  }, [editingClient]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClient = {
      id: editingClient ? editingClient.id : Date.now(),
      name,
      email,
      company,
      phone,
      physicalAddress,
    };
    onSaveClient(newClient);
    setName('');
    setEmail('');
    setCompany('');
    setPhone('');
    setPhysicalAddress('');
    setEditingClient(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">{editingClient ? 'Edit Client' : 'Add New Client'}</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Client Name</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Company (Optional)</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={company} onChange={e => setCompany(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone (Optional)</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Physical Address (Optional)</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={physicalAddress} onChange={e => setPhysicalAddress(e.target.value)} />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">{editingClient ? 'Update Client' : 'Add Client'}</button>
        {editingClient && (
          <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2 mt-4" onClick={() => setEditingClient(null)}>Cancel</button>
        )}
      </form>
    </div>
  );
};

export default ClientForm;
