
const initialState = {
    selected: [],
    hided: [],
  };
  
  
export const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "SELECT_ROWS":
        return { selected: [...state.selected, action.payload] };
      case "UNSELECT_ROWS":
        return {
          selected: [
            ...state.selected.slice(0, action.payload),
            ...state.selected.slice(action.payload + 1),
          ],
        }
        case "HIDE_COLS":
            console.log("CHECK")
            return { hided: [...state.hided, action.payload] };
      default:
        return state;
    }
  };