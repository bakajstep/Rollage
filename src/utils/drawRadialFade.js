export default function drawRadialFade(
    ctx,
    width,
    height,
    { image1, image2, fadeRadiusPct }
) {
    // 1. Vykreslíme image2 na celé plátno
    ctx.drawImage(image2, 0, 0, width, height)

    // 2. Připravíme masku pro image1
    const centerX = width / 2
    const centerY = height / 2
    const maxR = Math.min(width, height) / 2
    const fadeR = (fadeRadiusPct / 100) * maxR

    // Vytvoříme radiální gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxR)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(fadeR / maxR, 'rgba(255,255,255,1)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.save()
    // 3. Vykreslíme image1
    ctx.drawImage(image1, 0, 0, width, height)

    // 4. Maska
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    ctx.restore()
}
