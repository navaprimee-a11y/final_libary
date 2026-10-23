import React from 'react';

const FilterPanel = ({ filters }) => {
  const {
    selectedCategory, setSelectedCategory,
    selectedAuthor, setSelectedAuthor,
    categories, authors,
  } = filters;

  return (
    <div className="filter-panel" role="group" aria-label="Filter books">
      <div className="filter-field">
        <label htmlFor="book-category-filter">Category</label>
        <select id="book-category-filter" aria-label="Filter by category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div className="filter-field">
        <label htmlFor="book-author-filter">Author</label>
        <select id="book-author-filter" aria-label="Filter by author" value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)}>
          <option value="All">All Authors</option>
          {authors.map((author) => <option key={author} value={author}>{author}</option>)}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
