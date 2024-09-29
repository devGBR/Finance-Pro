import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Chip, Collapse, IconButton, Tooltip } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, PriceCheckOutlined } from '@mui/icons-material';
import MarcaPago from './modal/MarcaPago';
import { Info } from 'react-feather';

export default function TableGestao(props) {
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModalMarcaPago, setOpenModalMarcaPago] = useState(false);
    const [expandedRows, setExpandedRows] = useState({}); // Mapeia o estado de expansão por linha
    const columns = props.column;

    useEffect(() => {
        if (!props.loading) {
            const mappedRows = props.type === 'receita'
                ? props.data.map(item => createData(item.nome, item.valor, item.mes, item.status, item.usado, item.valor_total))
                : props.type === 'despesa'
                    ? props.data.map(item => createData(item.nome, item.valor, item.data_vencimento, item.status, item.forma_pagamento, item.valor_total))
                    : [];
            setRows(mappedRows);
        }
    }, [props.loading, props.data, props.type]);

    function createData(nome, valor, data, status, redirect, total) {
        if (props.type === 'receita') {
            const usado = redirect;
            const recebido = data;
            return { nome, valor, recebido, status, usado, total };
        } else if (props.type === 'despesa') {
            const pagamento = redirect;
            const vencimento = data;
            const categoria = "Despesa fixa";
            return {
                nome, valor, status, total,
                secondTable: [{
                    pagamento,
                    vencimento,
                    categoria
                }]
            };
        }
        return {};
    }

    function modalMarcaPago() {
        setOpenModalMarcaPago(!openModalMarcaPago);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Função para alternar o estado de expansão de uma linha individual
    const toggleRowExpansion = (rowIndex) => {
        setExpandedRows((prevState) => ({
            ...prevState,
            [rowIndex]: !prevState[rowIndex], // Alterna o estado da linha específica
        }));
    };

    return (
        <Paper elevation={0} sx={{ border: 0, width: '100%' }}>
            <MarcaPago open={openModalMarcaPago} click={() => { setOpenModalMarcaPago(!openModalMarcaPago) }} receita={props.receita} type={props.type} />
            <TableContainer sx={{ maxHeight: 300 }} >
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow sx={{ textTransform: 'uppercase' }}>
                            {props.type === 'despesa' && <TableCell>Expandir</TableCell>}
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <React.Fragment>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => (
                                    <React.Fragment key={index}>
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            {props.type === 'despesa' && (
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="expand row"
                                                        size="small"
                                                        onClick={() => toggleRowExpansion(index)} // Alterna a expansão da linha específica
                                                    >
                                                        {expandedRows[index] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.id === "acao" ? (
                                                            <div className='w-100 text-center'>
                                                                <Tooltip placement="top" className='text-center' title="Marca como pago">
                                                                    <IconButton onClick={modalMarcaPago} disabled={row['status'] === 'Pago'}>
                                                                        <PriceCheckOutlined color={row['status'] === 'Pago' ? '#999' : 'success'} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                        ) : (column.id === "usado" || column.id === "pagamento") ? (
                                                            <Tooltip
                                                                placement="top"
                                                                className="text-center"
                                                                title={
                                                                    <React.Fragment>
                                                                        <ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
                                                                            { value && value.split(',').map((item, index) => (
                                                                                <li key={index}>{item};</li>
                                                                            ))}
                                                                        </ul>
                                                                    </React.Fragment>
                                                                }
                                                            >
                                                                <IconButton>
                                                                    <Info style={{ color: 'green' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        ) : (column.id === "status") ? (
                                                            value.split(',').map((item) => (
                                                                <Chip color={item === 'Pago' ? 'success' : 'warning'} className='mx-1 my-1 text-white bg-green' elevation={1} label={item} key={item} />
                                                            ))
                                                        ) : column.format && typeof value === 'number' ? (
                                                            column.format(value)
                                                        ) : (
                                                            value
                                                        )}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>

                                        {props.type === 'despesa' && (
                                            <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                    <Collapse in={expandedRows[index]} timeout="auto" unmountOnExit>
                                                        <Table size='small' aria-label="purchases">
                                                            <TableHead>
                                                                <TableRow sx={{ textTransform: 'uppercase' }}>
                                                                    <TableCell align='center'>Forma de pagamento</TableCell>
                                                                    <TableCell align='center'>Até o vencimento</TableCell>
                                                                    <TableCell align='center'>Categoria</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {row.secondTable.map((data, i) => (
                                                                    <TableRow key={i}>
                                                                        <TableCell align='center' component="th" scope="row">
                                                                            <Chip color='success' variant='outlined' className='mx-1 my-1' elevation={1} label={data.pagamento} />
                                                                        </TableCell>
                                                                        <TableCell align='center'>{data.vencimento}</TableCell>
                                                                        <TableCell align='center'>
                                                                            <Chip style={{ backgroundColor: data.categoria === 'Despesa fixa' ? '#d32f2f' : '#635BFF', color: 'white' }} className='mx-1 my-1' elevation={1} label={data.categoria} />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                        </React.Fragment>
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                sx={{ border: 0 }}
                rowsPerPageOptions={[3, 5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
