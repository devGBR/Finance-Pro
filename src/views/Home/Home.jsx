import React from 'react';
import { Card, CardContent, Typography, Avatar, Stack, CardHeader, Divider, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import CardInfo from '../../components/cards/CardInfo';
import { ArrowUpward, ArrowDownward, CurrencyExchange, Savings } from '@mui/icons-material';
import Chart from 'react-apexcharts';

import './Home.scss';
import moment from 'moment';
import 'moment/locale/pt-br'; // Importação do locale

// Defina o locale para português
moment.locale('pt-br');


const infos = [
  {
    bgIcon: '#4CAF50',
    title: 'Entrada',
    value: 24000,
    iconPorcent: <ArrowUpward color='success' />,
    icon: <ArrowUpward />,
    porcent: '12',
    typePorcent: 'de aumento',
    typePrev: 'Falta',
    prev: 12000,
    total: 36000
  },
  {
    bgIcon: '#F44336',
    title: 'Saídas',
    value: 120,
    iconPorcent: <ArrowDownward color='error' />,
    icon: <ArrowDownward />,
    porcent: '8',
    typePorcent: 'de diminuição',
    typePrev: 'Falta',
    prev: 12,
    total: 24
  },
  {
    bgIcon: '#FFC107',
    title: 'Investimentos',
    value: 5,
    iconPorcent: <ArrowUpward color='success' />,
    icon: <Savings />,
    porcent: '15',
    typePorcent: 'de aumento',
    typePrev: 'Previsto',
    prev: 12,
    total: 18
  },
  {
    bgIcon: '#2196F3',
    title: 'Saldo Livre',
    value: 18,
    iconPorcent: <ArrowUpward color='success' />,
    icon: <Savings />,
    porcent: '20',
    typePorcent: 'de aumento',
    typePrev: 'Previsto',
    prev: 12,
    total: 30
  }
];

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];
const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
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
          total: {
            show: true,
            label: 'Total',
            formatter: () => '100%',
          },
        },
      },
    },
  },
  labels: ['Desktop', 'Tablet', 'Phone'],
  colors: ['#635BFF', '#15B79F', '#FB9C0C'],
  legend: {
    show: false,
  },
};

const series = [63, 15, 22];

export default function Home() {
  console.log(moment().utc());

const paginationModel = { page: 0, pageSize: 5 };
  return (
    <div id="cardsViews">
      <Stack direction="row" spacing={2}>
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
          />
        ))}
      </Stack>
      <Stack direction="row" className='my-4 gap-2'>
        <Card className="custom-card-table w-75 pb-0 mx-auto" elevation={1}>
          <div style={{ height: 360, width: '100%', overflow: 'auto' }}> {/* Contêiner para permitir a rolagem */}
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{ border: 0 }} // Remove a borda
            />
          </div>
        </Card>
        <Card className="custom-card-table w-25 pb-0 mx-auto" elevation={1}>
          <CardHeader
            title="Gastos"
            subheader={moment().format('MMMM YYYY')}
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
              <Chart options={chartOptions} series={series} type="donut" height={600} width={300} />
            </Box>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Traffic split by device type
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>
      <Stack direction="row" className='my-4 gap-2'>
        <Card className="custom-card-table w-25 pb-0 mx-auto" elevation={1}>

        </Card>
        <Card className="custom-card-table w-75 pb-0 mx-auto" sx={{ minHeight: 400 }} elevation={1}>
        </Card>

      </Stack>

    </div>

  );
}
