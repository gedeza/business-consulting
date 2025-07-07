import React from 'react';

const ProjectDetails = ({ clientName, setClientName, projectName, setProjectName, clients, onSelectExistingClient }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">B. Project & Client Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Client's Name</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={clientName} onChange={e => setClientName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Project Title</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={projectName} onChange={e => setProjectName(e.target.value)} />
        </div>
      </div>
      <div className="mb-4 mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Existing Client</label>
        <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={e => onSelectExistingClient(e.target.value)}>
          <option value="">-- Select a Client --</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name} ({client.company})</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProjectDetails;