import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import { listProducts } from '../actions/productActions';
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
} from '../constants/productConstants';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Product Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch PRODUCT_LIST_SUCCESS when fetching products succeeds', async () => {
    const mockProducts = [
      { id: 1, title: 'Test Product', price: 29.99 },
      { id: 2, title: 'Another Product', price: 39.99 },
    ];

    mockedAxios.get.mockResolvedValue({ data: mockProducts });

    const expectedActions = [
      { type: PRODUCT_LIST_REQUEST },
      { type: PRODUCT_LIST_SUCCESS, payload: mockProducts },
    ];

    const store = mockStore({ productList: { products: [] } });

    await store.dispatch(listProducts());

    expect(store.getActions()).toEqual(expectedActions);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/products');
  });

  it('should dispatch PRODUCT_LIST_FAIL when fetching products fails', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    const expectedActions = [
      { type: PRODUCT_LIST_REQUEST },
      { type: PRODUCT_LIST_FAIL, payload: errorMessage },
    ];

    const store = mockStore({ productList: { products: [] } });

    await store.dispatch(listProducts());

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should dispatch PRODUCT_LIST_FAIL with server error message', async () => {
    const serverError = {
      response: {
        data: {
          message: 'Server Error: Products not found',
        },
      },
    };

    mockedAxios.get.mockRejectedValue(serverError);

    const expectedActions = [
      { type: PRODUCT_LIST_REQUEST },
      { type: PRODUCT_LIST_FAIL, payload: 'Server Error: Products not found' },
    ];

    const store = mockStore({ productList: { products: [] } });

    await store.dispatch(listProducts());

    expect(store.getActions()).toEqual(expectedActions);
  });
});