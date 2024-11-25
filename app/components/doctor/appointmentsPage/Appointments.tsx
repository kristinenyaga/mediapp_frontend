"use client"
import React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Layout from '../../layout';
import { HiOutlineArrowLongRight } from "react-icons/hi2";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F9F9F9',
    color: '#000201',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
const Appointments = () => {
  const getCurrentDate = () => {
    const date = new Date();

    // Get day with ordinal suffix
    const day = date.getDate();
    const ordinal =
      day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
          ? 'nd'
          : day % 10 === 3 && day !== 13
            ? 'rd'
            : 'th';
    const dayWithOrdinal = `${day}${ordinal}`;

    // Get month and year
    const month = date.toLocaleString('default', { month: 'short' }); // Nov
    const year = date.getFullYear();

    return `${dayWithOrdinal} ${month} ${year}`;
  };

  return (
    <Layout>
      <div className='px-5'>
        <div className='flex  justify-between items-center xl:w-[90%]' >
          <div className='flex items-center gap-5 mt-3'>
            <p className='font-medium text-[20px]'>Today&apos;s Appointments</p>
            <p className='bg-blue-100 text-blue-300 p-3 w-[150px] text-center rounded-md text-sm'>{getCurrentDate()}</p>
          </div>
          <p className='text-blue-300 cursor-pointer hover:underline underline-offset-4 mt-5 flex gap-3 items-center'>All Appointments <HiOutlineArrowLongRight className='text-blue-300 text-2xl'/></p>
        </div>
        <div className='mt-5'>
          <input
            type='text'
            placeholder='Search appointments by patient ID...'
            className='w-[90%] border border-gray-300 rounded-md p-3 py-4 focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder:text-sm'
          />
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Dessert (100g serving)</StyledTableCell>
                <StyledTableCell align="right">Calories</StyledTableCell>
                <StyledTableCell align="right">Fat&nbsp;(g)</StyledTableCell>
                <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
                <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.calories}</StyledTableCell>
                  <StyledTableCell align="right">{row.fat}</StyledTableCell>
                  <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                  <StyledTableCell align="right">{row.protein}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


      </div>
    </Layout>
  );
};

export default Appointments;
