public class Message {

    private String subject;
    private String content;
  
    public String getSubject() {
      System.out.println(subject);
      return subject;
    }
  
    public void setSubject(String subject) {
      this.subject = subject;
    }
  
    public String getContent() {
      return content;
    }
  
    public void setContent(String content) {
      this.content = content;
    }
  
  }