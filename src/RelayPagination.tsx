import type {
  TableCellBaseProps,
  TablePaginationProps,
} from '@material-ui/core'
import { Box, IconButton, TablePagination, useTheme } from '@material-ui/core'
import type { TablePaginationActionsProps } from '@material-ui/core/TablePagination/TablePaginationActions'
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from '@material-ui/icons'
import type { MouseEvent } from 'react'
import React from 'react'

type PaginationActions = 'first' | 'last' | 'previous' | 'next'

interface RelayPaginationProps
  extends Omit<
    TablePaginationProps,
    'onChangePage' | 'ActionsComponent' | 'page'
  > {
  component?: React.ElementType<TableCellBaseProps>
  hasNext: boolean
  hasPrevious: boolean
  onChangePage: (
    event: MouseEvent<HTMLButtonElement>,
    action: PaginationActions,
  ) => void
}

/**
 * Helper to quickly get a pagnation component that can work with relay style
 * graphql queries. Where pages are navigated relative to a row cursor instead
 * of absolute pages.
 *
 * This pagination component uses 4 buttons instead of the default two and
 * overrides the normal onChangePage function with one that returns an action
 * string instead of a page number.
 *
 * Other PaginationProps get passed to their default location.
 */
const RelayPagination = ({
  count,
  hasPrevious,
  hasNext,
  onChangePage,
  ...other
}: RelayPaginationProps): JSX.Element => {
  const theme = useTheme()

  function paginationTotalCountDisplay() {
    return `Total Results: ${count}`
  }

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, 'first')
  }

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, 'previous')
  }

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, 'next')
  }

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onChangePage(event, 'last')
  }

  const RelayPaginationActions = ({
    backIconButtonProps,
    nextIconButtonProps,
    count: omitCount,
    onChangePage: omitOnChangePage,
    page: OmitPage,
    rowsPerPage: omitRowsPerPage,
    ...paginationActionProps
  }: TablePaginationActionsProps) => {
    return (
      <Box flexShrink={0} ml={2} {...paginationActionProps}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          aria-label="first page"
          {...backIconButtonProps}
        >
          {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={!hasPrevious}
          aria-label="previous page"
          {...backIconButtonProps}
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={!hasNext}
          aria-label="next page"
          {...nextIconButtonProps}
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          aria-label="last page"
          {...nextIconButtonProps}
        >
          {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
        </IconButton>
      </Box>
    )
  }

  return (
    <TablePagination
      labelDisplayedRows={paginationTotalCountDisplay}
      {...other}
      ActionsComponent={RelayPaginationActions}
      count={count}
      onChangePage={() =>
        console.warn("Default onChangePage call shouldn't be being called")
      }
      page={0}
    />
  )
}

export { RelayPagination }
