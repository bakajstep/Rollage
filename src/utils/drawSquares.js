export default function drawSquares(
    ctx,
    width,
    height,
    { image1, image2, nHoriz, nVert }
) {
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
