export default function drawWaveStripes(
    ctx,
    width,
    height,
    { image1, image2, waveCount, waveAmplitude }
) {
    const sectionH = height / waveCount

    // Zkusíme menší krok x, aby byla vlna plynulejší (a nevynechávala rohy).
    const stepX = 2 // klidně 1, ale pozor na výkon

    // Přidáme offset, aby se vlna natáhla i za okraje canvasu
    // (podobně jako u šikmých pruhů), když je waveAmplitude velká.
    const offsetX = waveAmplitude * 2

    for (let i = 0; i < waveCount; i++) {
        ctx.save()
        ctx.beginPath()

        const yBaseTop = i * sectionH
        const yBaseBot = (i + 1) * sectionH

        // Začneme vlevo "před" canvasem
        ctx.moveTo(-offsetX, yBaseTop)
        // Horní vlna zleva doprava
        for (let x = -offsetX; x <= width + offsetX; x += stepX) {
            // Relativní pozice 0..1 (pro výpočet sin) = (x / width)
            // Ale pokud posuneme x o -offsetX, můžeme to korigovat => (x+offsetX)/width
            const rel = (x + offsetX) / width
            const yOff = waveAmplitude * Math.sin(rel * 2 * Math.PI)
            ctx.lineTo(x, yBaseTop + yOff)
        }

        // Pravý svislý okraj
        ctx.lineTo(width + offsetX, yBaseBot)

        // Dolní vlna – zprava doleva
        for (let x = width + offsetX; x >= -offsetX; x -= stepX) {
            const rel = (x + offsetX) / width
            const yOff = waveAmplitude * Math.sin(rel * 2 * Math.PI)
            ctx.lineTo(x, yBaseBot + yOff)
        }

        ctx.closePath()
        ctx.clip()

        const sourceImage = i % 2 === 0 ? image1 : image2
        ctx.drawImage(sourceImage, 0, 0, width, height)

        ctx.restore()
    }
}
