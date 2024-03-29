{
const WIDTH = 14
const HEIGHT = 12
const SIZE = 12
const X_OFFSET = (174 - (WIDTH*SIZE))/2
const Y_OFFSET = 10

class Game {
  constructor(){
    this.paused=false

    this.width=WIDTH
    this.height=HEIGHT
    this.highscore=0 // store somewhere?
    this.gameOver=()=>{
      this.init()
    }
    this.init()
  }
  init(){
    this.snake={bits:[[11,6],[10,6],[9,6],[8,6]],direction:'r'}
    this.moveApple()
    this.points=0
    this.frame=0
  }
  tick(){
    this.draw()
    if(this.paused){
      this.frame++
      return;
    }
    const oldState=this.snake.bits.slice()
    const head=this.moveCalc(oldState[0],this.snake.direction)
    this.snake.bits=this.snake.bits.slice()
    this.snake.bits.unshift(head)
    if(
      head[0]===this.apple[0] &&
      head[1]===this.apple[1]
    ) {
      this.points++
      if(this.points>this.highscore)this.highscore = this.points
      this.moveApple()
    }
    else this.snake.bits.pop()
    this.collisionCheck();
    this.frame++
  }
  moveCalc(head,dir){
    const w = this.width
    const h = this.height
    const x = head[0]
    const y = head[1]
    return (
      dir=='u'?[(w+x)%w,(h+y-1)%h]:
      dir=='l'?[(w+x-1)%w,(h+y)%h]:
      dir=='d'?[(w+x)%w,(h+y+1)%h]:
      [(w+x+1)%w,y%h]
    )
  }
  moveApple(){
    let pos = null
    while(!pos){
      let temp = [
        Math.floor(this.width*Math.random()),
        Math.floor(this.height*Math.random()),
      ]
      if(!this.snake.bits.find(
          (xy)=>(xy[0]==temp[0]&&xy[1]==temp[1])
        ))pos=temp;
    }
    this.apple = pos
  }
  collisionCheck(){
    const bitSet = this.snake.bits.map(b=>b.toString()).filter((v,i,a)=>a.indexOf(v)==i)
    if(bitSet.length<this.snake.bits.length)this.gameOver();
  }
  listen(k){
    // if paused, ignore inputs
    if(this.paused)return;
    const alt = false
    // 'original' controls
    if(!alt)switch(k){
      case 'ArrowUp':
        if(this.snake.direction!='d') this.snake.direction = 'u';
        break;
      case 'ArrowDown':
        if(this.snake.direction!='u') this.snake.direction = 'd';
        break;
      case 'ArrowLeft':
        if(this.snake.direction!='r') this.snake.direction = 'l';
        break;
      case 'ArrowRight':
        if(this.snake.direction!='l') this.snake.direction = 'r';
        break;
    }
    // alt control scheme
    const dirs = ['u','r','d','l']
    if(alt)switch(k){
      case 'ArrowLeft':
        this.snake.direction = dirs[(4+dirs.findIndex(dir=>dir==this.snake.direction)-1)%4];
        break;
      case 'ArrowRight':
        this.snake.direction = dirs[(4+dirs.findIndex(dir=>dir==this.snake.direction)+1)%4];
        break;
    }
  }
  draw(){
    Bangle.setLCDPower(0.8);
    g.reset().clearRect(Bangle.appRect);
    g.setBgColor(g.theme.bg);
    g.setColor(g.theme.fg);
    g.drawRect(X_OFFSET,Y_OFFSET,X_OFFSET+(WIDTH*SIZE),Y_OFFSET+(HEIGHT*SIZE))
    this.snake.bits.forEach(
      bit => {
        const x = X_OFFSET+(bit[0]*SIZE)
        const y = Y_OFFSET+(bit[1]*SIZE)
        g.setColor(0.0,0.7,0.0);
        g.fillRect(x,y,x+SIZE,y+SIZE);
      }
    )
    const x = X_OFFSET+(this.apple[0]*SIZE)
    const y = Y_OFFSET+(this.apple[1]*SIZE)
    g.setColor(1.0,0.0,0.0);
    g.fillRect(x,y,x+SIZE,y+SIZE);
    g.setColor(g.theme.fg);
    g.drawString(`points: ${this.points}\thighscore: ${this.highscore}`, 5, 176-15, true /*clear background*/);
  }
  pause(){this.paused=true}
  unpause(){this.paused=false}
}

let inited = false

const start = () => {
  inited = true
  const game = new Game()
  game.init();
  Bangle.on('swipe', function(directionLR, directionUD) {
    if(directionLR!=0){
      game.listen(directionLR<0?'ArrowLeft':'ArrowRight');
    }
    else{
      game.listen(directionUD<0?'ArrowUp':'ArrowDown');
    }
  });
  setInterval(() => {
    game.tick();
  }, 250);
}

start()
}