package com.glasstv.launcher;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.JavascriptInterface;
import android.view.KeyEvent;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.*;

public class MainActivity extends Activity {
    private WebView web;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        web.setBackgroundColor(android.graphics.Color.BLACK);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(true);
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient());
        web.addJavascriptInterface(new Bridge(), "GlassTVAndroid");
        setContentView(web);
        web.loadUrl("file:///android_asset/index.html");
    }
    private class Bridge {
        @JavascriptInterface public String getInstalledApps() {
            JSONArray array = new JSONArray();
            PackageManager pm = getPackageManager();
            Intent query = new Intent(Intent.ACTION_MAIN);
            query.addCategory(Intent.CATEGORY_LEANBACK_LAUNCHER);
            List<ResolveInfo> results = new ArrayList<>(pm.queryIntentActivities(query, 0));
            Intent regular = new Intent(Intent.ACTION_MAIN);
            regular.addCategory(Intent.CATEGORY_LAUNCHER);
            results.addAll(pm.queryIntentActivities(regular, 0));
            Set<String> seen = new HashSet<>();
            Collections.sort(results, (a,b) -> String.valueOf(a.loadLabel(pm)).compareToIgnoreCase(String.valueOf(b.loadLabel(pm))));
            for (ResolveInfo info : results) {
                String pkg = info.activityInfo.packageName;
                if (pkg.equals(getPackageName()) || !seen.add(pkg)) continue;
                try { JSONObject item = new JSONObject(); item.put("name", String.valueOf(info.loadLabel(pm))); item.put("packageName",pkg); array.put(item); }
                catch (Exception ignored) { }
            }
            return array.toString();
        }
        @JavascriptInterface public boolean launchApp(String packageName) {
            if (packageName == null || packageName.isEmpty()) return false;
            PackageManager pm = getPackageManager();
            Intent launch = pm.getLeanbackLaunchIntentForPackage(packageName);
            if (launch == null) launch = pm.getLaunchIntentForPackage(packageName);
            if (launch == null) return false;
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            try { startActivity(launch); return true; } catch (Exception e) { return false; }
        }
    }
    @Override public boolean onKeyDown(int code, KeyEvent event) {
        if (code == KeyEvent.KEYCODE_BACK && web.canGoBack()) { web.goBack(); return true; }
        return super.onKeyDown(code, event);
    }
    @Override protected void onDestroy() { if (web != null) web.destroy(); super.onDestroy(); }
}
