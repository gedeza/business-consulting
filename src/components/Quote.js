
import React, { useState, useEffect } from 'react';

const Quote = ({ quote, setQuote, polishingPercentage, vatEnabled }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (quote) {
      setTasks(quote.tasks);
    }
  }, [quote]);

  if (!quote) return null;

  const handleHoursChange = (index, newHours) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].hours = newHours;
    setTasks(updatedTasks);
  };

  const recalculateQuote = () => {
    let totalHours = 0;
    tasks.forEach(task => {
      let taskHours = parseFloat(task.hours) || 0;
      if (quote.partialGroundwork && task.completed) {
        taskHours *= (polishingPercentage / 100);
      }
      if (task.perDocument) {
        taskHours *= quote.numDocuments;
      }
      totalHours += taskHours;
    });

    const finalHours = totalHours * (parseFloat(quote.complexity) || 0);
    let finalCost = finalHours * (parseFloat(quote.hourlyRate) || 0);
    let vatAmount = 0;

    if (quote.vatEnabled) {
      vatAmount = finalCost * 0.15; // 15% VAT
      finalCost += vatAmount;
    }

    setQuote({
      ...quote,
      tasks: tasks,
      finalHours,
      finalCost
    });
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6" id="quote-output">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Project Quotation</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-700">From:</h4>
          <p className="font-bold text-gray-800">{quote.businessName}</p>
          <p className="text-gray-600">{quote.consultantProfile.name}<br />{quote.consultantProfile.title}<br />{quote.consultantProfile.email}</p>
        </div>
        <div className="md:text-right">
          <h4 className="text-lg font-semibold text-gray-700">To:</h4>
          <p className="font-bold text-gray-800">{quote.clientName}</p>
          <h4 className="text-lg font-semibold text-gray-700 mt-4">Project:</h4>
          <p className="font-bold text-gray-800">{quote.projectName}</p>
        </div>
      </div>

      <h5 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Service: {quote.service}</h5>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">Task</th>
              <th className="py-2 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="py-2 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">Hours</th>
              <th className="py-2 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.name} className={task.completed ? 'bg-gray-50' : ''}>
                <td className="py-2 px-4 border-b text-gray-700">{task.name}</td>
                <td className="py-2 px-4 border-b text-gray-700">{task.description}</td>
                <td className="py-2 px-4 border-b text-gray-700">
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={task.hours}
                    onChange={(e) => handleHoursChange(index, e.target.value)}
                    disabled={task.completed}
                  />
                </td>
                <td className="py-2 px-4 border-b text-gray-700">{task.completed ? 'Completed' : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-6">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={recalculateQuote}>Recalculate Quote</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <p className="text-gray-700"><strong>Hourly Rate:</strong> {quote.hourlyRate.toLocaleString()} {quote.currency}</p>
          <p className="text-gray-700"><strong>Complexity Multiplier:</strong> {quote.complexity}x</p>
          {quote.numDocuments && <p className="text-gray-700"><strong>Number of Documents:</strong> {quote.numDocuments}</p>}
          {quote.vatEnabled && (
            <p className="text-gray-700"><strong>VAT (15%):</strong> {quote.vatAmount.toLocaleString(undefined, { style: 'currency', currency: quote.currency })}</p>
          )}
        </div>
        <div className="md:text-right">
          <h4 className="text-xl font-semibold text-gray-800">Total Estimated Hours: {quote.finalHours.toFixed(2)}</h4>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">Total Estimated Cost: {quote.finalCost.toLocaleString(undefined, { style: 'currency', currency: quote.currency })}</h3>
        </div>
      </div>
    </div>
  );
};

export default Quote;
