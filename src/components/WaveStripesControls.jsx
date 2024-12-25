import React from 'react'
import { TextField, Stack } from '@mui/material'

export default function WaveStripesControls({
                                                waveCount,
                                                setWaveCount,
                                                waveAmplitude,
                                                setWaveAmplitude
                                            }) {
    return (
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <TextField
                type="number"
                label="Počet pruhů (waveCount)"
                value={waveCount}
                onChange={(e) => setWaveCount(+e.target.value)}
            />
            <TextField
                type="number"
                label="Vlna amplitude (px)"
                value={waveAmplitude}
                onChange={(e) => setWaveAmplitude(+e.target.value)}
            />
        </Stack>
    )
}
