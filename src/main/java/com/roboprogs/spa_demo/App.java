package com.roboprogs.spa_demo;

import static spark.Spark.*;

// @formatter:off
//
// see:  https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=intellij+disable+auto+format&*
// e.g. -
//      http://www.gamefromscratch.com/post/2015/02/01/Preventing-IntelliJ-code-auto-formatting-from-ruining-your-day.aspx
//      http://stackoverflow.com/questions/3375307/how-to-disable-code-formatting-for-some-part-of-the-code-using-comments

/**
 * A VERY simple web server / application using the Spark Java library / wrapper.
 * Used as a vehicle for a simple backend to a demo/stub SPA.
 */
public class App {

    /** configure and start up our web server / app */
    public static void main( String[] args ) {
        // read static files from jar:
        staticFiles.location( "/public" );

        // dummy web resource/endpoint, so that server doesn't exit
        get(
            "/hello",
            (req, res) -> "Hello World"
        );
    }

}
