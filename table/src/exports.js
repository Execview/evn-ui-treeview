import Table from './table/OldTable';
import cats from './store/ElCatso';

import UserRoleDisplay from './UserRoleDisplay/UserRoleDisplay';
import UserHeaderDisplay from './headers/UserHeaderDisplay';
import Cell from './cells/Cell/Cell';
import ColorCell from './cells/colorCell/ColorCell';
import ColorFilter, {filter as ColorFilterFunction} from './cells/colorCell/ColorFilter';
import DateCell from './cells/dateCell/DateCell';
import DateFilter, {filter as DateFilterFunction}  from './cells/dateCell/DateFilter'
import DropdownCell from './cells/dropdownCell/DropdownCell';
import GenericAssignCell from './cells/genericAssignCell/GenericAssignCell';
import GenericAssign from './cells/genericAssignCell/GenericAssign';
import ImageDisplay from './cells/imageDisplay/ImageDisplay';
import InPlaceCell from './cells/InPlaceCell/InPlaceCell';
import TextCell from './cells/TextCell/TextCell';
import TextFilter, {filter as TextFilterFunction}  from './cells/TextCell/TextFilter';

module.exports = {
	Table,
	cats,
	UserRoleDisplay,
	UserHeaderDisplay,
	Cell,
	ColorCell,
	ColorFilter,
	ColorFilterFunction,
	DateCell,
	DateFilter,
	DateFilterFunction,
	DropdownCell,
	GenericAssignCell,
	GenericAssign,
	ImageDisplay,
	InPlaceCell,
	TextCell,
	TextFilter,
	TextFilterFunction
};
