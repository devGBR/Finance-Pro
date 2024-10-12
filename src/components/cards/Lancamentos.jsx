import { Box, Card, CardHeader, IconButton, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react'
import { Plus } from 'react-feather';
import TableGestao from '../TableGestao';
import moment from 'moment';
import NewLancamento from '../modal/modalNewLancamento';

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

const options = { month: 'long', year: 'numeric' };

export default function Lancamentos(props) {
  const [value, setValue] = useState(0);
  const subheader = new Date(props.dataAtual).toLocaleDateString('pt-BR', options);
  const [openModalNewLancamento, setOpenModalNewLancamento] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

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
  const getButtonBackgroundColor = () => {
    switch (value) {
      case 0:
        return 'success.main'; // Cor para Receitas
      case 1:
        return 'error.main'; // Cor para Despesas
      case 2:
        return 'warning.dark'; // Cor para Investimentos
      default:
        return 'default'; // Cor padrão
    }
  };
  function NovoLancamento() {
    setOpenModalNewLancamento(!openModalNewLancamento)
  }
  const investimentos_all = props.investimento_all
  return (
    <Card className="custom-card-table w-100 pb-0  mx-auto" elevation={1}>
      <NewLancamento
       
        style={{maxHeight: '90dvh'}}
        open={openModalNewLancamento}
        click={() => setOpenModalNewLancamento(!openModalNewLancamento)}
        monit={value === 0 ? props.pendentes : value === 1 ? props.receita : props.receita}
        investimentos={value === 2 ?  investimentos_all : []}
        type={value === 0 ? 'Receita' : value === 1 ? 'Despesa' : 'Investimento'}
        loading={props.set}
      />

      <CardHeader
        title="Lançamentos"
        subheader={subheader}
        action={
          <IconButton
            edge="end"
            aria-label="novo lançamento"
            className='buttonIcon'
            onClick={NovoLancamento}
            sx={{ backgroundColor: getButtonBackgroundColor() }}
          >
            <Plus />
          </IconButton>
        }
        titleTypographyProps={{ variant: 'h6' }}
        subheaderTypographyProps={{ variant: 'subtitle2', color: 'textSecondary' }}
        sx={{ pb: 0 }}
      >

      </CardHeader>
      <div className='w-100'>
        <Tabs value={value} textColor="inherit" onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Receitas" sx={{ color: value === 0 && 'success.main' }} {...a11yProps(0)} />
          <Tab label="Despesas" sx={{ color: value === 1 && 'error.main' }}  {...a11yProps(1)} />
          <Tab label="Investimentos" sx={{ color: value === 2 && 'warning.dark' }}  {...a11yProps(1)} />
        </Tabs>
      </div>
      <CustomTabPanel value={value} index={0}>
        <div style={{ height: 300, width: '100%', overflow: 'auto' }}>
          <TableGestao column={columnReceita} data={props.receita} type="receita" loading={props.loading}  set={props.set} />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div style={{ height: 300, width: '100%', overflow: 'auto' }}>
          <TableGestao column={columnDespesa} data={props.despesa} receita={props.receita} type="despesa" loading={props.loading}  set={props.set} />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <div style={{ height: 300, width: '100%', overflow: 'auto' }}>
          <TableGestao column={columnInvestimento} data={props.investimento} loading={props.loading} type="investido"  set={props.set} />
        </div>
      </CustomTabPanel>
    </Card>
  )
}
