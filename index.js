const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const projects = require("./projects.json");

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("./public"));
app.use(express.static("./projects"));

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.get("/", (req, res) => {
    res.render("welcome", {
        title: "Home",
        projects,
    });
});

app.get("/projects/:project", (req, res) => {
    const project = req.params.project;
    const selectedProject = projects.find((item) => item.directory == project);

    if (!selectedProject) {
        return res.sendStatus(404);
    } else {
        res.render("descriptionPage", {
            title: "Projects",
            projects,
            selectedProject,
        });
    }
});

app.get("/projects/:project/src", (req, res) => {
    const project = req.params.project;
    const selectedProject = projects.find((item) => item.directory == project);

    if (!selectedProject) {
        return res.sendStatus(404);
    } else {
        res.render("descriptionPage", {
            title: "Projects",
            projects,
            selectedProject,
        });
    }
});

app.listen(process.env.PORT || 8080, () => console.log("server listening!"));
