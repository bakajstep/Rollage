import { TextField, Stack } from '@mui/material'

export default function AngleStripesControls({
                                                 angleDeg,
                                                 setAngleDeg,
                                                 angleStripCount,
                                                 setAngleStripCount
                                             }) {
    return (
        <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
            <TextField
                type="number"
                label="Úhel (stupně)"
                value={angleDeg}
                onChange={(e) => setAngleDeg(+e.target.value)}
            />
            <TextField
                type="number"
                label="Počet pruhů"
                value={angleStripCount}
                onChange={(e) => setAngleStripCount(+e.target.value)}
            />
        </Stack>
    )
}
