var amf = require("./amf.js");

var exampleName = process.argv.slice(2)[0]
var format = ".raml"
var spec = "RAML 1.0"
if (exampleName.endsWith("-oas")) {
    exampleName = exampleName.replace("-oas", "")
    format = ".oas"
    spec = "OAS 3.0"
}

amf.plugins.document.WebApi.register();
amf.plugins.document.Vocabularies.register();
amf.plugins.features.AMFValidation.register();

var runExample = function(exampleName) {
    console.log("\n\n\nRunning example " + exampleName)
    return new Promise((resolve, reject) => {

	amf.Core
	    .loadValidationProfile("file://examples/" + exampleName + "/profile.yaml")
	    .then((profile) => {

		amf.Core
		    .parser(spec, "application/yaml")
		    .parseFileAsync("file://examples/" + exampleName + "/api" + format).then((doc) => {

			amf.Core.validate(doc, profile).then(resolve).catch(reject);

		    }).catch(reject);

	    }).catch(reject);
    })
};

amf.Core.init().then(() => {
    runExample(exampleName)
	.then((report) => console.log(report.toString()))
	.catch(console.log)
});
