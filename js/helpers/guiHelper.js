export class GuiHelper{
    constructor(gui, settings){
        this.addEarrings(gui, settings)
        this.addNecklace(gui, settings)
        this.addBangleFolder(gui, settings)
        this.addBottu(gui, settings)
        this.addFaceMaskFolder(gui, settings)
        this.addGoggles(gui, settings)
        this.addHat(gui, settings)
        this.addHeadLocketFolder(gui, settings)
        this.addNoseRing(gui, settings)
        this.addRingFolder(gui, settings)
        this.addShirt(gui, settings)
    }
    addEarrings(gui, settings){
        var earringFolder = gui.addFolder("Earrings(Pre-Release/Release)");
        earringFolder.add(settings.earrings, 'enabled')
            .name("Include Earrings").listen();
        earringFolder.add(settings.earrings.left, 'zOff')
            .name("Z offset(Earring: left)").min(-1000).max(1000).step(1);
        earringFolder.add(settings.earrings.left, 'xOff')
            .name("X offset(Earring: left)").min(-200).max(200).step(1);
        earringFolder.add(settings.earrings.left, 'yOff')
            .name("Y offset(Earring: left)").min(-200).max(200).step(1);
        earringFolder.add(settings.earrings.left, 'scaleOff')
            .name("Scale(Earring: Left)").min(-5).max(10).step(1);
        earringFolder.add(settings.earrings.left, 'zRot')
            .name("Z rot(Earring: left)").min(-1000).max(1000).step(1);
        earringFolder.add(settings.earrings.left, 'xRot')
            .name("X rot(Earring: left)").min(-200).max(200).step(1);
        earringFolder.add(settings.earrings.left, 'yRot')
            .name("Y rot(Earring: left)").min(-200).max(200).step(1);
        earringFolder.add(settings.earrings.right, 'scaleOff')
            .name("Scale(Earring: Right)").min(-5).max(10).step(1);
        earringFolder.add(settings.earrings.right, 'zOff')
            .name("Z offset(Earring: right)").min(-1000).max(1000).step(10);
        earringFolder.add(settings.earrings.right, 'xOff')
            .name("X offset(Earring: right)").min(-200).max(200).step(1);
        earringFolder.add(settings.earrings.right, 'yOff')
            .name("Y offset(Earring: right)").min(-200).max(200).step(1);
        earringFolder.add(settings.earrings.right, 'zRot')
            .name("Z rot(Earring: right)").min(-1000).max(1000).step(1);
        earringFolder.add(settings.earrings.right, 'xRot')
            .name("X rot(Earring: right)").min(-200).max(200).step(1);
        earringFolder.add(settings.earrings.right, 'yRot')
            .name("Y rot(Earring: right)").min(-200).max(200).step(1);
        earringFolder.add(settings.earrings, 'earringType', [ 'Option 1', 'Option 2'] );    
    }
    addNecklace(gui, settings){
        var necklaceFolder = gui.addFolder("Necklace(Pre-Release/Release)");
        necklaceFolder.add(settings.necklace, 'enabled')
            .name("Include Necklace").listen();
        necklaceFolder.add(settings.necklace, 'zOff')
            .name("Z offset(Necklace)").min(-1000).max(1000).step(1);
        necklaceFolder.add(settings.necklace, 'xOff')
            .name("X offset(Necklace)").min(-200).max(200).step(1);
        necklaceFolder.add(settings.necklace, 'yOff')
            .name("Y offset(Necklace)").min(-200).max(400).step(1);
        necklaceFolder.add(settings.necklace, 'rotation')
            .name("Rotation X(Necklace)").min(0).max(2 * Math.PI)
        necklaceFolder.add(settings.necklace, 'scaleOff')
            .name("Scale(Necklace)").min(-10).max(20).step(1);
        necklaceFolder.add(settings.necklace, 'necklaceType', [ 'Option 1', 'Option 2'] );    
    }
    addBottu(gui, settings){
        var bottuFolder = gui.addFolder("Bottu(Release)");
        bottuFolder.add(settings.bottu, 'enabled')
            .name("Include Bottu").listen();
        bottuFolder.add(settings.bottu, 'zOff')
            .name("Z offset(Bottu)").min(-1000).max(1000).step(1);
        bottuFolder.add(settings.bottu, 'xOff')
            .name("X offset(Bottu)").min(-200).max(200).step(1);
        bottuFolder.add(settings.bottu, 'yOff')
            .name("Y offset(Bottu)").min(-200).max(200).step(1);
    }
    addNoseRing(gui, settings){
        var noseRingFolder = gui.addFolder("Nose Ring(Release)");
        noseRingFolder.add(settings.nosering, 'enabled')
            .name("Include Nose Ring").listen();
        noseRingFolder.add(settings.nosering, 'zOff')
            .name("Z offset(Nose Ring)").min(-1000).max(1000).step(1);
        noseRingFolder.add(settings.nosering, 'xOff')
            .name("X offset(Nose Ring)").min(-200).max(200).step(1);
        noseRingFolder.add(settings.nosering, 'yOff')
            .name("Y offset(Nose Ring)").min(-200).max(200).step(1);
    }
    addGoggles(gui, settings){
        var goggleFolder = gui.addFolder("Goggles(Release)");
        goggleFolder.add(settings.goggles, 'enabled')
            .name("Include Goggles").listen();
        goggleFolder.add(settings.goggles, 'zOff')
            .name("Z offset(Goggles)").min(-1000).max(1000).step(1);
        goggleFolder.add(settings.goggles, 'xOff')
            .name("X offset(Goggles)").min(-200).max(200).step(1);
        goggleFolder.add(settings.goggles, 'yOff')
            .name("Y offset(Goggles)").min(-200).max(400).step(1);
        goggleFolder.add(settings.goggles, 'scaleOff')
            .name("Scale(Goggles)").min(-10).max(20).step(1);
        goggleFolder.add(settings.goggles, 'rotZ')
            .name("RotZ(Goggles)").min(-100).max(100).step(1);
        goggleFolder.add(settings.goggles, 'rotX')
            .name("RotX(Goggles)").min(-100).max(100).step(1);
        goggleFolder.add(settings.goggles, 'rotY')
            .name("RotY(Goggles)").min(-100).max(100).step(1);
    }
    addHat(gui, settings){
        var hatFolder = gui.addFolder("hat(Release)");
        hatFolder.add(settings.hat, 'enabled')
            .name("Include hat").listen();
        hatFolder.add(settings.hat, 'zOff')
            .name("Z offset(hat)").min(-1000).max(1000).step(1);
        hatFolder.add(settings.hat, 'xOff')
            .name("X offset(hat)").min(-200).max(200).step(1);
        hatFolder.add(settings.hat, 'yOff')
            .name("Y offset(hat)").min(-200).max(400).step(1);
        hatFolder.add(settings.hat, 'scaleOff')
            .name("Scale(hat)").min(-10).max(20).step(1);
        hatFolder.add(settings.hat, 'rotZ')
            .name("RotZ(hat)").min(-100).max(100).step(1);
        hatFolder.add(settings.hat, 'rotX')
            .name("RotX(hat)").min(-100).max(100).step(1);
        hatFolder.add(settings.hat, 'rotY')
            .name("RotY(hat)").min(-100).max(100).step(1);
    }
    addShirt(gui, settings){
        var shirtFolder = gui.addFolder("Shirts(Alpha)");
        shirtFolder.add(settings.shirt, 'enabled')
            .name("Include Shirt").listen();
        shirtFolder.add(settings.shirt, 'zOff')
            .name("Z offset(Shirt)").min(-1000).max(1000).step(1);
        shirtFolder.add(settings.shirt, 'xOff')
            .name("X offset(Shirt)").min(-500).max(500).step(1);
        shirtFolder.add(settings.shirt, 'yOff')
            .name("Y offset(Shirt)").min(-500).max(400).step(1);
        shirtFolder.add(settings.shirt, 'scaleOff')
            .name("Scale(Shirt)").min(-10).max(40).step(1);
    }
    addNeckOccluder(gui, settings){
        var neckOccluderFolder = gui.addFolder("Neck Occluder(Alpha)");
        neckOccluderFolder.add(settings.neck, 'enabled')
            .name("Include Neck Occluder").listen();
        neckOccluderFolder.add(settings.neck, 'zOff')
            .name("Z offset(Neck)").min(-1000).max(1000).step(1);
        neckOccluderFolder.add(settings.neck, 'xOff')
            .name("X offset(Neck)").min(-500).max(500).step(1);
        neckOccluderFolder.add(settings.neck, 'yOff')
            .name("Y offset(Neck)").min(-500).max(400).step(1);
        neckOccluderFolder.add(settings.neck, 'scaleOff')
            .name("Scale(Neck)").min(-10).max(80).step(1);
    }
    addRingFolder(gui, settings){
        var ringFolder = gui.addFolder("Ring(Alpha)");
        ringFolder.add(settings.ring, 'enabled')
            .name("Include Ring").listen();
        ringFolder.add(settings.ring, 'zOff')
            .name("Z offset(Ring)").min(-1000).max(1000).step(1);
        ringFolder.add(settings.ring, 'xOff')
            .name("X offset(Ring)").min(-500).max(500).step(1);
        ringFolder.add(settings.ring, 'yOff')
            .name("Y offset(Ring)").min(-500).max(400).step(1);
        ringFolder.add(settings.ring, 'scaleOff')
            .name("Scale(Ring)").min(-40).max(40).step(1);
    }
    addBangleFolder(gui, settings){
        var bangleFolder = gui.addFolder("Bangle(Alpha)");
        bangleFolder.add(settings.bangle, 'enabled')
            .name("Include Bangle").listen();
        bangleFolder.add(settings.bangle, 'zOff')
            .name("Z offset(Bangle)").min(-1000).max(1000).step(1);
        bangleFolder.add(settings.bangle, 'xOff')
            .name("X offset(Bangle)").min(-500).max(500).step(1);
        bangleFolder.add(settings.bangle, 'yOff')
            .name("Y offset(Bangle)").min(-500).max(400).step(1);
        bangleFolder.add(settings.bangle, 'scaleOff')
            .name("Scale(Bangle)").min(-80).max(40).step(1);    
    }
    addHeadLocketFolder(gui, settings){
        var headLocketFolder = gui.addFolder("Head Locket(Alpha)");
        headLocketFolder.add(settings.headlocket, 'enabled')
            .name("Include Head Locket").listen();
        headLocketFolder.add(settings.headlocket, 'zOff')
            .name("Z offset(Head Locket)").min(-1000).max(1000).step(1);
        headLocketFolder.add(settings.headlocket, 'xOff')
            .name("X offset(Head Locket)").min(-500).max(500).step(1);
        headLocketFolder.add(settings.headlocket, 'yOff')
            .name("Y offset(Head Locket)").min(-500).max(400).step(1);
        headLocketFolder.add(settings.headlocket, 'xRot')
            .name("Xrot Offset(HeadLocket)").min(-1000).max(1000).step(1);
        headLocketFolder.add(settings.headlocket, 'yRot')
            .name("Yrot Offset(HeadLocket)").min(-500).max(500).step(1);
        headLocketFolder.add(settings.headlocket, 'zRot')
            .name("Zrot Offset(HeadLocket)").min(-500).max(400).step(1);
        headLocketFolder.add(settings.headlocket, 'scaleOff')
            .name("Scale(Head Locket)").min(-80).max(40).step(1);
    }
    addFaceMaskFolder(gui, settings){
        var faceMaskFolder = gui.addFolder("Face Mask(Alpha)")
        faceMaskFolder.add(settings.facemask, 'enabled')
            .name("Include Face Mask").listen();
        faceMaskFolder.add(settings.facemask, 'zOff')
            .name("Z offset(Face Mask)").min(-1000).max(1000).step(1);
        faceMaskFolder.add(settings.facemask, 'xOff')
            .name("X offset(Face Mask)").min(-500).max(500).step(1);
        faceMaskFolder.add(settings.facemask, 'yOff')
            .name("Y offset(Face Mask)").min(-500).max(400).step(1);
        faceMaskFolder.add(settings.facemask, 'xRot')
            .name("Xrot Offset(Face Mask)").min(-1000).max(1000).step(1);
        faceMaskFolder.add(settings.facemask, 'yRot')
            .name("Yrot Offset(Face Mask)").min(-500).max(500).step(1);
        faceMaskFolder.add(settings.facemask, 'zRot')
            .name("Zrot Offset(Face Mask)").min(-500).max(400).step(1);
        faceMaskFolder.add(settings.facemask, 'scaleOff')
            .name("Scale(Face Mask)").min(-80).max(40).step(1);
    }
}