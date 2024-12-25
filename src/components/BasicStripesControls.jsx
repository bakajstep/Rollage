import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material'

export default function BasicStripesControls({
                                                 orientation,
                                                 setOrientation,
                                                 stripMode,
                                                 setStripMode,
                                                 stripCount,
                                                 setStripCount,
                                                 stripSizeCm,
                                                 setStripSizeCm
                                             }) {
    return (
        <>
            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="orientation-label">Orientace pruhů</InputLabel>
                <Select
                    labelId="orientation-label"
                    value={orientation}
                    label="Orientace pruhů"
                    onChange={(e) => setOrientation(e.target.value)}
                >
                    <MenuItem value="horizontal">Horizontální</MenuItem>
                    <MenuItem value="vertical">Vertikální</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="strip-mode-label">Způsob zadání pruhů</InputLabel>
                <Select
                    labelId="strip-mode-label"
                    value={stripMode}
                    label="Způsob zadání pruhů"
                    onChange={(e) => setStripMode(e.target.value)}
                >
                    <MenuItem value="count">Počet pruhů</MenuItem>
                    <MenuItem value="size">Velikost v cm</MenuItem>
                </Select>
            </FormControl>

            {stripMode === 'count' ? (
                <TextField
                    sx={{ mt: 2 }}
                    type="number"
                    label="Počet pruhů"
                    value={stripCount}
                    onChange={(e) => setStripCount(+e.target.value)}
                    fullWidth
                />
            ) : (
                <TextField
                    sx={{ mt: 2 }}
                    type="number"
                    label="Velikost pruhu (cm)"
                    value={stripSizeCm}
                    onChange={(e) => setStripSizeCm(+e.target.value)}
                    fullWidth
                />
            )}
        </>
    )
}
