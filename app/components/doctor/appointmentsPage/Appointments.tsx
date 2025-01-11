'use client'
import React, { useState,useEffect } from 'react'
import DoctorLayout from '../doctorLayout'
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { createTheme as createMaterialTheme } from "@mui/material/styles";
import { ThemeProvider as MaterialThemeProvider } from "@mui/material/styles";
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft, MdOutlineArrowRightAlt } from "react-icons/md";
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from '@table-library/react-table-library/table';
import {
  useSort,
  HeaderCellSort,
  SortIconPositions,
  SortToggleType,
} from "@table-library/react-table-library/sort";
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { usePagination } from '@table-library/react-table-library/pagination';
import { nodes } from './data';
import DiagnosisModal from './diagnosisModal';

const key = 'Composed Table';
const Appointments = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState({ nodes });
  const [statusFilter, setStatusFilter] = useState('')
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  
  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 2,
    },
    onChange: onPaginationChange,
  });
  function onPaginationChange(action: any, state: any) {
    console.log(action, state);
  }

  const handleSearch = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearch(event.target.value);
  };
  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortIcon: {
        margin: "0px",
        iconDefault: <UnfoldMoreOutlinedIcon fontSize="medium" />,
        iconUp: <KeyboardArrowUpOutlinedIcon fontSize="medium" />,
        iconDown: <KeyboardArrowDownOutlinedIcon fontSize="medium" />,
      },
      sortFns: {
        PATIENT_NAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        APPOINTMENT_DATE: (array) => array.sort((a, b) => new Date(a.date) - new Date(b.date)),
        APPOINTMENT_TIME: (array) => array.sort((a, b) => {
          const [hourA, minuteA] = a.time.split(":").map(Number)
          const [hourB, minuteB] = b.time.split(":").map(Number)
          return hourA * 60 + minuteA - (hourB * 60 + minuteB)

        }),
      },
    }
  );
  function onSortChange(action, state) {
    console.log(action, state);
  }
  const handleUpdate = (value, id, property) => {
    setData((state) => ({
      ...state,
      nodes: state.nodes.map((node) => {
        if (node.id === id) {
          return { ...node, [property]: value };
        } else {
          return node;
        }
      }),
    }));
  };

  useEffect(() => {
    const filteredNodes = search || statusFilter ? nodes.filter(item => { 
      return (
        (!search || item.name.toLowerCase().includes(search.toLowerCase())) &&
        (!statusFilter || item.status === statusFilter)
      )
    }):nodes
    setData({ nodes: filteredNodes })
    pagination.fns.onSetPage(0);
  },[search,statusFilter])
  const theme = useTheme({
    HeaderRow: `
        .th {
          border-bottom: 1px solid #F9F9F9;
        }
      `,
    BaseCell: `
        &:not(:last-of-type) {
          border: 1px solid #F9F9F9;

        }
        border: 1px solid #F9F9F9;
        padding: 8px 16px;
        text-align: center;
        color:#4F5653;

      `,
    Cell: `
            &:last-of-type {
          color:#0077B6;
          cursor:pointer;
        }
    `,

    HeaderCell: `
    color:#000201;
    font-weight:600;
    `

  });

  return (
    <DoctorLayout>
      <div className='flex flex-col gap-5'>
        <div className='flex items-center justify-between w-[98%]'>
          <div className='mt-3 mb-8'>
            <p className='text-[22px] font-medium'>Today&apos;s Appointments</p>
            <p className='text-sm text-gray-500'>an overview of todays appointment details</p>
          </div>
          <p className='text-blue-500 font-medium text-base flex items-center gap-1 cursor-pointer hover:text-[18px]'>view all appointments <MdOutlineArrowRightAlt className=' text-3xl'/> </p>
        </div>
        <div className='flex items-center mb-5'>
          <input id="search" placeholder='search by patient name' type="text" className='p-2 rounded-md border border-gray-400 placeholder:text-gray-600 placeholder:text-sm focus:outline-blue-600 focus:outline-[0.1px]' onChange={handleSearch} />
          <div className="">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-[10px] rounded-md text-sm focus:outline-none"
            >
              <option value="">Status filter</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>

            </select>
          </div>

        </div>
        <Table data={data} theme={theme} sort={sort} pagination={pagination}>
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCellSort sortKey='APPOINTMENT_DATE'>Appointment Date</HeaderCellSort>
                  <HeaderCellSort sortKey='APPOINTMENT_TIME'>Appointment Time</HeaderCellSort>
                  <HeaderCellSort sortKey='PATIENT_NAME'>Patient Name</HeaderCellSort>
                  <HeaderCell>Room Number</HeaderCell>
                  <HeaderCell>Status</HeaderCell>
                  <HeaderCell>completed</HeaderCell>
                  <HeaderCell>Predicted Diagnosis</HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((item) => (
                  <Row key={item.id} item={item}>
                    <Cell>
                      {item.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </Cell>
                    <Cell>{item.time}</Cell>
                    <Cell>{item.name}</Cell>
                    <Cell>{item.room_no}</Cell>
                    <Cell className={`
                    ${item.status === 'pending' ? 'bg-[#faedde5f] text-[#d97706]' : ''}
                    ${item.status === 'completed' ? 'text-brand-500 bg-brand-100' : ''}
                    ${item.status === 'cancelled' ? 'text-red-300 bg-red-50' : ''}
                  
                      `}>{item.status}</Cell>
                    <Cell>
                      <input
                        type="checkbox"
                        checked={item.status !== 'pending' && item.status !== 'cancelled'}
                        onChange={(event) =>
                          handleUpdate(event.target.checked ? 'completed':'pending' , item.id, "status")
                        }
                      />
                    </Cell>
                    <Cell onClick={()=>handleOpen()}>view</Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
        <div className="flex flex-col items-left mt-4">
          <div className="mb-4 text-sm text-gray-700">
            Total Pages: {pagination.state.getTotalPages(data.nodes)}
          </div>

          <div className="flex items-right space-x-4 text-sm">
            <button
              className={`px-3 py-1.5 rounded-md ${pagination.state.page === 0
                ?"border text-gray-500 border-gray-200 cursor-not-allowed" :
                "border text-gray-700 border-gray-300"
                }`}
              onClick={() => pagination.fns.onSetPage(pagination.state.page - 1)}
              disabled={pagination.state.page === 0}
            >
              <MdKeyboardDoubleArrowLeft className='text-lg' />
            </button>

            {pagination.state.getPages(data.nodes).map((_, index) => (
              <button
                key={index}
                type="button"
                className={`px-4 py-1 rounded-sm ${pagination.state.page === index ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                onClick={() => pagination.fns.onSetPage(index)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className={`px-3 py-1 rounded-md ${pagination.state.page === pagination.state.getTotalPages(data.nodes) - 1
                ? "border text-gray-500 border-gray-200 cursor-not-allowed"
                : "border text-gray-700 border-gray-300"
                }`}
              onClick={() => pagination.fns.onSetPage(pagination.state.page + 1)}
              disabled={pagination.state.page === pagination.state.getTotalPages(data.nodes) - 1}
            >
              <MdKeyboardDoubleArrowRight className='text-lg' />
            </button>
          </div>
        </div>
        <DiagnosisModal
          handleClose={handleClose}
          open={open}
        />
      </div>

    </DoctorLayout>
  )
}

export default Appointments