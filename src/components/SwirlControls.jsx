import { TextField } from '@mui/material'

export default function SwirlControls({ swirlCount, setSwirlCount }) {
    return (
        <TextField
            sx={{ mt: 2 }}
            type="number"
            label="Počet klínů (swirlCount)"
            value={swirlCount}
            onChange={(e) => setSwirlCount(+e.target.value)}
            fullWidth
        />
    )
}
