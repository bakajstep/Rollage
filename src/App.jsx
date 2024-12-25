import { useState, useRef } from 'react'
import {
  Container,
  Grid,
  Stack,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography
} from '@mui/material'

import Header from './components/Header'
import ImageUploader from './components/ImageUploader'
import DrawModeSelector from './components/DrawModeSelector'
import BasicStripesControls from './components/BasicStripesControls'
import AngleStripesControls from './components/AngleStripesControls'
import SquaresControls from './components/SquaresControls'
import SwirlControls from './components/SwirlControls'
import WaveStripesControls from './components/WaveStripesControls'
import RadialFadeControls from './components/RadialFadeControls'
import ResultCard from './components/ResultCard'

// Import kreslících funkcí
import {
  drawBasicStripes,
  drawAngleStripes,
  drawAngleStripesNoRotate,
  drawSquares,
  drawSwirl,
  drawWaveStripes,
  drawRadialFade
} from './utils'

function App() {
  // Obrázky + preview
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [preview1, setPreview1] = useState(null)
  const [preview2, setPreview2] = useState(null)

  // Režim
  const [drawMode, setDrawMode] = useState('basic-stripes')

  // Parametry
  // BASIC STRIPES
  const [orientation, setOrientation] = useState('horizontal') // 'horizontal' | 'vertical'
  const [stripMode, setStripMode] = useState('count') // 'count' | 'size'
  const [stripCount, setStripCount] = useState(5)
  const [stripSizeCm, setStripSizeCm] = useState(1)

  // ANGLE STRIPES
  const [angleDeg, setAngleDeg] = useState(45)
  const [angleStripCount, setAngleStripCount] = useState(5)

  // SQUARES
  const [nHoriz, setNHoriz] = useState(5)
  const [nVert, setNVert] = useState(5)

  // SWIRL
  const [swirlCount, setSwirlCount] = useState(6)

  // WAVE
  const [waveCount, setWaveCount] = useState(5)
  const [waveAmplitude, setWaveAmplitude] = useState(40)

  // RADIAL FADE
  const [fadeRadiusPct, setFadeRadiusPct] = useState(50)

  // Výsledek
  const [result, setResult] = useState(null)
  const canvasRef = useRef(null)

  // Nahrávání obrázků
  const handleImageUpload1 = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => setImage1(img)
    img.src = url
    setPreview1(url)
  }

  const handleImageUpload2 = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => setImage2(img)
    img.src = url
    setPreview2(url)
  }

  // Tlačítko VYTVOŘIT
  const handleGenerate = () => {
    if (!image1 || !image2) return

    // Minimální rozměry pro obě
    const width = Math.min(image1.width, image2.width)
    const height = Math.min(image1.height, image2.height)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    // Podle režimu zavoláme příslušnou funkci
    switch (drawMode) {
      case 'basic-stripes':
        drawBasicStripes(ctx, width, height, {
          image1,
          image2,
          orientation,
          stripMode,
          stripCount,
          stripSizeCm
        })
        break
      case 'angle-stripes':
        drawAngleStripes(ctx, width, height, {
          image1,
          image2,
          angleDeg,
          angleStripCount
        })
        break
      case 'angle-stripes-no-rotate':
        drawAngleStripesNoRotate(ctx, width, height, {
          image1,
          image2,
          angleDeg,
          angleStripCount
        })
        break
      case 'squares':
        drawSquares(ctx, width, height, { image1, image2, nHoriz, nVert })
        break
      case 'swirl':
        drawSwirl(ctx, width, height, { image1, image2, swirlCount })
        break
      case 'wave-stripes':
        drawWaveStripes(ctx, width, height, { image1, image2, waveCount, waveAmplitude })
        break
      case 'radial-fade':
        drawRadialFade(ctx, width, height, { image1, image2, fadeRadiusPct })
        break
      default:
        drawBasicStripes(ctx, width, height, {
          image1,
          image2,
          orientation,
          stripMode,
          stripCount,
          stripSizeCm
        })
        break
    }

    // Uložíme výsledek do dataURL
    const dataURL = canvas.toDataURL('image/png')
    setResult(dataURL)
  }

  // Tlačítko STÁHNOUT
  const handleDownload = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = 'rolaz.png'
    a.click()
  }

  return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography paragraph>
            Nahraj dva obrázky a vyber režim sloučení. Obrázek 1 a 2 se budou
            různě střídat nebo prolínat. Kód je jen ukázka, co všechno jde s
            canvasem dělat.
          </Typography>

          {/* Grid pro nahrání obrázků */}
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
                    <ImageUploader onUpload={handleImageUpload1} label="OBRÁZEK 1" />
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
                    <ImageUploader onUpload={handleImageUpload2} label="OBRÁZEK 2" />
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

          {/* Výběr režimu + ovládací prvky */}
          <Box sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
            <DrawModeSelector drawMode={drawMode} setDrawMode={setDrawMode} />

            {/* Parametry pro BASIC STRIPES */}
            {drawMode === 'basic-stripes' && (
                <BasicStripesControls
                    orientation={orientation}
                    setOrientation={setOrientation}
                    stripMode={stripMode}
                    setStripMode={setStripMode}
                    stripCount={stripCount}
                    setStripCount={setStripCount}
                    stripSizeCm={stripSizeCm}
                    setStripSizeCm={setStripSizeCm}
                />
            )}

            {/* Parametry pro ANGLE STRIPES (+ no-rotate) */}
            {(drawMode === 'angle-stripes' || drawMode === 'angle-stripes-no-rotate') && (
                <AngleStripesControls
                    angleDeg={angleDeg}
                    setAngleDeg={setAngleDeg}
                    angleStripCount={angleStripCount}
                    setAngleStripCount={setAngleStripCount}
                />
            )}

            {/* Parametry pro SQUARES */}
            {drawMode === 'squares' && (
                <SquaresControls
                    nHoriz={nHoriz}
                    setNHoriz={setNHoriz}
                    nVert={nVert}
                    setNVert={setNVert}
                />
            )}

            {/* Parametry pro SWIRL */}
            {drawMode === 'swirl' && (
                <SwirlControls swirlCount={swirlCount} setSwirlCount={setSwirlCount} />
            )}

            {/* Parametry pro WAVE */}
            {drawMode === 'wave-stripes' && (
                <WaveStripesControls
                    waveCount={waveCount}
                    setWaveCount={setWaveCount}
                    waveAmplitude={waveAmplitude}
                    setWaveAmplitude={setWaveAmplitude}
                />
            )}

            {/* Parametry pro RADIAL FADE */}
            {drawMode === 'radial-fade' && (
                <RadialFadeControls
                    fadeRadiusPct={fadeRadiusPct}
                    setFadeRadiusPct={setFadeRadiusPct}
                />
            )}
          </Box>

          {/* Tlačítko VYTVOŘIT */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
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
              <ResultCard result={result} handleDownload={handleDownload} />
          )}

          {/* Skrytý canvas pro generování výsledku */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Container>
      </>
  )
}

export default App
