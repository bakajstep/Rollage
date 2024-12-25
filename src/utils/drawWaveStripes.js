export default function drawWaveStripes(
    ctx,
    width,
    height,
    { image1, image2, waveCount, waveAmplitude }
) {
    const sectionH = height / waveCount

    for (let i = 0; i < waveCount; i++) {
        ctx.save()
        ctx.beginPath()

        const yBaseTop = i * sectionH
        const yBaseBot = (i + 1) * sectionH

        ctx.moveTo(0, yBaseTop)
        // Horní hrana vlny
        for (let x = 0; x <= width; x += 5) {
            const yOff = waveAmplitude * Math.sin((x / width) * 2 * Math.PI)
            ctx.lineTo(x, yBaseTop + yOff)
        }

        ctx.lineTo(width, yBaseBot)

        // Dolní hrana vlny (zpět z prava do leva)
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
