import React, { useEffect, useState } from 'react';
import { Avatar, Backdrop, Box, Button, Fade, FormControl, InputLabel, ListItemText, MenuItem, Modal, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import { Edit } from 'react-feather';
import axios from 'axios';
import './EditUser.scss';
import api from '../../../services/api';
import SuccessToast from '../../toats/SucessToast';
import { toast } from 'react-toastify';
import LoadingToast from '../../toats/LoadingToast';

const estados = [
    { sigla: 'AC' }, { sigla: 'AL' }, { sigla: 'AP' }, { sigla: 'AM' }, { sigla: 'BA' },
    { sigla: 'CE' }, { sigla: 'DF' }, { sigla: 'ES' }, { sigla: 'GO' }, { sigla: 'MA' },
    { sigla: 'MT' }, { sigla: 'MS' }, { sigla: 'MG' }, { sigla: 'PA' }, { sigla: 'PB' },
    { sigla: 'PR' }, { sigla: 'PE' }, { sigla: 'PI' }, { sigla: 'RJ' }, { sigla: 'RN' },
    { sigla: 'RS' }, { sigla: 'RO' }, { sigla: 'RR' }, { sigla: 'SC' }, { sigla: 'SP' },
    { sigla: 'SE' }, { sigla: 'TO' }
];

export default function EditUser(props) {
    const user = props.user
    const [nome, setNome] = useState(user.nome);
    const [cpfCnpj, setCpfCnpj] = useState(user.cpf_cnpj);
    const [email, setEmail] = useState(user.email);
    const [telefone, setTelefone] = useState(user.telefone);
    const [cep, setCep] = useState(user.cep);
    const [logradouro, setLogradouro] = useState(user.logradouro);
    const [municipio, setMunicipio] = useState(user.municipio);
    const [numero, setNumero] = useState(user.numero);
    const [estado, setEstado] = useState(user.estado);
    const [error, setError] = useState('');

    const [validationError, setValidationError] = useState({
        nome: false,
        telefone: false,
        cep: false,
        logradouro: false,
        numero: false,
        municipio: false,
        estado: false,
    });



    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const handleCepChange = (e) => {
        setCep(e.target.value);
    };

    const searchCep = async () => {
        setCep(cep.replace('-', ''))
        if (cep.length !== 8) {
            setError('CEP deve conter 8 dígitos.');
            return;
        }
        try {
            toast.info(<LoadingToast message="Buscando CEP!" title="CEP" />)
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
            if (response.data.erro) {   
                toast.error(<ErrorToast error="CEP não encontrado!" title="CEP" />)
                setLogradouro('');
                setMunicipio('');
                setEstado('');
            } else {
                toast.success(<SuccessToast message={`CEP encontrado!`} title="CEP" />)
                setLogradouro(response.data.logradouro);
                setMunicipio(response.data.localidade);
                setEstado(response.data.uf);
                setError('');
            }
        } catch (error) {
            setError('Erro ao buscar o CEP.');
        }
    };

    const handleSubmit = () => {
        
        let hasError = false;
        let errors = {
            nome: false,
            telefone: false,
            cep: false,
            logradouro: false,
            numero: false,
            municipio: false,
            estado: false,
        };

        if (!nome) {
            errors.nome = true;
            hasError = true;
        }
        if (!telefone) {
            errors.telefone = true;
            hasError = true;
        }
        if (!cep) {
            errors.cep = true;
            hasError = true;
        }
        if (!logradouro) {
            errors.logradouro = true;
            hasError = true;
        }
        if (!numero) {
            errors.numero = true;
            hasError = true;
        }
        if (!municipio) {
            errors.municipio = true;
            hasError = true;
        }
        if (!estado) {
            errors.estado = true;
            hasError = true;
        }

        setValidationError(errors);

        if (hasError) {
            return;
        }
        const data = {
            nome,
            telefone,
            cep,
            logradouro,
            municipio,
            numero,
            estado
        }
        toast.info(<LoadingToast message="Atualizando os dados!" title="Usuário" />)
        api.put(`/user/${user.id}/update`, data).then((response) => {
            if (response.status === 200) {
                toast.success(<SuccessToast message={`Usuário atualizado com sucesso`} title="Usuário" />)
                props.click()
                props.setLoad(true)
            }
        }).catch((error) => {
            return toast.error(<ErrorToast error="Erro ao tentar editar o usuário " title="Usuário" />)
        })
    };
    function formatCpfCnpj(CpfCnpj) {
        if (CpfCnpj && CpfCnpj.length === 11) {
            // Formatar CPF: 000.000.000-00
            return CpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (CpfCnpj && CpfCnpj.length === 14) {
            // Formatar CNPJ: 00.000.000/0000-00
            return CpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return CpfCnpj;
    }
    return (
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
                                    backgroundColor: "#1471f3"
                                }}
                            >
                                <Edit />
                            </Avatar>
                            <Typography
                                variant="overline"
                                className='w-100 text-center'
                                sx={{ fontSize: 20 }}
                                component="span"
                            >
                                Editar dados
                            </Typography>
                        </Typography>
                    </div>
                    <Box className="gap-1">
                        <div className='w-100 h-100 d-flex flex-column gap-3' style={{ paddingTop: '60px', maxHeight: '580px', overflowY: 'auto', mt: 0 }}>
                            <TextField
                                id="nome"
                                fullWidth
                                label="Nome"
                                variant="outlined"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                error={validationError.nome}
                                helperText={validationError.nome ? 'Nome é obrigatório' : ''}
                            />
                            <TextField
                                id="cpfCnpj"
                                fullWidth
                                label="CPF/CNPJ"
                                variant="outlined"
                                value={formatCpfCnpj(cpfCnpj)}
                                disabled
                            />
                            <div className='w-100 d-flex flex-wrap gap-1'>
                                <TextField
                                    id="email"
                                    sx={{ width: { sm: '49.5%', xs: '100%' } }}
                                    className='mx-auto'
                                    disabled
                                    value={email}
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                />
                                <TextField
                                    id="telefone"
                                    sx={{ width: { sm: '49.5%', xs: '100%' } }}
                                    className='mx-auto'
                                    fullWidth
                                    label="Telefone"
                                    variant="outlined"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    error={validationError.telefone}
                                    helperText={validationError.telefone ? 'Telefone é obrigatório' : ''}
                                />
                            </div>

                            <TextField
                                id="cep"
                                fullWidth
                                label="CEP"
                                variant="outlined"
                                value={cep}
                                onChange={handleCepChange}
                                onBlur={searchCep}
                                error={validationError.cep}
                                helperText={validationError.cep ? 'CEP é obrigatório' : ''}
                            />
                            {error && <Typography color="error">{error}</Typography>}
                            <TextField
                                id="logradouro"
                                fullWidth
                                label="Logradouro"
                                variant="outlined"
                                value={logradouro}
                                onChange={(e) => setLogradouro(e.target.value)}
                                error={validationError.logradouro}
                                helperText={validationError.logradouro ? 'Logradouro é obrigatório' : ''}
                            />
                            <div className='w-100 d-flex flex-wrap gap-1'>
                                <TextField
                                    id="numero"
                                    sx={{ width: { sm: '32.5%', xs: '100%' } }}
                                    className='mx-auto'
                                    label="Número"
                                    variant="outlined"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    error={validationError.numero}
                                    helperText={validationError.numero ? 'Número é obrigatório' : ''}
                                />
                                <TextField
                                    id="municipio"
                                    sx={{ width: { sm: '32.5%', xs: '100%' } }}
                                    className='mx-auto'
                                    label="Município"
                                    variant="outlined"
                                    value={municipio}
                                    onChange={(e) => setMunicipio(e.target.value)}
                                    error={validationError.municipio}
                                    helperText={validationError.municipio ? 'Município é obrigatório' : ''}
                                />
                                <FormControl
                                    fullWidth
                                    error={validationError.estado}
                                    sx={{ width: { sm: '32.5%', xs: '100%' } }}
                                >
                                    <InputLabel id="estado-label">Estado</InputLabel>
                                    <Select
                                        labelId="estado-label"
                                        id="estado"
                                        value={estado}
                                        sx={{
                                            maxHeight: '56px !important',
                                            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#4caf50', // Cor da borda
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#121621', // Cor da borda quando focado
                                            },

                                        }}
                                        onChange={(e) => setEstado(e.target.value)}
                                        input={<OutlinedInput label="Estado" />}
                                    >
                                        {estados.map((estado, index) => (
                                            <MenuItem key={index} value={estado.sigla}>
                                                <ListItemText primary={estado.sigla} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {validationError.estado && <Typography color="error">Estado é obrigatório</Typography>}
                                </FormControl>
                            </div>
                            <Button
                                fullWidth
                                sx={{ mt: 2, p: 1 }}
                                onClick={handleSubmit}
                                variant="contained"
                                color="primary"
                            >
                                Salvar
                            </Button>
                        </div>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
}
