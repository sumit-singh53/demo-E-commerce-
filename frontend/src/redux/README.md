# Traditional Redux Implementation

This directory contains a complete traditional Redux setup for product management.

## File Structure

```
redux/
├── actions/
│   └── productActions.js       # Async thunk actions with axios
├── reducers/
│   ├── index.js               # Root reducer combining all reducers
│   └── productReducers.js     # Product list reducer
├── constants/
│   └── productConstants.js    # Action type constants
├── __tests__/
│   ├── productActions.test.js # Action tests
│   └── productReducers.test.js # Reducer tests
└── store.js                   # Store configuration
```

## Implementation Details

### Actions (`productActions.js`)
- Uses `axios` for HTTP requests to `/api/products`
- Implements proper error handling for network and server errors
- Follows Redux thunk pattern with async/await

### Reducers (`productReducers.js`)
- Traditional switch-case reducer pattern
- Handles loading, success, and error states
- Maintains immutable state updates

### Store (`store.js`)
- Uses Redux Toolkit's `configureStore` for modern setup
- Includes redux-thunk middleware automatically
- Combines reducers using `combineReducers`

## Usage in Components

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../redux/actions/productActions';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.productList);

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  // Component rendering logic...
};
```

## State Shape

```javascript
{
  productList: {
    products: [],      // Array of product objects
    loading: false,    // Boolean loading state
    error: null        // Error message string or null
  }
}
```

## Testing

Run tests with:
```bash
npm test -- --testPathPattern=redux
```

Tests cover:
- Action creators and async thunks
- Reducer state transitions
- Error handling scenarios
- Loading states