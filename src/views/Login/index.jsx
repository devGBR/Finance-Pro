import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import Money from '../../assets/img/Money.png';
import './Login.scss'
import { Button, Card, CardContent, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import Logo from '../../assets/img/logo.png'
import LogoColor from '../../assets/img/logoColor.png'
import { MonetizationOnOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import ErrorToast from '../../components/toats/ErrorToast';
import LoadingToast from '../../components/toats/LoadingToast';
import SuccessToast from '../../components/toats/SucessToast';


export default function Login() {
    const [email, setEmail] = useState(null);
    document.title = "Finance Pro | Login";
    const [password, setPassword] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.info(<LoadingToast message="Iniciando login!" title="Login" />)
        await axios.post(
            'https://18.230.23.121/api/login',
            { email, password },
            { withCredentials: true } // Permitir cookies
        ).then((response) => {
            if (response.status === 200) {
                const cookies = new Cookies(null, { path: '/' })
                let user = cookies.get('user')
                toast.dismiss()
                toast.success(<SuccessToast message={`Seja bem-vindo de volta, ${user.name}!`} title="Bem vindo" />)
                navigate('/');
            }
        }).catch((error) => {
            return toast.error(<ErrorToast error="Usuário não encontrado, tente novamente!" title="Login" />)
        })
    };

    return (
        <div className='d-flex layout-login'>
            <div className='w-75 icon-space'>
                <img src={LogoColor} className='logoP' alt="" />
                <img src={Money} className='icon ' alt="" />
            </div>
            <Card className='h-100' sx={{ width: { xs: '100%', sm: '40%' }, px: 6 }} elevation={8}>
                <CardContent style={{ height: '100dvh' }}>

                    <div className='d-flex flex-column gap-4 justify-content-center h-100'>

                        <div>
                            <h3 className='roboto-bold'>
                                Bem vindo ao
                            </h3>
                            <h3 className='title-logo'>
                                <span className='text-title'>FINANCE PRO</span>
                            </h3>
                            <Typography variant="caption" className='' color="text.secondary">
                                Faça o login para continuar
                            </Typography>
                        </div>
                        <TextField fullWidth id="outlined-basic" label="Email" value={email}
                            onChange={(e) => setEmail(e.target.value)} type='Email' variant="outlined" />
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
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
                                label="Password"
                            />
                        </FormControl>
                        <Button variant="contained" onClick={handleSubmit} className='p-2'>
                            Entrar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
