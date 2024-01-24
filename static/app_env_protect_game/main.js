class HP_gauge {
  constructor(_x,_y,_xsiz,_ysiz){
    this.maxhp = 100;
    this.hp = this.maxhp;
    this.delta_hp =  0.2;//変化量
    this.x = _x;this.y = _y;this.xsiz = _xsiz;this.ysiz = _ysiz;
  }

  draw(){
    //外枠
    fill(200);
    rect(this.x,this.y,this.xsiz,this.ysiz);
    //中身 
    let length = this.ysiz * this.hp/this.maxhp;
    if(this.hp >= 0){
      fill(32,223,128);
      rect(this.x,this.y + this.ysiz - length,this.xsiz,length);
    }
  }

  update(x){
    this.hp += x * this.delta_hp;
    if(this.hp > 100){this.hp = 100;}
    if(this.hp < 0){this.hp = 0;}
  }
  
}

class Oxgen_gauge{
  constructor(_x,_y,_xsiz,_ysiz){
    this.max_oxgen = 100;
    this.oxgen = this.max_oxgen;
    this.delta_oxgen = 0.1;
    this.x = _x;this.y = _y;this.xsiz = _xsiz;this.ysiz = _ysiz;
  }

  draw(){
    //外枠
    fill(200);
    rect(this.x,this.y,this.xsiz,this.ysiz);
    //中身 
    let length = this.ysiz * this.oxgen/this.max_oxgen;
    if(this.oxgen >= 0){
        fill(0,255,255);
        rect(this.x,this.y + this.ysiz - length,this.xsiz,length);
    }
  }

  update(x){
    this.oxgen += x * this.delta_oxgen;
    if(this.oxgen > 100)this.oxgen = 100;
    if(this.oxgen < 0)this.oxgen = 0;
  }

}

class Coins{
  constructor(_x,_y,_d){
    this.coincnt = 1;
    this.x = _x;this.y = _y;this.d = _d;
  }
  draw(){
    for(let i = 0;i < this.coincnt;i++){
      fill(255,230,0);
      circle(this.x ,this.y - (this.d + 3)*i,this.d);
    }
  }
}

const landstate = {
  tree : "tree",
  fire : "fire", 
  field :"field" ,
}

class Land{
  constructor(_minx,_maxx,_miny,_maxy){
    this.minx = _minx;
    this.maxx = _maxx;
    this.miny = _miny;
    this.maxy = _maxy;
    this.state = null;
  }

  position(){
    let minx = this.minx;let maxx = this.maxx;
    let miny = this.miny;let maxy = this.maxy;
    return {minx,maxx,miny,maxy};
  }

}

class Tree extends Land{
  constructor(_minx,_maxx,_miny,_maxy,_c){
    super(_minx,_maxx,_miny,_maxy);
    this.state = landstate.tree;
    this.c = _c;//係数
    this.level = 1;
    this.needpoint = 1000;
    this.nowpoint = 0;
    this.maxlevel = 3;
  }

  stateupdate(){
    if(this.level == this.maxlevel)return false;
    this.nowpoint += 5 * this.c;
    if(this.nowpoint >= this.needpoint){
      this.nowpoint = 0;
      this.level+= 1;
    }
    return false;
  }
}

class Fire extends Land{
  constructor(_minx,_maxx,_miny,_maxy,_c){
    super(_minx,_maxx,_miny,_maxy);
    this.state = landstate.fire;
    this.c = _c;//係数
    this.nowpoint = 0;
    this.needpoint = 100;
  }
  
  stateupdate(){
    //bool返す
    this.nowpoint += this.c * 1;
    return this.nowpoint >= this.needpoint ? true: false;
  }
}

class Field extends Land{
  constructor(_minx,_maxx,_miny,_maxy,_c){
    super(_minx,_maxx,_miny,_maxy);
    this.state = landstate.field;
    this.c = _c;//係数
    this.level = 1;
    this.needpoint = 1000;
    this.nowpoint = 0;
    this.maxlevel = 3;
    //収穫(コインを増やす用)
    this.harvestpoint = 0;
    this.harvestable = 500;
  }

  stateupdate(){
    if(this.level == this.maxlevel)return false;
    this.nowpoint += 2 * this.c;
    if(this.nowpoint >= this.needpoint){
      this.nowpoint = 0;
      this.level+= 1;
    }
    this.harvestpoint += 1 * (this.maxlevel +1 - this.level);
    return false;
  }


}

let canvas;
let minx,maxx,miny,maxy;//森林農地部分の指定
let xnum,ynum;//森林農地を何分割するか
let landxsiz = 0,landysiz = 0;
let lands = [];//土地情報
let hp,oxgen,coins;
let isfinish = false;

function setup(){
  canvas = createCanvas(800, 400);
  canvas.parent('myContainer');
  background(100);
  minx = width/3;maxx = width;
  miny = 0;maxy = height* 9/10;
  xnum = 3;ynum = 2;
  landxsiz = (maxx - minx)/xnum;
  landysiz = (maxy - miny)/ynum;

  hp = new HP_gauge(10,height/3,40,height/2);
  oxgen = new Oxgen_gauge(60,height/3,40,height/2);
  coins = new Coins(130,height/2 + height/3,30);
  for(let i = 0;i < ynum;i++){
    lands[i] = [];
    for(let j = 0;j < xnum;j++){
      if((i + j) % 2 == 0){
        lands[i][j] = new Tree(
          minx+landxsiz*j,minx + landxsiz * (j+1),
          miny + landysiz * i,miny + landysiz * (i+1),1);
        lands[i][j].level += 1;
      }else{
        lands[i][j] = new Field(
          minx+landxsiz*j,minx + landxsiz * (j+1),
          miny + landysiz * i,miny + landysiz * (i+1),1);
      }

    }
  }
}

function hpupdate(){
  hp.update(-1);
}

function oxgenupdate(){
  //森の状態を利用して酸素ゲージを増減させる
  let treelevel_sum = 0;
  for(let i = 0;i < ynum;i++)for(let j = 0;j < xnum;j++){
    if(lands[i][j].state == landstate.tree){
      treelevel_sum += lands[i][j].level;
    }
  }
  oxgen.update(treelevel_sum - 8);

}

function coinsupdate(){
  //収穫してコインを増やす
  for(let i = 0;i < ynum;i++)for(let j = 0;j < xnum;j++){
    if(lands[i][j].state == landstate.field){
      if(lands[i][j].harvestpoint >= lands[i][j].harvestable){
        coins.coincnt+= 1;
        lands[i][j].harvestpoint = 0;
      }
    }
  }
}


function drawlands_and_update_status(){
  //マス目の描画ついでにマス目の状態更新
  for(let i = 0;i < ynum;i++){
    for(let j = 0;j < xnum;j++){
      if(lands[i][j].state == landstate.tree){
        let tmp = 210 *(lands[i][j].maxlevel - lands[i][j].level)/lands[i][j].maxlevel;
        fill(tmp,255,tmp);
        lands[i][j].stateupdate();
      }else if(lands[i][j].state == landstate.fire){
        fill(255,0,0);
        let ret = lands[i][j].stateupdate();
        if(ret){
          let minx = lands[i][j].minx;let maxx = lands[i][j].maxx;
          let miny = lands[i][j].miny;let maxy = lands[i][j].maxy; 
          lands[i][j] = new Field(minx,maxx,miny,maxy,1);
        }
      }else{
        let tmp = 200 *(lands[i][j].maxlevel - lands[i][j].level)/lands[i][j].maxlevel;
        fill(tmp,tmp/2,0);
        lands[i][j].stateupdate();
      }

      rect(lands[i][j].minx,lands[i][j].miny,landxsiz,landysiz);
    }
  }
}

function mouseaction(){
  //マウスのクリックによって耕地森林の状態を変化させたりリスタートできるようにする  
  if(isfinish){
    //リスタート
    hp = new HP_gauge(10,height/3,40,height/2);
    oxgen = new Oxgen_gauge(60,height/3,40,height/2);
    coins = new Coins(130,height/2 + height/3,30);
    for(let i = 0;i < ynum;i++){
      lands[i] = [];
      for(let j = 0;j < xnum;j++){
        if((i + j) % 2 == 0){
          lands[i][j] = new Tree(
            minx+landxsiz*j,minx + landxsiz * (j+1),
            miny + landysiz * i,miny + landysiz * (i+1),1);
          lands[i][j].level += 1;
        }else{
          lands[i][j] = new Field(
            minx+landxsiz*j,minx + landxsiz * (j+1),
            miny + landysiz * i,miny + landysiz * (i+1),1);
        }

      }
    }
    isfinish = false;
  }else{
    //押されたのが森林か農地だったら
    console.log(mouseX,mouseY);
    let fin = false;
    for(let i = 0;i < ynum;i++)for(let j = 0;j < xnum;j++){
      let pos = lands[i][j].position();
      if(pos.minx <= mouseX && mouseX < pos.maxx
        && pos.miny <= mouseY && mouseY < pos.maxy){
          fin = true;
          if(lands[i][j].state == landstate.tree){
            //火をつける
            lands[i][j] = new Fire(pos.minx,pos.maxx,pos.miny,pos.maxy,1);
          }else if(lands[i][j].state == landstate.field){
            //植林
            lands[i][j] = new Tree(pos.minx,pos.maxx,pos.miny,pos.maxy,1/lands[i][j].level);
          }
      }
    }
    if(fin)return ;
    //それ以外のとこおいたらコイン使ってHP回復
  
    if(coins.coincnt >= 1){
      coins.coincnt -= 1;
      hp.hp += 20;
    }
  }

}

function mousePressed(){
  mouseaction();
}

function judge_isfinished(){
  //ゲームオーバーかどうかを判定する
  if(hp.hp <= 0 || oxgen.oxgen <= 0){
    isfinish = true;
    if(hp.hp <= 0){
      news_type = "poverty";
    }else if(oxgen.oxgen <= 0){
      news_type = "environment";
    }else{
      console.log("error");
    }
  }
}

function draw(){
  background(100);
  judge_isfinished();
  if(isfinish){
    //ゲームオーバーなのでゲームオーバー画面を出力する
    fill(255,0,0);
    textAlign(CENTER);
    textSize(50);
    text("GameOver", width/2, height/2);
    //リスタートボタン作る
    fill(0,200,0);
    rect(width/2-100,height/2+ 50,200,50);

    fill(255)
    textSize(30);
    text("Restart", width/2, height/2 + 85);

    redirectToresult(news_type);

    noLoop();
  }else{
    drawlands_and_update_status();
    
    //HPゲージの描画
    hp.draw();
    hpupdate();
  
    //酸素ゲージの描画
    oxgen.draw();
    oxgenupdate();
  
    //コインの描画
    coins.draw();
    coinsupdate();

  }
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

const csrfToken = getCookie('csrftoken');

function redirectToresult(news_type) {
  let method = "POST";
  let url = "newsFeed/";
  let body = JSON.stringify({ result: news_type });
  let headers = {
    "Content-Type": "application/json",
    'X-CSRFToken': csrfToken
  };

  fetch(url, { method, headers, body })
    .then(response => response.text())
    .then(data => {
      // Save data to local storage
      localStorage.setItem("news", data);
      // Navigate to the result page
      location.assign("result/");
    })
    .catch(error => console.error('Error:', error));
}