import { MoreVert } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  IconButton,
  Button,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import { blueGrey, red } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Edit } from 'react-feather';
import EditUser from '../../components/modal/EditUser';
import api from '../../services/api';
import { toast } from 'react-toastify';
import ErrorToast from '../../components/toats/ErrorToast';
import LoadingToast from '../../components/toats/LoadingToast';
import SuccessToast from '../../components/toats/SucessToast';
document.title = "Finance Pro | Configs";

export default function Settings(props) {
  const cookie = new Cookies
  const [userData, setUserData] = useState(cookie.get('user'))
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [openModalEditUser, setOpenModalEditUser] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState('');

  const handleChangePassword = () => {
    if (password.length < 8) {
      return toast.error(<ErrorToast error="A senha deve conter no mínimo 8 caracteres." title="Usuário" />)

    }
    if (password !== confirmPass) {
      return toast.error(<ErrorToast error="Senhas não conferem" title="Usuário" />)
    }
    toast.info(<LoadingToast message="Atualizando a senha!" title="Usuário" />)
    api.post(`/user/${userData.id}/update/password`, {
      password: password,
      confirmPass: confirmPass
    }).then((response) => {
      if (response.status) {
        toast.success(<SuccessToast message={`Senha atualizada com sucesso`} title="Usuário" />)
        setPassword('');
        setConfirmPass('');
      }
    }).catch((error) => {
      return toast.error(<ErrorToast error="Erro ao tentar atualizar a senha" title="Usuário" />)
    })

  };

  useEffect(() => {
    if (loadingUser === true) {
      api.get(`/user/${userData.id}/read`).then(
        (response) => {
          if (response.status === 200) {
            setUserData(response.data.data)
            setLoadingUser(false)
          }
        }
      )
    }
  }, [loadingUser])


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  function formatCpfCnpj(CpfCnpj) {
    if (CpfCnpj && CpfCnpj.length === 11) {
      return CpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (CpfCnpj && CpfCnpj.length === 14) {
      return CpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return CpfCnpj;

  }
  function formatCep(cep) {
    if (cep && cep.length === 8) {
      return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

  }
  function formatTel(tel) {
    if (tel && tel.length === 11) {
      return tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

  }

  return (
    <div className='d-flex flex-column gap-5'>
      <EditUser open={openModalEditUser} user={userData} setLoad={setLoadingUser} click={() => setOpenModalEditUser(!openModalEditUser)} />
      <Card elevation={2}>
        <CardHeader
          title="Detalhes do Usuário"
          action={
            <IconButton onClick={(e) => setOpenModalEditUser(!openModalEditUser)} aria-label="settings">
              <Edit />
            </IconButton>
          }
        />
        <Divider variant="middle" sx={{ backgroundColor: "#434a60" }} />
        <CardContent className='d-flex flex-wrap gap-3' sx={{ justifyContent: { xs: "center", sm: "start" } }}>
          <Avatar sx={{ width: 150, height: 150, bgcolor: blueGrey[900] }} variant="rounded">
            {userData.nome.charAt(0)} {/* Exibe a primeira letra do nome como avatar */}
          </Avatar>
          <Divider variant="middle" flexItem orientation="vertical" sx={{ display: { xs: 'none', sm: "flex" } }} />
          <Box className='d-flex flex-wrap' sx={{ width: {sm: "75%", xs: "100%"} }}>
            <div className='d-flex flex-column' style={{ minWidth: 200, width: '100%', maxWidth: 300 }}>
              <Typography variant="h6" >Dados pessoais</Typography>
              <Divider variant="" sx={{ backgroundColor: "#434a60", marginBottom: 1 }} />
              <div className='d-flex flex-column gap-1 mt-1'>
                <Typography variant="" className='d-flex gap-1 me-3 '><strong>Nome:</strong> {userData.nome}</Typography>
                <Divider variant="" className='me-3' sx={{ backgroundColor: "#434a60" }} />
                <Typography variant="" className='d-flex gap-1 me-3'><strong>Email:</strong> {userData.email}</Typography>
                <Divider variant="" className='me-3' sx={{ backgroundColor: "#434a60" }} />
                <Typography variant="" className='d-flex gap-1 me-3'><strong>Telefone:</strong> {formatTel(userData.telefone)}</Typography>
                <Divider variant="" className='me-3' sx={{ backgroundColor: "#434a60" }} />
                <Typography variant="" className='d-flex gap-1 me-3'><strong>CPF/CNPJ:</strong> {formatCpfCnpj(userData.cpf_cnpj)}</Typography>
                <Divider variant="" className='me-3' sx={{ backgroundColor: "#434a60" }} />
                <Typography variant="" className='d-flex gap-1 me-3'><strong>Perfil:</strong> {userData.perfil}</Typography>
              </div>
            </div>
            <div className='d-flex flex-column ' style={{ minWidth: 200, width: '100%', maxWidth: 300 }} >
              <Typography variant="h6" sx={{ mt: { xs: 2, sm: 0 } }} >Endereço</Typography>
              <Divider variant="" sx={{ backgroundColor: "#434a60", marginBottom: 1 }} />
              <div className='d-flex flex-column gap-1 mt-1'>
                <Typography variant="" className='d-flex gap-1'><strong>Logradouro:</strong> {`${userData.logradouro}, ${userData.numero} `}</Typography>
                <Divider variant="" sx={{ backgroundColor: "#434a60" }} />
                <Typography variant="" className='d-flex gap-1'><strong>Bairro:</strong> {userData.bairro}</Typography>
                <Divider variant="" sx={{ backgroundColor: "#434a60" }} />
                <Typography variant="" className='d-flex gap-1'><strong>CEP:</strong> {(formatCep(userData.cep))}</Typography>
                <Divider variant="" sx={{ backgroundColor: "#434a60" }} />
                <Typography variant="" className='d-flex gap-1'><strong>Município:</strong> {userData.municipio}</Typography>
                <Divider variant="" sx={{ backgroundColor: "#434a60" }} />
                <Typography variant="" className='d-flex gap-1'><strong>Estado:</strong> {userData.estado}</Typography>
              </div>
            </div>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Senha de acesso" />
        <Divider className="" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Nova senha</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Nova senha"
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Confirme a senha</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirme a senha"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                O campo senha deve conter no mínimo 8 caracteres.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleChangePassword}
              >
                Salvar
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setPassword('');
                  setConfirmPass('');
                  setError('');
                }}
                style={{ marginLeft: '10px' }}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
