class Wall {
    constructor(p1x,p1y,p2x,p2y,WallType={type:'Cinder', attenuation:10}) {
        this.p1x = p1x; 
        this.p1y = p1y; 
        this.p2x = p2x; 
        this.p2y = p2y; 
        this.walltype = WallType;
    }
    
}