import { TextField } from '@mui/material'

export default function RadialFadeControls({
                                               fadeRadiusPct,
                                               setFadeRadiusPct
                                           }) {
    return (
        <TextField
            sx={{ mt: 2 }}
            type="number"
            label="Poloměr (v %) pro středový fade"
            value={fadeRadiusPct}
            onChange={(e) => setFadeRadiusPct(+e.target.value)}
            fullWidth
        />
    )
}
