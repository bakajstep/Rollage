import { Card, CardContent, CardMedia, CardActions, Button, Typography } from '@mui/material'

export default function ResultCard({ result, handleDownload }) {
    return (
        <Card sx={{ mt: 4 }}>
            <CardContent>
                <Typography variant="h6">Výsledek</Typography>
            </CardContent>
            <CardMedia
                component="img"
                image={result}
                alt="Roláž"
                sx={{ maxHeight: 600, objectFit: 'contain' }}
            />
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="outlined" onClick={handleDownload}>
                    Stáhnout
                </Button>
            </CardActions>
        </Card>
    )
}
