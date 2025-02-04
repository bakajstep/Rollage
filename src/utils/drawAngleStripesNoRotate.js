export default function drawAngleStripesNoRotate(
    ctx,
    width,
    height,
    { image1, image2, angleDeg, angleStripCount }
) {
    const stripThickness = height / angleStripCount
    const angleRad = (Math.PI / 180) * angleDeg
    const tanA = Math.tan(angleRad)

    // Zkus velmi velký offset
    const offset = 2 * Math.max(width, height)

    for (let i = 0; i < angleStripCount; i++) {
        ctx.save()
        ctx.beginPath()

        const y1 = i * stripThickness
        const y2 = (i + 1) * stripThickness

        ctx.moveTo(-offset, y1 + (-offset) * tanA)
        ctx.lineTo(width + offset, y1 + (width + offset) * tanA)
        ctx.lineTo(width + offset, y2 + (width + offset) * tanA)
        ctx.lineTo(-offset, y2 + (-offset) * tanA)
        ctx.closePath()

        ctx.clip()

        const sourceImage = i % 2 === 0 ? image1 : image2
        ctx.drawImage(sourceImage, 0, 0, width, height)

        ctx.restore()
    }
}
