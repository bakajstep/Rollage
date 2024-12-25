import { TextField, Stack } from '@mui/material'

export default function SquaresControls({
                                            nHoriz,
                                            setNHoriz,
                                            nVert,
                                            setNVert
                                        }) {
    return (
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <TextField
                type="number"
                label="Počet kostiček (vodorovně)"
                value={nHoriz}
                onChange={(e) => setNHoriz(+e.target.value)}
            />
            <TextField
                type="number"
                label="Počet kostiček (svisle)"
                value={nVert}
                onChange={(e) => setNVert(+e.target.value)}
            />
        </Stack>
    )
}
