
import React from 'react';

const ClientList = ({ clients, onSelectClient, onDeleteClient }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">Saved Clients</h4>
      <div>
        {clients.length === 0 ? (
          <p className="text-gray-600">No clients saved yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {clients.map(client => (
              <li key={client.id} className="py-4 flex justify-between items-center">
                <div>
                  <h5 className="text-lg font-semibold text-gray-800">{client.name} {client.company && `(${client.company})`}</h5>
                  <small className="text-gray-600">{client.email}{client.phone && ` | ${client.phone}`}</small>
                  {client.physicalAddress && <small className="block text-gray-600">{client.physicalAddress}</small>}
                </div>
                <div>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2" onClick={() => onSelectClient(client)}>Select</button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => onDeleteClient(client.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ClientList;
