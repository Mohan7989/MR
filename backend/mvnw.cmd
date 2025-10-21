@echo off
setlocal

set MAVEN_PROJECT_BASEDIR=%~dp0
set MAVEN_WRAPPER_JAR=%MAVEN_PROJECT_BASEDIR%.mvn\wrapper\maven-wrapper.jar

if not exist "%MAVEN_WRAPPER_JAR%" (
  echo Downloading Maven Wrapper...
  mkdir "%MAVEN_PROJECT_BASEDIR%.mvn\wrapper"
  curl -o "%MAVEN_WRAPPER_JAR%" https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar
)

java -jar "%MAVEN_WRAPPER_JAR%" %*
endlocal