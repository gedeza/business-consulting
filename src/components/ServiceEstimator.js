
import React, { useState } from 'react';
import { services } from '../servicesData';
import { getTemplatesByService } from '../templatesData';
import { validateFundingValue, validateHourlyRate, formatCurrency } from '../utils/validation';

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
  setVatEnabled,
  pricingModel,
  setPricingModel,
  fundingValue,
  setFundingValue,
  supportType,
  setSupportType
}) => {
  const [errors, setErrors] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showCustomService, setShowCustomService] = useState(false);
  const [customServices, setCustomServices] = useState(() => {
    try {
      const saved = localStorage.getItem('customServices');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    tasks: [{ name: '', hours: 1, description: '' }]
  });
  // const [isCalculating, setIsCalculating] = useState(false);
  
  const isPercentageEligible = selectedService === "Business Proposal Writing" || 
                                selectedService === "Business Plan Development" || 
                                selectedService === "Administrative Workflow Development";
  
  const clearError = (field) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };
  
  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'hourlyRate':
        if (!validateHourlyRate(value)) {
          error = 'Hourly rate must be between R100 and R10,000';
        }
        break;
      case 'fundingValue':
        if (!validateFundingValue(value)) {
          error = 'Funding value must be between R10,000 and R10,000,000,000';
        }
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };
  
  const handleHourlyRateChange = (value) => {
    clearError('hourlyRate');
    setHourlyRate(value);
    validateField('hourlyRate', value);
  };
  
  const handleFundingValueChange = (value) => {
    clearError('fundingValue');
    setFundingValue(value);
    validateField('fundingValue', value);
  };
  
  const calculatePreview = () => {
    if (pricingModel === 'percentage' && fundingValue > 0) {
      const percentageRate = supportType === 'full' ? 0.03 : 0.015;
      const supportFee = fundingValue * percentageRate;
      const securityFee = 25000 * 1.15;
      return supportFee + securityFee;
    }
    return 0;
  };
  
  const previewCost = calculatePreview();

  const addCustomTask = () => {
    setNewService(prev => ({
      ...prev,
      tasks: [...prev.tasks, { name: '', hours: 1, description: '' }]
    }));
  };

  const removeCustomTask = (index) => {
    setNewService(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const updateCustomTask = (index, field, value) => {
    setNewService(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }));
  };

  const saveCustomService = () => {
    if (!newService.name.trim() || !newService.description.trim()) {
      alert('Please enter a service name and description.');
      return;
    }

    const validTasks = newService.tasks.filter(task => 
      task.name.trim() && task.hours > 0
    );

    if (validTasks.length === 0) {
      alert('Please add at least one valid task.');
      return;
    }

    const serviceToSave = {
      ...newService,
      tasks: validTasks,
      groundworkReduction: true,
      customService: true
    };

    const updatedCustomServices = {
      ...customServices,
      [newService.name]: serviceToSave
    };

    setCustomServices(updatedCustomServices);
    localStorage.setItem('customServices', JSON.stringify(updatedCustomServices));
    
    // Reset form
    setNewService({
      name: '',
      description: '',
      tasks: [{ name: '', hours: 1, description: '' }]
    });
    setShowCustomService(false);
    
    alert('Custom service created successfully!');
  };

  const deleteCustomService = (serviceName) => {
    if (window.confirm(`Are you sure you want to delete "${serviceName}"?`)) {
      const updatedCustomServices = { ...customServices };
      delete updatedCustomServices[serviceName];
      setCustomServices(updatedCustomServices);
      localStorage.setItem('customServices', JSON.stringify(updatedCustomServices));
      
      if (selectedService === serviceName) {
        setSelectedService('');
      }
    }
  };

  // Combine built-in and custom services
  const allServices = { ...services, ...customServices };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 className="text-2xl font-bold text-gray-800">Service Estimator</h4>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-gray-700 text-sm font-bold">Select Service</label>
          <button
            onClick={() => setShowCustomService(!showCustomService)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Custom
          </button>
        </div>
        <div className="relative">
          <select 
            className="w-full p-4 pr-12 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200 hover:bg-gray-100" 
            value={selectedService} 
            onChange={e => { setSelectedService(e.target.value); }}
          >
            <option value="">-- Select a Service --</option>
            <optgroup label="Built-in Services">
              {Object.keys(services).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </optgroup>
            {Object.keys(customServices).length > 0 && (
              <optgroup label="Custom Services">
                {Object.keys(customServices).map(s => (
                  <option key={s} value={s}>{s} (Custom)</option>
                ))}
              </optgroup>
            )}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {selectedService && (
          <>
            <div className="mt-3 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-blue-800">
                    <strong>Service Description:</strong> {allServices[selectedService].description}
                  </p>
                  {allServices[selectedService].estimatedHours && (
                    <p className="text-sm text-blue-700 mt-2">
                      <strong>Estimated Hours:</strong> {allServices[selectedService].estimatedHours.min}-{allServices[selectedService].estimatedHours.max} hours
                    </p>
                  )}
                </div>
                {allServices[selectedService].customService && (
                  <button
                    onClick={() => deleteCustomService(selectedService)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete custom service"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Template Selection */}
            {getTemplatesByService(selectedService).length > 0 && (
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-3">Available Templates (Optional)</label>
                <div className="relative">
                  <select
                    className="w-full p-4 pr-12 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200 hover:bg-gray-100"
                    value={selectedTemplate}
                    onChange={e => setSelectedTemplate(e.target.value)}
                  >
                    <option value="">-- Select a Template (Optional) --</option>
                    {getTemplatesByService(selectedService).map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {selectedTemplate && (
                  <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    {(() => {
                      const template = getTemplatesByService(selectedService).find(t => t.id === selectedTemplate);
                      return template ? (
                        <>
                          <p className="text-sm text-green-800 mb-2">
                            <strong>{template.name}:</strong> {template.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <strong className="text-green-700">Sections Included:</strong>
                              <ul className="list-disc list-inside text-green-600 mt-1">
                                {template.sections.slice(0, 4).map((section, index) => (
                                  <li key={index}>{section}</li>
                                ))}
                                {template.sections.length > 4 && <li>+ {template.sections.length - 4} more...</li>}
                              </ul>
                            </div>
                            <div>
                              <strong className="text-green-700">Compliance Areas:</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {template.compliance.map((comp, index) => (
                                  <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                    {comp}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Custom Service Creation Form */}
        {showCustomService && (
          <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold text-gray-800">Create Custom Service</h5>
              <button
                onClick={() => setShowCustomService(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Service Name</label>
                <input
                  type="text"
                  className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newService.name}
                  onChange={e => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Market Research & Analysis"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Service Description</label>
                <textarea
                  className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                  value={newService.description}
                  onChange={e => setNewService(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this service includes and its benefits..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-gray-700 text-sm font-bold">Tasks</label>
                  <button
                    onClick={addCustomTask}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Task
                  </button>
                </div>

                <div className="space-y-3">
                  {newService.tasks.map((task, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="md:col-span-4">
                        <input
                          type="text"
                          className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={task.name}
                          onChange={e => updateCustomTask(index, 'name', e.target.value)}
                          placeholder="Task name"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="number"
                          className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={task.hours}
                          onChange={e => updateCustomTask(index, 'hours', parseFloat(e.target.value) || 1)}
                          placeholder="Hours"
                          min="0.5"
                          step="0.5"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={task.description}
                          onChange={e => updateCustomTask(index, 'description', e.target.value)}
                          placeholder="Task description (optional)"
                        />
                      </div>
                      <div className="md:col-span-1">
                        {newService.tasks.length > 1 && (
                          <button
                            onClick={() => removeCustomTask(index)}
                            className="w-full p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCustomService(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCustomService}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Service
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedService && (
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-3">Pricing Model</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="relative">
              <input
                type="radio"
                className="sr-only"
                name="pricingModel"
                value="hourly"
                checked={pricingModel === 'hourly'}
                onChange={() => setPricingModel('hourly')}
              />
              <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                pricingModel === 'hourly' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    pricingModel === 'hourly' ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {pricingModel === 'hourly' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Hourly Rate</div>
                    <div className="text-sm text-gray-600">Traditional time-based pricing</div>
                  </div>
                </div>
              </div>
            </label>
            
            <label className="relative">
              <input
                type="radio"
                className="sr-only"
                name="pricingModel"
                value="percentage"
                checked={pricingModel === 'percentage'}
                onChange={() => setPricingModel('percentage')}
                disabled={!isPercentageEligible}
              />
              <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                !isPercentageEligible ? 'opacity-50 cursor-not-allowed' :
                pricingModel === 'percentage' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    pricingModel === 'percentage' ? 'border-purple-500' : 'border-gray-300'
                  }`}>
                    {pricingModel === 'percentage' && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Percentage-Based</div>
                    <div className="text-sm text-gray-600">Funding-dependent pricing</div>
                  </div>
                </div>
              </div>
            </label>
          </div>
          {!isPercentageEligible && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Percentage-based pricing is only available for Business Proposal Writing and Business Plan Development.
              </p>
            </div>
          )}
        </div>
      )}

      {selectedService && pricingModel === 'hourly' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3">Hourly Rate</label>
              <div className="relative">
                <input 
                  type="number" 
                  className={`w-full p-4 pr-12 text-gray-700 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 ${
                    errors.hourlyRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={hourlyRate} 
                  onChange={e => handleHourlyRateChange(parseFloat(e.target.value))}
                  placeholder="1000"
                  min="100"
                  max="10000"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <span className="text-gray-400 text-sm">{currency}</span>
                </div>
              </div>
              {errors.hourlyRate && (
                <p className="mt-2 text-sm text-red-600">{errors.hourlyRate}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">Recommended: R900 - R1,800 per hour</p>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3">Currency</label>
              <div className="relative">
                <select 
                  className="w-full p-4 pr-12 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200 hover:bg-gray-100" 
                  value={currency} 
                  onChange={e => setCurrency(e.target.value)}
                >
                  {Object.keys(exchangeRates).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
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

          {allServices[selectedService].requiresDocCount && (
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
              {allServices[selectedService].tasks.map(task => (
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

      {selectedService && pricingModel === 'percentage' && (
        <>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-3">Funding Value (ZAR)</label>
            <div className="relative">
              <input
                type="number"
                className={`w-full p-4 pr-12 text-gray-700 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 ${
                  errors.fundingValue ? 'border-red-500' : 'border-gray-300'
                }`}
                value={fundingValue}
                onChange={e => handleFundingValueChange(parseFloat(e.target.value) || 0)}
                placeholder="50000000"
                min="10000"
                max="10000000000"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="text-gray-400 text-sm">ZAR</span>
              </div>
            </div>
            {errors.fundingValue && (
              <p className="mt-2 text-sm text-red-600">{errors.fundingValue}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">Enter the total funding amount you're applying for</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-3">Support Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="relative">
                <input
                  type="radio"
                  className="sr-only"
                  name="supportType"
                  value="full"
                  checked={supportType === 'full'}
                  onChange={() => setSupportType('full')}
                />
                <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  supportType === 'full' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      supportType === 'full' ? 'border-green-500' : 'border-gray-300'
                    }`}>
                      {supportType === 'full' && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Full Support</div>
                      <div className="text-sm text-gray-600">3% of funding value</div>
                      <div className="text-xs text-gray-500 mt-1">Complete project management & expert consultation</div>
                    </div>
                  </div>
                </div>
              </label>
              
              <label className="relative">
                <input
                  type="radio"
                  className="sr-only"
                  name="supportType"
                  value="admin"
                  checked={supportType === 'admin'}
                  onChange={() => setSupportType('admin')}
                />
                <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  supportType === 'admin' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      supportType === 'admin' ? 'border-orange-500' : 'border-gray-300'
                    }`}>
                      {supportType === 'admin' && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Administration-Only</div>
                      <div className="text-sm text-gray-600">1.5% of funding value</div>
                      <div className="text-xs text-gray-500 mt-1">Administrative support & documentation</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h4 className="font-semibold text-purple-800">Cost Breakdown</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700">Security Fee:</span>
                <span className="font-medium">ZAR 25,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">VAT (15%):</span>
                <span className="font-medium">ZAR 3,750</span>
              </div>
              <div className="flex justify-between border-t border-purple-200 pt-2">
                <span className="text-purple-700 font-semibold">Total Security Fee:</span>
                <span className="font-bold text-purple-800">ZAR 28,750</span>
              </div>
              {previewCost > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Support Fee:</span>
                    <span className="font-medium">{formatCurrency(previewCost - 28750, 'ZAR')}</span>
                  </div>
                  <div className="flex justify-between border-t border-purple-200 pt-2">
                    <span className="text-purple-700 font-semibold">Total Estimated Cost:</span>
                    <span className="font-bold text-purple-800 text-lg">{formatCurrency(previewCost, 'ZAR')}</span>
                  </div>
                </>
              )}
            </div>
            <div className="mt-3 p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> This includes 12 months of as-needed consulting support in your chosen industries.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceEstimator;
