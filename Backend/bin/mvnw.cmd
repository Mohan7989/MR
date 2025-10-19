@echo off
setlocal
set DIR=%~dp0
if not exist "%DIR%\.mvn\wrapper\maven-wrapper.jar" (
  mkdir "%DIR%\.mvn\wrapper"
  powershell -Command "Invoke-WebRequest -Uri https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar -OutFile '%DIR%\.mvn\wrapper\maven-wrapper.jar'"
)
set JAVA_EXE=java
"%JAVA_EXE%" -classpath "%DIR%\.mvn\wrapper\maven-wrapper.jar" -Dmaven.multiModuleProjectDirectory="%DIR%" io.takari.maven.wrapper.MavenWrapperMain %*
endlocal