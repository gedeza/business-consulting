
import React from 'react';
import { services } from '../servicesData';

const ServiceEstimator = ({
  selectedService,
  setSelectedService,
  hourlyRate,
  setHourlyRate,
  currency,
  setCurrency,
  complexity,
  setComplexity,
  numDocuments,
  setNumDocuments,
  partialGroundwork,
  setPartialGroundwork,
  completedTasks,
  handleTaskToggle,
  exchangeRates,
  polishingPercentage,
  setPolishingPercentage,
  vatEnabled,
  setVatEnabled
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h4 className="text-xl font-semibold text-gray-800 mb-4">C. Service Estimator</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Service</label>
          <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={selectedService} onChange={e => { setSelectedService(e.target.value); }}>
            <option value="">-- Select a Service --</option>
            {Object.keys(services).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {selectedService && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Hourly Rate</label>
                <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={hourlyRate} onChange={e => setHourlyRate(parseFloat(e.target.value))} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Currency</label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={currency} onChange={e => setCurrency(e.target.value)}>
                  {Object.keys(exchangeRates).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4 mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Project Complexity</label>
              <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={complexity} onChange={e => setComplexity(parseFloat(e.target.value))}>
                <option value="1">Standard</option>
                <option value="1.5">Complex</option>
                <option value="2">Very Complex</option>
              </select>
            </div>

            {services[selectedService].requiresDocCount && (
              <div className="mb-4 mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Number of Documents</label>
                <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={numDocuments} min="1" onChange={e => setNumDocuments(parseInt(e.target.value, 10))} />
              </div>
            )}

            <div className="flex items-center mb-4 mt-4">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" id="groundwork" checked={partialGroundwork} onChange={e => setPartialGroundwork(e.target.checked)} />
              <label className="ml-2 text-gray-700" htmlFor="groundwork">Client has partial groundwork</label>
            </div>

            {partialGroundwork && (
              <div className="mb-4 mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Polishing Percentage (%)</label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={polishingPercentage}
                  onChange={e => setPolishingPercentage(parseFloat(e.target.value))}
                  min="0"
                  max="100"
                />
              </div>
            )}

            <div className="flex items-center mb-4 mt-4">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" id="vatEnabled" checked={vatEnabled} onChange={e => setVatEnabled(e.target.checked)} />
              <label className="ml-2 text-gray-700" htmlFor="vatEnabled">Apply 15% VAT</label>
            </div>

            {partialGroundwork && (
              <div className="mt-4">
                <h6 className="text-lg font-semibold text-gray-800 mb-2">Select Completed Tasks:</h6>
                {services[selectedService].tasks.map(task => (
                  <div className="flex items-center mb-2" key={task.name}>
                    <input
                      className="form-checkbox h-5 w-5 text-blue-600"
                      type="checkbox"
                      id={task.name}
                      checked={completedTasks.includes(task.name)}
                      onChange={() => handleTaskToggle(task.name)}
                    />
                    <label className="ml-2 text-gray-700" htmlFor={task.name}>
                      {task.name} ({task.hours} hrs{task.perDocument ? ' per doc' : ''})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceEstimator;
