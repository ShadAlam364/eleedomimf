import { createContext, useReducer, useContext } from "react";

// Initial state
const initialState = {
  tata: {
    tokens: {
      authTokens: {},
      uatTokens: {},
    },
    privateCar: {
      quotes: {},
      proposer: {},
      vInsStatus:{},
      ckyc: {},
      form60: {},
      otherKyc:{},
      aadhaarOtp: {},
      payment: {},
      controller: {},
    },
    twWheeler:{
      quotes: {},
      proposer: {},
      vInsStatus:{},
      ckyc: {},
      form60: {},
      otherKyc:{},
      aadhaarOtp: {},
      payment: {},
      controller: {},
    }
  },
  // magmaHDI: {
  //   tokens: {
  //     authTokens: {},
  //     uatTokens: {},
  //   },
  // },
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_TATA_TOKEN1":
      return {
        ...state,
        tata: {
          ...state.tata,
          tokens: { ...state.tata.tokens, authTokens: action.payload },
        },
      }; 
      case "SET_TATA_TOKEN2":
        return {
          ...state,
          tata: {
            ...state.tata,
            tokens: { ...state.tata.tokens, uatTokens: action.payload },
          },
        }; 
    case "SET_TATA_PRIVATE_CAR_QUOTES":
      return {
        ...state,
        tata: {
          ...state.tata,
          privateCar: { ...state.tata.privateCar, quotes: action.payload },
        },
      };
    case "SET_TATA_PRIVATE_CAR_PROPOSER":
      return {
        ...state,
        tata: {
          ...state.tata,
          privateCar: { ...state.tata.privateCar, proposer: action.payload },
        },
      };

    case "SET_TATA_PRIVATE_CAR_CKYC":
      return {
        ...state,
        tata: {
          ...state.tata,
          privateCar: { ...state.tata.privateCar, ckyc: action.payload },
        },
      };

    case "SET_TATA_PRIVATE_CAR_PAYMENT":
      return {
        ...state,
        tata: {
          ...state.tata,
          privateCar: { ...state.tata.privateCar, payment: action.payload },
        },
      };
      case "SET_TATA_PRIVATE_CAR_FORM60":
        return {
          ...state,
          tata: {
            ...state.tata,
            privateCar: { ...state.tata.privateCar, form60: action.payload },
          },
        };
        case "SET_TATA_PRIVATE_CAR_OTHERKYC":
        return {
          ...state,
          tata: {
            ...state.tata,
            privateCar: { ...state.tata.privateCar, otherKyc: action.payload },
          },
        };
        case "SET_TATA_PRIVATE_CAR_INSPECTION_STATUS":
          return {
            ...state,
            tata: {
              ...state.tata,
              privateCar: { ...state.tata.privateCar, vInsStatus: action.payload },
            },
          };
        case "SET_TATA_PRIVATE_CAR_AADHAAR_OTP":
          return {
            ...state,
            tata: {
              ...state.tata,
              privateCar: { ...state.tata.privateCar, aadhaarOtp: action.payload },
            },
          };
          case "SET_TATA_PRIVATE_CAR_CONTROLLER":
            return {
              ...state,
              tata: {
                ...state.tata,
                privateCar: { ...state.tata.privateCar, controller: action.payload },
              },
            };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

// Create context
const AppContext = createContext();

// Context Provider component
// eslint-disable-next-line react/prop-types
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
