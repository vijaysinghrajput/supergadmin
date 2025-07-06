export const reducer = (state, action) => {
  // Use immutable updates for better performance and predictability
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.cartId === action.payload.cartId
      );
      
      if (existingItemIndex === -1) {
        // Add new item
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
          totalAmmuont: state.totalAmmuont + Number(action.payload.price),
          totalItems: state.totalItems + 1,
        };
      } else {
        // Update existing item
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          itemQuant: Number(action.payload.itemQuant)
        };
        
        return {
          ...state,
          cartItems: updatedCartItems,
          totalAmmuont: state.totalAmmuont + Number(action.payload.price),
        };
      }
    }

    case "CART_DETAILS":
      return {
        ...state,
        cartDetails: { ...state.cartDetails, ...action.payload },
      };

    case "ADD_DATA": {
      const currentArray = state[action.data.type] || [];
      return {
        ...state,
        [action.data.type]: [...currentArray, action.data.payload],
      };
    }

    case "UPDATE_DATA": {
      const currentArray = state[action.data.type] || [];
      const objIndex = currentArray.findIndex(
        (obj) => obj[action.where.key] === action.where.value
      );
      
      if (objIndex === -1) return state;
      
      const updatedArray = [...currentArray];
      updatedArray[objIndex] = action.data.payload;
      
      return {
        ...state,
        [action.data.type]: updatedArray,
      };
    }

    case "FETCH_ALL_DATA":
      return {
        ...state,
        ...action.payload,
      };

    case "LOADING":
      return {
        ...state,
        isLoading: action.data,
      };

    case "REMOVE_DATA": {
      const currentArray = state[action.data.type] || [];
      const filteredArray = currentArray.filter(
        (item) => item[action.data.where] !== action.data.payload
      );
      
      return {
        ...state,
        [action.data.type]: filteredArray,
        testingDElete: action,
      };
    }

    case "USER_LOGIN":
      return {
        ...state,
        user: action.credentials || state.user,
        auth: {
          ...state.auth,
          isUserLogin: true,
        },
      };

    case "LOGOUT":
      return {
        ...state,
        user: {},
        auth: {
          ...state.auth,
          isUserLogin: false,
        },
      };
    case "REMOVE_FROM_CART": {
      const itemToRemove = state.cartItems.find(item => item.id === action.payload);
      if (!itemToRemove) return state;
      
      const updatedCartItems = state.cartItems.filter(item => item.id !== action.payload);
      
      return {
        ...state,
        cartItems: updatedCartItems,
        totalAmmuont: state.totalAmmuont - Number(itemToRemove.totalPrice || 0),
        totalItems: state.totalItems - Number(itemToRemove.itemQuant || 0),
      };
    }
    
    case "CLEAR_CART":
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalAmmuont");
      
      return {
        ...state,
        cartItems: [],
        totalAmmuont: 0,
        totalItems: 0,
      };

    case "UPDATE_CART": {
      const objIndex = state.cartItems.findIndex(
        (obj) => obj.cartId === action.payload.oldCartProductId
      );
      
      if (objIndex === -1) return state;
      
      const oldItem = state.cartItems[objIndex];
      const updatedCartItems = [...state.cartItems];
      updatedCartItems[objIndex] = action.payload;
      
      return {
        ...state,
        cartItems: updatedCartItems,
        totalAmmuont: state.totalAmmuont - Number(oldItem.totalPrice || 0) + Number(action.payload.totalPrice || 0),
        totalItems: state.totalItems - Number(oldItem.itemQuant || 0) + Number(action.payload.itemQuant || 0),
      };
    }

    default:
      return state;
  }
};
