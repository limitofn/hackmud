function (c, a) // s:#s.username.target_script
{
    // Handle the case with no arguments passed.
    if (a == null) {
        return "usage: harvest{s:#s.username.target_script}"
    }

    var pages = a.s.call().split("\n").filter(function(v) {
            return v.includes("|")                     // look for the line with pages listed
        }).join("").split("|").map(function(v) {       // split the pages up
            return v.trim()                            // trim whitespace
        }).filter(function(v){
            return v.length > 0                        // filter out empty results from this list
        }),
        args = {},                                     // arguments passed to the function passed in to this script
        out = a.s.call({}),                            // generic output variable
        none = out.match(/with ([a-z]+):"([a-z]+)"/i), // parse the output of the function with no parameters passed in
        cmd = none[1],                                 // the command used to view pages
        cw = none[2],                                  // the codeword needed to access the projects
        rePr = /(date for|continues on|of the|developments on) ([a-z0-9_]+(.sh|.exe)?)/ig, // regex for projects
        rePa = /(strategy )([a-z0-9_]+)/ig,                                                // regex for password(s)
        m,
        es = [],  // entries
        prs = [], // projects
        pas = [], // passwords
        ts = []   // targets

    // Look for projects and passwords in each of the pages.
    pages.forEach(function(v) {
        args = {}
        // Craft the arguments that will be called.
        // e.g.: {"see":"about_us"}
        args[cmd] = v

        // Call the function with the custom arguments.
        out = a.s.call(args)

        // Search for projects.
        while (m = rePr.exec(out)) {
            prs.push(m[2])
        }

        // Search for passwords.
        while (m = rePa.exec(out)) {
            pas.push(m[2])
        }
    })

    // Gather the results from each of the projects (and assume only one password was found).
    prs.forEach(function(p) {
        // Call the function with the custom arguments.
        // Note: The password parameter can either be p, pass, or password.
        //       Therefore, we pass in all three, since it ignores unneeded parameters.
        out = a.s.call({
            p:pas[0],        // password
            pass:pas[0],     // password
            password:pas[0], // password
            project:p,       // project
            [cmd]:cw,        // codeword
        })

        // Parse each entry and filter out none, empty, nil, error, etc.
        out.split("\n").forEach(function(e){
            // Make sure it is a valid entry.
            if (e && e.includes(".")) {
                ts.push(e)
            }
        })
    })

    // TODO: find out why this isn't getting called.
    // Run the cracker on the valid targets.
    ts.forEach(function(t) {
        #s.coeus.t1_cracker({t:"#s." + t})
    })

    return ts
}
