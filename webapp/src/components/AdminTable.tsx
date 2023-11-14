import React from 'react'
import MaterialTable from '@material-table/core'
import { ThemeProvider } from '@mui/material'
import { theme } from '../styles'

import '../features/adminRsuTab/Admin.css'

interface AdminTableProps {
  actions: any[]
  columns: any[]
  data: any[]
  title: string
  editable: any
}

const AdminTable = (props: AdminTableProps) => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <MaterialTable
          actions={props.actions}
          columns={props.columns}
          data={props.data}
          title={props.title}
          editable={props.editable}
          options={{
            selection: true,
            actionsColumnIndex: -1,
            tableLayout: 'fixed',
            rowStyle: {
              overflowWrap: 'break-word',
            },
          }}
        />
      </ThemeProvider>
    </div>
  )
}
export default AdminTable
