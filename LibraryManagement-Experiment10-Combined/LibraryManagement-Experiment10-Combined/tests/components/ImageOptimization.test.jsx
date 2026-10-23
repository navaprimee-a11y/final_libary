import { getSizedCoverUrl } from '../../src/utils/imageUrls';

describe('book cover image sizing', () => {
  test('uses a requested Open Library cover size', () => {
    expect(getSizedCoverUrl('https://covers.openlibrary.org/b/id/123-M.jpg', 'S'))
      .toBe('https://covers.openlibrary.org/b/id/123-S.jpg');
    expect(getSizedCoverUrl('https://covers.openlibrary.org/b/id/456-S.jpg', 'L'))
      .toBe('https://covers.openlibrary.org/b/id/456-L.jpg');
  });

  test('leaves unrelated URLs unchanged and handles missing URLs', () => {
    expect(getSizedCoverUrl('https://example.com/cover.jpg', 'L')).toBe('https://example.com/cover.jpg');
    expect(getSizedCoverUrl('', 'M')).toBe('');
    expect(getSizedCoverUrl(null, 'M')).toBe('');
  });
});
