import java.io.StringReader;

import javax.json.Json;
import javax.json.JsonObject;
import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

public class MessageDecoder implements Decoder.Text<JsonObject> {

  @Override
  public JsonObject decode(String jsonMessage) throws DecodeException {
    System.out.println("Decoding: "+jsonMessage);

    JsonObject jsonObject = (Json.createReader(new StringReader(jsonMessage))).readObject();
    // Message message = new Message();
    // message.setSubject(jsonObject.getString("subject"));
    //message.setContent(jsonObject.getString("content"));
    return jsonObject;

  }

  @Override
  public boolean willDecode(String jsonMessage) {
    try {
      // Check if incoming message is valid JSON
      Json.createReader(new StringReader(jsonMessage)).readObject();
      System.out.println("Can decode");
      return true;
    } catch (Exception e) {
      System.out.println(e);
      return false;
    }
  }

  @Override
  public void init(EndpointConfig ec) {
    System.out.println("MessageDecoder -init method called");
  }

  @Override
  public void destroy() {
    System.out.println("MessageDecoder - destroy method called");
  }

}