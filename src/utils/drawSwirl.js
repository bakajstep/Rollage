export default function drawSwirl(
    ctx,
    width,
    height,
    { image1, image2, swirlCount }
) {
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
