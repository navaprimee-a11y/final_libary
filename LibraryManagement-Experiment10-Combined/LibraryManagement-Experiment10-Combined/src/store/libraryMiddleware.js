import { BOOKS_STORAGE_KEY, BORROWING_STORAGE_KEY, recordUserActivity } from './librarySlice';

const actionsThatPersist = new Set([
  'library/addBooksToCatalogue',
  'library/removeBookFromCatalogue',
  'library/replaceBooks',
  'library/borrowBook',
  'library/placeBookHold',
  'library/returnBorrowedBook',
  'library/renewBorrowedBook',
  'library/syncMemberBorrowingData',
  'library/fetchBookSearch/fulfilled',
]);

const getTitle = (action) => action.payload?.record?.title
  || action.payload?.request?.title
  || action.payload?.book?.title
  || action.payload?.title
  || '';

const writeActivity = (message, level = 'info') => {
  if (typeof console === 'undefined') return;
  const method = level === 'warn' ? console.warn : level === 'error' ? console.error : console.info;
  method.call(console, `[Library] ${message}`);
};

const describeAction = (type, action, title) => {
  if (type === 'library/fetchBookSearch/fulfilled') {
    const query = action.meta?.arg?.query?.trim();
    return { message: `Open Library search loaded ${action.payload?.books?.length || 0} result(s)${query ? ` for "${query}"` : ''}.` };
  }
  if (type === 'library/fetchBookSearch/rejected' && !action.meta?.aborted) {
    return { message: 'Open Library search failed; saved catalogue data remains available.', level: 'warn' };
  }
  if (type === 'library/fetchApiRecommendations/fulfilled') {
    return { message: `API recommendations loaded (${action.payload?.length || 0} result(s)).` };
  }
  if (type === 'library/fetchApiRecommendations/rejected' && !action.meta?.aborted) {
    return { message: 'API recommendations failed; local recommendations will be shown.', level: 'warn' };
  }
  if (type === 'library/fetchSampleMember/fulfilled') {
    return { message: 'Sample member data loaded from the member REST API.' };
  }
  if (type === 'library/fetchSampleMember/rejected' && !action.meta?.aborted) {
    return { message: 'Sample member API request failed.', level: 'warn' };
  }
  if (type === 'library/setCurrentMember') {
    return { message: action.payload ? 'Member signed in.' : 'Member signed out.' };
  }
  if (type === 'library/setSearchKeyword') return { message: 'Catalogue search updated.' };
  if (type === 'library/setSelectedCategory') {
    return { message: `Category filter set to "${action.payload || 'All'}".` };
  }
  if (type === 'library/setSelectedAuthor') {
    return { message: `Author filter set to "${action.payload || 'All'}".` };
  }
  if (type === 'library/addBooksToCatalogue' || type === 'library/replaceBooks') {
    return { message: `Catalogue updated${title ? `: "${title}"` : ''}.` };
  }
  if (type === 'library/removeBookFromCatalogue') return { message: 'Book removed from the catalogue.' };
  if (type === 'library/borrowBook') {
    return { message: `Book checked out${title ? `: "${title}"` : ''}.` };
  }
  if (type === 'library/placeBookHold') {
    return { message: `Hold placed${title ? `: "${title}"` : ''}.` };
  }
  if (type === 'library/returnBorrowedBook') {
    return { message: `Book returned${title ? `: "${title}"` : ''}.` };
  }
  if (type === 'library/renewBorrowedBook') {
    return { message: `Book renewed${title ? `: "${title}"` : ''}.` };
  }
  return null;
};

const libraryMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  const type = action?.type;
  const title = getTitle(action);

  if (type === recordUserActivity.type) {
    const { message, level } = action.payload || {};
    if (message) writeActivity(message, level);
  } else if (typeof type === 'string') {
    const activity = describeAction(type, action, title);
    if (activity) writeActivity(activity.message, activity.level);
  }

  if (actionsThatPersist.has(type)) {
    try {
      const { books, accountRecords } = storeApi.getState().library;
      localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
      localStorage.setItem(BORROWING_STORAGE_KEY, JSON.stringify(accountRecords));
    } catch (error) {
      writeActivity(`Browser state could not be saved: ${error?.message || 'storage unavailable'}.`, 'warn');
    }
  }

  if (type === 'library/setCurrentMember') {
    try {
      const currentMember = storeApi.getState().library.currentMember;
      if (currentMember) localStorage.setItem('libraryReduxCurrentMember', JSON.stringify(currentMember));
      else localStorage.removeItem('libraryReduxCurrentMember');
    } catch (error) {
      writeActivity(`Current member state could not be saved: ${error?.message || 'storage unavailable'}.`, 'warn');
    }
  }

  return result;
};

export default libraryMiddleware;
