import java.io.File

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.rizzboard"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.rizzboard"
        minSdk = 26
        targetSdk = 35
        versionCode = 4
        versionName = "1.2.1"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    val releaseKeystorePath = System.getenv("RIZZ_KEYSTORE_PATH")
        ?: rootProject.file("keystore/rizzboard-release.jks").absolutePath
    val releaseKeystoreFile = File(releaseKeystorePath)

    signingConfigs {
        if (releaseKeystoreFile.exists()) {
            create("release") {
                storeFile = releaseKeystoreFile
                storePassword = System.getenv("RIZZ_KEYSTORE_PASSWORD") ?: "rizzboard2026"
                keyAlias = System.getenv("RIZZ_KEY_ALIAS") ?: "rizzboard"
                keyPassword = System.getenv("RIZZ_KEY_PASSWORD") ?: "rizzboard2026"
                enableV1Signing = true
                enableV2Signing = true
                enableV3Signing = true
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            signingConfig = if (releaseKeystoreFile.exists()) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }

    kotlinOptions {
        jvmTarget = "21"
    }

    sourceSets {
        getByName("main") {
            assets.srcDirs("src/main/assets")
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.gms:play-services-mlkit-text-recognition:19.0.1")
}
