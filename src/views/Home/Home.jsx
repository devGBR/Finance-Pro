import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar, Stack, CardHeader, Divider, Box, List, ListItem, ListItemAvatar, ListItemText, IconButton, Tabs, Tab, createTheme, ThemeProvider, Chip, Select, MenuItem, OutlinedInput, FormControl } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import CardInfo from '../../components/cards/CardInfo';
import { ArrowUpward, ArrowDownward, CurrencyExchange, Savings, Padding } from '@mui/icons-material';
import Chart from 'react-apexcharts';

import './Home.scss';
import moment from 'moment';
import 'moment/locale/pt-br'; // Importação do locale
import { Archive, Inbox, Plus } from 'react-feather';
import TableGestao from '../../components/TableGestao';
import { green, red, yellow } from '@mui/material/colors';
import axios from 'axios';
import Lancamentos from '../../components/cards/Lancamentos';

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


const meses = [
  { value: '01', name: 'Janeiro' },
  { value: '02', name: 'Fevereiro' },
  { value: '03', name: 'Março' },
  { value: '04', name: 'Abril' },
  { value: '05', name: 'Maio' },
  { value: '06', name: 'Junho' },
  { value: '07', name: 'Julho' },
  { value: '08', name: 'Agosto' },
  { value: '09', name: 'Setembro' },
  { value: '10', name: 'Outubro' },
  { value: '11', name: 'Novembro' },
  { value: '12', name: 'Dezembro' },
];


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

export default function Home() {
  const paginationModel = { page: 0, pageSize: 5 };
  const [tabLembretes, setTabLembretes] = React.useState(0);
  const [receita, setReceita] = useState([]);
  const [despesa, setDespesa] = useState([]);
  const [mes, setMes] = useState([]);
  const [arquivados, setArquivados] = useState([]);
  const [lembretes, setLembretes] = useState([]);
  const [investimento, setInvestimento] = useState();
  const [comparativos, setComparativos] = useState({ despesa_fixa: 0, despesa_variavel: 0, investido: 0, saldo_livre: 0 });
  const [investido, setInvestido] = useState({ total: 0, falta: 0, entrou: 0, porcentMes: 0, totalMes: 0 });
  const [saida, setSaida] = useState({ total: 0, falta: 0, saiu: 0, porcentMes: 0, totalMes: 0 });
  const [entrada, setEntrada] = useState({ total: 0, falta: 0, entrou: 0, porcentMes: 0, totalMes: 0 });
  const [saldo, setSaldo] = useState({ acumulado: 0, gasto: 0, total: 0 });
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  function a11yPropsLembretes(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const years = Array.from({ length: 8 }, (v, k) => (2023 + k).toString());
  const subheader = new Date().toLocaleDateString('pt-BR', options);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  useEffect(() => {
    console.log(mes)
    if (!mes[0]) {
      const currentMonth = new Date().getMonth() + 1;
      const formattedMonth = currentMonth.toString().padStart(2, '0');
      setMes(formattedMonth);
    }
    if (!selectedYear) {
      const currentYear = new Date().getFullYear().toString();
      setSelectedYear(currentYear);
    }

  }, [])

  useEffect(() => {
    let mes_ano = mes + '-' + selectedYear;
    console.log(mes_ano);

    axios.get(`http://127.0.0.1:8000/api/financer?mesAno=${mes_ano}`, {
      headers: {
        Authorization: "Bearer 4mdLPeK3yopx6lv8zWpaJexGqDGVYB9a7WRANMkw"
      }
    }).then((response) => {
      const {
        receitas,
        despesas,
        comparativo,
        investimentos,
        saldo_livre,
        saida,
        entrada,
        investido,
        arquivados,
        lembretes
      } = response.data;

      // Verifica se as receitas, despesas e investimentos estão vazios
      const isEmpty = !receitas.length && !despesas.length && !investimentos.length;

      // Atualiza os estados com os dados da resposta
      setReceita(isEmpty ? [] : receitas);
      setDespesa(isEmpty ? [] : despesas);
      setComparativos(isEmpty ? { despesa_fixa: 0, despesa_variavel: 0, investido: 0, saldo_livre: 0 } : comparativo);
      setInvestimento(isEmpty ? undefined : investimentos);
      setLembretes(isEmpty ? [] : lembretes);
      setArquivados(isEmpty ? [] : arquivados);
      setSaldo(isEmpty ? { acumulado: 0, gasto: 0, total: 0 } : saldo_livre);
      setSaida(isEmpty ? { total: 0, falta: 0, saiu: 0, porcentMes: 0, totalMes: 0 } : saida);
      setEntrada(isEmpty ? { total: 0, falta: 0, entrou: 0, porcentMes: 0, totalMes: 0 } : entrada);
      setInvestido(isEmpty ? { total: 0, falta: 0, entrou: 0, porcentMes: 0, totalMes: 0 } : investido);

      setLoading(false);
    }).catch((error) => {


      // Zerando todos os estados
      setReceita([]);
      setDespesa([]);
      setComparativos({ despesa_fixa: 0, despesa_variavel: 0, investido: 0, saldo_livre: 0 });
      setInvestimento(undefined);
      setInvestido({ total: 0, falta: 0, entrou: 0, porcentMes: 0, totalMes: 0 });
      setSaida({ total: 0, falta: 0, saiu: 0, porcentMes: 0, totalMes: 0 });
      setEntrada({ total: 0, falta: 0, entrou: 0, porcentMes: 0, totalMes: 0 });
      setSaldo({ acumulado: 0, gasto: 0, total: 0 });
      setLoading(false); // Certifique-se de que o loading é atualizado para false
    });

  }, [selectedYear, mes, loading]);


  const infos = [
    {
      bgIcon: '#4CAF50',
      title: 'Entrada',
      value: entrada.entrou,
      iconPorcent: entrada.porcentMes > 0 ? <ArrowUpward color='success' /> : <ArrowDownward color='error' />,
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
      iconPorcent: saida.porcentMes > 0 ? <ArrowUpward color='error' /> : <ArrowDownward color='success' />,
      icon: <ArrowDownward />,
      porcent: saida.porcentMes.toFixed(2),
      typePorcent: saida.porcentMes > 0 ? 'de aumento' : 'de diminuição',
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
      iconPorcent: investido.porcentMes > 0 ? <ArrowUpward color='success' /> : <ArrowDownward color='error' />,
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
                let totalSeries = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return totalSeries.toFixed(2) + '%';
              },
            },
          },
        },
      },
    },
    labels: ['D. Variavel', 'Investimento', 'Saldo Livre', 'D. Fixa'],
    colors: ['#635BFF', '#FFC107', '#2196f3', '#c03'],
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

  const handleMonthChange = (event) => {
    setMes(event.target.value);
  };

  const handleChangeLembretes = (event, newValue) => {
    setTabLembretes(newValue);
  };
  const lembretesPendentes = lembretes.filter(item => item.status !== 'Pago');

  return (
    <ThemeProvider theme={theme}>

      <div id="cardsViews">

        <div className='select-ano' >
          <div className='w-100 py-2 d-flex flex-wrap justify-content-end'>
            <Select
              displayEmpty
              value={mes}
              onChange={handleMonthChange}
              input={<OutlinedInput />}

              className='w-100 h-75 mx-auto text-center'
              style={{ fontFamily: 'sans-serif', fontSize: 20, maxWidth: 300 }}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>Selecione uma data</em>;
                }
                return meses.find(month => month.value === selected)?.name;
              }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem disabled value="">
                <em>Selecione um mês</em>
              </MenuItem>
              {meses.map((month) => (
                <MenuItem
                  key={month.value}
                  value={month.value}
                >
                  {month.name}
                </MenuItem>
              ))}
            </Select>
            <Select
              displayEmpty
              value={selectedYear}
              onChange={handleYearChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>Placeholder</em>;
                }
                return selected;
              }}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {years.map((year) => (
                <MenuItem
                  key={year}
                  value={year}
                >
                  {year}
                </MenuItem>
              ))}
            </Select>

          </div>
        </div>
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
          <Lancamentos receita={receita} despesa={despesa} pendentes={lembretesPendentes} investimento={investimento} set={setLoading} loading={loading} />
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
          <Card className="custom-card-table pb-0 mx-auto w-100" sx={{ maxHeight: 500, minWidth: 120, maxWidth: 300 }} elevation={1}>
            <CardHeader
              title="Lembretes"
              subheader={subheader}
              titleTypographyProps={{ variant: 'h6' }}
              subheaderTypographyProps={{ variant: 'subtitle2', color: 'textSecondary' }}
              sx={{ pb: 0 }}
            >

            </CardHeader>
            <div className='w-100 mx-4'>
              <Tabs value={tabLembretes} onChange={handleChangeLembretes} aria-label="basic tabs example">
                <Tab label="Recentes" {...a11yPropsLembretes(0)} />
                <Tab label="Arquivados" {...a11yPropsLembretes(1)} />
              </Tabs>
            </div>
            <Divider />
            <CustomTabPanel value={tabLembretes} index={0}>
              <List className='overflow-auto mt-1' sx={{ width: '100%', maxHeight: 300, maxWidth: 360, bgcolor: 'background.paper' }}>
                {lembretes.map(item => (
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
            <CustomTabPanel value={tabLembretes} index={1}>
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
