import produce from "immer";
import ActionType from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const cellReducer = produce(
  (state: CellsState = initialState, action: Action) => {
    switch (action.type) {
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        state.data[id].content = content;
        return state;
      // return {
      //   ...state,
      //   data: {
      //     ...state.data,
      //     [action.payload.id]: { // way to create object key
      //       ...state.data[action.payload.id],
      //       content: action.payload.content,
      //     },
      //   },
      // };
      case ActionType.DELETE_CELL:
        delete state.data[action.payload];
        // const index = state.order.findIndex((id) => id === action.payload);
        // if (index !== -1) state.order.splice(index, 1);
        // return;
        // or
        state.order = state.order.filter((id) => id !== action.payload);
        return state;

      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex > state.order.length - 1)
          return state;
        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;
        return state;

      case ActionType.INSERT_CELL_AFTER:
        const cell: Cell = {
          id: randomId(),
          type: action.payload.type,
          content: "",
        };
        state.data[cell.id] = cell;

        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );

        if (foundIndex < 0) {
          state.order.unshift(cell.id);
          return state;
        }

        state.order.splice(foundIndex + 1, 0, cell.id);
        return state;
      default:
        return state;
    }
  }
);
const randomId = () => {
  return Math.random().toString(36).substr(2, 8);
};
export default cellReducer;
