# creates build/html
rm -r build -errorAction ignore
$d = mkdir build
$d = mkdir build/html
cp -r websharper.reddit/Content build/html/
cp -r websharper.reddit/css build/html/
cp -r websharper.reddit/layouts build/html/
cp -r websharper.reddit/views build/html/
cp -r websharper.reddit/js build/html/
cp -r websharper.reddit/*.css build/html/
cp -r websharper.reddit/*.html build/html/
cp -r websharper.reddit/*.png build/html/

