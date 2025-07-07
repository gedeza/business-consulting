
import React from 'react';

const UserDetails = ({ consultantProfile, setConsultantProfile, businessName, setBusinessName, handleSaveDetails }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">A. Your Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Business Name</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={businessName} onChange={e => setBusinessName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Consultant Name</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={consultantProfile.name} onChange={e => setConsultantProfile({ ...consultantProfile, name: e.target.value })} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={consultantProfile.title} onChange={e => setConsultantProfile({ ...consultantProfile, title: e.target.value })} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={consultantProfile.email} onChange={e => setConsultantProfile({ ...consultantProfile, email: e.target.value })} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={consultantProfile.phone || ''} onChange={e => setConsultantProfile({ ...consultantProfile, phone: e.target.value })} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Logo URL</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={consultantProfile.logo || ''} onChange={e => setConsultantProfile({ ...consultantProfile, logo: e.target.value })} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">VAT Number</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={consultantProfile.vatNumber || ''} onChange={e => setConsultantProfile({ ...consultantProfile, vatNumber: e.target.value })} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">B-BBEE Status</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={consultantProfile.bbbeeStatus || ''} onChange={e => setConsultantProfile({ ...consultantProfile, bbbeeStatus: e.target.value })} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">CIPC Registration Number</label>
          <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={consultantProfile.cipcNumber || ''} onChange={e => setConsultantProfile({ ...consultantProfile, cipcNumber: e.target.value })} />
        </div>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4" onClick={handleSaveDetails}>Save My Details</button>
    </div>
  );
};

export default UserDetails;
