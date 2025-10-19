package src.main.java.com.mrca.util;



public class SlugUtil {
  public static String slugify(String s){
    return s.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .trim().replaceAll("\\s+", "-");
  }
}