import React from 'react';

const DateFilter = ({ setDateRange }) => {
  return (
    <div className="date-filter">
      <label>
        From: <input type="date" onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))} />
      </label>
      <label>
        To: <input type="date" onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))} />
      </label>
    </div>
  );
};

export default DateFilter;
