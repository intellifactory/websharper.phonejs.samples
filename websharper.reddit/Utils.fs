namespace WebSharper.Reddit

open IntelliFactory.WebSharper

[<JavaScript; AutoOpen>]
module Utils =
    module Array =
        let Last (arr : 'a []) =
            arr.[arr.Length - 1]

    type 'T ``[]`` with
        member a.Last = a.[a.Length - 1]
       