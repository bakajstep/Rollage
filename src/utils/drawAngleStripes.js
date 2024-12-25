export default function drawAngleStripes(
    ctx,
    width,
    height,
    { image1, image2, angleDeg, angleStripCount }
) {
    const angleRad = (Math.PI / 180) * angleDeg

    // Otočíme canvas, kreslíme pruhy "rovně", ale s otočeným canvasem
    ctx.translate(width / 2, height / 2)
    ctx.rotate(angleRad)
    ctx.translate(-width / 2, -height / 2)

    const stripH = height / angleStripCount
    for (let i = 0; i < angleStripCount; i++) {
        const y = i * stripH
        const sourceImage = i % 2 === 0 ? image1 : image2
        ctx.drawImage(sourceImage, 0, y, width, stripH, 0, y, width, stripH)
    }

    // Vrátíme transformaci zpět
    ctx.setTransform(1, 0, 0, 1, 0, 0)
}
