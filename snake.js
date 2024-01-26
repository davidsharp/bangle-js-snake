const WIDTH = 20
const HEIGHT = 20
const SIZE = 8

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
    this.snake={bits:[[11,6],[10,6],[9,6]],direction:'r'}
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
    g.reset().clearRect(Bangle.appRect);
    for(let y=0;y<this.height;y++){
      for(let x=0;x<this.width;x++){
          const _x = x * SIZE
          const _y = y * SIZE
          if(this.snake.bits.find(bit=>bit[0]==x&&bit[1]==y)){
            g.setColor(0.0,0.0,0.0);
            g.fillRect(_x,_y,_x+SIZE,_y+SIZE);
          }
          else if(this.apple[0]==x&&this.apple[1]==y){
            g.setColor(0.0,0.0,0.0);
            g.fillRect(_x,_y,_x+SIZE,_y+SIZE);
          }
      }
    }
    //console.log(`%c${arr.join('\n')}`,"background-color: green; color: red; font-weight: bold; padding: 4px; line-height: 0.6;")
    console.log(`points: ${this.points}\thighscore: ${this.highscore}`)
  }
  pause(){this.paused=true}
  unpause(){this.paused=false}
}

let inited = false

const start = () => {
  inited = true
  const game = new Game()
  game.init();
  //document.addEventListener('keydown', e => game.listen(e.key))
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
  }, 150);
}

start()
