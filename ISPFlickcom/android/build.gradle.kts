allprojects {
    repositories {
        google()
        mavenCentral()
        // Fallback repositories for network issues
        maven { url = uri("https://jcenter.bintray.com") }
        maven { url = uri("https://maven.google.com") }
    }
}

// Task to patch legacy plugin manifests
tasks.register("patchLegacyPluginManifests") {
    doLast {
        val pubCache = System.getenv("PUB_CACHE") ?: "${System.getProperty("user.home")}/.pub-cache"
        val manifestPath = "$pubCache/hosted/pub.dev/flutter_internet_speed_test-1.5.0/android/src/main/AndroidManifest.xml"
        val manifestFile = file(manifestPath)
        
        if (manifestFile.exists()) {
            var content = manifestFile.readText()
            if (content.contains("package=")) {
                content = content.replace(
                    Regex("""package\s*=\s*"[^"]*"\s*"""),
                    ""
                )
                manifestFile.writeText(content)
                println("✓ Patched flutter_internet_speed_test AndroidManifest.xml")
            } else {
                println("✓ flutter_internet_speed_test AndroidManifest.xml already patched")
            }
        } else {
            println("⚠ flutter_internet_speed_test manifest not found at: $manifestPath")
        }
    }
}

// Run patch before preBuild
tasks.configureEach {
    if (name == "preBuild") {
        dependsOn("patchLegacyPluginManifests")
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
    
    // Set namespace for flutter_internet_speed_test
    if (project.name == "flutter_internet_speed_test") {
        afterEvaluate {
            if (project.hasProperty("android")) {
                val android = project.extensions.getByName("android")
                try {
                    val setNamespace = android.javaClass.getMethod("setNamespace", String::class.java)
                    setNamespace.invoke(android, "com.shaz.plugin.fist.flutter_internet_speed_test")
                    println("✓ Set namespace for flutter_internet_speed_test")
                } catch (e: Exception) {
                    println("⚠ Could not set namespace for ${project.name}: ${e.message}")
                }
            }
        }
    } else {
        // For other plugins, set namespace if not already set
        afterEvaluate {
            if (project.hasProperty("android")) {
                val android = project.extensions.getByName("android")
                try {
                    val getNamespace = android.javaClass.getMethod("getNamespace")
                    val setNamespace = android.javaClass.getMethod("setNamespace", String::class.java)
                    
                    if (getNamespace.invoke(android) == null) {
                        setNamespace.invoke(android, "com.example.fix.${project.name.replace("-", "_")}")
                    }
                } catch (e: Exception) {
                    // Ignore if method not found
                }
            }
        }
    }
}

subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
