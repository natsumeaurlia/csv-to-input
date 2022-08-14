import React, { FormEvent, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Button, Checkbox, Divider, FormControlLabel, FormGroup } from '@mui/material'
import { Box } from '@mui/system'

interface CSV {
  [key: string]: any
}

const Popup = () => {
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState<File | null>()
  const [removeEmptyRow, setRemoveEmptyRow] = useState(true)
  const [csvArray, setCsvArray] = useState<CSV[]>([])

  const fileReader = new FileReader()

  const csvFileToArray = (content: string) => {
    // csv1行目(header)を取得
    const csvHeader = content.slice(0, content.indexOf('\n')).split(',')
    // header以降を1行ごとに分解
    const csvRows = content.slice(content.indexOf('\n') + 1).split('\n')

    const arr = csvRows.map((i) => {
      // 1行を要素ごとに分解
      const values = i.split(',')
      // ヘッダーをループし、ヘッダ位置に対応する列の値を詰めていく
      const obj = csvHeader.reduce((obj: CSV, header, index) => {
        if (removeEmptyRow && values[index]) {
          obj[header] = values[index]
        } else if (!removeEmptyRow) {
          obj[header] = values[index]
        }
        return obj
      }, {})
      return obj
    })

    setCsvArray(Array.from(arr))
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const file = target.files ? target.files[0] : null
    if (file) {
      setFileName(file.name)
    }
    setFile(file)
  }

  const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target?.result
        if (typeof csvOutput === 'string') {
          csvFileToArray(csvOutput)
        }
      }

      fileReader.readAsText(file)
    }
  }

  const headerKeys = Object.keys(Object.assign({}, ...csvArray))

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <input type={'file'} id={'csvFileInput'} accept={'.csv'} onChange={handleOnChange} hidden />
        <label htmlFor="csvFileInput">
          <Button variant="contained" component="span">
            Select CSV
          </Button>
        </label>
        {fileName.length > 0 && <h3 style={{ marginLeft: '1rem' }}>{fileName}</h3>}
      </Box>

      <Box
        sx={{
          marginTop: '1rem',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Button
          variant="contained"
          onClick={(e) => {
            handleOnSubmit(e)
          }}
        >
          IMPORT CSV
        </Button>
        <FormGroup
          sx={{
            marginLeft: '1rem',
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                value={removeEmptyRow}
                onClick={() => {
                  setRemoveEmptyRow(!removeEmptyRow)
                }}
                defaultChecked
              />
            }
            label="Remove Empty Row"
          />
        </FormGroup>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {headerKeys.map((key) => (
                <TableCell variant="head">{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {csvArray.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {Object.values(row).map((val) => (
                  <TableCell style={{ border: '1px solid gray' }} variant="body">
                    {val}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
)
