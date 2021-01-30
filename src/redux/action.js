import {SELECT_ROWS , UNSELECT_ROWS} from './types'

export function setAllselectedRows(row){
    return {
        type: SELECT_ROWS,
        payload: row
    }
}

export function unselectedRows(idx){
    return {
        type: UNSELECT_ROWS,
        payload: idx
    }
}

