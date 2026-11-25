namespace SpriteKind {
    export const button = SpriteKind.create()
}
// 5. Shift & Monster Helpers
function resetMonster (i: number) {
    let e = mData.get(i)
tiles.placeOnTile(mSprites.get(i), tiles.getTileLocation(e.get(4), e.get(5)))
    e.set(6, 0)
e.set(2, 29)
e.set(3, e.get(0) == 2 ? 19 : (e.get(0) == 1 ? 15 : (Math.percentChance(50) ? 15 : 19)))
}
function triggerJumpscare (idx: number) {
    if (gameState == "JUMPSCARE") {
        return
    }
    gameState = "JUMPSCARE"
    camsOpen = false
    light1On = false
    light2On = false
    let eyeC = mData.get(idx).get(7)
music.play(music.melodyPlayable(music.wawawawaa), music.PlaybackMode.InBackground)
    for (let j = 0; j <= 15; j++) {
        hudLayer.image.fill(j % 2 == 0 ? eyeC : 15)
        sx2 = Math.randomRange(-6, 6)
        sy2 = Math.randomRange(-4, 4)
        hudLayer.image.fillRect(45 + sx2, 18 + sy2, 70, 84, 15)
        hudLayer.image.drawRect(45 + sx2, 18 + sy2, 70, 84, eyeC)
        hudLayer.image.fillRect(56 + sx2, 34 + sy2, 16, 12, j % 2 == 0 ? 5 : eyeC)
        hudLayer.image.fillRect(88 + sx2, 34 + sy2, 16, 12, j % 2 == 0 ? 5 : eyeC)
        hudLayer.image.fillRect(54 + sx2, 62 + sy2, 52, 28, 2)
        pause(65)
    }
    game.splash("SHIFT FAILED", "" + mNames.get(idx) + " GOT YOU!")
    for (let spr2 of mSprites) {
        spr2.setFlag(SpriteFlag.Invisible, true)
    }
    gameState = "MENU"
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameState == "MENU") {
        if (selectedShift == 7) {
            gameState = "CUSTOM"
        } else {
            startShift(selectedShift)
        }
    } else if (gameState == "CUSTOM") {
        startShift(7)
    }
})
function drawDoorway (x1: number, y1: number, x2: number, y2: number, lightOn: boolean, doorProg: number, mImg: Image) {
    q = projectSpan(x1, y1, x2, y2)
    if (q.length == 0) {
        return
    }
    let leftX3 = q.get(0), width2 = q.get(1) - leftX3, hL2 = q.get(2), hR2 = q.get(3)
if (doorProg < 0.95) {
        for (let col2 = 0; col2 <= width2; col2++) {
            sx3 = leftX3 + col2
            if (sx3 < 0 || sx3 >= 160) {
                continue;
            }
            v = col2 / width2
            wallH2 = hL2 + (hR2 - hL2) * v
            wTop = Math.floor(60 - wallH2 * 0.5)
            wBot = Math.floor(60 + wallH2 * 0.5)
            if (!(lightOn)) {
                for (let sy3 = wTop; sy3 <= wBot; sy3 += 2) if (sy3 >= 0 && sy3 < 120) hudLayer.image.setPixel(sx3, sy3 + (col2 % 2), 15)
            } else if (col2 % 2 == 0) {
                let k = Math.abs(v - 0.5) < 0.25 ? 1 : 5
for (let sy4 = wTop; sy4 <= wBot; sy4 += 3) if (sy4 >= 0 && sy4 < 120) hudLayer.image.setPixel(sx3, sy4, k)
hudLayer.image.drawLine(sx3, wBot, sx3, Math.min(119, wBot + Math.floor(wallH2 * 0.2)), 5)
            }
        }
        if (lightOn && mImg != null) {
            drawWallImage(mImg, x1, y1, x2, y2, 0.12, 0.98)
        }
    }
    if (doorProg > 0.02) {
        for (let col3 = 0; col3 <= width2; col3++) {
            sx4 = leftX3 + col3
            if (sx4 < 0 || sx4 >= 160) {
                continue;
            }
            wallH3 = hL2 + (hR2 - hL2) * (col3 / width2)
            wTop2 = Math.floor(60 - wallH3 * 0.5)
            dBot = Math.floor(wTop2 + wallH3 * doorProg)
            if (dBot <= wTop2) {
                continue;
            }
            hudLayer.image.drawLine(sx4, wTop2, sx4, dBot, (col3 == 0 || col3 == width2) ? 15 : (col3 % 4 == 0 ? 11 : 13))
            hudLayer.image.drawLine(sx4, Math.max(wTop2, dBot - Math.max(2, Math.floor(wallH3 * 0.1))), sx4, dBot, Math.floor(col3 / 3) % 2 == 0 ? 5 : 15)
        }
    }
}
// 8. Input Handling
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameState == "MENU") {
        selectedShift = selectedShift <= 1 ? maxUnlockedShift : selectedShift - 1
    }
})
// 6. Fast 3D Projection & Wall Image Helpers
function projectSpan (x1: number, y1: number, x2: number, y2: number) {
    dirX = Render.getAttribute(Render.attribute.dirX)
    dirY = Render.getAttribute(Render.attribute.dirY)
    planeX = (0 - dirY) * 0.66
    planeY = dirX * 0.66
    invDet = 1 / (planeX * dirY - dirX * planeY)
    dxA = x1 - nightguard.x
    dyA = y1 - nightguard.y
    txA = invDet * (dirY * dxA - dirX * dyA)
    depthA = invDet * ((0 - planeY) * dxA + planeX * dyA)
    dxB = x2 - nightguard.x
    dyB = y2 - nightguard.y
    txB = invDet * (dirY * dxB - dirX * dyB)
    depthB = invDet * ((0 - planeY) * dxB + planeX * dyB)
    if (depthA <= 4 || depthB <= 4) {
        return []
    }
    sxA = Math.floor(80 * (1 + txA / depthA))
    sxB = Math.floor(80 * (1 + txB / depthB))
    let flipped = sxA > sxB ? 1 : 0
let leftX = flipped == 1 ? sxB : sxA, rightX = flipped == 1 ? sxA : sxB
let leftD = flipped == 1 ? depthB : depthA, rightD = flipped == 1 ? depthA : depthB
if (rightX < 0 || leftX > 160 || rightX - leftX < 1) {
        return []
    }
    return [
    leftX,
    rightX,
    Math.floor(1920 / leftD),
    Math.floor(1920 / rightD),
    flipped
    ]
}
function addMonster (name: string, art: Image, prefDoor: number, mech: number, sCol: number, sRow: number, color: number) {
    spr = sprites.create(art, SpriteKind.Enemy)
    spr.setFlag(SpriteFlag.Invisible, true)
    mNames.push(name)
    mSprites.push(spr)
    mImages.push(art)
    mAiLevels.push(0)
    mData.push([
    prefDoor,
    mech,
    29,
    prefDoor == 2 ? 19 : 15,
    sCol,
    sRow,
    0,
    color
    ])
}
function startShift (s: number) {
    selectedShift = s
    if (s == 1) {
        mAiLevels.set(0, 5);
mAiLevels.set(1, 0);
mAiLevels.set(2, 0);
mAiLevels.set(3, 0)
    } else if (s == 2) {
        mAiLevels.set(0, 6);
mAiLevels.set(1, 6);
mAiLevels.set(2, 0);
mAiLevels.set(3, 0)
    } else if (s == 3) {
        mAiLevels.set(0, 8);
mAiLevels.set(1, 8);
mAiLevels.set(2, 7);
mAiLevels.set(3, 0)
    } else if (s == 4) {
        mAiLevels.set(0, 9);
mAiLevels.set(1, 9);
mAiLevels.set(2, 9);
mAiLevels.set(3, 8)
    } else if (s == 5) {
        mAiLevels.set(0, 13);
mAiLevels.set(1, 13);
mAiLevels.set(2, 12);
mAiLevels.set(3, 12)
    } else if (s == 6) {
        mAiLevels.set(0, 17);
mAiLevels.set(1, 17);
mAiLevels.set(2, 16);
mAiLevels.set(3, 16)
    }
    powerPercent = 100
    gameHour = 0
    powerOut = false
    sabotageFlash = 0
    camsOpen = false
    door1Closed = false
    door2Closed = false
    light1On = false
    light2On = false
    door1Progress = 0
    door2Progress = 0
    cameraAngle = 180
    tiles.setWallAt(tiles.getTileLocation(29, 15), false)
    tiles.setWallAt(tiles.getTileLocation(29, 19), false)
    drawDarkOfficeBg()
    tiles.placeOnRandomTile(nightguard, sprites.castle.tileGrass2)
    Render.setViewAngleInDegree(cameraAngle)
    for (let i = 0; i <= mSprites.length - 1; i++) {
        resetMonster(i)
    }
    shiftStartTime = game.runtime()
    gameState = "PLAYING"
}
function drawWallPanel (x1: number, y1: number, x2: number, y2: number, dClosed: boolean, lOn: boolean, isP1: boolean) {
    l = projectSpan(x1, y1, x2, y2)
    if (l.length == 0 || l.get(1) - l.get(0) < 2) {
        if (isP1) {
            p1Visible = false
        } else {
            p2Visible = false
        }
        return
    }
    let leftX4 = l.get(0), rightX2 = l.get(1), width3 = rightX2 - leftX4, hL3 = l.get(2), hR3 = l.get(3)
topMax = 60 - Math.floor(Math.max(hL3, hR3) * 0.16)
    botMax = 60 + Math.floor(Math.max(hL3, hR3) * 0.16)
    if (isP1) {
        p1Visible = true
        p1Left = leftX4
        p1Right = rightX2
        p1Top = topMax
        p1Bottom = botMax
    } else {
        p2Visible = true
        p2Left = leftX4
        p2Right = rightX2
        p2Top = topMax
        p2Bottom = botMax
    }
    for (let col4 = 0; col4 <= width3; col4++) {
        sx5 = leftX4 + col4
        if (sx5 < 0 || sx5 >= 160) {
            continue;
        }
        m = hL3 + (hR3 - hL3) * (col4 / width3)
        bTop = Math.floor(60 - m * 0.16)
        bBot = Math.floor(60 + m * 0.16)
        bH = bBot - bTop
        hudLayer.image.drawLine(sx5, bTop, sx5, bBot, (col4 == 0 || col4 == width3) ? 15 : 12)
        n = Math.max(1, Math.floor(width3 * 0.2))
        if (col4 >= n && col4 <= width3 - n) {
            hudLayer.image.drawLine(sx5, bTop + Math.floor(bH * 0.12), sx5, bTop + Math.floor(bH * 0.44), dClosed ? 7 : 2)
            hudLayer.image.drawLine(sx5, bTop + Math.floor(bH * 0.56), sx5, bTop + Math.floor(bH * 0.88), lOn ? 5 : 1)
        }
    }
}
function drawWallImage (wallImg: Image, x1: number, y1: number, x2: number, y2: number, topR: number, botR: number) {
    p = projectSpan(x1, y1, x2, y2)
    if (p.length == 0) {
        return
    }
    let leftX2 = p.get(0), width = p.get(1) - leftX2, hL = p.get(2), hR = p.get(3), flipped2 = p.get(4) == 1
for (let col = 0; col <= width; col++) {
        sx = leftX2 + col
        if (sx < 0 || sx >= 160) {
            continue;
        }
        u = col / width
        srcX = Math.min(wallImg.width - 1, Math.floor((flipped2 ? 1 - u : u) * wallImg.width))
        wallH = hL + (hR - hL) * u
        wallTop = 60 - wallH * 0.5
        dTop = Math.floor(wallTop + wallH * topR)
        dH = Math.floor(wallTop + wallH * botR) - dTop
        if (dH <= 0) {
            continue;
        }
        for (let row = 0; row <= dH - 1; row++) {
            sy = dTop + row
            if (sy < 0 || sy >= 120) {
                continue;
            }
            h = wallImg.getPixel(srcX, Math.min(wallImg.height - 1, Math.floor(row / dH * wallImg.height)))
            if (h != 0) {
                hudLayer.image.setPixel(sx, sy, h)
            }
        }
    }
}
// 7. Camera, Jumpscare & HUD Rendering
function switchToCamera (index: number) {
    if (index < 0 || index >= camLocations.length) {
        return
    }
    activeCamIndex = index
    let targetLoc = camLocations.get(index)
tiles.placeOnTile(nightguard, targetLoc)
    bestAngle = 45
    bestScore = -1
    angles = [
    0,
    45,
    90,
    135,
    180,
    225,
    270,
    315
    ]
    dCols = [
    1,
    1,
    0,
    -1,
    -1,
    -1,
    0,
    1
    ]
    dRows = [
    0,
    1,
    1,
    1,
    0,
    -1,
    -1,
    -1
    ]
    for (let b = 0; b <= 7; b++) {
        for (let s = 1; s <= 5; s++) {
            let cc = targetLoc.col + dCols.get(b) * s, cr = targetLoc.row + dRows.get(b) * s
            if (cc < 0 || cr < 0 || tiles.tileAtLocationIsWall(tiles.getTileLocation(cc, cr))) break
            steps += 1
        }
if (steps > bestScore) {
            bestScore = steps
            bestAngle = angles.get(b)
        }
    }
    camBaseAngle = bestAngle
    camPanAngle = 0
    Render.setViewAngleInDegree(camBaseAngle)
}
function drawDarkOfficeBg () {
    officeBg.fillRect(0, 0, 160, 60, 15)
    officeBg.fillRect(0, 60, 160, 60, 12)
    officeBg.fillRect(0, 52, 160, 16, 15)
}
function scanTileNeighbors (list: tiles.Location[]) {
    for (let loc of list) {
        patrolTiles.push(loc)
        for (let dc = -1; dc <= 1; dc++) {
            for (let dr = -1; dr <= 1; dr++) {
                let c = loc.col + dc, r = loc.row + dr
                if (c < 0 || r < 0 || (dc == 0 && dr == 0)) continue
                let wLoc = tiles.getTileLocation(c, r)
                if (tiles.tileAtLocationIsWall(wLoc)) {
                    let exists = false
                    for (let w of wallMapLocations) if (w.col == c && w.row == r) exists = true
                    if (!exists) wallMapLocations.push(wLoc)
                }
            }
        }
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameState == "MENU") {
        selectedShift = selectedShift >= maxUnlockedShift ? 1 : selectedShift + 1
    }
})
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    if (gameState == "MENU") {
        if (x >= 16 && x <= 44 && y >= 38 && y <= 74) {
            selectedShift = selectedShift <= 1 ? maxUnlockedShift : selectedShift - 1
        } else if (x >= 116 && x <= 144 && y >= 38 && y <= 74) {
            selectedShift = selectedShift >= maxUnlockedShift ? 1 : selectedShift + 1
        } else if (x >= 36 && x <= 124 && y >= 84 && y <= 104) {
            if (selectedShift == 7) {
                gameState = "CUSTOM"
            } else {
                startShift(selectedShift)
            }
        }
        return
    }
    if (gameState == "CUSTOM") {
        for (let o = 0; o <= Math.min(4, mNames.length) - 1; o++) {
            rowY = 24 + o * 18
            if (y >= rowY && y <= rowY + 13) {
                if (x >= 74 && x <= 88) {
                    mAiLevels.set(o, Math.max(0, mAiLevels.get(o) - 1))
                } else if (x >= 114 && x <= 128) {
                    mAiLevels.set(o, Math.min(20, mAiLevels.get(o) + 1))
                }
            }
        }
        if (x >= 14 && x <= 64 && y >= 98 && y <= 113) {
            gameState = "MENU"
        } else if (x >= 76 && x <= 146 && y >= 98 && y <= 113) {
            startShift(7)
        }
        return
    }
    if (gameState != "PLAYING" || powerOut) {
        return
    }
    if (x >= 42 && x <= 118 && y >= 110) {
        toggleCams()
        return
    }
    if (camsOpen) {
        for (let i2 = 0; i2 <= camLocations.length - 1; i2++) {
            let loc2 = camLocations.get(i2)
cx = mapOffsetX + Math.floor((loc2.col - mapMinCol) * mapScale) - 1
            cy = mapOffsetY + Math.floor((loc2.row - mapMinRow) * mapScale) - 1
            if (x >= cx - 3 && x <= cx + 7 && y >= cy - 3 && y <= cy + 7) {
                switchToCamera(i2)
                return
            }
        }
        return
    }
    if (p1Visible && x >= p1Left && x <= p1Right && y >= p1Top && y <= p1Bottom) {
        if (y < 60) {
            door1Closed = !(door1Closed)
            tiles.setWallAt(tiles.getTileLocation(29, 15), door1Closed)
        } else {
            light1On = !(light1On)
            if (light1On) {
                light2On = false
            }
        }
    }
    if (p2Visible && x >= p2Left && x <= p2Right && y >= p2Top && y <= p2Bottom) {
        if (y < 60) {
            door2Closed = !(door2Closed)
            tiles.setWallAt(tiles.getTileLocation(29, 19), door2Closed)
        } else {
            light2On = !(light2On)
            if (light2On) {
                light1On = false
            }
        }
    }
})
function putOnWall (wallImg: Image, col: number, row: number, side: string, topR: number, botR: number) {
    x1 = col * 16 + 2
    y1 = row * 16 + 2
    x2 = col * 16 + 14
    y2 = row * 16 + 14
    if (side == "N") {
        y1 = row * 16
        y2 = y1
    } else if (side == "S") {
        y1 = (row + 1) * 16
        y2 = y1
    } else if (side == "W") {
        x1 = col * 16
        x2 = x1
    } else if (side == "E") {
        x1 = (col + 1) * 16
        x2 = x1
    }
    drawWallImage(wallImg, x1, y1, x2, y2, topR, botR)
}
function toggleCams () {
    if (powerOut || gameState != "PLAYING") {
        return
    }
    camsOpen = !(camsOpen)
    if (camsOpen) {
        savedOfficeAngle = cameraAngle
        officeBg.fillRect(0, 0, 160, 60, 12)
        officeBg.fillRect(0, 60, 160, 60, 11)
        switchToCamera(activeCamIndex)
    } else {
        tiles.placeOnRandomTile(nightguard, sprites.castle.tileGrass2)
        cameraAngle = savedOfficeAngle
        Render.setViewAngleInDegree(cameraAngle)
        drawDarkOfficeBg()
    }
}
let dDoor = 0
let sDist = 0
let bestNextDist = 0
let atD2 = false
let atD1 = false
let drain = 0
let usage = 0
let cy2 = 0
let cx2 = 0
let atD22 = false
let atD12 = false
let aRow2 = 0
let aCol2 = 0
let rowY2 = 0
let y2 = 0
let x2 = 0
let y1 = 0
let x1 = 0
let cy = 0
let cx = 0
let rowY = 0
let camPanAngle = 0
let dRows: number[] = []
let dCols: number[] = []
let angles: number[] = []
let bestScore = 0
let bestAngle = 0
let h = 0
let sy = 0
let dH = 0
let dTop = 0
let wallTop = 0
let wallH = 0
let srcX = 0
let u = 0
let sx = 0
let p: number[] = []
let n = 0
let bH = 0
let bBot = 0
let bTop = 0
let m = 0
let sx5 = 0
let p2Bottom = 0
let p2Top = 0
let p2Right = 0
let p2Left = 0
let p1Bottom = 0
let p1Top = 0
let p1Right = 0
let p1Left = 0
let botMax = 0
let topMax = 0
let p2Visible = false
let p1Visible = false
let l: number[] = []
let shiftStartTime = 0
let sabotageFlash = 0
let powerOut = false
let spr: Sprite = null
let sxB = 0
let sxA = 0
let depthB = 0
let txB = 0
let dyB = 0
let dxB = 0
let depthA = 0
let txA = 0
let dyA = 0
let dxA = 0
let invDet = 0
let planeY = 0
let planeX = 0
let dirY = 0
let dirX = 0
let dBot = 0
let wTop2 = 0
let wallH3 = 0
let sx4 = 0
let wBot = 0
let wTop = 0
let wallH2 = 0
let v = 0
let sx3 = 0
let q: number[] = []
let sy2 = 0
let sx2 = 0
let hudLayer: Sprite = null
let d = 0
let patrolTiles: tiles.Location[] = []
let mapMinRow = 0
let nightguard: Sprite = null
let officeBg: Image = null
let mapOffsetY = 0
let mapOffsetX = 0
let mapScale = 0
let powerPercent = 0
let camBaseAngle = 0
let savedOfficeAngle = 0
let cameraAngle = 0
let selectedShift = 0
let gameState = ""
let wallMapLocations: tiles.Location[] = []
// Packed config per monster: [prefDoor, mechanic, targetCol, targetRow, startCol, startRow, waitTicks, dotColor]
let mData: number[][] = []
let mAiLevels: number[] = []
let mImages: Image[] = []
let mSprites: Sprite[] = []
// 3. Compact Monster Arrays & Creator
let mNames: string[] = []
let mapMinCol = 0
let camLocations: tiles.Location[] = []
let gameHour = 0
let activeCamIndex = 0
let camsOpen = false
let door2Progress = 0
let door1Progress = 0
let light2On = false
let door2Closed = false
let light1On = false
let door1Closed = false
let d2Img: Image = null
let d1Img: Image = null
let bestTile: tiles.Location = null
let steps = 0
// 1. Core State & Variables
gameState = "MENU"
selectedShift = 1
let maxUnlockedShift = 1
cameraAngle = 180
savedOfficeAngle = 180
camBaseAngle = 45
powerPercent = 100
mapScale = 1
mapOffsetX = 94
mapOffsetY = 46
// 2. Monster & Wall Pixel Art
let monster1Img = img`
    . . . . . f f f f f f . . . . . 
    . . . . f c c c c c c f . . . . 
    . . . f c 1 2 c c 2 1 c f . . . 
    . . . f c c c c c c c c f . . . 
    . . . . f c 1 f f 1 c f . . . . 
    . . . . . f f f f f f . . . . . 
    . . f f f c c c c c c f f f . . 
    . f c c c c c 2 2 c c c c c f . 
    . f c c f c c c c c c f c c f . 
    . f c f . f c c c c f . f c f . 
    . f 1 f . f c c c c f . f 1 f . 
    . . . . . f c c c c f . . . . . 
    . . . . . f c f f c f . . . . . 
    . . . . . f c f f c f . . . . . 
    . . . . f c c f f c c f . . . . 
    . . . . f f f . . f f f . . . . 
    `
let monster2Img = img`
    . . . f f . . . . . . f f . . . 
    . . . f 2 f . . . . . f 2 f . . 
    . . . . f 2 f f f f f 2 f . . . 
    . . . . f 2 2 2 2 2 2 2 f . . . 
    . . . f 2 1 5 2 2 5 1 2 f . . . 
    . . . f 2 2 2 2 2 2 2 2 f . . . 
    . . . . f 2 1 1 1 1 2 f . . . . 
    . . . . . f f f f f f . . . . . 
    . . f f f 2 2 2 2 2 2 f f f . . 
    . f 2 2 2 2 2 5 5 2 2 2 2 2 f . 
    . f 2 f . f 2 2 2 2 f . f 2 f . 
    . f 1 f . f 2 2 2 2 f . f 1 f . 
    . . . . . f 2 f f 2 f . . . . . 
    . . . . . f 2 f f 2 f . . . . . 
    . . . . f 2 2 f f 2 2 f . . . . 
    . . . . f f f . . f f f . . . . 
    `
let monster3Img = img`
    . . . . . 1 1 1 1 1 1 . . . . . . . 
    . . . . 1 9 9 9 9 9 9 1 . . . . . . 
    . . . 1 9 1 5 1 9 9 1 1 5 9 1 . . . 
    . . . 1 9 9 9 9 9 9 9 9 1 . . . . . 
    . . . . 1 9 1 5 1 5 1 5 1 5 9 1 . . 
    . . . . . 1 9 9 9 9 9 1 . . . . . . 
    . . 1 1 1 9 9 1 1 9 9 1 1 1 . . . . 
    . 1 9 9 9 9 1 9 9 1 9 9 9 9 1 . . . 
    . . 1 9 9 9 9 9 9 9 9 9 9 1 . . . . 
    . . . 1 9 9 9 9 9 9 9 9 1 . . . . . 
    . . . 1 9 9 9 9 9 9 9 9 1 . . . . . 
    . . . . 1 9 9 9 9 9 9 1 . . . . . . 
    . . . . . 1 9 1 9 1 9 1 . . . . . . 
    . . . . . . 1 . 1 . 1 . . . . . . . 
    . . . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . . . 
    `
let monster4Img = img`
    . . . . f 7 7 7 7 7 7 f . . . . . 
    . . . f 7 5 7 7 7 7 5 7 f . . . . 
    . . . f 7 1 5 5 7 7 5 1 5 7 f . . 
    . . . f 7 7 7 5 5 7 7 7 f . . . . 
    . . . . f 7 5 5 5 5 7 f . . . . . 
    . . . . . f f f f f f . . . . . . 
    . . f 7 7 5 7 7 7 7 5 7 7 f . . . 
    . f 7 7 f 7 5 5 5 5 7 f 7 7 f . . 
    . f 5 f . f 7 7 7 7 f . f 5 f . . 
    . . f . . f 7 5 5 7 f . . f . . . 
    . . . . . f 7 7 7 7 f . . . . . . 
    . . . . . f 7 f f 7 f . . . . . . 
    . . . . . f 7 f f 7 f . . . . . . 
    . . . . f 7 5 f f 5 7 f . . . . . 
    . . . . f f f . . f f f . . . . . 
    . . . . . . . . . . . . . . . . . 
    `
let officePoster = img`
    1 1 1 1 1 1 1 1 1 1 . . . 
    1 2 2 1 5 5 1 7 7 1 . . . 
    1 1 1 1 1 1 1 1 1 1 . . . 
    1 1 4 5 1 5 5 1 5 5 4 1 . 
    1 1 4 5 2 2 5 5 4 1 . . . 
    1 1 4 5 1 5 1 5 1 5 5 4 1 
    1 2 2 2 2 2 2 2 2 1 . . . 
    1 1 1 1 1 1 1 1 1 1 . . . 
    `
// 4. Setup 3D View & Map Scan
tiles.setCurrentTilemap(tilemap`level1`)
Render.setViewMode(ViewMode.raycastingView)
officeBg = image.create(160, 120)
drawDarkOfficeBg()
scene.setBackgroundImage(officeBg)
nightguard = Render.getRenderSpriteVariable()
tiles.placeOnRandomTile(nightguard, sprites.castle.tileGrass2)
Render.setViewAngleInDegree(cameraAngle)
Render.moveWithController(0, 0)
browserEvents.setCursorVisible(true)
let darkGroundTiles = tiles.getTilesByType(sprites.dungeon.darkGroundNorthWest1)
camLocations = tiles.getTilesByType(sprites.dungeon.floorLight2)
scanTileNeighbors(darkGroundTiles)
scanTileNeighbors(camLocations)
let mapMaxCol = 1
let mapMaxRow = 1
if (wallMapLocations.length > 0) {
    let f = wallMapLocations.get(0)
mapMinCol = f.col;
mapMaxCol = f.col;
mapMinRow = f.row
    mapMaxRow = f.row
    for (let pt of wallMapLocations) {
        if (pt.col < mapMinCol) {
            mapMinCol = pt.col
        }
        if (pt.col > mapMaxCol) {
            mapMaxCol = pt.col
        }
        if (pt.row < mapMinRow) {
            mapMinRow = pt.row
        }
        if (pt.row > mapMaxRow) {
            mapMaxRow = pt.row
        }
    }
}
let boxSize = 56
let spanCols = Math.max(1, mapMaxCol - mapMinCol + 1)
let spanRows = Math.max(1, mapMaxRow - mapMinRow + 1)
mapScale = boxSize / Math.max(spanCols, spanRows)
mapOffsetX = 94 + Math.floor((boxSize - spanCols * mapScale) / 2)
mapOffsetY = 46 + Math.floor((boxSize - spanRows * mapScale) / 2)
let miniMapBg = image.create(62, 62)
miniMapBg.fill(15)
miniMapBg.drawRect(0, 0, 62, 62, 1)
let tPx = Math.max(1, Math.ceil(mapScale))
for (let g of darkGroundTiles) {
    miniMapBg.fillRect(3 + Math.floor((boxSize - spanCols * mapScale) / 2 + (g.col - mapMinCol) * mapScale), 3 + Math.floor((boxSize - spanRows * mapScale) / 2 + (g.row - mapMinRow) * mapScale), tPx, tPx, 11)
}
for (let a of wallMapLocations) {
    miniMapBg.fillRect(3 + Math.floor((boxSize - spanCols * mapScale) / 2 + (a.col - mapMinCol) * mapScale), 3 + Math.floor((boxSize - spanRows * mapScale) / 2 + (a.row - mapMinRow) * mapScale), tPx, tPx, 1)
}
let stageCol = 1
let stageRow = 1
let bestDist = -1
for (let t of patrolTiles) {
    d = Math.abs(t.col - 29) + Math.abs(t.row - 17)
    if (d > bestDist) {
        bestDist = d
        stageCol = t.col;
stageRow = t.row
    }
}
patrolTiles.push(tiles.getTileLocation(29, 15))
patrolTiles.push(tiles.getTileLocation(29, 19))
if (camLocations.length == 0) {
    camLocations.push(tiles.getTileLocation(0, 0))
}
// Register Monsters (Duplicate addMonster(...) to add more!)
addMonster("SHADOW", monster1Img, 1, 1, stageCol, stageRow, 2)
addMonster("CRIMSON", monster2Img, 2, 2, stageCol, stageRow, 4)
addMonster("WRAITH", monster3Img, 0, 3, stageCol, stageRow, 9)
addMonster("PHANTOM", monster4Img, 0, 4, stageCol, stageRow, 7)
hudLayer = sprites.create(image.create(160, 120), SpriteKind.button)
hudLayer.setFlag(SpriteFlag.RelativeToCamera, true)
hudLayer.setPosition(80, 60)
hudLayer.z = 10
// 10. Main Render Loop
game.onUpdate(function () {
    hudLayer.image.fill(0)
    if (gameState == "MENU") {
        hudLayer.image.fill(15)
        hudLayer.image.drawRect(3, 3, 154, 114, 12)
        hudLayer.image.print("FIVE SHIFTS AT", 34, 10, 1);
hudLayer.image.print("THE FACILITY", 40, 20, 2)
hudLayer.image.fillRect(16, 38, 128, 36, 11)
        hudLayer.image.drawRect(16, 38, 128, 36, 1)
        hudLayer.image.print("<", 22, 52, 5);
hudLayer.image.print(">", 132, 52, 5)
hudLayer.image.print(selectedShift == 7 ? "SHIFT 7: CUSTOM" : ("SHIFT " + selectedShift), 44, 46, 1)
hudLayer.image.print("UNLOCKED: " + maxUnlockedShift + "/7", 42, 60, 13)
hudLayer.image.fillRect(36, 84, 88, 20, 7)
        hudLayer.image.drawRect(36, 84, 88, 20, 1)
        hudLayer.image.print(selectedShift == 7 ? "CUSTOMIZE" : "START SHIFT", 46, 90, 15)
return
    }
    if (gameState == "CUSTOM") {
        hudLayer.image.fill(15)
        hudLayer.image.drawRect(3, 3, 154, 114, 12)
        hudLayer.image.print("SHIFT 7: CUSTOM AI", 24, 8, 5)
for (let i3 = 0; i3 <= Math.min(4, mNames.length) - 1; i3++) {
            rowY2 = 24 + i3 * 18
            hudLayer.image.print(mNames.get(i3), 10, rowY2 + 2, mData.get(i3).get(7))
hudLayer.image.fillRect(74, rowY2, 14, 13, 12)
            hudLayer.image.drawRect(74, rowY2, 14, 13, 1)
            hudLayer.image.print("-", 78, rowY2 + 3, 1)
hudLayer.image.print("" + mAiLevels.get(i3), 94, rowY2 + 3, 1)
hudLayer.image.fillRect(114, rowY2, 14, 13, 12)
            hudLayer.image.drawRect(114, rowY2, 14, 13, 1)
            hudLayer.image.print("+", 118, rowY2 + 3, 1)
        }
        hudLayer.image.fillRect(14, 98, 50, 15, 2)
        hudLayer.image.drawRect(14, 98, 50, 15, 1)
        hudLayer.image.print("BACK", 26, 102, 1)
hudLayer.image.fillRect(76, 98, 70, 15, 7)
        hudLayer.image.drawRect(76, 98, 70, 15, 1)
        hudLayer.image.print("START", 96, 102, 15)
return
    }
    if (gameState != "PLAYING") {
        return
    }
    let mx = browserEvents.mouseX()
if (!(camsOpen)) {
        if (mx < 35 && cameraAngle > 70) {
            cameraAngle += 0 - 4
            Render.setViewAngleInDegree(cameraAngle)
        } else if (mx > 125 && cameraAngle < 290) {
            cameraAngle += 4
            Render.setViewAngleInDegree(cameraAngle)
        }
    } else {
        if (mx < 35 && camPanAngle > -30) {
            camPanAngle += 0 - 2
            Render.setViewAngleInDegree(camBaseAngle + camPanAngle)
        } else if (mx > 125 && camPanAngle < 30) {
            camPanAngle += 2
            Render.setViewAngleInDegree(camBaseAngle + camPanAngle)
        }
    }
    door1Progress = door1Closed ? Math.min(1, door1Progress + 0.12) : Math.max(0, door1Progress - 0.12)
door2Progress = door2Closed ? Math.min(1, door2Progress + 0.12) : Math.max(0, door2Progress - 0.12)
for (let m3 = 0; m3 <= mSprites.length - 1; m3++) {
        let spr5 = mSprites.get(m3)
if (mAiLevels.get(m3) <= 0) {
            spr5.setFlag(SpriteFlag.Invisible, true)
            continue;
        }
        aCol2 = Math.floor(spr5.x / 16)
        aRow2 = Math.floor(spr5.y / 16)
        atD12 = aCol2 == 29 && aRow2 == 15
        atD22 = aCol2 == 29 && aRow2 == 19
        if (atD12) {
            d1Img = mImages.get(m3);
        }
        if (atD22) {
            d2Img = mImages.get(m3)
        }
        spr5.setFlag(SpriteFlag.Invisible, !(camsOpen) && (atD12 && !(light1On) || atD22 && !(light2On)))
    }
    if (camsOpen) {
        hudLayer.image.drawRect(2, 2, 156, 108, 1)
        if (Math.floor(game.runtime() / 500) % 2 == 0) {
            hudLayer.image.fillRect(8, 8, 5, 5, 2)
        }
        hudLayer.image.print("CAM " + (activeCamIndex + 1) + "/" + camLocations.length, 16, 7, 1)
hudLayer.image.drawTransparentImage(miniMapBg, 91, 43)
        for (let i4 = 0; i4 <= camLocations.length - 1; i4++) {
            let loc3 = camLocations.get(i4)
cx2 = mapOffsetX + Math.floor((loc3.col - mapMinCol) * mapScale) - 1
            cy2 = mapOffsetY + Math.floor((loc3.row - mapMinRow) * mapScale) - 1
            hudLayer.image.fillRect(cx2, cy2, 4, 4, i4 == activeCamIndex ? 7 : 5)
            hudLayer.image.drawRect(cx2, cy2, 4, 4, 15)
        }
        if (Math.floor(game.runtime() / 300) % 2 == 0) {
            for (let m4 = 0; m4 <= mSprites.length - 1; m4++) {
                if (mAiLevels.get(m4) <= 0) {
                    continue;
                }
                let spr6 = mSprites.get(m4)
hudLayer.image.fillRect(mapOffsetX + Math.floor((Math.floor(spr6.x / 16) - mapMinCol) * mapScale), mapOffsetY + Math.floor((Math.floor(spr6.y / 16) - mapMinRow) * mapScale), 3, 3, mData.get(m4).get(7))
            }
        }
    } else {
        putOnWall(officePoster, 28, 18, "E", 0.2, 0.65)
        drawDoorway(29 * 16, 16 * 16, 30 * 16, 16 * 16, light1On, door1Progress, d1Img)
        drawDoorway(29 * 16, 19 * 16, 30 * 16, 19 * 16, light2On, door2Progress, d2Img)
        if (!(powerOut)) {
            drawWallPanel(28 * 16 + 3, 16 * 16, 28 * 16 + 13, 16 * 16, door1Closed, light1On, true)
            drawWallPanel(28 * 16 + 3, 19 * 16, 28 * 16 + 13, 19 * 16, door2Closed, light2On, false)
        }
    }
    hudLayer.image.drawRect(0, 0, 160, 120, 15)
    hudLayer.image.drawRect(1, 1, 158, 118, 15)
    usage = 1 + (door1Closed ? 1 : 0) + (door2Closed ? 1 : 0) + (light1On ? 1 : 0) + (light2On ? 1 : 0) + (camsOpen ? 1 : 0)
    hudLayer.image.print(Math.ceil(powerPercent) + "%", 4, 102, 1)
for (let b2 = 0; b2 <= usage - 1; b2++) {
        hudLayer.image.fillRect(4 + b2 * 5, 112, 4, 6, b2 < 2 ? 7 : (b2 < 4 ? 5 : 2))
    }
    hudLayer.image.print(gameHour == 0 ? "12 PM" : (gameHour + " AM"), 124, 6, 1)
hudLayer.image.print("SHIFT " + selectedShift, 112, 16, 13)
if (sabotageFlash > 0) {
        sabotageFlash += 0 - 1
        hudLayer.image.drawRect(2, 2, 156, 116, 7)
        hudLayer.image.print("POWER DRAINED!", 38, 10, 7)
    }
    if (!(powerOut)) {
        hudLayer.image.fillRect(42, 112, 76, 8, 12)
        hudLayer.image.drawRect(42, 112, 76, 8, 1)
        hudLayer.image.drawLine(76, 116, 80, camsOpen ? 118 : 114, 1)
        hudLayer.image.drawLine(80, camsOpen ? 118 : 114, 84, 116, 1)
    }
})
game.onUpdateInterval(1000, function () {
    if (gameState != "PLAYING" || powerOut) {
        return
    }
    drain = 0.12 + selectedShift * 0.02 + (door1Closed ? 0.35 : 0) + (door2Closed ? 0.35 : 0) + (light1On ? 0.25 : 0) + (light2On ? 0.25 : 0) + (camsOpen ? 0.3 : 0)
    powerPercent = Math.max(0, powerPercent - drain)
    if (powerPercent <= 0) {
        powerOut = true
        door1Closed = false
        door2Closed = false
        light1On = false
        light2On = false
        tiles.setWallAt(tiles.getTileLocation(29, 15), false)
        tiles.setWallAt(tiles.getTileLocation(29, 19), false)
        if (camsOpen) {
            camsOpen = false
            tiles.placeOnRandomTile(nightguard, sprites.castle.tileGrass2)
            cameraAngle = savedOfficeAngle
            Render.setViewAngleInDegree(cameraAngle)
        }
        officeBg.fill(15)
    }
})
game.onUpdateInterval(45000, function () {
    if (gameState != "PLAYING") {
        return
    }
    gameHour += 1
    if (gameHour >= 6) {
        game.splash("6:00 AM", "SHIFT " + selectedShift + " COMPLETE!")
        if (selectedShift < 7 && selectedShift >= maxUnlockedShift) {
            maxUnlockedShift = selectedShift + 1
        }
        if (selectedShift < 7) {
            selectedShift += 1
        }
        for (let spr4 of mSprites) {
            spr4.setFlag(SpriteFlag.Invisible, true)
        }
        gameState = "MENU"
    }
})
// 9. Monster AI, Power & Clock Timers
game.onUpdateInterval(3500, function () {
    if (gameState != "PLAYING" || game.runtime() - shiftStartTime < 9000) {
        return
    }
    for (let m2 = 0; m2 <= mSprites.length - 1; m2++) {
        let ai = mAiLevels.get(m2), d2 = mData.get(m2), mech = d2.get(1)
if (ai <= 0 || mech == 3 && camsOpen || Math.randomRange(1, 20) > ai) {
            continue;
        }
        let spr3 = mSprites.get(m2), aCol = Math.floor(spr3.x / 16), aRow = Math.floor(spr3.y / 16)
atD1 = aCol == 29 && aRow == 15
        atD2 = aCol == 29 && aRow == 19
        if (atD1 || atD2) {
            if (atD1 ? door1Closed : door2Closed) {
                resetMonster(m2)
            } else {
                d2.set(6, d2.get(6) + 1)
if (d2.get(6) >= 2) {
                    if (mech == 4) {
                        powerPercent = Math.max(0, powerPercent - 12)
                        sabotageFlash = 25
                        music.play(music.melodyPlayable(music.powerDown), music.PlaybackMode.InBackground)
                        resetMonster(m2)
                    } else {
                        triggerJumpscare(m2)
                        return
                    }
                }
            }
            continue;
        }
        d2.set(6, 0)
let tCol = d2.get(2), tRow = d2.get(3), curDist = Math.abs(aCol - tCol) + Math.abs(aRow - tRow)
let maxStep = mech == 1 ? 1 : (mech == 2 ? (camsOpen ? 1 : 2) : (mech == 3 ? 4 : 2))
bestNextDist = curDist
        for (let t2 of patrolTiles) {
            sDist = Math.abs(t2.col - aCol) + Math.abs(t2.row - aRow)
            if (sDist >= 1 && sDist <= maxStep) {
                dDoor = Math.abs(t2.col - tCol) + Math.abs(t2.row - tRow)
                if (dDoor < bestNextDist) {
                    bestNextDist = dDoor
                    bestTile = t2
                }
            }
        }
        if (bestTile == null && curDist <= 4) {
            bestTile = tiles.getTileLocation(tCol, tRow)
        }
        if (bestTile != null) {
            if (camsOpen && camLocations.length > 0 && bestTile.col == camLocations.get(activeCamIndex).col && bestTile.row == camLocations.get(activeCamIndex).row) {
                continue;
            }
            tiles.placeOnTile(spr3, bestTile)
        }
    }
})
