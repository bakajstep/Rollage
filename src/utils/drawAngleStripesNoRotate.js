export default function drawAngleStripesNoRotate(
    ctx,
    width,
    height,
    { image1, image2, angleDeg, angleStripCount }
) {
    const stripThickness = height / angleStripCount
    const angleRad = (Math.PI / 180) * angleDeg
    const tanA = Math.tan(angleRad)

    for (let i = 0; i < angleStripCount; i++) {
        ctx.save()
        ctx.beginPath()

        const y1 = i * stripThickness
        const y2 = (i + 1) * stripThickness

        // Popis "šikmého" obdélníku (paralelogramu)
        ctx.moveTo(0, y1)
        ctx.lineTo(width, y1 + width * tanA)
        ctx.lineTo(width, y2 + width * tanA)
        ctx.lineTo(0, y2)
        ctx.closePath()

        ctx.clip()

        const sourceImage = i % 2 === 0 ? image1 : image2
        ctx.drawImage(sourceImage, 0, 0, width, height)

        ctx.restore()
    }
}
