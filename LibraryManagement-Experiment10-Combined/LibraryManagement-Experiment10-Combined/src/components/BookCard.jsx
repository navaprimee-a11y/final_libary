import React from 'react';
import { Link } from 'react-router-dom';
import BookStatus from './common/BookStatus';
import BorrowButton from './common/BorrowButton';
import { getSizedCoverUrl } from '../utils/imageUrls';

const BookCard = ({ book, borrowed = false, held = false }) => {
  return (
    <article className="book-card">
      {book.coverUrl && <Link to={`/book/${book.id}`} className="book-card-cover-link" aria-label={`View ${book.title} details`}><img className="book-card-cover" src={getSizedCoverUrl(book.coverUrl, 'M')} alt={`Cover of ${book.title}`} loading="lazy" decoding="async" fetchpriority="low" width="110" height="165" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.style.display = 'none'; }} /></Link>}
      <p className="eyebrow">{book.category} · {book.publishedYear}</p>
      <h3><Link to={`/book/${book.id}`}>{book.title}</Link></h3>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Rating:</strong> <span aria-label={`Rating: ${book.rating || 0} out of 5 stars`}>{'⭐'.repeat(book.rating || 0) || 'Not rated'}</span></p>
      <p className="book-card-status"><strong>Status:</strong> <BookStatus available={book.available} borrowed={borrowed} held={held} /></p>
      <div className="book-card-actions">
        <Link className="button-link" to={`/book/${book.id}`}>View details →</Link>
        {!borrowed && <BorrowButton book={book} disabled={held} className="book-card-borrow" />}
      </div>
    </article>
  );
};

export default BookCard;
