import javax.websocket.OnMessage;
import java.util.*;
import javax.websocket.OnOpen;
import javax.websocket.OnClose;
import javax.websocket.Session;
import javax.websocket.SendResult;
import javax.websocket.SendHandler;
import javax.websocket.server.ServerEndpoint;
import javax.websocket.EncodeException;
import java.io.IOException;
import javax.json.*;
import org.json.*;


@ServerEndpoint(value = "/socket" ,decoders = {MessageDecoder.class})
public class ServerEndPoint {
    private static List<Session> Users = new ArrayList<Session>();
    private static String [] cols = {"red","blue","green","yellow","purple","pink"};
    private static Map<String,String> Usernames = new HashMap<String,String>();
    private static List<String> inPlay = new ArrayList<String>();
    private static int chance = 0;
    @OnOpen
    public void onOpen(){
        System.out.println("Player has joined");
    }
    @OnClose
    public void onClose(Session session){
        System.out.println("Player has left");
        Usernames.remove(session.getUserProperties().get("username"));
        Users.remove(session);
        inPlay.remove(session.getUserProperties().get("username"));
        System.out.println(Users.size());
        try {
            JSONArray user = new JSONArray();
            for(String username : Usernames.keySet()){
                JSONObject temp = new JSONObject();
                temp.put("username",username);
                temp.put("color",Usernames.get(username));
                user.put(temp);
            }
            JSONObject reply = new JSONObject().put("user",user);
            reply.put("action","Disconnect");
            // System.out.println(user.toString());
            for(Session client : Users ){
                if(client.isOpen())
                    client.getBasicRemote().sendText(reply.toString());
            }
        } catch (Exception e) {
            System.out.println(e);
        }

    }
    @OnMessage
    public void OnMessage(JsonObject message, Session session) throws IOException, EncodeException {
        System.out.println("Message: "+message);
        String action = message.getString("action");
        switch (action) {
            case "joinRoom":
                System.out.println("Session "+session.getId());
                session.getUserProperties().put("username",message.getString("username"));
                Users.add(session);
                Usernames.put(message.getString("username"),cols[Users.size() - 1] );
                inPlay.add(message.getString("username"));
                try {
                    JSONObject colsAssign = new JSONObject().put("color",cols[Users.size() - 1]);
                    colsAssign.put("action","assignCol");
                    session.getBasicRemote().sendText(colsAssign.toString());
                } catch (Exception e) {
                    System.out.println(e);
                }
                try {
                    JSONArray user = new JSONArray();
                    for(String username : Usernames.keySet()){
                        JSONObject temp = new JSONObject();
                        temp.put("username",username);
                        temp.put("color",Usernames.get(username));
                        user.put(temp);
                    }
                    JSONObject reply = new JSONObject().put("user",user);
                    reply.put("action","joinRoom");
                    // System.out.println(user.toString());
                    for(Session client : Users ){
                        if(client.isOpen())
                            client.getBasicRemote().sendText(reply.toString());
                    }
                } catch (Exception e) {
                    System.out.println(e);
                }

                break;
            case "GameMove":
                System.out.println("GameMove");
                int x = message.getInt("x");
                int y = message.getInt("y");
                String color = message.getString("color");
                System.out.println(color+" "+Usernames.get(inPlay.get((chance)%inPlay.size())));
                System.out.println(inPlay);
                System.out.println(chance);
                if(color.equals(Usernames.get(inPlay.get((chance)%inPlay.size())))){
                    try {
                        chance++;
                        JSONObject gameMove = new JSONObject();
                        gameMove.put("x",x);
                        gameMove.put("y",y);
                        gameMove.put("color",Usernames.get(session.getUserProperties().get("username")));
                        System.out.println(Usernames.get(session.getUserProperties().get("username")));
                        gameMove.put("next",Usernames.get(inPlay.get(chance%inPlay.size())));
                        gameMove.put("action","gameMove");
                        System.out.println(x+" "+y);
                        System.out.println(session.getId());
                        for(Session client : Users){
                            if(client.isOpen()){// && client.getId() != session.getId()){
                                System.out.println("sending to "+client.getId());
                                client.getBasicRemote().sendText(gameMove.toString());
                            }
                        }
                    } catch (Exception e) {
                        System.out.println(e);
                    }
                }else{
                    System.out.println("No");
                }
                break;
            case "GameOver":
                System.out.println("Game Over for: "+session.getUserProperties().get("username"));
                inPlay.remove(session.getUserProperties().get("username"));
                try {
                    JSONObject gameoverRep = new JSONObject().put("action","playerLost");
                    gameoverRep.put("color",Usernames.get(session.getUserProperties().get("username")));
                    for(Session client: Users){
                        if(client.isOpen())
                            client.getAsyncRemote().sendText(gameoverRep.toString());
                    }
                } catch (Exception e) {
                    System.out.println(e);
                }
                if(inPlay.size() == 1){
                    try {
                        JSONObject gameFinRep = new JSONObject().put("winner",Usernames.get(inPlay.get(0)));
                        gameFinRep.put("action","gameOver");
                        for(Session client: Users){
                            if(client.isOpen()){
                                client.getAsyncRemote().sendText(gameFinRep.toString());
                            }
                        }
                    } catch (Exception e) {
                        System.out.println(e);
                    }
                }
                break;
       
            default:
            System.out.println("Action: "+action);
                break;
        }
        //return "Message Received";
    }
    @OnMessage
    public void getUserName(String username){
        System.out.println(username);
    }
    @OnMessage(maxMessageSize = 1024000)
    public byte[] handleBinaryMessage(byte[] buffer) {
        System.out.println("New Binary Message Received");
        return buffer;
    }
}