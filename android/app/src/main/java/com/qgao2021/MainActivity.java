package com.qgao2021;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;   // HERE

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "qgao2021";
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
    SplashScreen.show(this,true);  // 添加这一句

  }
}
