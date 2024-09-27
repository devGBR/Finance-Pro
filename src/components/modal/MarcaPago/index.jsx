import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader, Row, Button } from 'reactstrap';
import './Marcapago.scss';
import { Checkbox, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, FormControl, Chip, Box } from '@mui/material';
import { Check, Send, X } from 'react-feather';

export default function MarcaPago(props) {
    const [informarReceita, setInformarReceita] = useState(false);
    const [receitasSelecionadas, setReceitasSelecionadas] = useState([]);

    useEffect(() =>{
        setInformarReceita(false)
        setReceitasSelecionadas([])
    }, [props.open])

    const receitas = props.receita

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

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setReceitasSelecionadas(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleConfirmar = () => {
        console.log('Pagamento confirmado');
        console.log('Receitas selecionadas:', receitasSelecionadas);
        props.click(); // Fecha o modal após a confirmação
        setReceitasSelecionadas([]); // Limpa as receitas selecionadas
    };

    return (
        <Modal
            isOpen={props.open}
            toggle={props.click}
            centered
            style={{ zIndex: 1200 }}
        >
            <ModalHeader className="d-flex justify-content-center">
                <h2>Atualizar {props.type}</h2>
            </ModalHeader>
            <ModalBody className="d-flex flex-column align-items-center">
                {!informarReceita ? (
                    <>
                        <Row className="w-100 text-center mb-3">
                            <p>
                                Deseja informar qual receita pagou este {props.type}?
                            </p>
                        </Row>
                        <div className="w-100 mb-3 d-flex gap-3">
                            <Button
                                color="success"
                                onClick={() => setInformarReceita(true)}
                                className="w-50"
                            >
                                Sim <Check />
                            </Button>
                            <Button
                                color="success"
                                onClick={handleConfirmar}
                                className="w-75"
                            >
                                Apenas confirmar <Send />
                            </Button>
                        </div>
                    </>
                ) : (
                    <Row className="w-100 mb-3">
                        <FormControl fullWidth>
                            <InputLabel color="#121621" id="demo-multiple-checkbox-label">Selecione as Receitas:</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={receitasSelecionadas}
                                onChange={handleChange}
                                input={<OutlinedInput label="Selecione as Receitas" />}
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
                                            const receita = receitas.find(r => r.id === id);
                                            return receita ? (
                                                <Chip key={receita.id} label={`${receita.nome} - R$ ${receita.valor_total}`} />
                                            ) : null;
                                        })}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {receitas.map((receita) => (
                                    <MenuItem key={receita.id} value={receita.id}>
                                        <Checkbox checked={receitasSelecionadas.includes(receita.id)} />
                                        <ListItemText primary={`${receita.nome} - R$ ${receita.valor_total}`} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className="w-100 d-flex mt-4 gap-3">
                            <Button
                                color="danger"
                                onClick={() => setInformarReceita(false)}
                                className="w-50"
                            >
                                Cancelar <X />
                            </Button>
                            <Button
                                color="success"
                                onClick={handleConfirmar}
                                className="w-75"
                            >
                                Confirmar <Send />
                            </Button>
                        </div>
                    </Row>
                )}
            </ModalBody>
        </Modal>
    );
}
