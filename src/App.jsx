import React, { useState, useRef } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  Box
} from '@mui/material'

function App() {
  // ukladáme i "preview" URL, abychom ho mohli zobrazit v <img/>
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [preview1, setPreview1] = useState(null)
  const [preview2, setPreview2] = useState(null)

  const [orientation, setOrientation] = useState('horizontal') // 'horizontal' | 'vertical'
  const [stripMode, setStripMode] = useState('count') // 'count' | 'size'
  const [stripCount, setStripCount] = useState(5)
  const [stripSizeCm, setStripSizeCm] = useState(1)

  const [result, setResult] = useState(null)
  const canvasRef = useRef(null)

  const handleImageUpload1 = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)

    const img = new Image()
    img.onload = () => {
      setImage1(img)
    }
    img.src = url
    setPreview1(url)
  }

  const handleImageUpload2 = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)

    const img = new Image()
    img.onload = () => {
      setImage2(img)
    }
    img.src = url
    setPreview2(url)
  }

  const handleGenerate = () => {
    if (!image1 || !image2) return

    const width = Math.min(image1.width, image2.width)
    const height = Math.min(image1.height, image2.height)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    let actualStripCount = stripCount
    let stripSizePx = 0

    // 1 palec ~ 2.54 cm => 96 px/palec => ~37.8 px/cm
    const pxPerCm = 37.8

    if (stripMode === 'count') {
      actualStripCount = stripCount
    } else {
      stripSizePx = pxPerCm * stripSizeCm
      if (orientation === 'horizontal') {
        actualStripCount = Math.floor(height / stripSizePx)
      } else {
        actualStripCount = Math.floor(width / stripSizePx)
      }
    }

    for (let i = 0; i < actualStripCount; i++) {
      if (orientation === 'horizontal') {
        const stripHeight =
            stripMode === 'count' ? height / actualStripCount : stripSizePx
        const y = i * stripHeight

        const sourceImage = i % 2 === 0 ? image1 : image2
        ctx.drawImage(
            sourceImage,
            0,
            y,
            width,
            stripHeight,
            0,
            y,
            width,
            stripHeight
        )
      } else {
        const stripWidth =
            stripMode === 'count' ? width / actualStripCount : stripSizePx
        const x = i * stripWidth

        const sourceImage = i % 2 === 0 ? image1 : image2
        ctx.drawImage(
            sourceImage,
            x,
            0,
            stripWidth,
            height,
            x,
            0,
            stripWidth,
            height
        )
      }
    }

    const dataURL = canvas.toDataURL('image/png')
    setResult(dataURL)
  }

  const handleDownload = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = 'rolaz.png'
    a.click()
  }

  return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div">
              Obrázková roláž
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
            Nahraj dva obrázky a aplikace z nich vytvoří roláž (střídající se pruhy
            z prvního a druhého).
          </Typography>

          {/* Grid: levá (obrázek 1) + pravá (obrázek 2) */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                {preview1 && (
                    <CardMedia
                        component="img"
                        image={preview1}
                        alt="Náhled obrázku 1"
                        sx={{ height: 200, objectFit: 'cover' }}
                    />
                )}
                <CardContent>
                  <Stack spacing={1}>
                    <Button variant="contained" component="label">
                      OBRÁZEK 1
                      <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleImageUpload1}
                      />
                    </Button>
                    {image1 && (
                        <Typography variant="caption" color="text.secondary">
                          {image1.width} × {image1.height}px
                        </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                {preview2 && (
                    <CardMedia
                        component="img"
                        image={preview2}
                        alt="Náhled obrázku 2"
                        sx={{ height: 200, objectFit: 'cover' }}
                    />
                )}
                <CardContent>
                  <Stack spacing={1}>
                    <Button variant="contained" component="label">
                      OBRÁZEK 2
                      <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleImageUpload2}
                      />
                    </Button>
                    {image2 && (
                        <Typography variant="caption" color="text.secondary">
                          {image2.width} × {image2.height}px
                        </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Nastavení pruhů: orientace, typ, atd. */}
          <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 4,
                maxWidth: 400,
                mx: 'auto'
              }}
          >
            <FormControl fullWidth>
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

            <FormControl fullWidth>
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
                    type="number"
                    label="Počet pruhů"
                    value={stripCount}
                    onChange={(e) => setStripCount(+e.target.value)}
                    fullWidth
                />
            ) : (
                <TextField
                    type="number"
                    label="Velikost pruhu (cm)"
                    value={stripSizeCm}
                    onChange={(e) => setStripSizeCm(+e.target.value)}
                    fullWidth
                />
            )}
          </Box>

          {/* Tlačítko Vytvořit */}
          <Box
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'center',
              }}
          >
            <Button
                variant="contained"
                size="large"
                onClick={handleGenerate}
                disabled={!image1 || !image2}
            >
              VYTVOŘIT ROLÁŽ
            </Button>
          </Box>

          {/* Výsledek */}
          {result && (
              <Card sx={{ mt: 4 }}>
                <CardContent>
                  <Typography variant="h6">Výsledek</Typography>
                </CardContent>
                <CardMedia
                    component="img"
                    image={result}
                    alt="Roláž"
                    sx={{ maxHeight: 500, objectFit: 'contain' }}
                />
                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button variant="outlined" onClick={handleDownload}>
                    Stáhnout
                  </Button>
                </CardActions>
              </Card>
          )}

          {/* Skrytý canvas pro generování výsledku */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Container>
      </>
  )
}

export default App
