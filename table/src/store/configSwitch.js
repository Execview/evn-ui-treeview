import * as config from './configs';

// Change this number to change displayed data!
const configNumber = 2;

export const columnsInfo = config['columnsInfo' + configNumber];
export const editableCells = config['editableCells' + configNumber];
export const data = config['newData' + configNumber];

export const cellTypes = config.cellTypes;
export const dataSort = config.dataSort;
export const rules = config.rules;
