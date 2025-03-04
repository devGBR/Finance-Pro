import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from 'react-feather/dist/icons/menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { CssBaseline, Divider, Drawer, FormControl, List, ListItem, ListItemButton, ListItemIcon, ListItemText, OutlinedInput, Select, styled } from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import WalletIcon from '@mui/icons-material/WalletOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import logo from "../assets/img/logo.png"
import { blueGrey, deepOrange } from '@mui/material/colors';
import { Settings } from 'react-feather';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ExitToApp } from '@mui/icons-material';
import Cookies from 'universal-cookie';

const drawerWidth = 260;

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    marginLeft: 0,
                },
            },
        ],
    }),
);
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function Layout({ children }) {
    const { window } = children;
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const cookies = new Cookies;
    const user = cookies.get('user')

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const location = useLocation();


    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    function handleLogout(){
       
        let userCookie = cookies.get('user')
        if(userCookie){
            cookies.remove('user')
            cookies.remove('api_token')
            return;
        }
    }

    const items = [{ title: 'Finanças', icon: location.pathname === '/' ? <MonetizationOnIcon /> : <MonetizationOnOutlinedIcon />, link: '/' },
    // { title: 'Entradas', icon: location.pathname === '/entradas' ? <AccountBalanceWalletIcon /> : <AccountBalanceWalletOutlinedIcon />, link: '/entradas' },
    // { title: 'Saidas', icon: location.pathname === '/saidas' ? <WalletIcon /> : <WalletOutlinedIcon />, link: '/saidas' },
    { title: 'Configurações', icon: location.pathname === '/config' ? <SettingsIcon /> : <Settings />, link: '/config' }]

    const drawer = (
        <div>
            <Toolbar>
                <img src={logo} className='text-center' style={{ width: '50px' }} alt="" /> <Typography className='mx-2' ><strong>FINANCE PRO</strong></Typography>
            </Toolbar>
            <Divider sx={{ backgroundColor: "#434a60" }} />
            <List>
                {items.map((item, index) => (
                    <ListItem key={item.title}>
                        <ListItemButton to={item.link} sx={[
                            {
                                borderRadius: 12,
                                minHeight: 48,
                                px: 2.5,
                                ...(location.pathname === item.link && {
                                    backgroundColor: 'white',
                                    color: 'black',
                                }),
                                transition: 'none',

                                '&:focus, &:active': {
                                    backgroundColor: '#00b2fc9c',
                                },
                                '&:hover': {
                                    backgroundColor: '#00b2fc9c',
                                    color: '#FAFAFA'
                                },
                            },
                            open
                                ? {
                                    justifyContent: 'initial',
                                }
                                : {
                                    justifyContent: 'center',
                                },
                        ]}>
                            <ListItemIcon sx={{
                                ...(location.pathname === item.link ? {

                                    color: 'black',
                                } : {
                                    color: 'white',
                                }),
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    </ListItem>
                ))}

            </List>
            <Divider variant='middle' sx={{ backgroundColor: "#FAFAFA" }} />
            <ListItem>
                    <ListItemButton to={'/'} onClick={handleLogout} sx={[
                        {
                            borderRadius: 12,
                            minHeight: 48,
                            px: 2.5,
                            transition: 'none',

                            '&:focus, &:active': {
                                backgroundColor: '#00b2fc9c',
                            },
                            '&:hover': {
                                backgroundColor: '#00b2fc9c',
                                color: '#FAFAFA'
                            },
                        },
                        open
                            ? {
                                justifyContent: 'initial',
                            }
                            : {
                                justifyContent: 'center',
                            },
                    ]}>
                        <ListItemIcon sx={{
                            color: 'white',
                        }}>
                            <ExitToApp />
                        </ListItemIcon>
                        <ListItemText primary={'Sair'} />
                    </ListItemButton>
                </ListItem>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{
              backgroundImage: 'linear-gradient(46deg,#1f2b6e, #1471f3)',
              color: 'white',
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}>
                <Container maxWidth="xl">
                    <Toolbar className='d-flex  align-center gap-3 ' disableGutters>

                        <div className='me-auto'>

                            <IconButton
                                color="black"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: 'none' } }}
                            >
                                <Menu />
                            </IconButton>
                        </div>

                        <IconButton component={Link} to="/config" className='text-white' aria-label="Configurações">
                            <Settings />
                        </IconButton>
                        <Avatar
                            sx={{ bgcolor: blueGrey[900] }}
                            alt={user.nome}
                            src="/broken-image.jpg"
                        />

                    </Toolbar>
                </Container>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundImage: 'linear-gradient(46deg, #1471f3, #1f2b6e)', color: "#FAFAFA" },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,  backgroundImage: 'linear-gradient(46deg, #1471f3, #1f2b6e)', color: "#FAFAFA" },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>

    )
}
