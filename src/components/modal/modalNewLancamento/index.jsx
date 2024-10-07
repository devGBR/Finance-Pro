import React, { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Modal,
    Typography,
    Snackbar,
    Alert,
    Fade,
    Avatar,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Chip,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import { useTheme } from '@mui/material/styles';
import './NewLancamento.scss'
import axios from 'axios';
import { SavingsOutlined } from '@mui/icons-material';
import { Row } from 'reactstrap';
import { Check, Send, X } from 'react-feather';
import SuccessToast from '../../toats/SucessToast';
import ErrorToast from '../../toats/ErrorToast';
import { toast } from 'react-toastify';
import LoadingToast from '../../toats/LoadingToast';
import api from '../../../services/api';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const mesesAnos = [
    { value: '01-2024', name: 'Janeiro 2024' },
    { value: '02-2024', name: 'Fevereiro 2024' },
    { value: '03-2024', name: 'Março 2024' },
    { value: '04-2024', name: 'Abril 2024' },
    { value: '05-2024', name: 'Maio 2024' },
    { value: '06-2024', name: 'Junho 2024' },
    { value: '07-2024', name: 'Julho 2024' },
    { value: '08-2024', name: 'Agosto 2024' },
    { value: '09-2024', name: 'Setembro 2024' },
    { value: '10-2024', name: 'Outubro 2024' },
    { value: '11-2024', name: 'Novembro 2024' },
    { value: '12-2024', name: 'Dezembro 2024' },
];

export default function NewLancamento(props) {
    const [nome, setNome] = React.useState('');
    const [valor, setValor] = React.useState('');
    const [rendimento, setRendimento] = React.useState('');
    const [date, setDate] = React.useState('');
    const [mesAno, setMesAno] = React.useState('');
    const [status, setStatus] = useState("Pendente");
    const [exist, setExist] = React.useState(false);
    const [informarPagamento, setInformarPagamento] = useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [Selecionadas, setSelecionadas] = useState([]);
    const [investimento, setInvestimento] = useState();
    const [categoria, setCategoria] = useState('');
    const theme = useTheme();

    useEffect(() => {
        if (props.open) {
            setNome('');
            setValor('');
            setDate('');
            setMesAno('');
            setStatus('');
            setRendimento('');
            setExist(false);
            setInformarPagamento(false);
            setOpenSnackbar(false);
            setSnackbarMessage('');
            setSelecionadas([]);
            setInvestimento('');
            setCategoria('');
        }
    }, [props.open]);




    const handleSubmit = async () => {
        toast.info(<LoadingToast message="Criando lançamento" title="Lançamento" />)
        const data = {
            valor: parseFloat(valor.replace('R$', '').replace('.', '').replace(',', '.')),
            ...(props.type === 'Receita'
                ? { recebido: date }
                : props.type === 'Despesa' ? { data_vencimento: date }
                    : { data_investimento: date }
            ),
            ...(props.type === 'Despesa' && {
                mes_ano: mesAno,
                categoria: categoria
            }),
            ...(props.type === 'Investimento' && { rendimento: parseFloat(rendimento.replace('%', '').replace(',', '.')) }),
            status,
            ...(props.type === 'Receita'
                ? Selecionadas && Selecionadas.length > 0 && { usado: Selecionadas }
                : Selecionadas && Selecionadas.length > 0 && { forma_pagamento: Selecionadas }
            )
        };
        if (!exist) {
            data.nome = nome;
        }


        try {
            const response = await api.post(exist ? `/financer/${props.type.toLowerCase()}/create/${investimento}` : `/financer/${props.type.toLowerCase()}/create`,
                data
            );
            if (response.status === 200) {
                props.loading(true)
                toast.success(<SuccessToast message={`Lançamento criado com sucesso`} title="Lançamentos" />)
                props.click(); // Fecha o modal após o envio
            }

        } catch (error) {
            return toast.error(<ErrorToast error="Erro ao tentar criar lançamento" title="Lançamentos" />)
        }
    };

    const items = props.monit
    const investimentos = props.investimentos && props.investimentos.filter(item => item.status === "Pago")

    useEffect(() => {
        if (exist === true) {
            if (!investimentos) {
                setExist(false)
            }
        }

    }, [exist, investimentos])

    const handleValorChange = (e) => {
        const inputValue = e.target.value.replace(/[^\d,]/g, ''); // Remove caracteres não numéricos, mas permite vírgula
        setValor(inputValue);
    };

    // Função para formatar o valor como moeda quando o usuário sair do campo
    const handleBlurValor = () => {
        const numericValue = parseFloat(valor.replace(',', '.')); // Substitui vírgula por ponto para conversão correta
        if (!isNaN(numericValue)) {
            const formattedValue = numericValue.toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                style: "currency",
                currency: "BRL"
            });
            setValor(formattedValue);
        }
    };
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelecionadas(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    function handleNomeChange(e) {
        const { name, value } = e.target
        setNome(value)
    }


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const handleRendimentoChange = (e) => {
        let value = e.target.value;

        // Permitir apenas números, vírgulas, pontos e remover o símbolo de porcentagem
        value = value.replace(/[^\d.,]/g, '');

        setRendimento(value);
    };

    // Função para formatar o valor como porcentagem ao sair do campo
    const handleRendimentoBlur = () => {
        let value = rendimento.replace(',', '.'); // Substitui vírgula por ponto

        // Verificar se o valor é válido e se pode ser convertido para número
        if (!isNaN(value) && value.trim() !== '') {
            // Converte para número com 2 casas decimais
            value = parseFloat(value);
            setRendimento(`${value}%`); // Adiciona o símbolo de % após a formatação
        } else {
            setRendimento('0%');
        }
    };

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={props.open}
                onClose={props.click}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={props.open}>
                    <Box
                        className='custom-modal overflow-auto'
                        sx={style}
                    >
                        <div
                            className='w-100'
                            style={{
                                position: 'fixed',
                                zIndex: 10,
                                background: "#FFF",
                                top: 0,
                                left: 0,
                                right: 0,
                                padding: '10px 20px',
                            }}
                        >
                            <Typography
                                id="modal-title"
                                className='d-flex align-items-center justify-content-between'
                                variant="h6"
                                component="span"
                                align="center"
                                gutterBottom
                            >
                                <Avatar
                                    className="custom-avatar"
                                    style={{
                                        backgroundColor: props.type === 'Receita'
                                            ? 'green'
                                            : props.type === 'Despesa'
                                                ? 'red'
                                                : '#FFC107'
                                    }}
                                >
                                    <SavingsOutlined />
                                </Avatar>
                                <Typography
                                    variant="overline"
                                    className='w-100 text-center'
                                    sx={{ fontSize: 20 }}
                                    component="span"
                                >
                                    Criar {props.type}
                                </Typography>
                            </Typography>
                        </div>
                        <Box sx={{ paddingTop: '40px', maxHeight: '580px', overflowY: 'auto', mt: 0 }}>
                            {props.type === 'Investimento' && <FormControl fullWidth variant="outlined" margin="normal" required>
                                <InputLabel color="#121621" id="demo-multiple-checkbox-label">Lançamento</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    value={exist}
                                    onChange={(e) => setExist(e.target.value)}
                                    required
                                    input={<OutlinedInput label="Lançamento" />}
                                    sx={{
                                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#4caf50',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#121621',
                                        },
                                    }}
                                >
                                    <MenuItem value={false}>Novo</MenuItem>
                                    <MenuItem value={true}>Existente</MenuItem>
                                </Select>
                            </FormControl>}
                            {props.type === 'Investimento' && exist === true && investimentos && <>

                                <FormControl fullWidth variant="outlined" margin="normal" required>
                                    <InputLabel color="#121621" id="demo-multiple-checkbox-label">Selecionar investimento</InputLabel>
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        value={investimento}
                                        onChange={(e) => setInvestimento(e.target.value)}
                                        required
                                        input={<OutlinedInput label="Selecionar investimento" />}
                                        sx={{
                                            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#4caf50',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#121621',
                                            },
                                        }}
                                    >
                                        {investimentos.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                <ListItemText primary={item.nome} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                            }
                            {exist === false && (
                                <TextField
                                    fullWidth
                                    label={props.type}
                                    name='nome'
                                    variant="outlined"
                                    value={nome}
                                    onChange={handleNomeChange}  // Atualiza o estado a cada mudança
                                    margin="normal"
                                    required
                                />
                            )}
                            {props.type === 'Investimento' &&
                                <TextField
                                    fullWidth
                                    label="Rentabilidade Anual"
                                    variant="outlined"
                                    value={rendimento}
                                    onChange={handleRendimentoChange}  // Atualiza o estado a cada mudança
                                    onBlur={handleRendimentoBlur}
                                    margin="normal"
                                    placeholder='1,00%'
                                    required
                                />
                            }
                            <TextField
                                fullWidth
                                label={props.type === 'Investimento' && exist && investimentos ? "Valor acrescentado" : "Valor"}
                                variant="outlined"
                                value={valor}
                                onChange={handleValorChange} // Permite digitar sem formatação
                                onBlur={handleBlurValor} // Aplica a formatação ao sair do campo
                                margin="normal"
                                required
                                InputProps={{
                                    inputProps: { min: 0 },
                                }}
                            />

                            <TextField
                                fullWidth
                                label={props.type === 'Receita' ? "Data Recebido" : props.type === 'Despesa' ? 'Data vencimento' : 'Data do investimento'}
                                variant="outlined"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                            />
                            <FormControl fullWidth variant="outlined" margin="normal" required>
                                <InputLabel color="#121621" id="demo-multiple-checkbox-label">Status</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                    input={<OutlinedInput label="status" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            <Chip
                                                sx={{
                                                    backgroundColor: selected === "Pago" ? 'green' : '#FFC107',
                                                    color: '#fff'
                                                }}
                                                label={selected}
                                            />
                                        </Box>
                                    )}
                                    sx={{
                                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#4caf50',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#121621',
                                        },
                                    }}
                                >
                                    <MenuItem value="Pago">Pago</MenuItem>
                                    <MenuItem value="Pendente">Pendente</MenuItem>
                                </Select>

                            </FormControl>

                            {props.type === 'Despesa' && (
                                <>
                                    <FormControl fullWidth variant="outlined" margin="normal" required>
                                        <InputLabel color="#121621" id="demo-multiple-checkbox-label">Mês Previsto/Criação</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            value={mesAno}
                                            onChange={(e) => setMesAno(e.target.value)}
                                            required
                                            input={<OutlinedInput label="Mês Previsto/Criação" />}
                                            sx={{
                                                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#4caf50',
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#121621',
                                                },
                                            }}
                                        >
                                            {mesesAnos.map((item) => (
                                                <MenuItem key={item.value} value={item.value}>
                                                    <ListItemText primary={item.name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth variant="outlined" margin="normal" required>
                                        <InputLabel color="#121621" id="demo-multiple-checkbox-label">Categoria</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            value={categoria}
                                            onChange={(e) => setCategoria(e.target.value)}
                                            required
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    <Chip sx={{
                                                        backgroundColor: selected === "variavel" ? '#635BFF' : '#c03', // Fundo personalizado
                                                        color: '#fff' // Texto branco
                                                    }} label={selected} />
                                                </Box>
                                            )}
                                            input={<OutlinedInput label="Lançamento" />}
                                            sx={{
                                                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#4caf50',
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#121621',
                                                },
                                            }}
                                        >
                                            <MenuItem value={'fixa'}>Fixa</MenuItem>
                                            <MenuItem value={'variavel'}>Variavel</MenuItem>
                                        </Select>
                                    </FormControl>
                                </>
                            )}

                            {!informarPagamento ? <>
                                <Row className="w-100 text-center">
                                    <p>
                                        {props.type === 'Receita' ? "Deseja pagar algum lançamento com essa receita?" : `Deseja pagar esse lançamento com alguma receita cadastrada?`}
                                    </p>
                                </Row>
                                <div className="w-100 mb-3 gap-3 d-flex">
                                    {status === 'Pago' && <Button
                                        variant="contained"
                                        color={props.type === 'Receita' ? 'success' : props.type === 'Despesa' ? 'error' : 'warning'}
                                        onClick={() => setInformarPagamento(true)}
                                        className="w-50 text-white"
                                    >
                                        Sim  &nbsp; <Check />
                                    </Button>}
                                    <Button
                                        variant="contained"
                                        color={props.type === 'Receita' ? 'success' : props.type === 'Despesa' ? 'error' : 'warning'}
                                        onClick={handleSubmit}
                                        className={status === 'Pago' ? 'w-75 text-white' : 'w-100 text-white'}
                                    >
                                        {status === 'Pago' ? "Apenas enviar" : "Enviar"} &nbsp; <Send />
                                    </Button>
                                </div>
                            </> : (
                                <Row className="w-100 mx-auto mb-3">
                                    <Row className="w-100 mb-3">
                                        <Typography variant="h5" className='h4' color="">
                                            Selecione na ordem de pagamento!
                                        </Typography>
                                        <Typography variant="caption" className='' color="text.secondary">
                                            ex:  O lançamento 1 tem 68 e o lançamento 2 tem 300 a pendencia e de 270, se selecionar o lançamento 2 primeiro ele irá zerar o lançamento dois e o 1 continuara com com 68.
                                        </Typography>
                                    </Row>
                                    <FormControl fullWidth>
                                        <InputLabel color="#121621" id="demo-multiple-checkbox-label">  {props.type === 'Receita' ? "Selecione os lançamentos" : `Selecione as receitas`}</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            multiple
                                            value={Selecionadas}
                                            onChange={handleChange}
                                            input={<OutlinedInput label={props.type === 'Receita' ? "Selecione os lançamentos" : `Selecione as receitas`} />}
                                            sx={{
                                                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#4caf50', // Cor da borda
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#121621', // Cor da borda quando focado
                                                },
                                            }}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((id) => {
                                                        const item = items.find(r => r.id === id);
                                                        return item ? (
                                                            <Chip key={item.id} sx={{
                                                                backgroundColor: item.data_vencimento ? '#f44336' : item.data_investimento ? '#ff9800' : 'green', // Fundo personalizado
                                                                color: '#fff' // Texto branco
                                                            }} label={`${item.nome} - R$ ${item.valor_total} - ${item.data_vencimento ? 'Despesa' : item.data_investimento ? 'Investimento' : 'Receita'}`} />
                                                        ) : null;
                                                    })}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {items.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    <Checkbox checked={Selecionadas.includes(item.id)} />
                                                    <ListItemText primary={`${item.nome} - R$ ${item.valor_total}`} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <div className="w-100 d-flex mt-4 gap-3">
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => setInformarPagamento(false)}
                                            className="w-50"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handleSubmit}
                                            className="w-50 text-white"
                                        >
                                            Enviar
                                        </Button>
                                    </div>
                                </Row>
                            )}
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarMessage.includes('Erro') ? 'error' : 'success'}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
