import { FormControlLabel, Grid, Switch, TextField, Typography, withStyles } from '@material-ui/core'
import React from 'react'
import { currencyMask, percentageMask, removeMask } from '../../utils/mask'

const FormECommerce = ({data, setData}) => {
    const GreenSwitch = withStyles({
        switchBase: {
          '&$checked': {
            color: '#9ACD32',
          },
          '&$checked + $track': {
            backgroundColor: '#9ACD32',
          },
        },
        checked: {},
        track: {},
      })(Switch);
    const handleChangeOpposite = (e, opposite) => {
        const tmpData = {...data};
        tmpData[e.target.name] = removeMask(e.target.value);
        tmpData[opposite] = 0;
        setData(tmpData);
    }
    return (
        <>
            <Grid item md={2} xs={12}>
                <FormControlLabel
                    label='Cobrar do cliente'
                    name='cashless'
                    value={data.chargeClient}
                    control={<GreenSwitch checked={data.chargeClient} onChange={(e) => setData({...data, chargeClient: e.target.checked})} />}
                />
            </Grid>
            <Grid item md={2} xs={12}>
                <FormControlLabel
                    label='Taxa administrativa'
                    name='adminTax'
                    value={data.adminTax}
                    control={<GreenSwitch checked={data.adminTax} onChange={(e) => setData({...data, adminTaxValue: 0, adminTaxPercentage: 0, adminTaxMinimum: 0, adminTax: e.target.checked})} />}
                />
            </Grid>
            {data.adminTax && (<><Grid item md={3} xs={12}>
                <TextField
                    label='Taxa (R$)'
                    name='adminTaxValue'
                    value={currencyMask(data.adminTaxValue)}
                    onChange={(e) => handleChangeOpposite(e, 'adminTaxPercentage')}
                    variant='outlined'
                    type='text'
                    size='small'
                    fullWidth
                />
            </Grid>
            <Grid item md={2} xs={12}>
                <TextField
                    label='Taxa (%)'
                    name='adminTaxPercentage'
                    value={percentageMask(data.adminTaxPercentage)}
                    onChange={(e) => handleChangeOpposite(e, 'adminTaxValue')}
                    variant='outlined'
                    type='text'
                    size='small'
                    fullWidth
                />
            </Grid>
            <Grid item md={3} xs={12}>
                <TextField
                    label='Taxa Mínima (R$)'
                    name='adminTaxPercentage'
                    value={currencyMask(data?.adminTaxMinimum)}
                    onChange={(e) => setData({...data, adminTaxMinimum: removeMask(e.target.value)})}
                    variant='outlined'
                    type='text'
                    size='small'
                    fullWidth
                />
            </Grid></>)}
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xl={2} lg={2} md={4} sm={12} xs={12}>
                        <Typography>Formas de pagamento:</Typography>
                    </Grid>
                    <Grid item xl={2} lg={2} md={4} sm={6} xs={6}>
                            <FormControlLabel
                                label='Cartão de crédito'
                                name='credit'
                                value={data.credit}
                                control={<GreenSwitch checked={data.credit} onChange={(e) => setData({...data, credit: e.target.checked})} />}
                            />
                        </Grid>
                
                        <Grid item xs={4}>
                            <Grid item xl={2} lg={2} md={4} sm={6} xs={6}>
                                <FormControlLabel
                                    label='PIX'
                                    name='pix'
                                    value={data.pix}
                                    control={<GreenSwitch checked={data.pix} onChange={(e) => setData({...data, pix: e.target.checked})} />}
                                />
                            </Grid>
                    </Grid>
                </Grid>
              
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2}>
                    <Grid item md={2} xs={12}>
                        <FormControlLabel
                            label='Split'
                            name='split'    
                            value={data.hasSplit}
                            control={<GreenSwitch checked={data.hasSplit} onChange={(e) => setData({...data, splitValue: 0, splitPercentage: 0, hasSplit: e.target.checked})} />}
                        />
                    </Grid>
                {data.hasSplit && (<><Grid item md={4} xs={12}>
                    <TextField
                        label='Taxa retida (R$)'
                        name='splitValue'
                        value={currencyMask(data.splitValue)}
                        onChange={(e) => handleChangeOpposite(e, 'splitPercentage')}
                        variant='outlined'
                        type='text'
                        size='small'
                        fullWidth
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <TextField
                        label='Taxa retida (%)'
                        name='splitPercentage'
                        value={percentageMask(data.splitPercentage)}
                        onChange={(e) => handleChangeOpposite(e, 'splitValue')}
                        variant='outlined'
                        type='text'
                        size='small'
                        fullWidth
                    />
                </Grid></>)}
                </Grid>
            </Grid>
            
            <Grid item xs={4}>
                <TextField
                    label='ID do Pagseguro'
                    name='gatewayToken'
                    value={data.gatewayToken}
                    onChange={(e) => setData({...data, gatewayToken: e.target.value})}
                    variant='outlined'
                    type='text'
                    size='small'
                    fullWidth
                />
            </Grid>
        </>

    )
}

export default FormECommerce
