# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# === V-Taper Coach - Production ProGuard Rules ===
# Generated: 2026-04-18 for Google Play Store Release

# Keep application classes
-keep class com.vtaper.coach.** { *; }
-keepclassmembers class com.vtaper.coach.** { *; }

# Capacitor WebView and Plugins
-keep class com.getcapacitor.** { *; }
-keepclassmembers class com.getcapacitor.** { *; }
-keep class * extends com.getcapacitor.Plugin { *; }

# Capacitor Cordova Plugins
-keep class com.capacitorjs.plugins.** { *; }
-keep class org.apache.cordova.** { *; }

# React/Web Asset Protection
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# WebView JavaScript Interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Stripe SDK
-keep class com.stripe.android.** { *; }
-keep class com.stripe.android.payments.** { *; }
-keep class com.stripe.android.model.** { *; }

# Supabase
-keep class io.github.jan.supabase.** { *; }
-keep class io.ktor.** { *; }

# OkHttp (used by Supabase)
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# Kotlin Coroutines
-keep class kotlinx.coroutines.** { *; }

# Framer Motion / Recharts (web libraries)
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod <methods>;
}

# Preserve line numbers for crash reporting
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Prevent warnings for libraries we can't control
-dontwarn com.stripe.android.**
-dontwarn io.ktor.**
-dontwarn kotlinx.coroutines.**
-dontwarn okhttp3.**
-dontwarn okio.**
