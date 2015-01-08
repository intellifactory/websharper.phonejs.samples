namespace WebSharper.Reddit

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.JavaScript
open IntelliFactory.WebSharper.JQuery
open IntelliFactory.WebSharper.PhoneJS
open IntelliFactory.WebSharper.Knockout

[<Require(typeof<Resources.AndroidHoloDark>)>]
[<Require(typeof<Resources.GenericStyle>)>]
[<Require(typeof<Resources.IOSDefault>)>]
[<Require(typeof<Resources.Win8White>)>]
[<Require(typeof<Resources.TizenWhite>)>]
[<JavaScript>]
module Client =
    type RedditPost = 
        {
            Author     : string
            Title      : string
            Name       : string
            CreatedUTC : Date
            Score      : int
            Thumbnail  : string
            Url        : string
            Open       : Func<RedditPost, unit>
            Nsfw       : bool
            Subreddit  : string
        }

    let mutable lastFetched : string option = None
    let Store navigate = DevExpress.data.CustomStore.Create(
                            As New [
                                "load" => fun ops -> 
                                     if As<bool> ops?refresh then
                                        lastFetched <- None
                                     let url =
                                         lastFetched
                                         |> Option.fold (fun s a -> s + "?after=" + a) "http://www.reddit.com/r/all/hot.json"
                                     JQuery.GetJSON(url)
                                        .Then(fun data ->
                                            try
                                                let posts : obj [] = data?data?children
                                                let result =
                                                    [| 
                                                        for post in posts do
                                                            let data = post?data
                                                            let date = new Date(0)
                                                            date.SetUTCSeconds(data?created_utc)

                                                            yield {
                                                                Author = data?author
                                                                Title = data?title
                                                                Name  = data?name
                                                                CreatedUTC = date
                                                                Score = data?score
                                                                Thumbnail = data?thumbnail
                                                                Url = data?url
                                                                Open = navigate
                                                                Nsfw = data?over_18
                                                                Subreddit = "/r/" + data?subreddit
                                                            }
                                                    |]
                                                lastFetched <- Some result.Last.Name
                                                As result
                                            with
                                            | _ -> false)
                            ])

    let DataSource navigate =
        let options = DevExpress.data.DataSourceOptions(1., true)
        options?store <- Store navigate
        DevExpress.data.DataSource.Create(options)

    let Main =
        JQuery.Of(fun () -> 
                    let MainApp : obj = New []
                    MainApp?app <- DevExpress.framework.html.HtmlApplication.Create(
                                        As New [
                                            "namespace" => MainApp
                                            "navigationType" => "simple"
                                        ])
                    let app = As<DevExpress.framework.html.HtmlApplication.T> MainApp?app

                    MainApp?List <- fun () ->
                        let viewModel = 
                            New [
                                "dataSource" => (DataSource <| Func<_,_>(fun this -> 
                                                    app.navigate("Page/" + JS.EncodeURIComponent(this.Url))))
                            ]
                        viewModel

                    MainApp?Page <- fun paramz ->
                        let viewModel =
                            New [
                                "Title" => paramz?title
                                "Url" => JS.DecodeURIComponent paramz?url
                            ]
                        viewModel

                    app.router.register(":view", New ["view" => "List"])
                    app.router.register(":view/:url", New ["view" => "Page"; "url" => ""])
                    app.navigate()).Ignore
