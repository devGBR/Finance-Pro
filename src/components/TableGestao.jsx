import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Chip, Collapse, IconButton, Tooltip, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, PriceCheckOutlined } from '@mui/icons-material';
import MarcaPago from './modal/MarcaPago';
import { Info } from 'react-feather';
import { common } from '@mui/material/colors';

export default function TableGestao(props) {
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModalMarcaPago, setOpenModalMarcaPago] = useState(false);
    const [expandedRows, setExpandedRows] = useState({}); // Mapeia o estado de expansão por linha
    const columns = props.column;

    useEffect(() => {
        if (!props.loading) {
            const mappedRows = createData(props.data);
            console.log(mappedRows);
            setRows(mappedRows);
        }
    }, [props.loading, props.data, props.type]);

    function createData(data) {
        if (!data || data.length === 0) return []; // Verifica se os dados estão vazios

        if (props.type === 'receita') {
            return data.map((item) => ({
                nome: item.nome,
                valor: item.valor,
                recebido: item.recebido,
                status: item.status,
                usado: item.usado,
                total: item.valor_total
            }));
        } else if (props.type === 'despesa') {
            return data.map((item) => ({
                nome: item.nome,
                valor: item.valor,
                secondTable: [{
                    pagamento: item.forma_pagamento,
                    vencimento: item.data_vencimento,
                    categoria: item.categoria
                }],
                status: item.status,
                total: item.valor_total
            }));
        } else if (props.type === 'investido') {
            return data.map((item) => ({
                nome: item.nome,
                valor: item.valor,
                rendimento: item.rendimento,
                total_ano: item.total_ano,
                secondTable: [{
                    data_investimento: item.data_investimento,
                    pagamento: item.forma_pagamento,
                }],
                status: item.status,
                total: item.valor_total
            }));
        }
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
            <TableContainer sx={{ minHeight: 100, maxHeight: 245 }} >
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow sx={{ textTransform: 'uppercase' }}>
                            {(props.type === 'despesa' || props.type === 'investido') && <TableCell>Expandir</TableCell>}
                            {columns.map((column) => (
                                !Array.isArray(column.secondaryColumns) && <TableCell
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
                                            {(props.type === 'despesa' || props.type === 'investido') && (
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
                                                    !Array.isArray(column.secondaryColumns) && <TableCell key={column.id} align={column.align}>
                                                        {column.id === "acao" ? (
                                                            <div className='w-100'>
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
                                                                            {value && value.split(',').map((item, index) => (
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

                                        {(props.type === 'despesa' || props.type === 'investido') && (
                                            <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                                                    <Collapse in={expandedRows[index]} timeout="auto" className='w-100' unmountOnExit>
                                                        <Table size='small' aria-label="purchases">
                                                            <TableHead>
                                                                <TableRow sx={{ textTransform: 'uppercase' }}>
                                                                    {columns.map((column) => (
                                                                        Array.isArray(column.secondaryColumns) && column.secondaryColumns.map((secColumn) => (
                                                                            <TableCell
                                                                                key={secColumn.id}  // Use o id da coluna secundária
                                                                                align={'center'}
                                                                                style={{ minWidth: secColumn.minWidth }}
                                                                            >
                                                                                {secColumn.label}
                                                                            </TableCell>
                                                                        ))
                                                                    ))}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody >
                                                                <TableRow >
                                                                    {columns.map((column) => {
                                                                        // Verifica se a coluna tem colunas secundárias
                                                                        if (Array.isArray(column.secondaryColumns)) {
                                                                            return column.secondaryColumns.map((secColumn) => {
                                                                                const value = row.secondTable[0][secColumn.id]; 
                                                                                return (
                                                                                    <TableCell align='center'  component="th" scope="row" key={secColumn.id}>
                                                                                        {secColumn.id === "pagamento" ? (
                                                                                            value ? value.split(',').map((item) => (
                                                                                                <Chip key={item} color='success' variant='outlined' className='mx-1 my-1' elevation={1} label={item} />
                                                                                            )):  <Typography variant="body2" className='text-center' color="textSecondary">Não foi pago com nenhuma receita cadastrada.</Typography>
                                                                                        ) : secColumn.id === "categoria" ? (
                                                                                            <Chip style={{ backgroundColor: value === 'fixa' ? '#d32f2f' : '#635BFF', color: 'white', textTransform: 'capitalize' }} className='mx-1 my-1' variant='caption'   elevation={1} label={value} />
                                                                                        ) : secColumn.format && typeof value === 'number' ? (
                                                                                            secColumn.format(value)
                                                                                        ) : (
                                                                                            value
                                                                                        )}
                                                                                    </TableCell>
                                                                                );
                                                                            });
                                                                        }
                                                                        return null; // Retorna null caso não tenha colunas secundárias
                                                                    })}
                                                                </TableRow>

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
