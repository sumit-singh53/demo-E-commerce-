import { productListReducer } from '../reducers/productReducers';
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
} from '../constants/productConstants';

describe('Product List Reducer', () => {
  const initialState = { products: [] };

  it('should return the initial state', () => {
    expect(productListReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle PRODUCT_LIST_REQUEST', () => {
    const action = { type: PRODUCT_LIST_REQUEST };
    const expectedState = { loading: true, products: [] };

    expect(productListReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle PRODUCT_LIST_SUCCESS', () => {
    const mockProducts = [
      { id: 1, title: 'Test Product', price: 29.99 },
      { id: 2, title: 'Another Product', price: 39.99 },
    ];

    const action = {
      type: PRODUCT_LIST_SUCCESS,
      payload: mockProducts,
    };

    const expectedState = {
      loading: false,
      products: mockProducts,
    };

    expect(productListReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle PRODUCT_LIST_FAIL', () => {
    const errorMessage = 'Failed to fetch products';
    const action = {
      type: PRODUCT_LIST_FAIL,
      payload: errorMessage,
    };

    const expectedState = {
      loading: false,
      error: errorMessage,
    };

    expect(productListReducer(initialState, action)).toEqual(expectedState);
  });

  it('should preserve existing state for unknown actions', () => {
    const existingState = {
      products: [{ id: 1, title: 'Existing Product' }],
      loading: false,
    };

    const unknownAction = { type: 'UNKNOWN_ACTION' };

    expect(productListReducer(existingState, unknownAction)).toEqual(existingState);
  });

  it('should handle state transitions correctly', () => {
    let state = initialState;

    // Start loading
    state = productListReducer(state, { type: PRODUCT_LIST_REQUEST });
    expect(state.loading).toBe(true);
    expect(state.products).toEqual([]);

    // Success with products
    const products = [{ id: 1, title: 'Product' }];
    state = productListReducer(state, {
      type: PRODUCT_LIST_SUCCESS,
      payload: products,
    });
    expect(state.loading).toBe(false);
    expect(state.products).toEqual(products);
    expect(state.error).toBeUndefined();

    // Error state
    state = productListReducer(state, {
      type: PRODUCT_LIST_FAIL,
      payload: 'Error occurred',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error occurred');
  });
});