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
  // Ukládáme i "preview" URL, abychom ho mohli zobrazit v <img/>
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [preview1, setPreview1] = useState(null)
  const [preview2, setPreview2] = useState(null)

  // ---------------------------
  // OVLÁDACÍ PRVKY
  // ---------------------------
  const [drawMode, setDrawMode] = useState('basic-stripes')
  // 'basic-stripes' | 'angle-stripes' | 'squares' | 'swirl'

  // (A) Pro 'basic-stripes'
  const [orientation, setOrientation] = useState('horizontal') // 'horizontal' | 'vertical'
  const [stripMode, setStripMode] = useState('count') // 'count' | 'size'
  const [stripCount, setStripCount] = useState(5)
  const [stripSizeCm, setStripSizeCm] = useState(1)

  // (B) Pro 'angle-stripes'
  const [angleDeg, setAngleDeg] = useState(45)
  const [angleStripCount, setAngleStripCount] = useState(5)

  // (C) Pro 'squares'
  const [nHoriz, setNHoriz] = useState(5) // Počet kostiček vodorovně
  const [nVert, setNVert] = useState(5)  // Počet kostiček svisle

  // (D) Pro 'swirl'
  const [swirlCount, setSwirlCount] = useState(6)

  // ---------------------------
  // VÝSLEDEK
  // ---------------------------
  const [result, setResult] = useState(null)
  const canvasRef = useRef(null)

  // ---------------------------
  // LOAD IMAGES
  // ---------------------------
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

  // ---------------------------
  // VÝPOČET
  // ---------------------------
  const handleGenerate = () => {
    if (!image1 || !image2) return

    // Získáme minimální plochu, aby obrázky měly společný rozměr
    const width = Math.min(image1.width, image2.width)
    const height = Math.min(image1.height, image2.height)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    // Každý režim zavolá vlastní vykreslovací funkci
    switch (drawMode) {
      case 'basic-stripes':
        drawBasicStripes(ctx, width, height)
        break
      case 'angle-stripes':
        drawAngleStripes(ctx, width, height)
        break
      case 'squares':
        drawSquares(ctx, width, height)
        break
      case 'swirl':
        drawSwirl(ctx, width, height)
        break
      default:
        // default fallback
        drawBasicStripes(ctx, width, height)
        break
    }

    // Uložíme výsledek do dataURL
    const dataURL = canvas.toDataURL('image/png')
    setResult(dataURL)
  }

  // ---------------------------
  // 1) BASIC STRIPES (původní)
  // ---------------------------
  const drawBasicStripes = (ctx, width, height) => {
    // stripCount / stripSizeCm / orientation => horizontální pruhy / vertikální pruhy
    let actualStripCount = stripCount
    let stripSizePx = 0
    const pxPerCm = 37.8 // 1 cm ~ 37.8 px

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
  }

  // ---------------------------
  // 2) ANGLE STRIPES
  // ---------------------------
  const drawAngleStripes = (ctx, width, height) => {
    // Zde budeme točit canvas o zadaný úhel (ve stupních)
    // a pak vykreslíme pruhy "vodorovně", ale na natočeném plátně
    const angleRad = (Math.PI / 180) * angleDeg // převod do rad
    // Přesuneme souřadnice do středu, rotujeme, pak zpět
    ctx.translate(width / 2, height / 2)
    ctx.rotate(angleRad)
    ctx.translate(-width / 2, -height / 2)

    // Teď vykreslíme pruhy "rovně" – např. horizontální.
    const stripH = height / angleStripCount
    for (let i = 0; i < angleStripCount; i++) {
      const y = i * stripH
      const sourceImage = i % 2 === 0 ? image1 : image2
      ctx.drawImage(sourceImage, 0, y, width, stripH, 0, y, width, stripH)
    }

    // Vrátíme transformaci zpátky
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  // ---------------------------
  // 3) SQUARES
  // ---------------------------
  const drawSquares = (ctx, width, height) => {
    // Rozdělíme plátno na nHoriz × nVert
    // a v "checkerboard" stylu střídáme image1 / image2
    const cellW = width / nHoriz
    const cellH = height / nVert
    let index = 0

    for (let row = 0; row < nVert; row++) {
      for (let col = 0; col < nHoriz; col++) {
        const sx = col * cellW
        const sy = row * cellH
        const sourceImage = index % 2 === 0 ? image1 : image2
        ctx.drawImage(
            sourceImage,
            sx,
            sy,
            cellW,
            cellH,
            sx,
            sy,
            cellW,
            cellH
        )
        index++
      }
      // pokud nechceme „šachovnicový“ vzor, ale prosté střídání řádků,
      // klidně to tady trochu uprav.
    }
  }

  // ---------------------------
  // 4) SWIRL (rotační prolnutí)
  // ---------------------------
  const drawSwirl = (ctx, width, height) => {
    // Velmi jednoduchý příklad:
    // nakrájíme plátno na swirlCount "klínů" (vějířů) kolem středu.
    // Střídavě vykreslíme klín z image1 a image2.
    // Kreslíme tak, že
    // 1) posuneme střed => translate(width/2, height/2)
    // 2) otočíme => rotate(úhel klínu)
    // 3) vykreslíme obdélník "vlevo nahoře" => avšak jen klín => clip?
    //    Zde pro zjednodušení:
    //    - uděláme path, vyplníme klín => pak drawImage.
    // Tohle je jen hrubá demoukázka.

    const centerX = width / 2
    const centerY = height / 2
    ctx.save()
    ctx.translate(centerX, centerY)

    const angleStep = (2 * Math.PI) / swirlCount

    for (let i = 0; i < swirlCount; i++) {
      ctx.save()
      ctx.beginPath()
      // klín od i * angleStep do (i+1)*angleStep
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, Math.max(width, height), i * angleStep, (i + 1) * angleStep)
      ctx.closePath()
      // vyrobíme ořez (clip)
      ctx.clip()

      // vybereme obrázek (i % 2)
      const sourceImage = i % 2 === 0 ? image1 : image2

      // teď vykreslíme obrázek tak, aby aspoň pokryl celé plátno
      // vrátíme transformaci do stavu, kdy je střed uprostřed,
      // ale ještě před rotací klínu => proto "save" pro každý klín.
      // Můžeme ho vykreslit se středem? Stačí:
      ctx.drawImage(sourceImage, -centerX, -centerY, width, height)

      ctx.restore()
    }

    ctx.restore()
  }

  // ---------------------------
  // STÁHNOUT
  // ---------------------------
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
            Nahraj dva obrázky a vyber režim, jak se mají sloučit.
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

          {/* DRUH VYKRESLOVÁNÍ */}
          <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 4,
                maxWidth: 600,
                mx: 'auto'
              }}
          >
            <FormControl fullWidth>
              <InputLabel id="draw-mode-label">Režim sloučení</InputLabel>
              <Select
                  labelId="draw-mode-label"
                  value={drawMode}
                  label="Režim sloučení"
                  onChange={(e) => setDrawMode(e.target.value)}
              >
                <MenuItem value="basic-stripes">Pruhy (Horiz/Vert)</MenuItem>
                <MenuItem value="angle-stripes">Pruhy s úhlem</MenuItem>
                <MenuItem value="squares">Kostičky</MenuItem>
                <MenuItem value="swirl">Rot. prolínání</MenuItem>
              </Select>
            </FormControl>

            {/* Parametry pro basic-stripes */}
            {drawMode === 'basic-stripes' && (
                <>
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
                </>
            )}

            {/* Parametry pro angle-stripes */}
            {drawMode === 'angle-stripes' && (
                <>
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
                </>
            )}

            {/* Parametry pro squares */}
            {drawMode === 'squares' && (
                <Stack direction="row" spacing={2}>
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
            )}

            {/* Parametry pro swirl */}
            {drawMode === 'swirl' && (
                <TextField
                    type="number"
                    label="Počet prolnutí (klínů)"
                    value={swirlCount}
                    onChange={(e) => setSwirlCount(+e.target.value)}
                />
            )}
          </Box>

          {/* Tlačítko Vytvořit */}
          <Box
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'center'
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
