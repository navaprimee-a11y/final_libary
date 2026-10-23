import React from 'react';

const SearchBar = ({ searchInputRef, searchKeyword, setSearchKeyword }) => {
  const handleChange = (event) => {
    // Keep user-controlled query text bounded and strip non-printing controls.
    const safeValue = event.target.value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').slice(0, 120);
    setSearchKeyword(safeValue);
  };

  return (
    <div className="search-bar" role="search" aria-label="Search the library catalogue">
      <label className="sr-only" htmlFor="book-search">Search books by title or author</label>
      <input
        id="book-search"
        ref={searchInputRef}
        type="search"
        placeholder="Search books by title or author..."
        value={searchKeyword}
        onChange={handleChange}
        className="search-input"
        maxLength={120}
        autoComplete="off"
        spellCheck="false"
        aria-describedby="book-search-help"
      />
      <span className="sr-only" id="book-search-help">Search updates the catalogue results as you type. Maximum 120 characters.</span>
    </div>
  );
};

export default SearchBar;
