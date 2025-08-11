import React from "react";


function SearchBar({ setSearchQuery }) {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search by category or type..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;

