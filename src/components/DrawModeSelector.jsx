import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

export default function DrawModeSelector({ drawMode, setDrawMode }) {
    return (
        <FormControl fullWidth>
            <InputLabel id="draw-mode-label">Režim sloučení</InputLabel>
            <Select
                labelId="draw-mode-label"
                value={drawMode}
                label="Režim sloučení"
                onChange={(e) => setDrawMode(e.target.value)}
            >
                <MenuItem value="basic-stripes">Pruhy (Horiz/Vert)</MenuItem>
                {/*<MenuItem value="angle-stripes-no-rotate">Šikmé pruhy</MenuItem>*/}
                <MenuItem value="squares">Kostičky</MenuItem>
                <MenuItem value="swirl">Rotační klíny (Swirl)</MenuItem>
                <MenuItem value="wave-stripes">Vlnité pruhy (Wave)</MenuItem>
            </Select>
        </FormControl>
    )
}
