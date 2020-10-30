//var url = "wss://fgz1acx06f.execute-api.us-east-1.amazonaws.com/Development/";
var url = "ws://localhost:4000/socket";
var myColor;
var serverDiv = document.getElementById("players");
webSocket = new WebSocket(url);
webSocket.onmessage = function (event) {
  // expandReaction(0,0,getRed());
  // console.log(event.data);
  var data = JSON.parse(event.data);
  //console.log(data);
  switch (data.action) {
    case "joinRoom":
      var playerarr = data.user;
      console.log(playerarr);
      createPlayerDiv(playerarr);
      document.getElementById("red").getElementsByTagName("span")[0].innerText = "Now Playing";
      document.getElementById("red").getElementsByTagName("span")[0].classList.add("active");
      break;
    case "gameMove":
      expandReaction(data.x,data.y,getMyCol(data.color));
      var sp = serverDiv.getElementsByTagName("span");
      console.log(sp);
      for (let i = 0; i < sp.length; i++) {
        sp[i].classList.remove("active");
        sp[i].innerText="";
      }
      var next = document.getElementById(data.next);
      next.getElementsByTagName("span")[0].classList.add("active");
      next.getElementsByTagName("span")[0].innerText = "Now Playing";
      break;
    case "assignCol":
      console.log("Assigning "+data.color);
      myColor = data.color;
      setup();
      setOwner(data.color);
      break;
    case "gameOver":
      if(data.winner === myColor)
        document.getElementById("winner").innerText = "You are the winner";
      else
        document.getElementById("winner").innerText = "Game Over. The winner is "+data.winner;
      document.getElementById("game").classList.add("hidden");
      document.getElementById("gameOver").classList.remove("hidden");
      console.log("Game Over. The winner is "+data.winner);
      break;
    case "playerLost":
      document.getElementById(data.color).classList.remove("active");
      document.getElementById(data.color).getElementsByTagName("span")[0].innerText = "";
      document.getElementById(data.color).classList.add("lost");
      if(data.color === myColor){
        console.log("You have lost");
      }else{
        console.log(data.color+" has lost");
      }
      break;
    case "Disconnect":
      var playerarr = data.user;
      createPlayerDiv(playerarr);
    break;
    default:
      break;
  }
}
var username = document.getElementById("username");
function connect(){
  document.getElementById("login").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  webSocket.send(JSON.stringify({"action":"joinRoom","username":username.value}));
}
function restart(){
  window.location.reload();
}
webSocket.onopen = function (event) {
  console.log("Connected");
};
function gameOver(){
    webSocket.send(JSON.stringify({action:"GameOver",color:myColor}));
}
function gameMove(x,y){
  webSocket.send(JSON.stringify({"action":"GameMove","x":x,"y":y,"color":myColor}));
}
function getMyCol(myCol){
  if(myCol == "mine"){
    if(myColor == 255){
      return 255;
    }else{
      myCol = myColor;
    }
  }
  if(myCol == "red"){
    return getRed();
  }else if(myCol == "blue"){
    return getBlue();
  }else if(myCol == "green"){
    return getGreen();
  }else if(myCol == "purple"){
    return getPurple();
  }else if(myCol == "pink"){
    return getPink();
  }else if(myCol == "yellow"){
    return getYellow();
  }
}
function createPlayerDiv(playerarr){
  serverDiv.innerHTML = "";
  for (let i = 0; i < playerarr.length; i++) {
    var player = document.createElement("div");
    var player_clr = document.createElement("div");
    var player_nm = document.createElement("div");
    var status = document.createElement("span");
    player_clr.setAttribute("class","player-color");
    player_nm.setAttribute("class","player-name");
    player.setAttribute("class","player");
    if(playerarr[i].color === myColor){
      player.classList.add("self");
    }
    player.setAttribute("id",playerarr[i].color);
    console.log(playerarr[i].username);
    player_clr.style.background = playerarr[i].color;
    player_nm.innerText = str(playerarr[i].username);

    player_nm.append(status);
    player.append(player_clr);
    player.append(player_nm);
    serverDiv.append(player);
  }
}