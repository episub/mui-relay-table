/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/unbound-method */
import type { SortDirection, TableCellProps, Theme } from '@material-ui/core'
import {
  Box,
  Checkbox,
  createStyles,
  IconButton,
  lighten,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core'
import type { TablePaginationActionsProps } from '@material-ui/core/TablePagination/TablePaginationActions'
import {
  CheckBoxOutlineBlank,
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  LibraryAddCheck,
} from '@material-ui/icons'
import type { MouseEvent, ReactElement, ReactNode } from 'react'
import React from 'react'
import { useToggle } from 'react-use'

enum PaginationOptions {
  BACK_ONE = -1,
  BACK_ALL = -2,
  FORWARD_ONE = 1,
  FORWARD_ALL = 2,
}

type Maybe<T> = T | undefined | null

const TABLE_ROW_HEIGHT = 53
const COLUMN_SPAN_ADDITION = 1

const EMPTY = 0

const DEFAULT_STARTING_ROWS = 10
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const DEFAULT_ROW_OPTIONS = [DEFAULT_STARTING_ROWS, 30, 50, 100]

type MinimumRequiredEdge = {
  [propName: string]: unknown
  cursor: string
  node: {
    [propName: string]: unknown
    id: string
  }
}

type ProcessingFunction<T> = (edge: T) => ReactNode

type CheckboxProps<T> = CommonProps<T> & {
  checkboxEnabled: true
  tableHeaderSelected: ReactNode
  onCheckboxRowClick(event: MouseEvent<HTMLTableRowElement>): void
  onSelectAllClick(): void
  clearSelected(): void
}

type NoCheckboxProps<T> = CommonProps<T> & { checkboxEnabled?: false }

type TableFix<T> = CheckboxProps<T> | NoCheckboxProps<T>

interface OpinionatedRelayTableColumnData<T> {
  id: string
  title: ReactNode
  sortID?: string
  cellProps?: TableCellProps
  processEdge: ProcessingFunction<T>
}

interface CommonProps<T> {
  /**
   * columns define how we transform the edges provided through the edges prop.
   */
  columns: Array<OpinionatedRelayTableColumnData<T>>
  edges: Maybe<MinimumRequiredEdge[]>
  onChangeRowsPerPage?: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >
  state: TableStateProps
  tableHeader?: ReactNode
  tableID: string
  setSort(direction: SortDirection, field: string): void
  onRowClick?(event: MouseEvent<HTMLTableRowElement>): void
  onPagination(change: PaginationOptions): void
}

interface TableStateProps {
  currentRowsPerPage: number
  hasNext: Maybe<boolean>
  hasPrevious: Maybe<boolean>
  loading?: boolean
  selectedList?: string[]
  sortDirection: SortDirection
  sortField: Maybe<string>
  totalCount: number
}

type TablePaginationProps<T> = Pick<
  TableFix<T>,
  'state' | 'onChangeRowsPerPage' | 'onPagination'
>

type TableRowProps<T> = Pick<
  TableFix<T>,
  'state' | 'onRowClick' | 'checkboxEnabled' | 'columns'
> & {
  renderCheckbox: boolean
  isSelected: boolean
  edge: MinimumRequiredEdge
  onCheckboxRowClick?(event: MouseEvent<HTMLTableRowElement>): void
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
  }),
)

const AlternatingTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow)

const OpinionatedTableRow = <T,>(props: TableRowProps<T>) => (
  <AlternatingTableRow
    key={props.edge.cursor}
    id={props.edge.node.id}
    hover
    onClick={
      props.checkboxEnabled ? props.onCheckboxRowClick : props.onRowClick
    }
  >
    {props.checkboxEnabled ? (
      <TableCell padding="checkbox">
        <Checkbox id={props.edge.node.id} checked={props.isSelected} />
      </TableCell>
    ) : null}
    {props.columns.map((column) => (
      <TableCell key={column.id} {...column.cellProps}>
        {column.processEdge((props.edge as unknown) as T)}
      </TableCell>
    ))}
  </AlternatingTableRow>
)

function TablePaginationCustom<T>({
  state: { totalCount, hasNext, hasPrevious, currentRowsPerPage },
  onChangeRowsPerPage,
  onPagination,
}: TablePaginationProps<T>) {
  function onPageChange(
    _event: MouseEvent<HTMLButtonElement> | null,
    page: number,
  ): void {
    onPagination(page)
  }

  function paginationTotalCountDisplay() {
    return `Total Results: ${totalCount}`
  }

  const TablePaginationActions = ({
    onChangePage,
  }: TablePaginationActionsProps) => {
    function handleFirstPageButtonClick(
      event: React.MouseEvent<HTMLButtonElement>,
    ) {
      onChangePage(event, PaginationOptions.BACK_ALL)
    }

    function handleBackButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
      onChangePage(event, PaginationOptions.BACK_ONE)
    }

    function handleNextButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
      onChangePage(event, PaginationOptions.FORWARD_ONE)
    }

    function handleLastPageButtonClick(
      event: React.MouseEvent<HTMLButtonElement>,
    ) {
      onChangePage(event, PaginationOptions.FORWARD_ALL)
    }

    return (
      <Box pl={3} flexShrink={0}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={!hasPrevious}
          aria-label="first page"
        >
          <FirstPage />
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={!hasPrevious}
          aria-label="previous page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={!hasNext}
          aria-label="next page"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={!hasNext}
          aria-label="last page"
        >
          <LastPage />
        </IconButton>
      </Box>
    )
  }

  return (
    <TablePagination
      component="div"
      onChangePage={onPageChange}
      labelDisplayedRows={paginationTotalCountDisplay}
      onChangeRowsPerPage={onChangeRowsPerPage}
      page={0}
      count={totalCount}
      rowsPerPage={currentRowsPerPage}
      rowsPerPageOptions={DEFAULT_ROW_OPTIONS}
      ActionsComponent={TablePaginationActions}
    />
  )
}

/**
 * Custom table to wrangle the page based api of material-ui tables into relay
 * style
 *
 * @deprecated this table has been superceded by material-ui/data-grid
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function OpinionatedRelayTable<T>({
  state,
  columns,
  edges,
  onRowClick,
  setSort,
  tableHeader,
  onPagination,
  onChangeRowsPerPage,
  ...checkboxProps
}: TableFix<T>): ReactElement | null {
  const styles = useToolbarStyles()
  const [showCheckboxColumn, toggleCheckboxRender] = useToggle(false)

  const emptyRows = state.currentRowsPerPage - (edges?.length ?? EMPTY)
  const selectedRows =
    checkboxProps.checkboxEnabled === true
      ? state.selectedList?.length ?? EMPTY
      : EMPTY

  function toggleCheckboxColumn() {
    if (checkboxProps.checkboxEnabled) {
      checkboxProps.clearSelected()
      toggleCheckboxRender()
    }
  }

  function onSortChange(event: MouseEvent<HTMLSpanElement>) {
    setSort(
      state.sortDirection === 'asc' ? 'desc' : 'asc',
      event.currentTarget.id,
    )
    if (checkboxProps.checkboxEnabled) {
      checkboxProps.clearSelected()
    }
  }

  return (
    <Paper elevation={0} variant="outlined">
      {tableHeader && selectedRows === EMPTY && (
        <Box clone display="flex" flexDirection="row">
          <Toolbar>
            {checkboxProps.checkboxEnabled ? (
              <Tooltip title="Toggle checkbox selection">
                <IconButton onClick={toggleCheckboxColumn}>
                  {showCheckboxColumn ? (
                    <LibraryAddCheck />
                  ) : (
                    <CheckBoxOutlineBlank />
                  )}
                </IconButton>
              </Tooltip>
            ) : null}
            {tableHeader}
          </Toolbar>
        </Box>
      )}
      {selectedRows > EMPTY ? (
        <Box clone display="flex" flexDirection="row">
          <Toolbar className={styles.highlight}>
            <Typography color="inherit" variant="subtitle1">
              {selectedRows} Selected
            </Typography>
            <Box flexGrow={1} />
            {checkboxProps.checkboxEnabled
              ? checkboxProps.tableHeaderSelected
              : null}
          </Toolbar>
        </Box>
      ) : null}
      {state.loading ? <LinearProgress /> : null}
      <Table>
        <TableHead>
          <TableRow>
            {checkboxProps.checkboxEnabled && showCheckboxColumn ? (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedRows > EMPTY &&
                    selectedRows < (edges?.length ?? EMPTY)
                  }
                  checked={selectedRows === edges?.length}
                  onChange={checkboxProps.onSelectAllClick}
                />
              </TableCell>
            ) : null}
            {columns.map(({ id, title, sortID, cellProps }) => (
              <TableCell
                key={id}
                {...cellProps}
                sortDirection={
                  state.sortField === sortID
                    ? state.sortDirection === 'asc'
                      ? 'desc'
                      : 'asc'
                    : false
                }
              >
                {sortID ? (
                  <TableSortLabel
                    id={sortID}
                    onClick={onSortChange}
                    active={state.sortField === sortID}
                    direction={state.sortDirection === 'asc' ? 'desc' : 'asc'}
                  >
                    {title}
                  </TableSortLabel>
                ) : (
                  title
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {edges?.map((edge) => (
            <OpinionatedTableRow<T>
              state={state}
              columns={columns}
              key={edge.node.id}
              edge={edge}
              isSelected={
                !!state.selectedList?.find(
                  (element) => element === edge.node.id,
                )
              }
              onRowClick={onRowClick}
              renderCheckbox={showCheckboxColumn}
              onCheckboxRowClick={
                checkboxProps.checkboxEnabled
                  ? checkboxProps.onCheckboxRowClick
                  : undefined
              }
              checkboxEnabled={checkboxProps.checkboxEnabled}
            />
          ))}
          {emptyRows > EMPTY && (
            <TableRow style={{ height: TABLE_ROW_HEIGHT * emptyRows }}>
              <TableCell
                colSpan={
                  showCheckboxColumn
                    ? columns.length + COLUMN_SPAN_ADDITION
                    : columns.length
                }
              />
            </TableRow>
          )}
        </TableBody>
        <TablePaginationCustom
          state={state}
          onChangeRowsPerPage={onChangeRowsPerPage}
          onPagination={onPagination}
        />
      </Table>
    </Paper>
  )
}

export type { SortDirection, OpinionatedRelayTableColumnData }
export { OpinionatedRelayTable }
