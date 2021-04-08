// export const persistMiddlware = (store) => { // object similare to the store
//     return (next) => { // function that will take us to the next middlware
//         return (action) => {} // action we care of
//     }
// }

import { Dispatch } from "redux";
import { saveCells } from "../action-creators";
import ActionType from "../action-types";
import { Action } from "../actions";
import { RootState } from "../reducers";

export const persistMiddlware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  let timer: any;

  return (next: (action: Action) => void) => {
    return (action: Action) => {
      next(action); // forward on every single action

      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          saveCells()(dispatch, getState);
        }, 250);
      }
    };
  };
};
