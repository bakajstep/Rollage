import { useState, useRef } from 'react'
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
  // Obrázky + preview
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [preview1, setPreview1] = useState(null)
  const [preview2, setPreview2] = useState(null)

  // ---------------------------
  // VÝBĚR REŽIMŮ
  // ---------------------------
  const [drawMode, setDrawMode] = useState('basic-stripes')
  /*
    Možné hodnoty:
      - 'basic-stripes' (původní horizontální / vertikální)
      - 'angle-stripes' (původní, rotuje i obrázek)
      - 'angle-stripes-no-rotate' (šikmé pruhy bez rotace obrázku)
      - 'squares' (kostičky)
      - 'swirl' (rotační klíny)
      - 'wave-stripes' (vlnité pruhy)
      - 'radial-fade' (radiální přechod)
  */

  // (A) Pro basic-stripes
  const [orientation, setOrientation] = useState('horizontal') // 'horizontal' | 'vertical'
  const [stripMode, setStripMode] = useState('count') // 'count' | 'size'
  const [stripCount, setStripCount] = useState(5)
  const [stripSizeCm, setStripSizeCm] = useState(1)

  // (B) Pro angle-stripes + angle-stripes-no-rotate
  const [angleDeg, setAngleDeg] = useState(45)
  const [angleStripCount, setAngleStripCount] = useState(5)

  // (C) Pro squares
  const [nHoriz, setNHoriz] = useState(5)
  const [nVert, setNVert] = useState(5)

  // (D) Pro swirl
  const [swirlCount, setSwirlCount] = useState(6)

  // (E) Pro wave-stripes
  const [waveCount, setWaveCount] = useState(5)     // kolik vln
  const [waveAmplitude, setWaveAmplitude] = useState(40) // výška vln

  // (F) Pro radial-fade
  // Kolik % poloměru bude "obrázek1" a zbytek se plynule překlopí do obrázku2
  const [fadeRadiusPct, setFadeRadiusPct] = useState(50)

  // ---------------------------
  // VÝSLEDEK
  // ---------------------------
  const [result, setResult] = useState(null)
  const canvasRef = useRef(null)

  // ---------------------------
  // LOAD IMAGES (Preview)
  // ---------------------------
  const handleImageUpload1 = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)

    const img = new Image()
    img.onload = () => setImage1(img)
    img.src = url
    setPreview1(url)
  }
  const handleImageUpload2 = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)

    const img = new Image()
    img.onload = () => setImage2(img)
    img.src = url
    setPreview2(url)
  }

  // ---------------------------
  // TLAČÍTKO "VYTVOŘIT"
  // ---------------------------
  const handleGenerate = () => {
    if (!image1 || !image2) return

    // Minimální rozměry pro obě
    const width = Math.min(image1.width, image2.width)
    const height = Math.min(image1.height, image2.height)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    switch (drawMode) {
      case 'basic-stripes':
        drawBasicStripes(ctx, width, height)
        break
      case 'angle-stripes':
        drawAngleStripes(ctx, width, height)
        break
      case 'angle-stripes-no-rotate':
        drawAngleStripesNoRotate(ctx, width, height)
        break
      case 'squares':
        drawSquares(ctx, width, height)
        break
      case 'swirl':
        drawSwirl(ctx, width, height)
        break
      case 'wave-stripes':
        drawWaveStripes(ctx, width, height)
        break
      case 'radial-fade':
        drawRadialFade(ctx, width, height)
        break
      default:
        drawBasicStripes(ctx, width, height)
        break
    }

    // Uložíme výsledek do dataURL
    const dataURL = canvas.toDataURL('image/png')
    setResult(dataURL)
  }

  // ---------------------------
  // FUNKCE VYKRESLOVÁNÍ
  // ---------------------------

  // 1) BASIC STRIPES (původní)
  const drawBasicStripes = (ctx, width, height) => {
    let actualStripCount = stripCount
    let stripSizePx = 0
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
        ctx.drawImage(sourceImage, 0, y, width, stripHeight, 0, y, width, stripHeight)
      } else {
        const stripWidth =
            stripMode === 'count' ? width / actualStripCount : stripSizePx
        const x = i * stripWidth

        const sourceImage = i % 2 === 0 ? image1 : image2
        ctx.drawImage(sourceImage, x, 0, stripWidth, height, x, 0, stripWidth, height)
      }
    }
  }

  // 2) ANGLE STRIPES (rotuje se i obrázek)
  const drawAngleStripes = (ctx, width, height) => {
    const angleRad = (Math.PI / 180) * angleDeg
    ctx.translate(width / 2, height / 2)
    ctx.rotate(angleRad)
    ctx.translate(-width / 2, -height / 2)

    const stripH = height / angleStripCount
    for (let i = 0; i < angleStripCount; i++) {
      const y = i * stripH
      const sourceImage = i % 2 === 0 ? image1 : image2
      ctx.drawImage(sourceImage, 0, y, width, stripH, 0, y, width, stripH)
    }

    // Vrátíme transformaci
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  // 3) ANGLE STRIPES (bez rotace obrázku)
  //    Používáme ořezový polygon (clip) pro každý pruh zvlášť,
  //    aby obrázek zůstal "rovně" a jen pruh měl šikmý tvar.
  const drawAngleStripesNoRotate = (ctx, width, height) => {
    // Tloušťka jednoho šikmého pruhu (podél "kolmé" osy k diagonále)
    const stripThickness = height / angleStripCount

    // Úhel ve zlomcích:
    const angleRad = (Math.PI / 180) * angleDeg
    // normální vektor k diagonále:
    // Pokud diagonála má směr angleRad, pak normála je angleRad + 90°
    // My potřebujeme definovat, že pruh i se nachází "v pásmu" i*stripThickness až ...
    // Samotná geometrii je netriviální – tady to děláme trochu zjednodušeně.

    for (let i = 0; i < angleStripCount; i++) {
      // definuj path:
      ctx.save()
      ctx.beginPath()

      // Popíšeme "šikmý obdélník" (paralelogram).
      // pro i-tý pruh začíná od i*stripThickness a končí i+1 * stripThickness
      // v rovině diagonály. Jedna z možností (zjednodušení):
      const y1 = i * stripThickness
      const y2 = (i + 1) * stripThickness

      // Počítejme s trojúhelníkem v rohu.
      // My tady pro ukázku nakreslíme v x=0 -> x=width, a y z linek y= y1 + (x * tan(angle)) ...
      // Tohle je jen hrubý příklad.
      const tanA = Math.tan(angleRad)

      ctx.moveTo(0, y1 + 0 * tanA)
      ctx.lineTo(width, y1 + width * tanA)
      ctx.lineTo(width, y2 + width * tanA)
      ctx.lineTo(0, y2 + 0 * tanA)
      ctx.closePath()

      ctx.clip()

      const sourceImage = i % 2 === 0 ? image1 : image2
      // Obrázek vykreslíme "rovně"
      ctx.drawImage(sourceImage, 0, 0, width, height)

      ctx.restore()
    }
  }

  // 4) SQUARES (kostičky)
  const drawSquares = (ctx, width, height) => {
    const cellW = width / nHoriz
    const cellH = height / nVert
    let index = 0
    for (let row = 0; row < nVert; row++) {
      for (let col = 0; col < nHoriz; col++) {
        const sx = col * cellW
        const sy = row * cellH
        const sourceImage = index % 2 === 0 ? image1 : image2
        ctx.drawImage(sourceImage, sx, sy, cellW, cellH, sx, sy, cellW, cellH)
        index++
      }
    }
  }

  // 5) SWIRL (rotační klíny)
  const drawSwirl = (ctx, width, height) => {
    const centerX = width / 2
    const centerY = height / 2
    ctx.save()
    ctx.translate(centerX, centerY)

    const angleStep = (2 * Math.PI) / swirlCount
    for (let i = 0; i < swirlCount; i++) {
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, Math.max(width, height), i * angleStep, (i + 1) * angleStep)
      ctx.closePath()
      ctx.clip()
      const sourceImage = i % 2 === 0 ? image1 : image2
      ctx.drawImage(sourceImage, -centerX, -centerY, width, height)
      ctx.restore()
    }
    ctx.restore()
  }

  // 6) WAVE STRIPES (vlnité pruhy)
  const drawWaveStripes = (ctx, width, height) => {
    // Rozdělíme plátno na waveCount horizontálních sekcí,
    // ale hraniční čára mezi sekcemi je sinus.
    const sectionH = height / waveCount
    for (let i = 0; i < waveCount; i++) {
      ctx.save()
      ctx.beginPath()

      // i-tá "sekce" leží v rozsahu y od i*sectionH do (i+1)*sectionH,
      // ale s horní křivkou definovanou sinus, a dolní křivkou definovanou sinus.
      // Zase pro jednoduchost:
      //   yTop(x) = i*sectionH + waveAmplitude*sin((x/width)*2*pi)
      //   yBot(x) = (i+1)*sectionH + waveAmplitude*sin((x/width)*2*pi)
      // Nakreslíme obdélníkovou oblast s vlnitými hranami.
      const yBaseTop = i * sectionH
      const yBaseBot = (i + 1) * sectionH

      ctx.moveTo(0, yBaseTop)
      // Horní hrana vlny
      for (let x = 0; x <= width; x += 5) {
        const yOff = waveAmplitude * Math.sin((x / width) * 2 * Math.PI)
        ctx.lineTo(x, yBaseTop + yOff)
      }
      // Pravý okraj
      ctx.lineTo(width, yBaseBot)
      // Dolní hrana vlny (zpátky z prava do leva)
      for (let x = width; x >= 0; x -= 5) {
        const yOff = waveAmplitude * Math.sin((x / width) * 2 * Math.PI)
        ctx.lineTo(x, yBaseBot + yOff)
      }
      ctx.closePath()
      ctx.clip()

      const sourceImage = i % 2 === 0 ? image1 : image2
      ctx.drawImage(sourceImage, 0, 0, width, height)
      ctx.restore()
    }
  }

  // 7) RADIAL FADE (radiální přechod)
  const drawRadialFade = (ctx, width, height) => {
    // Postup:
    // 1. Nejdřív vykreslíme image2 celé
    ctx.drawImage(image2, 0, 0, width, height)

    // 2. Přidáme "masku" pro image1 jako kruhový gradient (střed plátna).
    //    Poloměr, kde se bude lámat fade, = fadeRadiusPct % z polovičního rozměru
    const centerX = width / 2
    const centerY = height / 2
    const maxR = Math.min(width, height) / 2
    const fadeR = (fadeRadiusPct / 100) * maxR

    // 3. Vytvoříme gradient (0 -> fadeR => plná alfa, fadeR -> maxR => alfa=0)
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxR)
    gradient.addColorStop(0, 'rgba(255,255,255,1)') // střed plný
    gradient.addColorStop(fadeR / maxR, 'rgba(255,255,255,1)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    // 4. Uděláme dočasný canvas pro masku?
    //    Nebo to rovnou klipneme? Tady můžeme použít "destination-in" + bílou masku
    //    Ale chceme tam vykreslit image1.
    //    Jednodušší:
    //    - nakreslíme image1
    //    - pak dáme "globalCompositeOperation = 'destination-in'" a vykreslíme gradient => ve středové části prosvítí image1.
    ctx.save()

    // Nejdřív image1
    ctx.drawImage(image1, 0, 0, width, height)

    // Teď maska
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    ctx.restore()
  }

  // ---------------------------
  // STAŽENÍ
  // ---------------------------
  const handleDownload = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = 'rolaz.png'
    a.click()
  }

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div">
              Obrázková roláž (Pokročilé režimy)
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
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

          {/* Výběr režimu */}
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
                <MenuItem value="angle-stripes">Šikmé pruhy (rotace obrázků)</MenuItem>
                <MenuItem value="angle-stripes-no-rotate">Šikmé pruhy (bez rotace)</MenuItem>
                <MenuItem value="squares">Kostičky</MenuItem>
                <MenuItem value="swirl">Rotační klíny (Swirl)</MenuItem>
                <MenuItem value="wave-stripes">Vlnité pruhy (Wave)</MenuItem>
                <MenuItem value="radial-fade">Radiální přechod (Fade)</MenuItem>
              </Select>
            </FormControl>

            {/* Parametry pro BASIC STRIPES */}
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

            {/* Parametry pro ANGLE STRIPES */}
            {(drawMode === 'angle-stripes' || drawMode === 'angle-stripes-no-rotate') && (
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

            {/* Parametry pro SQUARES */}
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

            {/* Parametry pro SWIRL */}
            {drawMode === 'swirl' && (
                <TextField
                    type="number"
                    label="Počet klínů (swirlCount)"
                    value={swirlCount}
                    onChange={(e) => setSwirlCount(+e.target.value)}
                />
            )}

            {/* Parametry pro WAVE */}
            {drawMode === 'wave-stripes' && (
                <Stack direction="row" spacing={2}>
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
            )}

            {/* Parametry pro RADIAL FADE */}
            {drawMode === 'radial-fade' && (
                <TextField
                    type="number"
                    label="Poloměr (v %) pro středový fade"
                    value={fadeRadiusPct}
                    onChange={(e) => setFadeRadiusPct(+e.target.value)}
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
          )}

          {/* Skrytý canvas pro generování výsledku */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Container>
      </>
  )
}

export default App
