export default function drawBasicStripes(
    ctx,
    width,
    height,
    { image1, image2, orientation, stripMode, stripCount, stripSizeCm }
) {
    let actualStripCount = stripCount
    let stripSizePx = 0
    const pxPerCm = 37.8

    if (stripMode === 'size') {
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
