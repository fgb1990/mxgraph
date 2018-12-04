// add snipet into BundleConfig.cs:
bundles.Add(new ScriptBundle("~/bundles/miniui").Include(
                "~/Scripts/miniui.js",
                "~/Scripts/pagertree.js"));

bundles.Add(new StyleBundle("~/Content/miniui").Include(
                "~/Content/miniui.css",
                "~/Content/miniui-icons.css"));
                

// replace _layout.cshtml:

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>@ViewBag.Title - App</title>
    @Styles.Render("~/Content/css")
    @Styles.Render("~/Content/miniui")
    @Scripts.Render("~/bundles/modernizr")

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="~/Scripts/html5shiv.min.js"></script>
    <![endif]-->
</head>
<body>
    <div class="navbar navbar-default navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                @Html.ActionLink("App", "Index", "Home", new { area = "" }, new { @class = "navbar-brand" })
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                </ul>
                @Html.Partial("_LoginPartial")
            </div>
        </div>
    </div>
    <div class="container body-content">
        @*@Html.Partial("_Alerts")*@
        @RenderBody()
    </div>
    <div class="navbar navbar-default navbar-fixed-bottom">
        <div class="container">
            <div class="navbar-collapse collapse text-center">
                &copy; @DateTime.Now.Year - App
            </div>
        </div>
    </div>

    @Scripts.Render("~/bundles/jquery")
    @Scripts.Render("~/bundles/bootstrap")
    @Scripts.Render("~/bundles/miniui")
    @RenderSection("scripts", required: false)
</body>
</html>
