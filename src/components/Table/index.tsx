import React, { Fragment, useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { usePagination } from '@/hooks/usePagination'
import { AddCircle, CloseSharp, SearchSharp } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Switch,
  TableBody,
  TableCell,
  TableContainer,
  TableHead as TableHeadMui,
  Table as TableMui,
  TablePagination,
  TableRow,
  Toolbar,
  Typography
} from '@mui/material'

interface HeadCell {
  disablePadding: boolean
  id: string
  label?: string
  numeric: boolean
}

interface TableHeadProps {
  headers: readonly HeadCell[]
  action: boolean
}

const TableHead: React.FC<TableHeadProps> = ({ headers, action }) => {
  return (
    <TableHeadMui>
      <TableRow>
        {headers.map((headCell, index) => (
          <Fragment key={index}>
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
            >
              {headCell.label}
            </TableCell>
          </Fragment>

        ))}
        {action && <TableCell align="center">Ações</TableCell>}
      </TableRow>
    </TableHeadMui>
  )
}

interface TableToolbarProps {
  title: string
  add?: string
  search?: (value: string | null) => void
}

const TableToolbar: React.FC<TableToolbarProps> = ({ title, add, search }) => {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')

  const handleEnterKeyBoard = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && search) {
      search(searchValue)
    }
    if (e.key === 'Escape' && search) {
      search(null)
      setSearchValue('')
    }
  }, [search, searchValue])

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        gap: 2,
      }}
    >
      <Typography sx={{ flex: '1 1 100%', display: { xs: 'none', md: 'flex' } }} variant="h6" component="div">
        {title}
      </Typography>

      <OutlinedInput
        sx={{ width: '100%', maxWidth: '300px' }}
        size="small"
        value={searchValue || ''}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={event => handleEnterKeyBoard(event)}
        endAdornment={
          <InputAdornment position="end">
            {
              searchValue.length > 0 && (
                <IconButton
                  onClick={() => {
                    if (search) {
                      search(null)
                      setSearchValue('')
                    }
                  }}
                  color='primary'
                  sx={{
                    borderRadius: '0 8px 8px 0',
                    mr: '-15px',
                  }}
                  edge="end"
                >
                  <CloseSharp />
                </IconButton>
              )
            }
            <IconButton
              onClick={() => searchValue.length > 0 && search ? search(searchValue) : null}
              color='primary'
              sx={{
                borderRadius: '0 8px 8px 0',
                mr: '-15px',
              }}
              edge="end"
            >
              <SearchSharp />
            </IconButton>
          </InputAdornment>
        }
      />

      {add && (
        <Button
          color="primary"
          variant="contained"
          sx={{
            px: { xs: 12, md: 8 },
          }}
          onClick={() => {
            router.push(add)
          }}
          startIcon={<AddCircle />}
        >
          Adicionar
        </Button>
      )}
    </Toolbar>
  )
}

interface TableProps {
  headers: HeadCell[]
  data: any[]
  traitResponse?: (data: any) => any
  title: string
  actions?: (data: any) => JSX.Element
  add?: string
  search?: (value: string | null) => void
  loading?: boolean
}

const Table = ({ headers, data, traitResponse, title, actions, add, search, loading }: TableProps) => {
  const { limit, total, setLimit, setSkip } = usePagination()
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    console.log('rows', rows)
  }, [rows])

  const handleChangePage = (_: unknown, newPage: number) => {
    setSkip(newPage * limit)
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const handleRestructure = useCallback(async () => {
    if (traitResponse) {
      setRows(await traitResponse(data))
      return
    }
    setRows(data)
  }, [data, traitResponse])

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * limit - total) : 0

  useEffect(() => {
    handleRestructure()
  }, [data, handleRestructure])

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, pl: 1 }}>
        <TableToolbar title={title} add={add} search={search} />
        <TableContainer>
          <TableMui size={dense ? 'small' : 'medium'}>
            <TableHead
              action={!!actions}
              headers={headers}
            />
            <TableBody>
              {
                !loading ?
                  rows.map((row, index) => {
                    return (
                      <TableRow key={index}>
                        {headers.map((header, subIndex) => {
                          return (
                            <TableCell
                              sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                              }}
                              align={header.numeric ? 'right' : 'left'}
                              key={subIndex}
                            >
                              {row[header.id]}
                            </TableCell>
                          )
                        })}
                        {actions && (
                          <TableCell
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                            }}
                            align="center"
                          >
                            {actions(row)}
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })
                  : (
                    <TableRow>
                      <TableCell colSpan={6} >
                        <Box display="flex" width="100%" alignItems="center" justifyContent="center">
                          <CircularProgress color="primary" size={60} />
                        </Box>
                      </TableCell>
                    </TableRow>

                  )
              }
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </TableMui>
        </TableContainer>
        <TablePagination
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Espaçamento" />
    </Box>
  )
}

export default Table