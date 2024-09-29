import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar, Stack, CardHeader, Divider, Box, List, ListItem, ListItemAvatar, ListItemText, IconButton, Tabs, Tab, createTheme, ThemeProvider, Chip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import CardInfo from '../../components/cards/CardInfo';
import { ArrowUpward, ArrowDownward, CurrencyExchange, Savings, Padding } from '@mui/icons-material';
import Chart from 'react-apexcharts';

import './Home.scss';
import moment from 'moment';
import 'moment/locale/pt-br'; // Importação do locale
import { Archive, Inbox } from 'react-feather';
import TableGestao from '../../components/TableGestao';
import { green, red, yellow } from '@mui/material/colors';
import axios from 'axios';

// Defina o locale para português
moment.locale('pt-br');

const theme = createTheme({
  palette: {
    success: green,
    error: red,
    warning: yellow
  },
});

const options = { month: 'long', year: 'numeric' };
const subheader = new Date().toLocaleDateString('pt-BR', options);



const items = [
  {
    id: 1,
    title: 'Soja & Co. Eucalyptus',
    date: 'Updated Mar 8, 2024',
    imgSrc: '/assets/product-5.png'
  },
  {
    id: 2,
    title: 'Necessaire Body Lotion',
    date: 'Updated Mar 8, 2024',
    imgSrc: '/assets/product-4.png'
  },
  {
    id: 3,
    title: 'Ritual of Sakura',
    date: 'Updated Mar 8, 2024',
    imgSrc: '/assets/product-3.png'
  },
  {
    id: 4,
    title: 'Lancome Rouge',
    date: 'Updated Mar 8, 2024',
    imgSrc: '/assets/product-2.png'
  },
  {
    id: 5,
    title: 'Erbology Aloe Vera',
    date: 'Updated Mar 8, 2024',
    imgSrc: '/assets/product-1.png'
  },
];

const columnReceita = [

  { id: 'nome', label: 'Receita', minWidth: 100 },
  { id: 'valor', label: 'Valor', minWidth: 100, format: (value) => value.toLocaleString('pt-br', { minimumFractionDigits: 2, style: "currency", currency: "BRL" }), },
  { id: 'recebido', label: 'Recebido', minWidth: 100, format: (value) => value.toLocaleString('pt-br') },
  { id: 'status', label: 'Status', minWidth: 100, format: (value) => value.toLocaleString('pt-br') },
  { id: 'usado', label: 'Usado  para', minWidth: 100 },
  { id: 'total', label: 'Total', minWidth: 100, format: (value) => value.toLocaleString('pt-br', { minimumFractionDigits: 2, style: "currency", currency: "BRL" }) },
  { id: 'acao', label: 'Ações', minWidth: 100 },
]
const columnDespesa = [
  { id: 'nome', label: 'Despesa', minWidth: 100 },
  { id: 'valor', label: 'Valor', maxWidth: 50, format: (value) => value.toLocaleString('pt-br', { minimumFractionDigits: 2, style: "currency", currency: "BRL" }) },
  { id: 'status', label: 'Status', maxWidth: 40 },
  { id: 'total', label: 'Total', minWidth: 100, format: (value) => value.toLocaleString('pt-br', { minimumFractionDigits: 2, style: "currency", currency: "BRL" }) },
  { id: 'acao', label: 'Ações', minWidth: 100 },
  {
    secondaryColumns: [
      { id: 'pagamento', label: 'Pago com', minWidth: 100, format: (value) => value.toLocaleString('pt-br') },
      { id: 'vencimento', label: 'Data de vencimento', minWidth: 100, format: (value) => value.toLocaleString('pt-br') },
      { id: 'categoria', label: 'Categoria', minWidth: 100, format: (value) => value.toLocaleString('pt-br') },
    ]
  },
]
const columnInvestimento = [

  { id: 'nome', label: 'Investimento', minWidth: 50 },
  { id: 'valor', label: 'Valor', minWidth: 50, format: (value) => value.toLocaleString('pt-br', { minimumFractionDigits: 2, style: "currency", currency: "BRL" }) },
  { id: 'status', label: 'Status', minWidth: 50, format: (value) => value.toLocaleString('pt-br') },
  { id: 'rendimento', label: 'Anual', minWidth: 50, format: (value) => value + '%' },
  { id: 'total_ano', label: 'Total anual', minWidth: 100, format: (value) => value.toLocaleString('pt-br', { minimumFractionDigits: 2, style: "currency", currency: "BRL" }) },
  { id: 'total', label: 'Total', minWidth: 50, format: (value) => value.toLocaleString('pt-br', { minimumFractionDigits: 2, style: "currency", currency: "BRL" }) },
  { id: 'acao', label: 'Ações', minWidth: 10 },
  {
    secondaryColumns: [
      { id: 'data_investimento', label: 'Data Investimento', minWidth: 100 },
      { id: 'pagamento', label: 'Pago com', minWidth: 100, format: (value) => value.toLocaleString('pt-br') },
    ]
  },
]






export default function Home() {
  const paginationModel = { page: 0, pageSize: 5 };
  const [value, setValue] = React.useState(0);
  const [receita, setReceita] = useState([]);
  const [despesa, setDespesa] = useState([]);
  const [arquivados, setArquivados] = useState([]);
  const [investimento, setInvestimento] = useState();
  const [comparativos, setComparativos] = useState({ despesa_fixa: 0, despesa_variavel: 0, investido: 0, saldo_livre: 0 });
  const [investido, setInvestido] = useState({total: 0, falta: 0, entrou: 0, porcentMes: 0, totalMes: 0});
  const [saida, setSaida] = useState({total: 0, falta: 0, saiu: 0, porcentMes: 0, totalMes: 0});
  const [entrada, setEntrada] = useState({total: 0, falta: 0, entrou: 0, porcentMes: 0, totalMes: 0});
  const [saldo, setSaldo] = useState({acumulado: 0,  gasto : 0,  total: 0});
  const [loading, setLoading] = useState(true);
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/financer", {
      headers: {
        Authorization: "Bearer 4mdLPeK3yopx6lv8zWpaJexGqDGVYB9a7WRANMkw"
      }
    }).then((response) => {
      const { receitas, despesas, comparativo, investimentos, saldo_livre, saida, entrada, investido } = response.data;
      setReceita(receitas)
      setDespesa(despesas)
      setComparativos(comparativo)
      setInvestimento(investimentos)
      setSaldo(saldo_livre)
      setSaida(saida)
      setEntrada(entrada)
      setInvestido(investido)
      setLoading(false)
    }).catch((error) => {
      console.log(error)
    })
  }, [])

  const infos = [
    {
      bgIcon: '#4CAF50',
      title: 'Entrada',
      value: entrada.entrou,
      iconPorcent: entrada.porcentMes > 0 ?  <ArrowUpward color='success' /> : <ArrowDownward color='error' />,
      icon: <ArrowUpward />,
      porcent: entrada.porcentMes.toFixed(2),
      typePorcent: entrada.porcentMes > 0 ? 'de aumento' : 'de diminuição',
      typePrev: 'Falta',
      prev: entrada.falta,
      total: entrada.total,
      total_mes: entrada.totalMes,
      mes_anti: true
    },
    {
      bgIcon: '#F44336',
      title: 'Saídas',
      value: saida.saiu,
      iconPorcent: saida.porcentMes > 0 ?  <ArrowUpward color='success' /> : <ArrowDownward color='error' />,
      icon: <ArrowDownward />,
      porcent: saida.porcentMes.toFixed(2),
      typePorcent:  saida.porcentMes > 0 ? 'de aumento' : 'de diminuição',
      typePrev: 'Falta',
      prev: saida.falta,
      total: saida.total,
      total_mes: saida.totalMes,
      mes_anti: true
    },
    {
      bgIcon: '#FFC107',
      title: 'Investido',
      value: investido.entrou,
      iconPorcent: investido.porcentMes > 0 ?  <ArrowUpward color='success' /> : <ArrowDownward color='error' />,
      icon: <Savings />,
      porcent: investido.porcentMes.toFixed(2),
      typePorcent: investido.porcentMes > 0 ? 'de aumento' : 'de diminuição',
      typePrev: 'Previsto',
      prev: investido.falta,
      total: investido.total,
      total_mes: investido.totalMes,
      mes_anti: true
    },
    {
      bgIcon: '#2196F3',
      title: 'Saldo Total',
      value: saldo.total,
      icon: <Savings />,
      typePrev: 'Gasto',
      prev: saldo.gasto,
      total: saldo.acumulado,
      mes_anti: false
    }
  ];

  const chartOptions = {
    chart: {
      type: 'donut',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            value: {
              show: true,
              formatter: function (val) {
                console.log(val)
                return val + '%';
              }
            },
            total: {
              show: true,
              label: 'Total',
              formatter: function (w) {

                return '100' + '%';
              },
            },
          },
        },
      },
    },
    labels: ['D. Variavel', 'Investimento', 'Saldo Livre', 'D. Fixa'],
    colors: ['#635BFF', '#15B79F', '#FB9C0C', '#c03'],
    legend: {
      show: true,
      position: 'bottom'
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + '%'; // Adiciona o símbolo de porcentagem no tooltip
        }
      }
    }
  };


  const series = [parseFloat(comparativos.despesa_variavel),
  parseFloat(comparativos.investido),
  parseFloat(comparativos.saldo_livre),
  parseFloat(comparativos.despesa_fixa)];


  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 0, pt: 0 }}>{children}</Box>}
      </div>
    );
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <ThemeProvider theme={theme}>

      <div id="cardsViews">
        <Stack direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }}>
          {infos.map((info, index) => (
            <CardInfo
              key={index}
              bgIcon={info.bgIcon}
              title={info.title}
              value={info.value}
              iconPorcent={info.iconPorcent}
              icon={info.icon}
              porcent={info.porcent}
              typePorcent={info.typePorcent}
              typePrev={info.typePrev}
              prev={info.prev}
              total={info.total}
              mes_anti={info.mes_anti}
              total_mes={info.total_mes}
            />
          ))}
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }} className='my-4 gap-2'>
          <Card className="custom-card-table w-100 pb-0  mx-auto" elevation={1}>
            <CardHeader
              title="Lançamentos"
              subheader={subheader}
              titleTypographyProps={{ variant: 'h6' }}
              subheaderTypographyProps={{ variant: 'subtitle2', color: 'textSecondary' }}
              sx={{ pb: 0 }}
            />
            <div className='w-100'>
              <Tabs value={value} textColor="inherit" onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Receitas" sx={{ color: value === 0 && 'success.main' }} {...a11yProps(0)} />
                <Tab label="Despesas" sx={{ color: value === 1 && 'error.main' }}  {...a11yProps(1)} />
                <Tab label="Investimentos" sx={{ color: value === 2 && 'warning.dark' }}  {...a11yProps(1)} />
              </Tabs>
            </div>
            <CustomTabPanel value={value} index={0}>
              <div style={{ height: 300, width: '100%', overflow: 'auto' }}>
                <TableGestao column={columnReceita} data={receita} type="receita" loading={loading} />
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <div style={{ height: 300, width: '100%', overflow: 'auto' }}>
                <TableGestao column={columnDespesa} data={despesa} receita={receita} type="despesa" loading={loading} />
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <div style={{ height: 300, width: '100%', overflow: 'auto' }}>
                <TableGestao column={columnInvestimento} data={investimento} type="investido" />
              </div>
            </CustomTabPanel>
          </Card>
          <Card className="custom-card-table  pb-0 mx-auto" sx={{
            width: { xs: '100%', sm: '30%' }
          }} elevation={1}>
            <CardHeader
              title="Comparativo"
              subheader={subheader}
              titleTypographyProps={{ variant: 'h6' }}
              subheaderTypographyProps={{ variant: 'subtitle2', color: 'textSecondary' }}
              sx={{ pb: 0 }}
            />
            <Divider />
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 250,
                }}
              >
                <Chart options={chartOptions} series={series} type="donut" height={600} width={250} />
              </Box>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="textSecondary">

                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }} className='my-4 gap-2'>
          <Card className="custom-card-table pb-0 mx-auto" sx={{ maxHeight: 500, minWidth: 120, width: 430 }} elevation={1}>
            <CardHeader
              title="Lembretes"
              subheader={subheader}
              titleTypographyProps={{ variant: 'h6' }}
              subheaderTypographyProps={{ variant: 'subtitle2', color: 'textSecondary' }}
              sx={{ pb: 0 }}
            >

            </CardHeader>
            <div className='w-75 mx-4'>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Recentes" {...a11yProps(0)} />
                <Tab label="Arquivados" {...a11yProps(1)} />
              </Tabs>
            </div>
            <Divider />
            <CustomTabPanel value={value} index={0}>
              <List className='overflow-auto mt-1' sx={{ width: '100%', maxHeight: 300, maxWidth: 360, bgcolor: 'background.paper' }}>
                {despesa.filter((item) => item.status === 'Pendente').map(item => (
                  <ListItem key={item.id} divider>
                    <ListItemAvatar>
                      <Avatar src={item.imgSrc} alt={item.nome} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="subtitle1" sx={{ textDecoration: item.status === "Pago" ? 'line-through' : 'none' }}>{item.nome}</Typography>}
                      secondary={<Typography variant="body2" color="textSecondary">{item.data_vencimento}</Typography>}
                    />
                    <IconButton edge="end" aria-label="options">
                      <Inbox size={18} color='green' />
                    </IconButton>
                  </ListItem>
                ))}

              </List>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <List className='overflow-auto mt-1' sx={{ width: '100%', maxHeight: 300, maxWidth: 360, bgcolor: 'background.paper' }}>
                {arquivados && arquivados.length > 0 ? (
                  arquivados.map(item => (
                    <ListItem key={item.id} divider>
                      <ListItemAvatar>
                        <Avatar src={item.imgSrc} alt={item.title} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="subtitle1" sx={{ textDecoration: 'line-through' }}>{item.title}</Typography>}
                        secondary={<Typography variant="body2" color="textSecondary">{item.date}</Typography>}
                      />
                      <IconButton edge="end" aria-label="options">
                        <Inbox size={18} color='green' />
                      </IconButton>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" className='text-center' color="textSecondary">Nenhum item arquivado.</Typography>
                )}


              </List>
            </CustomTabPanel>
          </Card>
          <Card className="custom-card-table w-100 pb-0 mx-auto" sx={{ minHeight: 400 }} elevation={1}>
          </Card>

        </Stack>

      </div>
    </ThemeProvider>
  );
}
