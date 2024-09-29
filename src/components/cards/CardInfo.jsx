import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material'
import React from 'react'

export default function cardInfo(props) {
    let value = props.value
    return (
        <Card className="custom-card" elevation={1}>
            <CardContent className='pb-0'>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack>
                        <Typography variant="overline" component="span">
                            {props.title}
                        </Typography>
                        <Typography variant={value.toString().length >= 3 ? "h5" : "h4"} component={value.toString().length >= 4 ? "h5" : "h4"}>
                              {parseFloat(props.value).toLocaleString("pt-br", { minimumFractionDigits: 2, style: "currency", currency: "BRL" })} 
                        </Typography>
                    </Stack>
                    <Avatar className="custom-avatar" style={{ backgroundColor: props.bgIcon }}>
                        {props.icon}
                    </Avatar>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} className="percentage-change">
                    {props.porcent && <> {props.iconPorcent}
                    <Typography variant="body2" color="text.primary">{props.porcent}%</Typography>
                    <Typography variant="caption" color="text.secondary">
                       {props.typePorcent}
                    </Typography></>}
                </Stack>
                <div className='d-flex flex-column mt-2'>
                    <Typography variant="caption" className='' color="text.secondary">
                        {props.typePrev}: <strong> {parseFloat(props.prev).toLocaleString("pt-br", { minimumFractionDigits: 2, style: "currency", currency: "BRL" })} </strong>
                    </Typography>
                    <Typography variant="caption" className='' color="text.secondary">
                        {props.typePrev === 'Gasto' ? 'Acumulado' : "Total"}: <strong> {parseFloat(props.total).toLocaleString("pt-br", { minimumFractionDigits: 2, style: "currency", currency: "BRL" })} </strong>
                    </Typography>
                </div>

            </CardContent>
        </Card>
    )
}
