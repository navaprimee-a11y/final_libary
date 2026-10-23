import { configureStore } from '@reduxjs/toolkit';
import libraryReducer, { recordUserActivity, setSelectedCategory } from '../../src/store/librarySlice';
import libraryMiddleware from '../../src/store/libraryMiddleware';

const createLibraryStore = () => configureStore({
  reducer: { library: libraryReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(libraryMiddleware),
});

describe('library activity middleware', () => {
  test('writes explicitly recorded user activity to the console', () => {
    const log = jest.spyOn(console, 'info').mockImplementation(() => {});
    const store = createLibraryStore();

    store.dispatch(recordUserActivity({ message: 'Member signed in.' }));

    expect(log).toHaveBeenCalledWith('[Library] Member signed in.');
  });

  test('describes library actions without dumping their payloads', () => {
    const log = jest.spyOn(console, 'info').mockImplementation(() => {});
    const store = createLibraryStore();

    store.dispatch(setSelectedCategory('Fiction'));

    expect(log).toHaveBeenCalledWith('[Library] Category filter set to "Fiction".');
  });
});
