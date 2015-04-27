// $begin{copyright}
//
// This file is part of WebSharper
//
// Copyright (c) 2008-2014 IntelliFactory
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License.  You may
// obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied.  See the License for the specific language governing
// permissions and limitations under the License.
//
// $end{copyright}

try {
    Object.defineProperty(Error.prototype, 'message', { enumerable: true });
} catch (e) { }

var IntelliFactory =
{
    Runtime:
    {
        Class:
            function (p, s) {
                function r() { }
                r.prototype = p;
                for (var f in s) { r[f] = s[f]; }
                return r;
            },

        Define:
            function (a, b) {
                var overwrite = !!this.overwrite;
                function define(a, b) {
                    for (var k in b) {
                        var t1 = typeof a[k];
                        var t2 = typeof b[k];
                        if (t1 == "object" && t2 == "object") {
                            define(a[k], b[k]);
                        } else if (t1 == "undefined" || overwrite) {
                            a[k] = b[k];
                        } else {
                            throw new Error("Name conflict: " + k);
                        }
                    }
                }
                define(a, b);
            },

        DeleteEmptyFields:
            function (obj, fields) {
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    if (obj[f] === undefined) { delete obj[f]; }
                }
                return obj;
            },

        Field:
            function (f) {
                var value, ready = false;
                return function () {
                    if (!ready) { ready = true; value = f(); }
                    return value;
                }
            },

        GetOptional:
            function (value) {
                return (value === undefined) ? { $: 0 } : { $: 1, $0: value };
            },

        New:		
            function (ctor, fields) {
                var r = new ctor();
                for (var f in fields) {
                    if (!(f in r)) {
                        r[f] = fields[f];
                    }
                }
                return r
            },

        NewObject:
            function (kv) {
                var o = {};
                for (var i = 0; i < kv.length; i++) {
                    o[kv[i][0]] = kv[i][1];
                }
                return o;
            },

        OnInit:
            function (f) {
                if (!("init" in this)) {
                    this.init = [];
                }
                this.init.push(f);
            },

        OnLoad:
            function (f) {
                if (!("load" in this)) {
                    this.load = [];
                }
                this.load.push(f);
            },

        Inherit:
            function (a, b) {
                var p = a.prototype;
                a.prototype = new b();
                for (var f in p) {
                    a.prototype[f] = p[f];
                }
            },

        Safe:
            function (x) {
                if (x === undefined) return {};
                return x;
            },

        SetOptional:
            function (obj, field, value) {
                if (value.$ == 0) {
                    delete obj[field];
                } else {
                    obj[field] = value.$0;
                }
            },

        Start:
            function () {
                function run(c) {
                    for (var i = 0; i < c.length; i++) {
                        c[i]();
                    }
                }
                if ("init" in this) {
                    run(this.init);
                    this.init = [];
                }
                if ("load" in this) {
                    run(this.load);
                    this.load = [];
                }
            },

        Bind:
            function (f, obj) {
                return function () { return f.apply(this, arguments) }
            },

        CreateFuncWithArgs:
            function (f) {
                return function () { return f(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithOnlyThis:
            function (f) {
                return function () { return f(this); }
            },

        CreateFuncWithThis:
            function (f) {
                return function () { return f(this).apply(null, arguments); }
            },

        CreateFuncWithThisArgs:
            function (f) {
                return function () { return f(this)(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithRest:
            function (length, f) {
                return function () { return f(Array.prototype.slice.call(arguments, 0, length).concat([Array.prototype.slice.call(arguments, length)])); }
            },

        CreateFuncWithArgsRest:
            function (length, f) {
                return function () { return f([Array.prototype.slice.call(arguments, 0, length), Array.prototype.slice.call(arguments, length)]); }
            },

        UnionByType:
            function (types, value, optional) {
                var vt = typeof value;
                for (var i = 0; i < types.length; i++) {
                    var t = types[i];
                    if (typeof t == "number") {
                        if (Array.isArray(value) && (t == 0 || value.length == t)) {
                            return { $: i, $0: value };
                        }
                    } else {
                        if (t == vt) {
                            return { $: i, $0: value };
                        }
                    }
                }
                if (!optional) {
                    throw new Error("Type not expected for creating Choice value.");
                }
            }
    }
};

// Polyfill

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
;
var JSON;JSON||(JSON={}),function(){"use strict";function i(n){return n<10?"0"+n:n}function f(n){return o.lastIndex=0,o.test(n)?'"'+n.replace(o,function(n){var t=s[n];return typeof t=="string"?t:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+n+'"'}function r(i,e){var s,l,h,a,v=n,c,o=e[i];o&&typeof o=="object"&&typeof o.toJSON=="function"&&(o=o.toJSON(i)),typeof t=="function"&&(o=t.call(e,i,o));switch(typeof o){case"string":return f(o);case"number":return isFinite(o)?String(o):"null";case"boolean":case"null":return String(o);case"object":if(!o)return"null";if(n+=u,c=[],Object.prototype.toString.apply(o)==="[object Array]"){for(a=o.length,s=0;s<a;s+=1)c[s]=r(s,o)||"null";return h=c.length===0?"[]":n?"[\n"+n+c.join(",\n"+n)+"\n"+v+"]":"["+c.join(",")+"]",n=v,h}if(t&&typeof t=="object")for(a=t.length,s=0;s<a;s+=1)typeof t[s]=="string"&&(l=t[s],h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));else for(l in o)Object.prototype.hasOwnProperty.call(o,l)&&(h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));return h=c.length===0?"{}":n?"{\n"+n+c.join(",\n"+n)+"\n"+v+"}":"{"+c.join(",")+"}",n=v,h}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+i(this.getUTCMonth()+1)+"-"+i(this.getUTCDate())+"T"+i(this.getUTCHours())+":"+i(this.getUTCMinutes())+":"+i(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var e=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,n,u,s={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},t;typeof JSON.stringify!="function"&&(JSON.stringify=function(i,f,e){var o;if(n="",u="",typeof e=="number")for(o=0;o<e;o+=1)u+=" ";else typeof e=="string"&&(u=e);if(t=f,f&&typeof f!="function"&&(typeof f!="object"||typeof f.length!="number"))throw new Error("JSON.stringify");return r("",{"":i})}),typeof JSON.parse!="function"&&(JSON.parse=function(n,t){function r(n,i){var f,e,u=n[i];if(u&&typeof u=="object")for(f in u)Object.prototype.hasOwnProperty.call(u,f)&&(e=r(u,f),e!==undefined?u[f]=e:delete u[f]);return t.call(n,i,u)}var i;if(n=String(n),e.lastIndex=0,e.test(n)&&(n=n.replace(e,function(n){return"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(n.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return i=eval("("+n+")"),typeof t=="function"?r({"":i},""):i;throw new SyntaxError("JSON.parse");})}();;
(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,AggregateException,Exception,ArgumentException,Number,Arrays,Operators,IndexOutOfRangeException,Array,Seq,Unchecked,Enumerator,Arrays2D,Concurrency,Option,clearTimeout,setTimeout,CancellationTokenSource,Char,Util,Lazy,OperationCanceledException,Date,console,Scheduler,T,Html,Client,Activator,document,jQuery,Json,JSON,JavaScript,JSModule,HtmlContentExtensions,SingleNode,InvalidOperationException,List,T1,MatchFailureException,Math,Strings,PrintfHelpers,Remoting,XhrProvider,AsyncProxy,AjaxRemotingProvider,window,Enumerable,Ref,String,RegExp;
 Runtime.Define(Global,{
  WebSharper:{
   AggregateException:Runtime.Class({},{
    New:function(innerExceptions)
    {
     return Runtime.New(this,AggregateException.New1("One or more errors occurred.",innerExceptions));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   ArgumentException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,ArgumentException.New1("Value does not fall within the expected range."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Arrays:{
    average:function(arr)
    {
     return Number(Arrays.sum(arr))/Number(arr.length);
    },
    averageBy:function(f,arr)
    {
     return Number(Arrays.sumBy(f,arr))/Number(arr.length);
    },
    blit:function(arr1,start1,arr2,start2,length)
    {
     var i;
     Arrays.checkRange(arr1,start1,length);
     Arrays.checkRange(arr2,start2,length);
     for(i=0;i<=length-1;i++){
      Arrays.set(arr2,start2+i,Arrays.get(arr1,start1+i));
     }
     return;
    },
    checkBounds:function(arr,n)
    {
     return(n<0?true:n>=arr.length)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    checkBounds2D:function(arr,n1,n2)
    {
     return(((n1<0?true:n2<0)?true:n1>=arr.length)?true:n2>=(arr.length?arr[0].length:0))?Operators.Raise(IndexOutOfRangeException.New()):null;
    },
    checkLength:function(arr1,arr2)
    {
     return arr1.length!==arr2.length?Operators.FailWith("Arrays differ in length."):null;
    },
    checkRange:function(arr,start,size)
    {
     return((size<0?true:start<0)?true:arr.length<start+size)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    choose:function(f,arr)
    {
     var q,i,matchValue,_,x;
     q=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=f(Arrays.get(arr,i));
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        x=matchValue.$0;
        _=q.push(x);
       }
     }
     return q;
    },
    collect:function(f,x)
    {
     return Array.prototype.concat.apply([],Arrays.map(f,x));
    },
    concat:function(xs)
    {
     return Array.prototype.concat.apply([],Arrays.ofSeq(xs));
    },
    create:function(size,value)
    {
     var r,i;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,value);
     }
     return r;
    },
    create2D:function(rows)
    {
     var mapping,source1,x;
     mapping=function(source)
     {
      return Arrays.ofSeq(source);
     };
     source1=Seq.map(mapping,rows);
     x=Arrays.ofSeq(source1);
     x.dims=2;
     return x;
    },
    exists2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.exists2(f,arr1,arr2);
    },
    fill:function(arr,start,length,value)
    {
     var i;
     Arrays.checkRange(arr,start,length);
     for(i=start;i<=start+length-1;i++){
      Arrays.set(arr,i,value);
     }
     return;
    },
    filter:function(f,arr)
    {
     var r,i;
     r=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?r.push(Arrays.get(arr,i)):null;
     }
     return r;
    },
    find:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFind(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findINdex:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFindIndex(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,zero,arr)
    {
     var acc,i;
     acc=zero;
     for(i=0;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    fold2:function(f,zero,arr1,arr2)
    {
     var accum,i;
     Arrays.checkLength(arr1,arr2);
     accum=zero;
     for(i=0;i<=arr1.length-1;i++){
      accum=((f(accum))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return accum;
    },
    foldBack:function(f,arr,zero)
    {
     var acc,len,i;
     acc=zero;
     len=arr.length;
     for(i=1;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    foldBack2:function(f,arr1,arr2,zero)
    {
     var len,accum,i;
     Arrays.checkLength(arr1,arr2);
     len=arr1.length;
     accum=zero;
     for(i=1;i<=len;i++){
      accum=((f(Arrays.get(arr1,len-i)))(Arrays.get(arr2,len-i)))(accum);
     }
     return accum;
    },
    forall2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.forall2(f,arr1,arr2);
    },
    get:function(arr,n)
    {
     Arrays.checkBounds(arr,n);
     return arr[n];
    },
    get2D:function(arr,n1,n2)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     return arr[n1][n2];
    },
    init:function(size,f)
    {
     var r,i;
     size<0?Operators.FailWith("Negative size given."):null;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,f(i));
     }
     return r;
    },
    iter:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i));
     }
     return;
    },
    iter2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      (f(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    iteri:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      (f(i))(Arrays.get(arr,i));
     }
     return;
    },
    iteri2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      ((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    length:function(arr)
    {
     var matchValue;
     matchValue=arr.dims;
     return matchValue===2?arr.length*arr.length:arr.length;
    },
    map:function(f,arr)
    {
     var r,i;
     r=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(r,i,f(Arrays.get(arr,i)));
     }
     return r;
    },
    map2:function(f,arr1,arr2)
    {
     var r,i;
     Arrays.checkLength(arr1,arr2);
     r=Array(arr2.length);
     for(i=0;i<=arr2.length-1;i++){
      Arrays.set(r,i,(f(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return r;
    },
    mapi:function(f,arr)
    {
     var y,i;
     y=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(y,i,(f(i))(Arrays.get(arr,i)));
     }
     return y;
    },
    mapi2:function(f,arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return res;
    },
    max:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },x);
    },
    maxBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },arr);
    },
    min:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },x);
    },
    minBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },arr);
    },
    nonEmpty:function(arr)
    {
     return arr.length===0?Operators.FailWith("The input array was empty."):null;
    },
    ofSeq:function(xs)
    {
     var q,_enum;
     q=[];
     _enum=Enumerator.Get(xs);
     while(_enum.MoveNext())
      {
       q.push(_enum.get_Current());
      }
     return q;
    },
    partition:function(f,arr)
    {
     var ret1,ret2,i;
     ret1=[];
     ret2=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?ret1.push(Arrays.get(arr,i)):ret2.push(Arrays.get(arr,i));
     }
     return[ret1,ret2];
    },
    permute:function(f,arr)
    {
     var ret,i;
     ret=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,f(i),Arrays.get(arr,i));
     }
     return ret;
    },
    pick:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryPick(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    reduce:function(f,arr)
    {
     var acc,i;
     Arrays.nonEmpty(arr);
     acc=Arrays.get(arr,0);
     for(i=1;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    reduceBack:function(f,arr)
    {
     var len,acc,i;
     Arrays.nonEmpty(arr);
     len=arr.length;
     acc=Arrays.get(arr,len-1);
     for(i=2;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    reverse:function(array,offset,length)
    {
     var a;
     a=Arrays.sub(array,offset,length).slice().reverse();
     return Arrays.blit(a,0,array,offset,Arrays.length(a));
    },
    scan:function(f,zero,arr)
    {
     var ret,i;
     ret=Array(1+arr.length);
     Arrays.set(ret,0,zero);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,i+1,(f(Arrays.get(ret,i)))(Arrays.get(arr,i)));
     }
     return ret;
    },
    scanBack:function(f,arr,zero)
    {
     var len,ret,i;
     len=arr.length;
     ret=Array(1+len);
     Arrays.set(ret,len,zero);
     for(i=0;i<=len-1;i++){
      Arrays.set(ret,len-i-1,(f(Arrays.get(arr,len-i-1)))(Arrays.get(ret,len-i)));
     }
     return ret;
    },
    set:function(arr,n,x)
    {
     Arrays.checkBounds(arr,n);
     arr[n]=x;
     return;
    },
    set2D:function(arr,n1,n2,x)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     arr[n1][n2]=x;
     return;
    },
    setSub:function(arr,start,len,src)
    {
     var i;
     for(i=0;i<=len-1;i++){
      Arrays.set(arr,start+i,Arrays.get(src,i));
     }
     return;
    },
    setSub2D:function(dst,src1,src2,len1,len2,src)
    {
     var i,j;
     for(i=0;i<=len1-1;i++){
      for(j=0;j<=len2-1;j++){
       Arrays.set2D(dst,src1+i,src2+j,Arrays.get2D(src,i,j));
      }
     }
     return;
    },
    sort:function(arr)
    {
     return Arrays.sortBy(function(x)
     {
      return x;
     },arr);
    },
    sortBy:function(f,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortInPlace:function(arr)
    {
     return Arrays.sortInPlaceBy(function(x)
     {
      return x;
     },arr);
    },
    sortInPlaceBy:function(f,arr)
    {
     return arr.sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortInPlaceWith:function(comparer,arr)
    {
     return arr.sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    sortWith:function(comparer,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    sub:function(arr,start,length)
    {
     Arrays.checkRange(arr,start,length);
     return arr.slice(start,start+length);
    },
    sub2D:function(src,src1,src2,len1,len2)
    {
     var len11,len21,dst,i,j;
     len11=len1<0?0:len1;
     len21=len2<0?0:len2;
     dst=Arrays.zeroCreate2D(len11,len21);
     for(i=0;i<=len11-1;i++){
      for(j=0;j<=len21-1;j++){
       Arrays.set2D(dst,i,j,Arrays.get2D(src,src1+i,src2+j));
      }
     }
     return dst;
    },
    sum:function($arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$arr[i];
     return sum;
    },
    sumBy:function($f,$arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$f($arr[i]);
     return sum;
    },
    tryFind:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:Arrays.get(arr,i)
       }:null;
       i=i+1;
      }
     return res;
    },
    tryFindIndex:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:i
       }:null;
       i=i+1;
      }
     return res;
    },
    tryPick:function(f,arr)
    {
     var res,i,matchValue;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       matchValue=f(Arrays.get(arr,i));
       matchValue.$==1?res=matchValue:null;
       i=i+1;
      }
     return res;
    },
    unzip:function(arr)
    {
     var x,y,i,patternInput,b,a;
     x=[];
     y=[];
     for(i=0;i<=arr.length-1;i++){
      patternInput=Arrays.get(arr,i);
      b=patternInput[1];
      a=patternInput[0];
      x.push(a);
      y.push(b);
     }
     return[x,y];
    },
    unzip3:function(arr)
    {
     var x,y,z,i,matchValue,c,b,a;
     x=[];
     y=[];
     z=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=Arrays.get(arr,i);
      c=matchValue[2];
      b=matchValue[1];
      a=matchValue[0];
      x.push(a);
      y.push(b);
      z.push(c);
     }
     return[x,y,z];
    },
    zeroCreate2D:function(n,m)
    {
     var arr;
     arr=Arrays.init(n,function()
     {
      return Array(m);
     });
     arr.dims=2;
     return arr;
    },
    zip:function(arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i)]);
     }
     return res;
    },
    zip3:function(arr1,arr2,arr3)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     Arrays.checkLength(arr2,arr3);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i),Arrays.get(arr3,i)]);
     }
     return res;
    }
   },
   Arrays2D:{
    copy:function(array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return Arrays.get2D(array,i,j);
      };
     });
    },
    init:function(n,m,f)
    {
     var array,i,j;
     array=Arrays.zeroCreate2D(n,m);
     for(i=0;i<=n-1;i++){
      for(j=0;j<=m-1;j++){
       Arrays.set2D(array,i,j,(f(i))(j));
      }
     }
     return array;
    },
    iter:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       f(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    iteri:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       ((f(i))(j))(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    map:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return f(Arrays.get2D(array,i,j));
      };
     });
    },
    mapi:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return((f(i))(j))(Arrays.get2D(array,i,j));
      };
     });
    }
   },
   AsyncProxy:Runtime.Class({},{
    get_CancellationToken:function()
    {
     return Concurrency.GetCT();
    },
    get_DefaultCancellationToken:function()
    {
     return(Concurrency.defCTS())[0];
    }
   }),
   CancellationTokenSource:Runtime.Class({
    Cancel:function()
    {
     var _,chooser,array,errors;
     if(!this.c)
      {
       this.c=true;
       chooser=function(a)
       {
        var _1,e;
        try
        {
         a(null);
         _1={
          $:0
         };
        }
        catch(e)
        {
         _1={
          $:1,
          $0:e
         };
        }
        return _1;
       };
       array=this.r;
       errors=Arrays.choose(chooser,array);
       _=Arrays.length(errors)>0?Operators.Raise(AggregateException.New(errors)):null;
      }
     else
      {
       _=null;
      }
     return _;
    },
    Cancel1:function(throwOnFirstException)
    {
     var _,_1,action,array;
     if(!throwOnFirstException)
      {
       _=this.Cancel();
      }
     else
      {
       if(!this.c)
        {
         this.c=true;
         action=function(a)
         {
          return a(null);
         };
         array=this.r;
         _1=Arrays.iter(action,array);
        }
       else
        {
         _1=null;
        }
       _=_1;
      }
     return _;
    },
    CancelAfter:function(delay)
    {
     var _,option,arg0,_this=this;
     if(!this.c)
      {
       option=this.pending;
       Option.iter(function(handle)
       {
        return clearTimeout(handle);
       },option);
       arg0=setTimeout(function()
       {
        return _this.Cancel();
       },delay);
       _=void(this.pending={
        $:1,
        $0:arg0
       });
      }
     else
      {
       _=null;
      }
     return _;
    },
    get_IsCancellationRequested:function()
    {
     return this.c;
    }
   },{
    CreateLinkedTokenSource:function(t1,t2)
    {
     return CancellationTokenSource.CreateLinkedTokenSource1([t1,t2]);
    },
    CreateLinkedTokenSource1:function(tokens)
    {
     var cts,action;
     cts=CancellationTokenSource.New();
     action=function(t)
     {
      var value;
      value=Concurrency.Register(t,function()
      {
       return function()
       {
        return cts.Cancel();
       }();
      });
      return;
     };
     return Arrays.iter(action,tokens);
    },
    New:function()
    {
     var r;
     r=Runtime.New(this,{});
     r.c=false;
     r.pending={
      $:0
     };
     r.r=[];
     return r;
    }
   }),
   Char:Runtime.Class({},{
    GetNumericValue:function(c)
    {
     return(c>=48?c<=57:false)?Number(c)-Number(48):-1;
    },
    IsControl:function(c)
    {
     return(c>=0?c<=31:false)?true:c>=128?c<=159:false;
    },
    IsDigit:function(c)
    {
     return c>=48?c<=57:false;
    },
    IsLetter:function(c)
    {
     return(c>=65?c<=90:false)?true:c>=97?c<=122:false;
    },
    IsLetterOrDigit:function(c)
    {
     return Char.IsLetter(c)?true:Char.IsDigit(c);
    },
    IsLower:function(c)
    {
     return c>=97?c<=122:false;
    },
    IsUpper:function(c)
    {
     return c>=65?c<=90:false;
    },
    IsWhiteSpace:function($c)
    {
     var $0=this,$this=this;
     return Global.String.fromCharCode($c).match(/\s/)!==null;
    },
    Parse:function(s)
    {
     return s.length===1?s.charCodeAt(0):Operators.FailWith("String must be exactly one character long.");
    }
   }),
   Concurrency:{
    AwaitEvent:function(e)
    {
     var r;
     r=function(c)
     {
      var sub,sub1,creg,creg1,sub2,creg2;
      sub=function()
      {
       return Util.subscribeTo(e,function(x)
       {
        var action;
        Lazy.Force(sub1).Dispose();
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:x
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      sub1=Lazy.Create(sub);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var action;
        Lazy.Force(sub1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:2,
          $0:OperationCanceledException.New()
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      creg1=Lazy.Create(creg);
      sub2=Lazy.Force(sub1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Bind:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,action,action1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          action=function()
          {
           var _1,e;
           try
           {
            _1=(f(x))(c);
           }
           catch(e)
           {
            _1=c.k.call(null,{
             $:1,
             $0:e
            });
           }
           return _1;
          };
          _=Concurrency.scheduler().Fork(action);
         }
        else
         {
          action1=function()
          {
           return c.k.call(null,_arg1);
          };
          _=Concurrency.scheduler().Fork(action1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Catch:function(r)
    {
     var r1;
     r1=function(c)
     {
      var _,e1;
      try
      {
       _=r({
        k:function(_arg1)
        {
         var _1,x,e;
         if(_arg1.$==0)
          {
           x=_arg1.$0;
           _1=c.k.call(null,{
            $:0,
            $0:{
             $:0,
             $0:x
            }
           });
          }
         else
          {
           if(_arg1.$==1)
            {
             e=_arg1.$0;
             _1=c.k.call(null,{
              $:0,
              $0:{
               $:1,
               $0:e
              }
             });
            }
           else
            {
             _1=c.k.call(null,_arg1);
            }
          }
         return _1;
        },
        ct:c.ct
       });
      }
      catch(e1)
      {
       _=c.k.call(null,{
        $:0,
        $0:{
         $:1,
         $0:e1
        }
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r1);
    },
    Combine:function(a,b)
    {
     return Concurrency.Bind(a,function()
     {
      return b;
     });
    },
    Delay:function(mk)
    {
     var r;
     r=function(c)
     {
      var _,e;
      try
      {
       _=(mk(null))(c);
      }
      catch(e)
      {
       _=c.k.call(null,{
        $:1,
        $0:e
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r);
    },
    For:function(s,b)
    {
     var ie;
     ie=Enumerator.Get(s);
     return Concurrency.While(function()
     {
      return ie.MoveNext();
     },Concurrency.Delay(function()
     {
      return b(ie.get_Current());
     }));
    },
    FromContinuations:function(subscribe)
    {
     var r;
     r=function(c)
     {
      var continued,once;
      continued=[false];
      once=function(cont)
      {
       var _;
       if(continued[0])
        {
         _=Operators.FailWith("A continuation provided by Async.FromContinuations was invoked multiple times");
        }
       else
        {
         continued[0]=true;
         _=Concurrency.scheduler().Fork(cont);
        }
       return _;
      };
      return subscribe([function(a)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:0,
         $0:a
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:1,
         $0:e
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:2,
         $0:e
        });
       });
      }]);
     };
     return Concurrency.checkCancel(r);
    },
    GetCT:Runtime.Field(function()
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    }),
    Ignore:function(r)
    {
     return Concurrency.Bind(r,function()
     {
      return Concurrency.Return(null);
     });
    },
    OnCancel:function(action)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:Concurrency.Register(c.ct,action)
      });
     };
     return Concurrency.checkCancel(r);
    },
    Parallel:function(cs)
    {
     var cs1,_,r;
     cs1=Arrays.ofSeq(cs);
     if(Arrays.length(cs1)===0)
      {
       _=Concurrency.Return([]);
      }
     else
      {
       r=function(c)
       {
        var n,o,a,accept;
        n=cs1.length;
        o=[n];
        a=Arrays.create(n,undefined);
        accept=function(i)
        {
         return function(x)
         {
          var matchValue,_1,_2,x1,res,_3,x2,n1,res1;
          matchValue=[o[0],x];
          if(matchValue[0]===0)
           {
            _1=null;
           }
          else
           {
            if(matchValue[0]===1)
             {
              if(matchValue[1].$==0)
               {
                x1=matchValue[1].$0;
                Arrays.set(a,i,x1);
                o[0]=0;
                _2=c.k.call(null,{
                 $:0,
                 $0:a
                });
               }
              else
               {
                matchValue[0];
                res=matchValue[1];
                o[0]=0;
                _2=c.k.call(null,res);
               }
              _1=_2;
             }
            else
             {
              if(matchValue[1].$==0)
               {
                x2=matchValue[1].$0;
                n1=matchValue[0];
                Arrays.set(a,i,x2);
                _3=void(o[0]=n1-1);
               }
              else
               {
                matchValue[0];
                res1=matchValue[1];
                o[0]=0;
                _3=c.k.call(null,res1);
               }
              _1=_3;
             }
           }
          return _1;
         };
        };
        return Arrays.iteri(function(i)
        {
         return function(run)
         {
          var action;
          action=function()
          {
           return run({
            k:accept(i),
            ct:c.ct
           });
          };
          return Concurrency.scheduler().Fork(action);
         };
        },cs1);
       };
       _=Concurrency.checkCancel(r);
      }
     return _;
    },
    Register:function(ct,callback)
    {
     var i;
     i=ct.r.push(callback)-1;
     return{
      Dispose:function()
      {
       return Arrays.set(ct.r,i,function()
       {
       });
      }
     };
    },
    Return:function(x)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:x
      });
     };
     return Concurrency.checkCancel(r);
    },
    Scheduler:Runtime.Class({
     Fork:function(action)
     {
      var _,value,_this=this;
      this.robin.push(action);
      if(this.idle)
       {
        this.idle=false;
        value=setTimeout(function()
        {
         return _this.tick();
        },0);
        _=void value;
       }
      else
       {
        _=null;
       }
      return _;
     },
     tick:function()
     {
      var t,loop,matchValue,_,_1,value,_this=this;
      t=Date.now();
      loop=true;
      while(loop)
       {
        matchValue=this.robin.length;
        if(matchValue===0)
         {
          this.idle=true;
          _=loop=false;
         }
        else
         {
          (this.robin.shift())(null);
          if(Date.now()-t>40)
           {
            value=setTimeout(function()
            {
             return _this.tick();
            },0);
            _1=loop=false;
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
       }
      return;
     }
    },{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.idle=true;
      r.robin=[];
      return r;
     }
    }),
    Sleep:function(ms)
    {
     var r;
     r=function(c)
     {
      var pending,pending1,creg,creg1,pending2,creg2;
      pending=function()
      {
       return setTimeout(function()
       {
        var action;
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:null
         });
        };
        return Concurrency.scheduler().Fork(action);
       },ms);
      };
      pending1=Lazy.Create(pending);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var action;
        clearTimeout(Lazy.Force(pending1));
        action=function()
        {
         return c.k.call(null,{
          $:2,
          $0:OperationCanceledException.New()
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      creg1=Lazy.Create(creg);
      pending2=Lazy.Force(pending1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Start:function(c,ctOpt)
    {
     return Concurrency.StartWithContinuations(c,function()
     {
     },function(exn)
     {
      var ps;
      ps=[exn];
      return console?console.log.apply(console,["WebSharper: Uncaught asynchronous exception"].concat(ps)):undefined;
     },function()
     {
     },ctOpt);
    },
    StartChild:function(r)
    {
     var r1;
     r1=function(c)
     {
      var cached,queue,action,r2,r21;
      cached=[{
       $:0
      }];
      queue=[];
      action=function()
      {
       return r({
        k:function(res)
        {
         cached[0]={
          $:1,
          $0:res
         };
         while(queue.length>0)
          {
           (queue.shift())(res);
          }
         return;
        },
        ct:c.ct
       });
      };
      Concurrency.scheduler().Fork(action);
      r2=function(c2)
      {
       var matchValue,_,x;
       matchValue=cached[0];
       if(matchValue.$==0)
        {
         _=queue.push(c2.k);
        }
       else
        {
         x=matchValue.$0;
         _=c2.k.call(null,x);
        }
       return _;
      };
      r21=Concurrency.checkCancel(r2);
      return c.k.call(null,{
       $:0,
       $0:r21
      });
     };
     return Concurrency.checkCancel(r1);
    },
    StartWithContinuations:function(c,s,f,cc,ctOpt)
    {
     var ct,action;
     ct=Operators.DefaultArg(ctOpt,(Concurrency.defCTS())[0]);
     action=function()
     {
      return c({
       k:function(_arg1)
       {
        var _,e,e1,x;
        if(_arg1.$==1)
         {
          e=_arg1.$0;
          _=f(e);
         }
        else
         {
          if(_arg1.$==2)
           {
            e1=_arg1.$0;
            _=cc(e1);
           }
          else
           {
            x=_arg1.$0;
            _=s(x);
           }
         }
        return _;
       },
       ct:ct
      });
     };
     return Concurrency.scheduler().Fork(action);
    },
    TryCancelled:function(run,comp)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(_arg1)
       {
        var _,e;
        if(_arg1.$==2)
         {
          e=_arg1.$0;
          comp(e);
          _=c.k.call(null,_arg1);
         }
        else
         {
          _=c.k.call(null,_arg1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryFinally:function(run,f)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(r1)
       {
        var _,e;
        try
        {
         f(null);
         _=c.k.call(null,r1);
        }
        catch(e)
        {
         _=c.k.call(null,{
          $:1,
          $0:e
         });
        }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryWith:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,e,_1,e1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          _=c.k.call(null,{
           $:0,
           $0:x
          });
         }
        else
         {
          if(_arg1.$==1)
           {
            e=_arg1.$0;
            try
            {
             _1=(f(e))(c);
            }
            catch(e1)
            {
             _1=c.k.call(null,_arg1);
            }
            _=_1;
           }
          else
           {
            _=c.k.call(null,_arg1);
           }
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Using:function(x,f)
    {
     return Concurrency.TryFinally(f(x),function()
     {
      return x.Dispose();
     });
    },
    While:function(g,c)
    {
     return g(null)?Concurrency.Bind(c,function()
     {
      return Concurrency.While(g,c);
     }):Concurrency.Return(null);
    },
    checkCancel:function(r)
    {
     return function(c)
     {
      return c.ct.c?c.k.call(null,{
       $:2,
       $0:OperationCanceledException.New()
      }):r(c);
     };
    },
    defCTS:Runtime.Field(function()
    {
     return[CancellationTokenSource.New()];
    }),
    scheduler:Runtime.Field(function()
    {
     return Scheduler.New();
    })
   },
   Control:{
    createEvent:function(add,remove,create)
    {
     return{
      AddHandler:add,
      RemoveHandler:remove,
      Subscribe:function(r)
      {
       var h;
       h=create(function()
       {
        return function(args)
        {
         return r.OnNext.call(null,args);
        };
       });
       add(h);
       return{
        Dispose:function()
        {
         return remove(h);
        }
       };
      }
     };
    }
   },
   DateTimeHelpers:{
    AddMonths:function(d,months)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth()+months,e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    AddYears:function(d,years)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear()+years,e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    DatePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth(),e.getDate())).getTime();
    },
    TimePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(((24*0+e.getHours())*60+e.getMinutes())*60+e.getSeconds())*1000+e.getMilliseconds();
    }
   },
   Enumerable:{
    Of:function(getEnumerator)
    {
     return{
      GetEnumerator:getEnumerator
     };
    }
   },
   Enumerator:{
    Get:function(x)
    {
     return x instanceof Global.Array?T.New(0,null,function(e)
     {
      var i,_;
      i=e.s;
      if(i<Arrays.length(x))
       {
        e.c=Arrays.get(x,i);
        e.s=i+1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     }):Unchecked.Equals(typeof x,"string")?T.New(0,null,function(e)
     {
      var i,_;
      i=e.s;
      if(i<x.length)
       {
        e.c=x.charCodeAt(i);
        e.s=i+1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     }):x.GetEnumerator();
    },
    T:Runtime.Class({
     MoveNext:function()
     {
      return this.n.call(null,this);
     },
     get_Current:function()
     {
      return this.c;
     }
    },{
     New:function(s,c,n)
     {
      var r;
      r=Runtime.New(this,{});
      r.s=s;
      r.c=c;
      r.n=n;
      return r;
     }
    })
   },
   Exception:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,Exception.New1("Exception of type 'System.Exception' was thrown."));
    },
    New1:function($message)
    {
     var $0=this,$this=this;
     return new Global.Error($message);
    }
   }),
   Guid:Runtime.Class({},{
    NewGuid:function()
    {
     var $0=this,$this=this;
     return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c)
     {
      var r=Global.Math.random()*16|0,v=c=="x"?r:r&0x3|0x8;
      return v.toString(16);
     });
    }
   }),
   Html:{
    Client:{
     Activator:{
      Activate:Runtime.Field(function()
      {
       var _,meta;
       if(Activator.hasDocument())
        {
         meta=document.getElementById("websharper-data");
         _=meta?jQuery(document).ready(function()
         {
          var text,obj,action,array;
          text=meta.getAttribute("content");
          obj=Json.Activate(JSON.parse(text));
          action=function(tupledArg)
          {
           var k,v,p,old;
           k=tupledArg[0];
           v=tupledArg[1];
           p=v.get_Body();
           old=document.getElementById(k);
           return p.ReplaceInDom(old);
          };
          array=JSModule.GetFields(obj);
          return Arrays.iter(action,array);
         }):null;
        }
       else
        {
         _=null;
        }
       return _;
      }),
      hasDocument:function()
      {
       var $0=this,$this=this;
       return typeof Global.document!=="undefined";
      }
     },
     HtmlContentExtensions:{
      "IControlBody.SingleNode.Static":function(node)
      {
       return SingleNode.New(node);
      },
      SingleNode:Runtime.Class({
       ReplaceInDom:function(old)
       {
        var value;
        value=this.node.parentNode.replaceChild(this.node,old);
        return;
       }
      },{
       New:function(node)
       {
        var r;
        r=Runtime.New(this,{});
        r.node=node;
        return r;
       }
      })
     }
    }
   },
   IndexOutOfRangeException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,IndexOutOfRangeException.New1("Index was outside the bounds of the array."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   InvalidOperationException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,InvalidOperationException.New1("Operation is not valid due to the current state of the object."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   JavaScript:{
    JSModule:{
     Delete:function($x,$field)
     {
      var $0=this,$this=this;
      return delete $x[$field];
     },
     ForEach:function($x,$iter)
     {
      var $0=this,$this=this;
      for(var k in $x){
       if($iter(k))
        break;
      }
     },
     GetFieldNames:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push(k);
      return r;
     },
     GetFieldValues:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push($o[k]);
      return r;
     },
     GetFields:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push([k,$o[k]]);
      return r;
     },
     Log:function($x)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log($x);
     },
     LogMore:function($args)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log.apply(Global.console,$args);
     }
    },
    Pervasives:{
     NewFromList:function(fields)
     {
      var r,enumerator,forLoopVar,v,k;
      r={};
      enumerator=Enumerator.Get(fields);
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        v=forLoopVar[1];
        k=forLoopVar[0];
        r[k]=v;
       }
      return r;
     }
    }
   },
   Json:{
    Activate:function(json)
    {
     var types,i,decode;
     types=json.$TYPES;
     for(i=0;i<=Arrays.length(types)-1;i++){
      Arrays.set(types,i,Json.lookup(Arrays.get(types,i)));
     }
     decode=function(x)
     {
      var _,matchValue,_1,_2,o,ti,_3,r;
      if(Unchecked.Equals(x,null))
       {
        _=x;
       }
      else
       {
        matchValue=typeof x;
        if(matchValue==="object")
         {
          if(x instanceof Global.Array)
           {
            _2=Json.shallowMap(decode,x);
           }
          else
           {
            o=Json.shallowMap(decode,x.$V);
            ti=x.$T;
            if(Unchecked.Equals(typeof ti,"undefined"))
             {
              _3=o;
             }
            else
             {
              r=new(Arrays.get(types,ti))();
              JSModule.ForEach(o,function(k)
              {
               r[k]=o[k];
               return false;
              });
              _3=r;
             }
            _2=_3;
           }
          _1=_2;
         }
        else
         {
          _1=x;
         }
        _=_1;
       }
      return _;
     };
     return decode(json.$DATA);
    },
    lookup:function(x)
    {
     var k,r,i,n,rn,_;
     k=Arrays.length(x);
     r=Global;
     i=0;
     while(i<k)
      {
       n=Arrays.get(x,i);
       rn=r[n];
       if(!Unchecked.Equals(typeof rn,undefined))
        {
         r=rn;
         _=i=i+1;
        }
       else
        {
         _=Operators.FailWith("Invalid server reply. Failed to find type: "+n);
        }
      }
     return r;
    },
    shallowMap:function(f,x)
    {
     var _,matchValue,_1,r;
     if(x instanceof Global.Array)
      {
       _=Arrays.map(f,x);
      }
     else
      {
       matchValue=typeof x;
       if(matchValue==="object")
        {
         r={};
         JSModule.ForEach(x,function(y)
         {
          r[y]=f(x[y]);
          return false;
         });
         _1=r;
        }
       else
        {
         _1=x;
        }
       _=_1;
      }
     return _;
    }
   },
   Lazy:{
    Create:function(f)
    {
     var x,get;
     x={
      value:undefined,
      created:false,
      eval:f
     };
     get=function()
     {
      var _;
      if(x.created)
       {
        _=x.value;
       }
      else
       {
        x.created=true;
        x.value=f(null);
        _=x.value;
       }
      return _;
     };
     x.eval=get;
     return x;
    },
    CreateFromValue:function(v)
    {
     return{
      value:v,
      created:true,
      eval:function()
      {
       return v;
      },
      eval:function()
      {
       return v;
      }
     };
    },
    Force:function(x)
    {
     return x.eval.call(null,null);
    }
   },
   List:{
    T:Runtime.Class({
     GetEnumerator:function()
     {
      return T.New(this,null,function(e)
      {
       var matchValue,_,xs,x;
       matchValue=e.s;
       if(matchValue.$==0)
        {
         _=false;
        }
       else
        {
         xs=matchValue.$1;
         x=matchValue.$0;
         e.c=x;
         e.s=xs;
         _=true;
        }
       return _;
      });
     },
     get_Item:function(x)
     {
      return Seq.nth(x,this);
     },
     get_Length:function()
     {
      return Seq.length(this);
     }
    },{
     Construct:function(head,tail)
     {
      return Runtime.New(T1,{
       $:1,
       $0:head,
       $1:tail
      });
     },
     get_Nil:function()
     {
      return Runtime.New(T1,{
       $:0
      });
     }
    }),
    append:function(x,y)
    {
     return List.ofSeq(Seq.append(x,y));
    },
    choose:function(f,l)
    {
     return List.ofSeq(Seq.choose(f,l));
    },
    collect:function(f,l)
    {
     return List.ofSeq(Seq.collect(f,l));
    },
    concat:function(s)
    {
     return List.ofSeq(Seq.concat(s));
    },
    exists2:function(p,l1,l2)
    {
     return Arrays.exists2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    filter:function(p,l)
    {
     return List.ofSeq(Seq.filter(p,l));
    },
    fold2:function(f,s,l1,l2)
    {
     return Arrays.fold2(f,s,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    foldBack:function(f,l,s)
    {
     return Arrays.foldBack(f,Arrays.ofSeq(l),s);
    },
    foldBack2:function(f,l1,l2,s)
    {
     return Arrays.foldBack2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2),s);
    },
    forall2:function(p,l1,l2)
    {
     return Arrays.forall2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    head:function(l)
    {
     var _,h;
     if(l.$==1)
      {
       h=l.$0;
       _=h;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    init:function(s,f)
    {
     return List.ofArray(Arrays.init(s,f));
    },
    iter2:function(f,l1,l2)
    {
     return Arrays.iter2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    iteri2:function(f,l1,l2)
    {
     return Arrays.iteri2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    map:function(f,l)
    {
     return List.ofSeq(Seq.map(f,l));
    },
    map2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    map3:function(f,l1,l2,l3)
    {
     var array;
     array=Arrays.map2(function(func)
     {
      return function(arg1)
      {
       return func(arg1);
      };
     },Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)),Arrays.ofSeq(l3));
     return List.ofArray(array);
    },
    mapi:function(f,l)
    {
     return List.ofSeq(Seq.mapi(f,l));
    },
    mapi2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.mapi2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    max:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },l);
    },
    maxBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },l);
    },
    min:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },l);
    },
    minBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },l);
    },
    ofArray:function(arr)
    {
     var r,i;
     r=Runtime.New(T1,{
      $:0
     });
     for(i=0;i<=Arrays.length(arr)-1;i++){
      r=Runtime.New(T1,{
       $:1,
       $0:Arrays.get(arr,Arrays.length(arr)-i-1),
       $1:r
      });
     }
     return r;
    },
    ofSeq:function(s)
    {
     var r,e,x;
     r=[];
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       r.unshift(e.get_Current());
      }
     x=r.slice(0);
     x.reverse();
     return List.ofArray(x);
    },
    partition:function(p,l)
    {
     var patternInput,b,a;
     patternInput=Arrays.partition(p,Arrays.ofSeq(l));
     b=patternInput[1];
     a=patternInput[0];
     return[List.ofArray(a),List.ofArray(b)];
    },
    permute:function(f,l)
    {
     return List.ofArray(Arrays.permute(f,Arrays.ofSeq(l)));
    },
    reduceBack:function(f,l)
    {
     return Arrays.reduceBack(f,Arrays.ofSeq(l));
    },
    replicate:function(size,value)
    {
     return List.ofArray(Arrays.create(size,value));
    },
    rev:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     a.reverse();
     return List.ofArray(a);
    },
    scan:function(f,s,l)
    {
     return List.ofSeq(Seq.scan(f,s,l));
    },
    scanBack:function(f,l,s)
    {
     return List.ofArray(Arrays.scanBack(f,Arrays.ofSeq(l),s));
    },
    sort:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlace(a);
     return List.ofArray(a);
    },
    sortBy:function(f,l)
    {
     return List.sortWith(function(x)
     {
      return function(y)
      {
       return Operators.Compare(f(x),f(y));
      };
     },l);
    },
    sortWith:function(f,l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlaceWith(f,a);
     return List.ofArray(a);
    },
    tail:function(l)
    {
     var _,t;
     if(l.$==1)
      {
       t=l.$1;
       _=t;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    unzip:function(l)
    {
     var x,y,enumerator,forLoopVar,b,a;
     x=[];
     y=[];
     enumerator=Enumerator.Get(l);
     while(enumerator.MoveNext())
      {
       forLoopVar=enumerator.get_Current();
       b=forLoopVar[1];
       a=forLoopVar[0];
       x.push(a);
       y.push(b);
      }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0))];
    },
    unzip3:function(l)
    {
     var x,y,z,enumerator,forLoopVar,c,b,a;
     x=[];
     y=[];
     z=[];
     enumerator=Enumerator.Get(l);
     while(enumerator.MoveNext())
      {
       forLoopVar=enumerator.get_Current();
       c=forLoopVar[2];
       b=forLoopVar[1];
       a=forLoopVar[0];
       x.push(a);
       y.push(b);
       z.push(c);
      }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0)),List.ofArray(z.slice(0))];
    },
    zip:function(l1,l2)
    {
     return List.ofArray(Arrays.zip(Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    zip3:function(l1,l2,l3)
    {
     return List.ofArray(Arrays.zip3(Arrays.ofSeq(l1),Arrays.ofSeq(l2),Arrays.ofSeq(l3)));
    }
   },
   MatchFailureException:Runtime.Class({},{
    New:function(message,line,column)
    {
     return Runtime.New(this,Exception.New1(message+" at "+Global.String(line)+":"+Global.String(column)));
    }
   }),
   OperationCanceledException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,OperationCanceledException.New1("The operation was canceled."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Operators:{
    Compare:function(a,b)
    {
     return Unchecked.Compare(a,b);
    },
    DefaultArg:function(x,d)
    {
     var _,x1;
     if(x.$==0)
      {
       _=d;
      }
     else
      {
       x1=x.$0;
       _=x1;
      }
     return _;
    },
    FailWith:function(msg)
    {
     return Operators.Raise(Exception.New1(msg));
    },
    KeyValue:function(kvp)
    {
     return[kvp.K,kvp.V];
    },
    Max:function(a,b)
    {
     return Unchecked.Compare(a,b)===1?a:b;
    },
    Min:function(a,b)
    {
     return Unchecked.Compare(a,b)===-1?a:b;
    },
    Pown:function(a,n)
    {
     var p;
     p=function(n1)
     {
      var _,_1,b;
      if(n1===1)
       {
        _=a;
       }
      else
       {
        if(n1%2===0)
         {
          b=p(n1/2>>0);
          _1=b*b;
         }
        else
         {
          _1=a*p(n1-1);
         }
        _=_1;
       }
      return _;
     };
     return p(n);
    },
    Raise:function($e)
    {
     var $0=this,$this=this;
     throw $e;
    },
    Sign:function(x)
    {
     return x===0?0:x<0?-1:1;
    },
    Truncate:function(x)
    {
     return x<0?Math.ceil(x):Math.floor(x);
    },
    Using:function(t,f)
    {
     var _;
     try
     {
      _=f(t);
     }
     finally
     {
      t.Dispose();
     }
     return _;
    },
    range:function(min,max)
    {
     return Seq.init(1+max-min,function(x)
     {
      return x+min;
     });
    },
    step:function(min,step,max)
    {
     var s,predicate,source,x;
     s=Operators.Sign(step);
     predicate=function(k)
     {
      return s*(max-k)>=0;
     };
     source=Seq.initInfinite(function(k)
     {
      return min+k*step;
     });
     x=Seq.takeWhile(predicate,source);
     return x;
    }
   },
   Option:{
    bind:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _=f(x1);
      }
     return _;
    },
    exists:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=false;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    fold:function(f,s,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(s))(x1);
      }
     return _;
    },
    foldBack:function(f,x,s)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(x1))(s);
      }
     return _;
    },
    forall:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=true;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    iter:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=null;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    map:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _={
        $:1,
        $0:f(x1)
       };
      }
     return _;
    },
    toArray:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=[];
      }
     else
      {
       x1=x.$0;
       _=[x1];
      }
     return _;
    },
    toList:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=Runtime.New(T1,{
        $:0
       });
      }
     else
      {
       x1=x.$0;
       _=List.ofArray([x1]);
      }
     return _;
    }
   },
   PrintfHelpers:{
    padNumLeft:function(s,l)
    {
     var f;
     f=Arrays.get(s,0);
     return((f===" "?true:f==="+")?true:f==="-")?f+Strings.PadLeftWith(s.substr(1),l-1,48):Strings.PadLeftWith(s,l,48);
    },
    plusForPos:function(n,s)
    {
     return 0<=n?"+"+s:s;
    },
    prettyPrint:function(o)
    {
     var printObject,t,_1,_2,_3,mapping1,strings1;
     printObject=function(o1)
     {
      var s,_,mapping,array,strings;
      s=Global.String(o1);
      if(s==="[object Object]")
       {
        mapping=function(tupledArg)
        {
         var k,v;
         k=tupledArg[0];
         v=tupledArg[1];
         return k+" = "+PrintfHelpers.prettyPrint(v);
        };
        array=JSModule.GetFields(o1);
        strings=Arrays.map(mapping,array);
        _="{"+Strings.concat("; ",strings)+"}";
       }
      else
       {
        _=s;
       }
      return _;
     };
     t=typeof o;
     if(t=="string")
      {
       _1="\""+o+"\"";
      }
     else
      {
       if(t=="object")
        {
         if(o instanceof Global.Array)
          {
           mapping1=function(o1)
           {
            return PrintfHelpers.prettyPrint(o1);
           };
           strings1=Arrays.map(mapping1,o);
           _3="[|"+Strings.concat("; ",strings1)+"|]";
          }
         else
          {
           _3=printObject(o);
          }
         _2=_3;
        }
       else
        {
         _2=Global.String(o);
        }
       _1=_2;
      }
     return _1;
    },
    printArray:function(p,o)
    {
     var strings;
     strings=Arrays.map(p,o);
     return"[|"+Strings.concat("; ",strings)+"|]";
    },
    printArray2D:function(p,o)
    {
     var strings;
     strings=Seq.delay(function()
     {
      var l2;
      l2=o.length?o[0].length:0;
      return Seq.map(function(i)
      {
       var strings1;
       strings1=Seq.delay(function()
       {
        return Seq.map(function(j)
        {
         return p(Arrays.get2D(o,i,j));
        },Operators.range(0,l2-1));
       });
       return Strings.concat("; ",strings1);
      },Operators.range(0,o.length-1));
     });
     return"[["+Strings.concat("][",strings)+"]]";
    },
    printList:function(p,o)
    {
     var strings;
     strings=Seq.map(p,o);
     return"["+Strings.concat("; ",strings)+"]";
    },
    spaceForPos:function(n,s)
    {
     return 0<=n?" "+s:s;
    },
    toSafe:function(s)
    {
     return s==null?"":s;
    }
   },
   Queue:{
    Clear:function(a)
    {
     return a.splice(0,Arrays.length(a));
    },
    Contains:function(a,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },a);
    },
    CopyTo:function(a,array,index)
    {
     return Arrays.blit(a,0,array,index,Arrays.length(a));
    }
   },
   Random:Runtime.Class({
    Next:function()
    {
     return Math.floor(Math.random()*2147483648);
    },
    Next1:function(maxValue)
    {
     return maxValue<0?Operators.FailWith("'maxValue' must be greater than zero."):Math.floor(Math.random()*maxValue);
    },
    Next2:function(minValue,maxValue)
    {
     var _,maxValue1;
     if(minValue>maxValue)
      {
       _=Operators.FailWith("'minValue' cannot be greater than maxValue.");
      }
     else
      {
       maxValue1=maxValue-minValue;
       _=minValue+Math.floor(Math.random()*maxValue1);
      }
     return _;
    },
    NextBytes:function(buffer)
    {
     var i;
     for(i=0;i<=Arrays.length(buffer)-1;i++){
      Arrays.set(buffer,i,Math.floor(Math.random()*256));
     }
     return;
    }
   },{
    New:function()
    {
     return Runtime.New(this,{});
    }
   }),
   Ref:{
    decr:function($x)
    {
     var $0=this,$this=this;
     return void($x[0]--);
    },
    incr:function($x)
    {
     var $0=this,$this=this;
     return void($x[0]++);
    }
   },
   Remoting:{
    AjaxProvider:Runtime.Field(function()
    {
     return XhrProvider.New();
    }),
    AjaxRemotingProvider:Runtime.Class({},{
     Async:function(m,data)
     {
      var headers,payload;
      headers=Remoting.makeHeaders(m);
      payload=Remoting.makePayload(data);
      return Concurrency.Delay(function()
      {
       var x;
       x=AsyncProxy.get_CancellationToken();
       return Concurrency.Bind(x,function(_arg1)
       {
        return Concurrency.FromContinuations(function(tupledArg)
        {
         var ok,err,cc,waiting,reg,ok1,err1,arg00;
         ok=tupledArg[0];
         err=tupledArg[1];
         cc=tupledArg[2];
         waiting=[true];
         reg=Concurrency.Register(_arg1,function()
         {
          return function()
          {
           var _;
           if(waiting[0])
            {
             waiting[0]=false;
             _=cc(OperationCanceledException.New());
            }
           else
            {
             _=null;
            }
           return _;
          }();
         });
         ok1=function(x1)
         {
          var _;
          if(waiting[0])
           {
            waiting[0]=false;
            reg.Dispose();
            _=ok(Json.Activate(JSON.parse(x1)));
           }
          else
           {
            _=null;
           }
          return _;
         };
         err1=function(e)
         {
          var _;
          if(waiting[0])
           {
            waiting[0]=false;
            reg.Dispose();
            _=err(e);
           }
          else
           {
            _=null;
           }
          return _;
         };
         arg00=Remoting.EndPoint();
         return Remoting.AjaxProvider().Async(arg00,headers,payload,ok1,err1);
        });
       });
      });
     },
     Send:function(m,data)
     {
      return Concurrency.Start(Concurrency.Ignore(AjaxRemotingProvider.Async(m,data)),{
       $:0
      });
     },
     Sync:function(m,data)
     {
      var arg00,arg10,arg20,data1;
      arg00=Remoting.EndPoint();
      arg10=Remoting.makeHeaders(m);
      arg20=Remoting.makePayload(data);
      data1=Remoting.AjaxProvider().Sync(arg00,arg10,arg20);
      return Json.Activate(JSON.parse(data1));
     }
    }),
    EndPoint:Runtime.Field(function()
    {
     return"?";
    }),
    UseHttps:function()
    {
     var _,_1,_2,matchValue;
     try
     {
      if(!Strings.StartsWith(window.location.href,"https://"))
       {
        _2=Strings.Replace(window.location.href,"http://","https://");
        Remoting.EndPoint=function()
        {
         return _2;
        };
        _1=true;
       }
      else
       {
        _1=false;
       }
      _=_1;
     }
     catch(matchValue)
     {
      _=false;
     }
     return _;
    },
    XhrProvider:Runtime.Class({
     Async:function(url,headers,data,ok,err)
     {
      return Remoting.ajax(true,url,headers,data,ok,err);
     },
     Sync:function(url,headers,data)
     {
      var res;
      res=[undefined];
      Remoting.ajax(false,url,headers,data,function(x)
      {
       res[0]=x;
      },function(e)
      {
       return Operators.Raise(e);
      });
      return res[0];
     }
    },{
     New:function()
     {
      return Runtime.New(this,{});
     }
    }),
    ajax:function($async,$url,$headers,$data,$ok,$err)
    {
     var $0=this,$this=this;
     var xhr=new Global.XMLHttpRequest();
     xhr.open("POST",$url,$async);
     if($async==true)
      {
       xhr.withCredentials=true;
      }
     for(var h in $headers){
      xhr.setRequestHeader(h,$headers[h]);
     }
     function k()
     {
      if(xhr.status==200)
       {
        $ok(xhr.responseText);
       }
      else
       {
        var msg="Response status is not 200: ";
        $err(new Global.Error(msg+xhr.status));
       }
     }
     if("onload"in xhr)
      {
       xhr.onload=xhr.onerror=xhr.onabort=k;
      }
     else
      {
       xhr.onreadystatechange=function()
       {
        if(xhr.readyState==4)
         {
          k();
         }
       };
      }
     xhr.send($data);
    },
    makeHeaders:function(m)
    {
     var headers;
     headers={};
     headers["content-type"]="application/json";
     headers["x-websharper-rpc"]=m;
     return headers;
    },
    makePayload:function(data)
    {
     return JSON.stringify(data);
    }
   },
   Seq:{
    append:function(s1,s2)
    {
     return Enumerable.Of(function()
     {
      var e1;
      e1=Enumerator.Get(s1);
      return T.New(e1,null,function(x)
      {
       var _,_1,e2,_2;
       if(x.s.MoveNext())
        {
         x.c=x.s.get_Current();
         _=true;
        }
       else
        {
         if(x.s===e1)
          {
           e2=Enumerator.Get(s2);
           x.s=e2;
           if(e2.MoveNext())
            {
             x.c=e2.get_Current();
             _2=true;
            }
           else
            {
             _2=false;
            }
           _1=_2;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       return _;
      });
     });
    },
    average:function(s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+x];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    averageBy:function(f,s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+f(x)];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    cache:function(s)
    {
     var cache,_enum,getEnumerator;
     cache=[];
     _enum=Enumerator.Get(s);
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       var _,_1;
       if(e.s+1<cache.length)
        {
         e.s=e.s+1;
         e.c=cache[e.s];
         _=true;
        }
       else
        {
         if(_enum.MoveNext())
          {
           e.s=e.s+1;
           e.c=_enum.get_Current();
           cache.push(e.get_Current());
           _1=true;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       return _;
      };
      return T.New(0,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    choose:function(f,s)
    {
     var mapping;
     mapping=function(x)
     {
      var matchValue,_,v;
      matchValue=f(x);
      if(matchValue.$==0)
       {
        _=Runtime.New(T1,{
         $:0
        });
       }
      else
       {
        v=matchValue.$0;
        _=List.ofArray([v]);
       }
      return _;
     };
     return Seq.collect(mapping,s);
    },
    collect:function(f,s)
    {
     return Seq.concat(Seq.map(f,s));
    },
    compareWith:function(f,s1,s2)
    {
     var e1,e2,r,loop,matchValue;
     e1=Enumerator.Get(s1);
     e2=Enumerator.Get(s2);
     r=0;
     loop=true;
     while(loop?r===0:false)
      {
       matchValue=[e1.MoveNext(),e2.MoveNext()];
       matchValue[0]?matchValue[1]?r=(f(e1.get_Current()))(e2.get_Current()):r=1:matchValue[1]?r=-1:loop=false;
      }
     return r;
    },
    concat:function(ss)
    {
     return Enumerable.Of(function()
     {
      var outerE,next;
      outerE=Enumerator.Get(ss);
      next=function(st)
      {
       var matchValue,_,_1,_2;
       matchValue=st.s;
       if(Unchecked.Equals(matchValue,null))
        {
         if(outerE.MoveNext())
          {
           st.s=Enumerator.Get(outerE.get_Current());
           _1=next(st);
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         if(matchValue.MoveNext())
          {
           st.c=matchValue.get_Current();
           _2=true;
          }
         else
          {
           st.s=null;
           _2=next(st);
          }
         _=_2;
        }
       return _;
      };
      return T.New(null,null,next);
     });
    },
    countBy:function(f,s)
    {
     var generator;
     generator=function()
     {
      var d,e,keys,k,h,_,mapping,array,x;
      d={};
      e=Enumerator.Get(s);
      keys=[];
      while(e.MoveNext())
       {
        k=f(e.get_Current());
        h=Unchecked.Hash(k);
        if(d.hasOwnProperty(h))
         {
          _=void(d[h]=d[h]+1);
         }
        else
         {
          keys.push(k);
          _=void(d[h]=1);
         }
       }
      mapping=function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      };
      array=keys.slice(0);
      x=Arrays.map(mapping,array);
      return x;
     };
     return Seq.delay(generator);
    },
    delay:function(f)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(f(null));
     });
    },
    distinct:function(s)
    {
     return Seq.distinctBy(function(x)
     {
      return x;
     },s);
    },
    distinctBy:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,seen,next;
      _enum=Enumerator.Get(s);
      seen={};
      next=function(e)
      {
       var _,cur,h,check,has,_1;
       if(_enum.MoveNext())
        {
         cur=_enum.get_Current();
         h=function(c)
         {
          return Unchecked.Hash(f(c));
         };
         check=function(c)
         {
          return seen.hasOwnProperty(h(c));
         };
         has=check(cur);
         while(has?_enum.MoveNext():false)
          {
           cur=_enum.get_Current();
           has=check(cur);
          }
         if(has)
          {
           _1=false;
          }
         else
          {
           seen[h(cur)]=null;
           e.c=cur;
           _1=true;
          }
         _=_1;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    empty:function()
    {
     return[];
    },
    enumFinally:function(s,f)
    {
     return Enumerable.Of(function()
     {
      var e,_,e1;
      try
      {
       _=Enumerator.Get(s);
      }
      catch(e1)
      {
       f(null);
       _=Operators.Raise(e1);
      }
      e=_;
      return T.New(null,null,function(x)
      {
       var _1,_2,e2;
       try
       {
        if(e.MoveNext())
         {
          x.c=e.get_Current();
          _2=true;
         }
        else
         {
          f(null);
          _2=false;
         }
        _1=_2;
       }
       catch(e2)
       {
        f(null);
        _1=Operators.Raise(e2);
       }
       return _1;
      });
     });
    },
    enumUsing:function(x,f)
    {
     return f(x);
    },
    enumWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var next;
      next=function(en)
      {
       var matchValue,_,e,_1,_2;
       matchValue=en.s;
       if(matchValue.$==1)
        {
         e=matchValue.$0;
         if(e.MoveNext())
          {
           en.c=e.get_Current();
           _1=true;
          }
         else
          {
           en.s={
            $:0
           };
           _1=next(en);
          }
         _=_1;
        }
       else
        {
         if(f(null))
          {
           en.s={
            $:1,
            $0:Enumerator.Get(s)
           };
           _2=next(en);
          }
         else
          {
           _2=false;
          }
         _=_2;
        }
       return _;
      };
      return T.New({
       $:0
      },null,next);
     });
    },
    exists:function(p,s)
    {
     var e,r;
     e=Enumerator.Get(s);
     r=false;
     while(!r?e.MoveNext():false)
      {
       r=p(e.get_Current());
      }
     return r;
    },
    exists2:function(p,s1,s2)
    {
     var e1,e2,r;
     e1=Enumerator.Get(s1);
     e2=Enumerator.Get(s2);
     r=false;
     while((!r?e1.MoveNext():false)?e2.MoveNext():false)
      {
       r=(p(e1.get_Current()))(e2.get_Current());
      }
     return r;
    },
    filter:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,next;
      _enum=Enumerator.Get(s);
      next=function(e)
      {
       var loop,c,res,_;
       loop=_enum.MoveNext();
       c=_enum.get_Current();
       res=false;
       while(loop)
        {
         if(f(c))
          {
           e.c=c;
           res=true;
           _=loop=false;
          }
         else
          {
           _=_enum.MoveNext()?c=_enum.get_Current():loop=false;
          }
        }
       return res;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    find:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFind(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndex:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFindIndex(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,x,s)
    {
     var r,e;
     r=x;
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       r=(f(r))(e.get_Current());
      }
     return r;
    },
    forall:function(p,s)
    {
     return!Seq.exists(function(x)
     {
      return!p(x);
     },s);
    },
    forall2:function(p,s1,s2)
    {
     return!Seq.exists2(function(x)
     {
      return function(y)
      {
       return!(p(x))(y);
      };
     },s1,s2);
    },
    groupBy:function(f,s)
    {
     return Seq.delay(function()
     {
      var d,d1,keys,e,c,k,h;
      d={};
      d1={};
      keys=[];
      e=Enumerator.Get(s);
      while(e.MoveNext())
       {
        c=e.get_Current();
        k=f(c);
        h=Unchecked.Hash(k);
        !d.hasOwnProperty(h)?keys.push(k):null;
        d1[h]=k;
        d.hasOwnProperty(h)?d[h].push(c):void(d[h]=[c]);
       }
      return Arrays.map(function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      },keys);
     });
    },
    head:function(s)
    {
     var e;
     e=Enumerator.Get(s);
     return e.MoveNext()?e.get_Current():Seq.insufficient();
    },
    init:function(n,f)
    {
     return Seq.take(n,Seq.initInfinite(f));
    },
    initInfinite:function(f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       e.c=f(e.s);
       e.s=e.s+1;
       return true;
      };
      return T.New(0,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    insufficient:function()
    {
     return Operators.FailWith("The input sequence has an insufficient number of elements.");
    },
    isEmpty:function(s)
    {
     var e;
     e=Enumerator.Get(s);
     return!e.MoveNext();
    },
    iter:function(p,s)
    {
     return Seq.iteri(function()
     {
      return function(x)
      {
       return p(x);
      };
     },s);
    },
    iter2:function(p,s1,s2)
    {
     var e1,e2;
     e1=Enumerator.Get(s1);
     e2=Enumerator.Get(s2);
     while(e1.MoveNext()?e2.MoveNext():false)
      {
       (p(e1.get_Current()))(e2.get_Current());
      }
     return;
    },
    iteri:function(p,s)
    {
     var i,e;
     i=0;
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       (p(i))(e.get_Current());
       i=i+1;
      }
     return;
    },
    length:function(s)
    {
     var i,e;
     i=0;
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       i=i+1;
      }
     return i;
    },
    map:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,next;
      en=Enumerator.Get(s);
      next=function(e)
      {
       var _;
       if(en.MoveNext())
        {
         e.c=f(en.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    mapi:function(f,s)
    {
     return Seq.mapi2(f,Seq.initInfinite(function(x)
     {
      return x;
     }),s);
    },
    mapi2:function(f,s1,s2)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var e1,e2,next;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      next=function(e)
      {
       var _;
       if(e1.MoveNext()?e2.MoveNext():false)
        {
         e.c=(f(e1.get_Current()))(e2.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    max:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)>=0?x:y;
      };
     },s);
    },
    maxBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))>=0?x:y;
      };
     },s);
    },
    min:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)<=0?x:y;
      };
     },s);
    },
    minBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))<=0?x:y;
      };
     },s);
    },
    nth:function(index,s)
    {
     var pos,e;
     index<0?Operators.FailWith("negative index requested"):null;
     pos=-1;
     e=Enumerator.Get(s);
     while(pos<index)
      {
       !e.MoveNext()?Seq.insufficient():null;
       pos=pos+1;
      }
     return e.get_Current();
    },
    pairwise:function(s)
    {
     var mapping,source;
     mapping=function(x)
     {
      return[Arrays.get(x,0),Arrays.get(x,1)];
     };
     source=Seq.windowed(2,s);
     return Seq.map(mapping,source);
    },
    pick:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryPick(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    readOnly:function(s)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(s);
     });
    },
    reduce:function(f,source)
    {
     var e,r;
     e=Enumerator.Get(source);
     !e.MoveNext()?Operators.FailWith("The input sequence was empty"):null;
     r=e.get_Current();
     while(e.MoveNext())
      {
       r=(f(r))(e.get_Current());
      }
     return r;
    },
    scan:function(f,x,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,next;
      en=Enumerator.Get(s);
      next=function(e)
      {
       var _,_1;
       if(e.s)
        {
         if(en.MoveNext())
          {
           e.c=(f(e.get_Current()))(en.get_Current());
           _1=true;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         e.c=x;
         e.s=true;
         _=true;
        }
       return _;
      };
      return T.New(false,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    skip:function(n,s)
    {
     return Enumerable.Of(function()
     {
      var e,i;
      e=Enumerator.Get(s);
      for(i=1;i<=n;i++){
       !e.MoveNext()?Seq.insufficient():null;
      }
      return e;
     });
    },
    skipWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var e,empty;
      e=Enumerator.Get(s);
      empty=true;
      while(e.MoveNext()?f(e.get_Current()):false)
       {
        empty=false;
       }
      return empty?Enumerator.Get(Seq.empty()):T.New(true,null,function(x)
      {
       var _,r;
       if(x.s)
        {
         x.s=false;
         x.c=e.get_Current();
         _=true;
        }
       else
        {
         r=e.MoveNext();
         x.c=e.get_Current();
         _=r;
        }
       return _;
      });
     });
    },
    sort:function(s)
    {
     return Seq.sortBy(function(x)
     {
      return x;
     },s);
    },
    sortBy:function(f,s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Arrays.ofSeq(s);
      Arrays.sortInPlaceBy(f,array);
      return array;
     });
    },
    sum:function(s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+x;
      };
     },0,s);
    },
    sumBy:function(f,s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+f(x);
      };
     },0,s);
    },
    take:function(n,s)
    {
     return Enumerable.Of(function()
     {
      var e;
      e=Enumerator.Get(s);
      return T.New(0,null,function(_enum)
      {
       var _,_1;
       if(_enum.s>=n)
        {
         _=false;
        }
       else
        {
         if(e.MoveNext())
          {
           _enum.s=_enum.s+1;
           _enum.c=e.get_Current();
           _1=true;
          }
         else
          {
           e.Dispose();
           _enum.s=n;
           _1=false;
          }
         _=_1;
        }
       return _;
      });
     });
    },
    takeWhile:function(f,s)
    {
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       return Seq.enumWhile(function()
       {
        return e.MoveNext()?f(e.get_Current()):false;
       },Seq.delay(function()
       {
        return[e.get_Current()];
       }));
      });
     });
    },
    toArray:function(s)
    {
     var q,enumerator,e;
     q=[];
     enumerator=Enumerator.Get(s);
     while(enumerator.MoveNext())
      {
       e=enumerator.get_Current();
       q.push(e);
      }
     return q.slice(0);
    },
    toList:function(s)
    {
     return List.ofSeq(s);
    },
    truncate:function(n,s)
    {
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       var i;
       i=[0];
       return Seq.enumWhile(function()
       {
        return e.MoveNext()?i[0]<n:false;
       },Seq.delay(function()
       {
        Ref.incr(i);
        return[e.get_Current()];
       }));
      });
     });
    },
    tryFind:function(ok,s)
    {
     var e,r,x;
     e=Enumerator.Get(s);
     r={
      $:0
     };
     while(r.$==0?e.MoveNext():false)
      {
       x=e.get_Current();
       ok(x)?r={
        $:1,
        $0:x
       }:null;
      }
     return r;
    },
    tryFindIndex:function(ok,s)
    {
     var e,loop,i,x;
     e=Enumerator.Get(s);
     loop=true;
     i=0;
     while(loop?e.MoveNext():false)
      {
       x=e.get_Current();
       ok(x)?loop=false:i=i+1;
      }
     return loop?{
      $:0
     }:{
      $:1,
      $0:i
     };
    },
    tryPick:function(f,s)
    {
     var e,r;
     e=Enumerator.Get(s);
     r={
      $:0
     };
     while(Unchecked.Equals(r,{
      $:0
     })?e.MoveNext():false)
      {
       r=f(e.get_Current());
      }
     return r;
    },
    unfold:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       var matchValue,_,t,s1;
       matchValue=f(e.s);
       if(matchValue.$==0)
        {
         _=false;
        }
       else
        {
         t=matchValue.$0[0];
         s1=matchValue.$0[1];
         e.c=t;
         e.s=s1;
         _=true;
        }
       return _;
      };
      return T.New(s,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    windowed:function(windowSize,s)
    {
     windowSize<=0?Operators.FailWith("The input must be non-negative."):null;
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       var q;
       q=[];
       return Seq.append(Seq.enumWhile(function()
       {
        return q.length<windowSize?e.MoveNext():false;
       },Seq.delay(function()
       {
        q.push(e.get_Current());
        return Seq.empty();
       })),Seq.delay(function()
       {
        return q.length===windowSize?Seq.append([q.slice(0)],Seq.delay(function()
        {
         return Seq.enumWhile(function()
         {
          return e.MoveNext();
         },Seq.delay(function()
         {
          q.shift();
          q.push(e.get_Current());
          return[q.slice(0)];
         }));
        })):Seq.empty();
       }));
      });
     });
    },
    zip:function(s1,s2)
    {
     return Seq.mapi2(function(x)
     {
      return function(y)
      {
       return[x,y];
      };
     },s1,s2);
    },
    zip3:function(s1,s2,s3)
    {
     return Seq.mapi2(function(x)
     {
      return function(tupledArg)
      {
       var y,z;
       y=tupledArg[0];
       z=tupledArg[1];
       return[x,y,z];
      };
     },s1,Seq.zip(s2,s3));
    }
   },
   Slice:{
    array:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1=[];
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    },
    array2D:function(arr,start1,finish1,start2,finish2)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3,len1,len2;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=arr.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(arr.length?arr[0].length:0)-1;
      }
     finish21=_3;
     len1=finish11-start11+1;
     len2=finish21-start21+1;
     return Arrays.sub2D(arr,start11,start21,len1,len2);
    },
    array2Dfix1:function(arr,fixed1,start2,finish2)
    {
     var start21,_,n,finish21,_1,n1,len2,dst,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(arr.length?arr[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     dst=Array(len2);
     for(j=0;j<=len2-1;j++){
      Arrays.set(dst,j,Arrays.get2D(arr,fixed1,start21+j));
     }
     return dst;
    },
    array2Dfix2:function(arr,start1,finish1,fixed2)
    {
     var start11,_,n,finish11,_1,n1,len1,dst,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=arr.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     dst=Array(len1);
     for(i=0;i<=len1-1;i++){
      Arrays.set(dst,i,Arrays.get2D(arr,start11+i,fixed2));
     }
     return dst;
    },
    setArray:function(dst,start,finish,src)
    {
     var start1,_,n,finish1,_1,n1;
     if(start.$==1)
      {
       n=start.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start1=_;
     if(finish.$==1)
      {
       n1=finish.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish1=_1;
     return Arrays.setSub(dst,start1,finish1-start1+1,src);
    },
    setArray2D:function(dst,start1,finish1,start2,finish2,src)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=dst.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(dst.length?dst[0].length:0)-1;
      }
     finish21=_3;
     return Arrays.setSub2D(dst,start11,start21,finish11-start11+1,finish21-start21+1,src);
    },
    setArray2Dfix1:function(dst,fixed1,start2,finish2,src)
    {
     var start21,_,n,finish21,_1,n1,len2,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(dst.length?dst[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     for(j=0;j<=len2-1;j++){
      Arrays.set2D(dst,fixed1,start21+j,Arrays.get(src,j));
     }
     return;
    },
    setArray2Dfix2:function(dst,start1,finish1,fixed2,src)
    {
     var start11,_,n,finish11,_1,n1,len1,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     for(i=0;i<=len1-1;i++){
      Arrays.set2D(dst,start11+i,fixed2,Arrays.get(src,i));
     }
     return;
    },
    string:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1="";
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    }
   },
   Stack:{
    Clear:function(stack)
    {
     return stack.splice(0,Arrays.length(stack));
    },
    Contains:function(stack,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },stack);
    },
    CopyTo:function(stack,array,index)
    {
     return Arrays.blit(array,0,array,index,Arrays.length(stack));
    }
   },
   Strings:{
    Compare:function(x,y)
    {
     return Operators.Compare(x,y);
    },
    CopyTo:function(s,o,d,off,ct)
    {
     return Arrays.blit(Strings.ToCharArray(s),o,d,off,ct);
    },
    EndsWith:function($x,$s)
    {
     var $0=this,$this=this;
     return $x.substring($x.length-$s.length)==$s;
    },
    IndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.indexOf(Global.String.fromCharCode($c),$i);
    },
    Insert:function($x,$index,$s)
    {
     var $0=this,$this=this;
     return $x.substring(0,$index-1)+$s+$x.substring($index);
    },
    IsNullOrEmpty:function($x)
    {
     var $0=this,$this=this;
     return $x==null||$x=="";
    },
    Join:function($sep,$values)
    {
     var $0=this,$this=this;
     return $values.join($sep);
    },
    LastIndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.lastIndexOf(Global.String.fromCharCode($c),$i);
    },
    PadLeft:function(s,n)
    {
     return Strings.PadLeftWith(s,n,32);
    },
    PadLeftWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c))+$s;
    },
    PadRight:function(s,n)
    {
     return Strings.PadRightWith(s,n,32);
    },
    PadRightWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return $s+Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c));
    },
    RegexEscape:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");
    },
    Remove:function($x,$ix,$ct)
    {
     var $0=this,$this=this;
     return $x.substring(0,$ix)+$x.substring($ix+$ct);
    },
    Replace:function(subject,search,replace)
    {
     var replaceLoop;
     replaceLoop=function(subj)
     {
      var index,_,replaced,nextStartIndex;
      index=subj.indexOf(search);
      if(index!==-1)
       {
        replaced=Strings.ReplaceOnce(subj,search,replace);
        nextStartIndex=index+replace.length;
        _=Strings.Substring(replaced,0,index+replace.length)+replaceLoop(replaced.substring(nextStartIndex));
       }
      else
       {
        _=subj;
       }
      return _;
     };
     return replaceLoop(subject);
    },
    ReplaceChar:function(s,oldC,newC)
    {
     return Strings.Replace(s,String.fromCharCode(oldC),String.fromCharCode(newC));
    },
    ReplaceOnce:function($string,$search,$replace)
    {
     var $0=this,$this=this;
     return $string.replace($search,$replace);
    },
    Split:function(s,pat,opts)
    {
     var res;
     res=Strings.SplitWith(s,pat);
     return opts===1?Arrays.filter(function(x)
     {
      return x!=="";
     },res):res;
    },
    SplitChars:function(s,sep,opts)
    {
     var re;
     re="["+Strings.RegexEscape(String.fromCharCode.apply(undefined,sep))+"]";
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitStrings:function(s,sep,opts)
    {
     var re;
     re=Strings.concat("|",Arrays.map(function(s1)
     {
      return Strings.RegexEscape(s1);
     },sep));
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitWith:function($str,$pat)
    {
     var $0=this,$this=this;
     return $str.split($pat);
    },
    StartsWith:function($t,$s)
    {
     var $0=this,$this=this;
     return $t.substring(0,$s.length)==$s;
    },
    Substring:function($s,$ix,$ct)
    {
     var $0=this,$this=this;
     return $s.substr($ix,$ct);
    },
    ToCharArray:function(s)
    {
     return Arrays.init(s.length,function(x)
     {
      return s.charCodeAt(x);
     });
    },
    ToCharArrayRange:function(s,startIndex,length)
    {
     return Arrays.init(length,function(i)
     {
      return s.charCodeAt(startIndex+i);
     });
    },
    Trim:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"").replace(/\s+$/,"");
    },
    TrimEnd:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/\s+$/,"");
    },
    TrimStart:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"");
    },
    collect:function(f,s)
    {
     return Arrays.init(s.length,function(i)
     {
      return f(s.charCodeAt(i));
     }).join("");
    },
    concat:function(separator,strings)
    {
     return Seq.toArray(strings).join(separator);
    },
    exists:function(f,s)
    {
     return Seq.exists(f,Strings.protect(s));
    },
    forall:function(f,s)
    {
     return Seq.forall(f,Strings.protect(s));
    },
    init:function(count,f)
    {
     return Arrays.init(count,f).join("");
    },
    iter:function(f,s)
    {
     return Seq.iter(f,Strings.protect(s));
    },
    iteri:function(f,s)
    {
     return Seq.iteri(f,Strings.protect(s));
    },
    length:function(s)
    {
     return Strings.protect(s).length;
    },
    map:function(f,s)
    {
     return Strings.collect(function(x)
     {
      return String.fromCharCode(f(x));
     },Strings.protect(s));
    },
    mapi:function(f,s)
    {
     return Seq.toArray(Seq.mapi(function(i)
     {
      return function(x)
      {
       return String.fromCharCode((f(i))(x));
      };
     },s)).join("");
    },
    protect:function(s)
    {
     return s===null?"":s;
    },
    replicate:function(count,s)
    {
     return Strings.init(count,function()
     {
      return s;
     });
    }
   },
   Unchecked:{
    Compare:function(a,b)
    {
     var _,matchValue,_1,matchValue1;
     if(a===b)
      {
       _=0;
      }
     else
      {
       matchValue=typeof a;
       if(matchValue==="undefined")
        {
         matchValue1=typeof b;
         _1=matchValue1==="undefined"?0:-1;
        }
       else
        {
         _1=matchValue==="function"?Operators.FailWith("Cannot compare function values."):matchValue==="boolean"?a<b?-1:1:matchValue==="number"?a<b?-1:1:matchValue==="string"?a<b?-1:1:a===null?-1:b===null?1:"CompareTo"in a?a.CompareTo(b):(a instanceof Array?b instanceof Array:false)?Unchecked.compareArrays(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.compareDates(a,b):Unchecked.compareArrays(JSModule.GetFields(a),JSModule.GetFields(b));
        }
       _=_1;
      }
     return _;
    },
    Equals:function(a,b)
    {
     var _,matchValue;
     if(a===b)
      {
       _=true;
      }
     else
      {
       matchValue=typeof a;
       _=matchValue==="object"?a===null?false:b===null?false:"Equals"in a?a.Equals(b):(a instanceof Array?b instanceof Array:false)?Unchecked.arrayEquals(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.dateEquals(a,b):Unchecked.arrayEquals(JSModule.GetFields(a),JSModule.GetFields(b)):false;
      }
     return _;
    },
    Hash:function(o)
    {
     var matchValue;
     matchValue=typeof o;
     return matchValue==="function"?0:matchValue==="boolean"?o?1:0:matchValue==="number"?o:matchValue==="string"?Unchecked.hashString(o):matchValue==="object"?o==null?0:o instanceof Array?Unchecked.hashArray(o):Unchecked.hashObject(o):0;
    },
    arrayEquals:function(a,b)
    {
     var _,eq,i;
     if(Arrays.length(a)===Arrays.length(b))
      {
       eq=true;
       i=0;
       while(eq?i<Arrays.length(a):false)
        {
         !Unchecked.Equals(Arrays.get(a,i),Arrays.get(b,i))?eq=false:null;
         i=i+1;
        }
       _=eq;
      }
     else
      {
       _=false;
      }
     return _;
    },
    compareArrays:function(a,b)
    {
     var _,_1,cmp,i;
     if(Arrays.length(a)<Arrays.length(b))
      {
       _=-1;
      }
     else
      {
       if(Arrays.length(a)>Arrays.length(b))
        {
         _1=1;
        }
       else
        {
         cmp=0;
         i=0;
         while(cmp===0?i<Arrays.length(a):false)
          {
           cmp=Unchecked.Compare(Arrays.get(a,i),Arrays.get(b,i));
           i=i+1;
          }
         _1=cmp;
        }
       _=_1;
      }
     return _;
    },
    compareDates:function(a,b)
    {
     return Operators.Compare(a.getTime(),b.getTime());
    },
    dateEquals:function(a,b)
    {
     return a.getTime()===b.getTime();
    },
    hashArray:function(o)
    {
     var h,i;
     h=-34948909;
     for(i=0;i<=Arrays.length(o)-1;i++){
      h=Unchecked.hashMix(h,Unchecked.Hash(Arrays.get(o,i)));
     }
     return h;
    },
    hashMix:function(x,y)
    {
     return(x<<5)+x+y;
    },
    hashObject:function(o)
    {
     var _,op_PlusPlus,h;
     if("GetHashCode"in o)
      {
       _=o.GetHashCode();
      }
     else
      {
       op_PlusPlus=function(x,y)
       {
        return Unchecked.hashMix(x,y);
       };
       h=[0];
       JSModule.ForEach(o,function(key)
       {
        h[0]=op_PlusPlus(op_PlusPlus(h[0],Unchecked.hashString(key)),Unchecked.Hash(o[key]));
        return false;
       });
       _=h[0];
      }
     return _;
    },
    hashString:function(s)
    {
     var _,hash,i;
     if(s===null)
      {
       _=0;
      }
     else
      {
       hash=5381;
       for(i=0;i<=s.length-1;i++){
        hash=Unchecked.hashMix(hash,s.charCodeAt(i)<<0);
       }
       _=hash;
      }
     return _;
    }
   },
   Util:{
    addListener:function(event,h)
    {
     event.Subscribe(Util.observer(h));
    },
    observer:function(h)
    {
     return{
      OnCompleted:function()
      {
      },
      OnError:function()
      {
      },
      OnNext:h
     };
    },
    subscribeTo:function(event,h)
    {
     return event.Subscribe(Util.observer(h));
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  AggregateException=Runtime.Safe(Global.WebSharper.AggregateException);
  Exception=Runtime.Safe(Global.WebSharper.Exception);
  ArgumentException=Runtime.Safe(Global.WebSharper.ArgumentException);
  Number=Runtime.Safe(Global.Number);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  IndexOutOfRangeException=Runtime.Safe(Global.WebSharper.IndexOutOfRangeException);
  Array=Runtime.Safe(Global.Array);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Arrays2D=Runtime.Safe(Global.WebSharper.Arrays2D);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Option=Runtime.Safe(Global.WebSharper.Option);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  setTimeout=Runtime.Safe(Global.setTimeout);
  CancellationTokenSource=Runtime.Safe(Global.WebSharper.CancellationTokenSource);
  Char=Runtime.Safe(Global.WebSharper.Char);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Lazy=Runtime.Safe(Global.WebSharper.Lazy);
  OperationCanceledException=Runtime.Safe(Global.WebSharper.OperationCanceledException);
  Date=Runtime.Safe(Global.Date);
  console=Runtime.Safe(Global.console);
  Scheduler=Runtime.Safe(Concurrency.Scheduler);
  T=Runtime.Safe(Enumerator.T);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Activator=Runtime.Safe(Client.Activator);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Json=Runtime.Safe(Global.WebSharper.Json);
  JSON=Runtime.Safe(Global.JSON);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  HtmlContentExtensions=Runtime.Safe(Client.HtmlContentExtensions);
  SingleNode=Runtime.Safe(HtmlContentExtensions.SingleNode);
  InvalidOperationException=Runtime.Safe(Global.WebSharper.InvalidOperationException);
  List=Runtime.Safe(Global.WebSharper.List);
  T1=Runtime.Safe(List.T);
  MatchFailureException=Runtime.Safe(Global.WebSharper.MatchFailureException);
  Math=Runtime.Safe(Global.Math);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  PrintfHelpers=Runtime.Safe(Global.WebSharper.PrintfHelpers);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  XhrProvider=Runtime.Safe(Remoting.XhrProvider);
  AsyncProxy=Runtime.Safe(Global.WebSharper.AsyncProxy);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  window=Runtime.Safe(Global.window);
  Enumerable=Runtime.Safe(Global.WebSharper.Enumerable);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  String=Runtime.Safe(Global.String);
  return RegExp=Runtime.Safe(Global.RegExp);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(AggregateException,Exception);
  Runtime.Inherit(ArgumentException,Exception);
  Runtime.Inherit(IndexOutOfRangeException,Exception);
  Runtime.Inherit(InvalidOperationException,Exception);
  Runtime.Inherit(MatchFailureException,Exception);
  Runtime.Inherit(OperationCanceledException,Exception);
  Remoting.EndPoint();
  Remoting.AjaxProvider();
  Activator.Activate();
  Concurrency.scheduler();
  Concurrency.defCTS();
  Concurrency.GetCT();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Arrays,ok,Unchecked,console,Testing,Pervasives,TestBuilder,test,Random,Math,NaN1,Infinity1,List,String,Seq;
 Runtime.Define(Global,{
  WebSharper:{
   Testing:{
    Assert:{
     For:function(times,gen,attempt)
     {
      var i,i1;
      for(i=0;i<=Arrays.length(gen.Base)-1;i++){
       attempt(Arrays.get(gen.Base,i));
      }
      for(i1=1;i1<=times;i1++){
       attempt(gen.Next.call(null,null));
      }
      return;
     },
     Raises:function(f)
     {
      var _,matchValue;
      try
      {
       f(null);
       _=ok(false,"Assert raises exception test failed.");
      }
      catch(matchValue)
      {
       _=ok(true,"Pass.");
      }
      return _;
     }
    },
    Pervasives:{
     Is:function(a,b)
     {
      var _,ps;
      if(!Unchecked.Equals(a,b))
       {
        ps=[a,b];
        if(console)
         {
          console.log.apply(console,["Equality test failed."].concat(ps));
         }
        _=ok(false,"Equality test failed.");
       }
      else
       {
        _=ok(true,"Pass.");
       }
      return _;
     },
     Isnt:function(a,b)
     {
      var _,ps;
      if(Unchecked.Equals(a,b))
       {
        ps=[a,b];
        if(console)
         {
          console.log.apply(console,["Inequality test failed."].concat(ps));
         }
        _=ok(false,"Inequality test failed.");
       }
      else
       {
        _=ok(true,"Pass.");
       }
      return _;
     },
     Test:function(name)
     {
      return TestBuilder.New(name);
     },
     TestBuilder:Runtime.Class({
      Delay:function(f)
      {
       return test(this.name,f);
      },
      Zero:function()
      {
       return null;
      }
     },{
      New:function(name)
      {
       var r;
       r=Runtime.New(this,{});
       r.name=name;
       return r;
      }
     })
    },
    Random:{
     ArrayOf:function(generator)
     {
      return{
       Base:[[]],
       Next:function()
       {
        var len;
        len=Random.Natural().Next.call(null,null)%100;
        return Arrays.init(len,function()
        {
         return generator.Next.call(null,null);
        });
       }
      };
     },
     Boolean:Runtime.Field(function()
     {
      return{
       Base:[true,false],
       Next:function()
       {
        return Random.StandardUniform().Next.call(null,null)>0.5;
       }
      };
     }),
     Const:function(x)
     {
      return{
       Base:[x],
       Next:function()
       {
        return x;
       }
      };
     },
     Exponential:function(lambda)
     {
      return{
       Base:[],
       Next:function()
       {
        var p;
        p=Random.StandardUniform().Next.call(null,null);
        return-Math.log(1-p)/lambda;
       }
      };
     },
     Float:Runtime.Field(function()
     {
      return{
       Base:[0],
       Next:function()
       {
        var sign;
        sign=Random.Boolean().Next.call(null,null)?1:-1;
        return sign*Random.Exponential(0.1).Next.call(null,null);
       }
      };
     }),
     FloatExhaustive:Runtime.Field(function()
     {
      return{
       Base:[0,NaN1,Infinity1,-Infinity1],
       Next:function()
       {
        return Random.Float().Next.call(null,null);
       }
      };
     }),
     FloatWithin:function(low,hi)
     {
      return{
       Base:[low,hi],
       Next:function()
       {
        return low+(hi-low)*Math.random();
       }
      };
     },
     Implies:function(a,b)
     {
      return!a?true:b;
     },
     Imply:function(a,b)
     {
      return Random.Implies(a,b);
     },
     Int:Runtime.Field(function()
     {
      return{
       Base:[0,1,-1],
       Next:function()
       {
        return Math.round(Random.Float().Next.call(null,null));
       }
      };
     }),
     ListOf:function(generator)
     {
      var f,gen;
      f=function(array)
      {
       return List.ofArray(array);
      };
      gen=Random.ArrayOf(generator);
      return Random.Map(f,gen);
     },
     Map:function(f,gen)
     {
      var f1;
      f1=gen.Next;
      return{
       Base:Arrays.map(f,gen.Base),
       Next:function(x)
       {
        return f(f1(x));
       }
      };
     },
     Mix:function(a,b)
     {
      var left;
      left=[false];
      return{
       Base:a.Base.concat(b.Base),
       Next:function()
       {
        left[0]=!left[0];
        return left[0]?a.Next.call(null,null):b.Next.call(null,null);
       }
      };
     },
     Natural:Runtime.Field(function()
     {
      var g;
      g=Random.Int().Next;
      return{
       Base:[0,1],
       Next:function(x)
       {
        var value;
        value=g(x);
        return Math.abs(value);
       }
      };
     }),
     OneOf:function(seeds)
     {
      var index;
      index=Random.Within(1,Arrays.length(seeds));
      return{
       Base:seeds,
       Next:function()
       {
        return Arrays.get(seeds,index.Next.call(null,null)-1);
       }
      };
     },
     OptionOf:function(generator)
     {
      return Random.Mix(Random.Const({
       $:0
      }),Random.Map(function(arg0)
      {
       return{
        $:1,
        $0:arg0
       };
      },generator));
     },
     StandardUniform:Runtime.Field(function()
     {
      return{
       Base:[],
       Next:function()
       {
        return Math.random();
       }
      };
     }),
     String:Runtime.Field(function()
     {
      return{
       Base:[""],
       Next:function()
       {
        var len,cs;
        len=Random.Natural().Next.call(null,null)%100;
        cs=Arrays.init(len,function()
        {
         return Random.Int().Next.call(null,null)%256;
        });
        return String.fromCharCode.apply(undefined,cs);
       }
      };
     }),
     StringExhaustive:Runtime.Field(function()
     {
      return{
       Base:[null,""],
       Next:Random.String().Next
      };
     }),
     Tuple2Of:function(a,b)
     {
      return{
       Base:Seq.toArray(Seq.delay(function()
       {
        return Seq.collect(function(x)
        {
         return Seq.map(function(y)
         {
          return[x,y];
         },b.Base);
        },a.Base);
       })),
       Next:function()
       {
        return[a.Next.call(null,null),b.Next.call(null,null)];
       }
      };
     },
     Tuple3Of:function(a,b,c)
     {
      return{
       Base:Seq.toArray(Seq.delay(function()
       {
        return Seq.collect(function(x)
        {
         return Seq.collect(function(y)
         {
          return Seq.map(function(z)
          {
           return[x,y,z];
          },c.Base);
         },b.Base);
        },a.Base);
       })),
       Next:function()
       {
        return[a.Next.call(null,null),b.Next.call(null,null),c.Next.call(null,null)];
       }
      };
     },
     Within:function(low,hi)
     {
      return{
       Base:[low,hi],
       Next:function()
       {
        return Random.Natural().Next.call(null,null)%(hi-low)+low;
       }
      };
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  ok=Runtime.Safe(Global.ok);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  console=Runtime.Safe(Global.console);
  Testing=Runtime.Safe(Global.WebSharper.Testing);
  Pervasives=Runtime.Safe(Testing.Pervasives);
  TestBuilder=Runtime.Safe(Pervasives.TestBuilder);
  test=Runtime.Safe(Global.test);
  Random=Runtime.Safe(Testing.Random);
  Math=Runtime.Safe(Global.Math);
  NaN1=Runtime.Safe(Global.NaN);
  Infinity1=Runtime.Safe(Global.Infinity);
  List=Runtime.Safe(Global.WebSharper.List);
  String=Runtime.Safe(Global.String);
  return Seq=Runtime.Safe(Global.WebSharper.Seq);
 });
 Runtime.OnLoad(function()
 {
  Random.StringExhaustive();
  Random.String();
  Random.StandardUniform();
  Random.Natural();
  Random.Int();
  Random.FloatExhaustive();
  Random.Float();
  Random.Boolean();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Html,Client,Implementation,Attribute,Pagelet,Element,Enumerator,Math,document,jQuery,Events,JQueryEventSupport,AttributeBuilder,DeprecatedTagBuilder,JQueryHtmlProvider,TagBuilder,Text,Attr,EventsPervasives,Tags;
 Runtime.Define(Global,{
  WebSharper:{
   Html:{
    Client:{
     Attr:{
      Attr:Runtime.Field(function()
      {
       return Implementation.Attr();
      })
     },
     Attribute:Runtime.Class({
      get_Body:function()
      {
       var attr;
       attr=this.HtmlProvider.CreateAttribute(this.Name);
       attr.value=this.Value;
       return attr;
      }
     },{
      New:function(htmlProvider,name,value)
      {
       var a;
       a=Attribute.New1(htmlProvider);
       a.Name=name;
       a.Value=value;
       return a;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     AttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Default:{
      OnLoad:function(init)
      {
       return Implementation.HtmlProvider().OnDocumentReady(init);
      }
     },
     DeprecatedAttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     DeprecatedTagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Element:Runtime.Class({
      AppendI:function(pl)
      {
       var body,_,objectArg,arg00,objectArg1,arg001,arg10,_1,r;
       body=pl.get_Body();
       if(body.nodeType===2)
        {
         objectArg=this["HtmlProvider@33"];
         arg00=this.get_Body();
         _=objectArg.AppendAttribute(arg00,body);
        }
       else
        {
         objectArg1=this["HtmlProvider@33"];
         arg001=this.get_Body();
         arg10=pl.get_Body();
         _=objectArg1.AppendNode(arg001,arg10);
        }
       if(this.IsRendered)
        {
         _1=pl.Render();
        }
       else
        {
         r=this.RenderInternal;
         _1=void(this.RenderInternal=function()
         {
          r(null);
          return pl.Render();
         });
        }
       return _1;
      },
      AppendN:function(node)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.AppendNode(arg00,node);
      },
      OnLoad:function(f)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.OnLoad(arg00,f);
      },
      Render:function()
      {
       var _;
       if(!this.IsRendered)
        {
         this.RenderInternal.call(null,null);
         _=void(this.IsRendered=true);
        }
       else
        {
         _=null;
        }
       return _;
      },
      get_Body:function()
      {
       return this.Dom;
      },
      get_Html:function()
      {
       return this["HtmlProvider@33"].GetHtml(this.get_Body());
      },
      get_HtmlProvider:function()
      {
       return this["HtmlProvider@33"];
      },
      get_Id:function()
      {
       var objectArg,arg00,id,_,newId,objectArg1,arg001;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       id=objectArg.GetProperty(arg00,"id");
       if(id===undefined?true:id==="")
        {
         newId="id"+Math.round(Math.random()*100000000);
         objectArg1=this["HtmlProvider@33"];
         arg001=this.get_Body();
         objectArg1.SetProperty(arg001,"id",newId);
         _=newId;
        }
       else
        {
         _=id;
        }
       return _;
      },
      get_Item:function(name)
      {
       var objectArg,arg00,objectArg1,arg001;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       objectArg.GetAttribute(arg00,name);
       objectArg1=this["HtmlProvider@33"];
       arg001=this.get_Body();
       return objectArg1.GetAttribute(arg001,name);
      },
      get_Text:function()
      {
       return this["HtmlProvider@33"].GetText(this.get_Body());
      },
      get_Value:function()
      {
       return this["HtmlProvider@33"].GetValue(this.get_Body());
      },
      set_Html:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetHtml(arg00,x);
      },
      set_Item:function(name,value)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetAttribute(arg00,name,value);
      },
      set_Text:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetText(arg00,x);
      },
      set_Value:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetValue(arg00,x);
      }
     },{
      New:function(html,name)
      {
       var el,dom;
       el=Element.New1(html);
       dom=document.createElement(name);
       el.RenderInternal=function()
       {
       };
       el.Dom=dom;
       el.IsRendered=false;
       return el;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r["HtmlProvider@33"]=HtmlProvider;
       return r;
      }
     }),
     Events:{
      JQueryEventSupport:Runtime.Class({
       OnBlur:function(f,el)
       {
        return jQuery(el.get_Body()).bind("blur",function()
        {
         return f(el);
        });
       },
       OnChange:function(f,el)
       {
        return jQuery(el.get_Body()).bind("change",function()
        {
         return f(el);
        });
       },
       OnClick:function(f,el)
       {
        return this.OnMouse("click",f,el);
       },
       OnDoubleClick:function(f,el)
       {
        return this.OnMouse("dblclick",f,el);
       },
       OnError:function(f,el)
       {
        return jQuery(el.get_Body()).bind("error",function()
        {
         return f(el);
        });
       },
       OnEvent:function(ev,f,el)
       {
        return jQuery(el.get_Body()).bind(ev,function(ev1)
        {
         return(f(el))(ev1);
        });
       },
       OnFocus:function(f,el)
       {
        return jQuery(el.get_Body()).bind("focus",function()
        {
         return f(el);
        });
       },
       OnKeyDown:function(f,el)
       {
        return jQuery(el.get_Body()).bind("keydown",function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode,
          Event:ev
         });
        });
       },
       OnKeyPress:function(f,el)
       {
        return jQuery(el.get_Body()).keypress(function(ev)
        {
         return(f(el))({
          CharacterCode:ev.which,
          Event:ev
         });
        });
       },
       OnKeyUp:function(f,el)
       {
        return jQuery(el.get_Body()).bind("keyup",function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode,
          Event:ev
         });
        });
       },
       OnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).bind("load",function()
        {
         return f(el);
        });
       },
       OnMouse:function(name,f,el)
       {
        return jQuery(el.get_Body()).bind(name,function(ev)
        {
         return(f(el))({
          X:ev.pageX,
          Y:ev.pageY,
          Event:ev
         });
        });
       },
       OnMouseDown:function(f,el)
       {
        return this.OnMouse("mousedown",f,el);
       },
       OnMouseEnter:function(f,el)
       {
        return this.OnMouse("mouseenter",f,el);
       },
       OnMouseLeave:function(f,el)
       {
        return this.OnMouse("mouseleave",f,el);
       },
       OnMouseMove:function(f,el)
       {
        return this.OnMouse("mousemove",f,el);
       },
       OnMouseOut:function(f,el)
       {
        return this.OnMouse("mouseout",f,el);
       },
       OnMouseUp:function(f,el)
       {
        return this.OnMouse("mouseup",f,el);
       },
       OnResize:function(f,el)
       {
        return jQuery(el.get_Body()).bind("resize",function()
        {
         return f(el);
        });
       },
       OnScroll:function(f,el)
       {
        return jQuery(el.get_Body()).bind("scroll",function()
        {
         return f(el);
        });
       },
       OnSelect:function(f,el)
       {
        return jQuery(el.get_Body()).bind("select",function()
        {
         return f(el);
        });
       },
       OnSubmit:function(f,el)
       {
        return jQuery(el.get_Body()).bind("submit",function()
        {
         return f(el);
        });
       },
       OnUnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).bind("unload",function()
        {
         return f(el);
        });
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      })
     },
     EventsPervasives:{
      Events:Runtime.Field(function()
      {
       return JQueryEventSupport.New();
      })
     },
     Implementation:{
      Attr:Runtime.Field(function()
      {
       return AttributeBuilder.New(Implementation.HtmlProvider());
      }),
      DeprecatedHtml:Runtime.Field(function()
      {
       return DeprecatedTagBuilder.New(Implementation.HtmlProvider());
      }),
      HtmlProvider:Runtime.Field(function()
      {
       return JQueryHtmlProvider.New();
      }),
      JQueryHtmlProvider:Runtime.Class({
       AddClass:function(node,cls)
       {
        return jQuery(node).addClass(cls);
       },
       AppendAttribute:function(node,attr)
       {
        var arg10,arg20;
        arg10=attr.nodeName;
        arg20=attr.value;
        return this.SetAttribute(node,arg10,arg20);
       },
       AppendNode:function(node,el)
       {
        return jQuery(node).append(jQuery(el));
       },
       Clear:function(node)
       {
        return jQuery(node).contents().detach();
       },
       CreateAttribute:function(str)
       {
        return document.createAttribute(str);
       },
       CreateElement:function(name)
       {
        return document.createElement(name);
       },
       CreateTextNode:function(str)
       {
        return document.createTextNode(str);
       },
       GetAttribute:function(node,name)
       {
        return jQuery(node).attr(name);
       },
       GetHtml:function(node)
       {
        return jQuery(node).html();
       },
       GetProperty:function(node,name)
       {
        var x;
        x=jQuery(node).prop(name);
        return x;
       },
       GetText:function(node)
       {
        return node.textContent;
       },
       GetValue:function(node)
       {
        var x;
        x=jQuery(node).val();
        return x;
       },
       HasAttribute:function(node,name)
       {
        return jQuery(node).attr(name)!=null;
       },
       OnDocumentReady:function(f)
       {
        return jQuery(document).ready(f);
       },
       OnLoad:function(node,f)
       {
        return jQuery(node).ready(f);
       },
       Remove:function(node)
       {
        return jQuery(node).remove();
       },
       RemoveAttribute:function(node,name)
       {
        return jQuery(node).removeAttr(name);
       },
       RemoveClass:function(node,cls)
       {
        return jQuery(node).removeClass(cls);
       },
       SetAttribute:function(node,name,value)
       {
        return jQuery(node).attr(name,value);
       },
       SetCss:function(node,name,prop)
       {
        return jQuery(node).css(name,prop);
       },
       SetHtml:function(node,text)
       {
        return jQuery(node).html(text);
       },
       SetProperty:function(node,name,value)
       {
        var x;
        x=jQuery(node).prop(name,value);
        return x;
       },
       SetStyle:function(node,style)
       {
        return jQuery(node).attr("style",style);
       },
       SetText:function(node,text)
       {
        node.textContent=text;
       },
       SetValue:function(node,value)
       {
        return jQuery(node).val(value);
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      }),
      Tags:Runtime.Field(function()
      {
       return TagBuilder.New(Implementation.HtmlProvider());
      })
     },
     Operators:{
      OnAfterRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        r.apply(w);
        return f(w);
       };
       return;
      },
      OnBeforeRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        f(w);
        return r.apply(w);
       };
       return;
      },
      add:function(el,inner)
      {
       var enumerator,pl;
       enumerator=Enumerator.Get(inner);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      }
     },
     Pagelet:Runtime.Class({
      AppendTo:function(targetId)
      {
       var target,value;
       target=document.getElementById(targetId);
       value=target.appendChild(this.get_Body());
       return this.Render();
      },
      Render:function()
      {
       return null;
      },
      ReplaceInDom:function(node)
      {
       var value;
       value=node.parentNode.replaceChild(this.get_Body(),node);
       return this.Render();
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     TagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      },
      text:function(data)
      {
       return Text.New(data);
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Tags:{
      Deprecated:Runtime.Field(function()
      {
       return Implementation.DeprecatedHtml();
      }),
      Tags:Runtime.Field(function()
      {
       return Implementation.Tags();
      })
     },
     Text:Runtime.Class({
      get_Body:function()
      {
       return document.createTextNode(this.text);
      }
     },{
      New:function(text)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r.text=text;
       return r;
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Implementation=Runtime.Safe(Client.Implementation);
  Attribute=Runtime.Safe(Client.Attribute);
  Pagelet=Runtime.Safe(Client.Pagelet);
  Element=Runtime.Safe(Client.Element);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Math=Runtime.Safe(Global.Math);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Events=Runtime.Safe(Client.Events);
  JQueryEventSupport=Runtime.Safe(Events.JQueryEventSupport);
  AttributeBuilder=Runtime.Safe(Client.AttributeBuilder);
  DeprecatedTagBuilder=Runtime.Safe(Client.DeprecatedTagBuilder);
  JQueryHtmlProvider=Runtime.Safe(Implementation.JQueryHtmlProvider);
  TagBuilder=Runtime.Safe(Client.TagBuilder);
  Text=Runtime.Safe(Client.Text);
  Attr=Runtime.Safe(Client.Attr);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  return Tags=Runtime.Safe(Client.Tags);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Attribute,Pagelet);
  Runtime.Inherit(Element,Pagelet);
  Runtime.Inherit(Text,Pagelet);
  Tags.Tags();
  Tags.Deprecated();
  Implementation.Tags();
  Implementation.HtmlProvider();
  Implementation.DeprecatedHtml();
  Implementation.Attr();
  EventsPervasives.Events();
  Attr.Attr();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Unchecked,Seq,Option,Control,Disposable,Arrays,FSharpEvent,Util,Event,Event1,Collections,ResizeArray,ResizeArrayProxy,EventModule,HotStream,HotStream1,Concurrency,Operators,Error,setTimeout,clearTimeout,LinkedList,T,MailboxProcessor,Observable,Observer,Ref,Observable1,List,T1,Observer1;
 Runtime.Define(Global,{
  WebSharper:{
   Control:{
    Disposable:{
     Of:function(dispose)
     {
      return{
       Dispose:dispose
      };
     }
    },
    Event:{
     Event:Runtime.Class({
      AddHandler:function(h)
      {
       return this.Handlers.Add(h);
      },
      RemoveHandler:function(h)
      {
       var predicate,objectArg,action,source,option;
       predicate=function(y)
       {
        return Unchecked.Equals(h,y);
       };
       objectArg=this.Handlers;
       action=function(arg00)
       {
        return objectArg.RemoveAt(arg00);
       };
       source=this.Handlers;
       option=Seq.tryFindIndex(predicate,source);
       return Option.iter(action,option);
      },
      Subscribe:function(observer)
      {
       var h,_this=this;
       h=function(x)
       {
        return observer.OnNext(x);
       };
       this.AddHandler(h);
       return Disposable.Of(function()
       {
        return _this.RemoveHandler(h);
       });
      },
      Trigger:function(x)
      {
       var arr,idx,h;
       arr=this.Handlers.ToArray();
       for(idx=0;idx<=arr.length-1;idx++){
        h=Arrays.get(arr,idx);
        h(x);
       }
       return;
      }
     })
    },
    EventModule:{
     Choose:function(c,e)
     {
      var r;
      r=FSharpEvent.New();
      Util.addListener(e,function(x)
      {
       var matchValue,_,y;
       matchValue=c(x);
       if(matchValue.$==0)
        {
         _=null;
        }
       else
        {
         y=matchValue.$0;
         _=r.event.Trigger(y);
        }
       return _;
      });
      return r.event;
     },
     Filter:function(ok,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return ok(x)?r.Trigger(x):null;
      });
      return r;
     },
     Map:function(f,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return r.Trigger(f(x));
      });
      return r;
     },
     Merge:function(e1,e2)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e1,function(arg00)
      {
       return r.Trigger(arg00);
      });
      Util.addListener(e2,function(arg00)
      {
       return r.Trigger(arg00);
      });
      return r;
     },
     Pairwise:function(e)
     {
      var buf,ev;
      buf=[{
       $:0
      }];
      ev=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       var matchValue,_,old;
       matchValue=buf[0];
       if(matchValue.$==1)
        {
         old=matchValue.$0;
         buf[0]={
          $:1,
          $0:x
         };
         _=ev.Trigger([old,x]);
        }
       else
        {
         _=void(buf[0]={
          $:1,
          $0:x
         });
        }
       return _;
      });
      return ev;
     },
     Partition:function(f,e)
     {
      return[EventModule.Filter(f,e),EventModule.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var state,f;
      state=[seed];
      f=function(value)
      {
       state[0]=(fold(state[0]))(value);
       return state[0];
      };
      return EventModule.Map(f,e);
     },
     Split:function(f,e)
     {
      var chooser,chooser1;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      return[EventModule.Choose(chooser,e),EventModule.Choose(chooser1,e)];
     }
    },
    FSharpEvent:Runtime.Class({},{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.event=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      return r;
     }
    }),
    HotStream:{
     HotStream:Runtime.Class({
      Subscribe:function(o)
      {
       var disp;
       this.Latest[0].$==1?o.OnNext(this.Latest[0].$0):null;
       disp=Util.subscribeTo(this.Event.event,function(v)
       {
        return o.OnNext(v);
       });
       return disp;
      },
      Trigger:function(v)
      {
       this.Latest[0]={
        $:1,
        $0:v
       };
       return this.Event.event.Trigger(v);
      }
     },{
      New:function()
      {
       return Runtime.New(HotStream1,{
        Latest:[{
         $:0
        }],
        Event:FSharpEvent.New()
       });
      }
     })
    },
    MailboxProcessor:Runtime.Class({
     PostAndAsyncReply:function(msgf,timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.PostAndTryAsyncReply(msgf,timeout),function(_arg4)
       {
        var _,x;
        if(_arg4.$==1)
         {
          x=_arg4.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        return Concurrency.Return(_);
       });
      });
     },
     PostAndTryAsyncReply:function(msgf,timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg3,_arg4,_,arg001,waiting,arg002,value;
       ok=tupledArg[0];
       _arg3=tupledArg[1];
       _arg4=tupledArg[2];
       if(timeout1<0)
        {
         arg001=msgf(function(x)
         {
          return ok({
           $:1,
           $0:x
          });
         });
         _this.mailbox.AddLast(arg001);
         _=_this.resume();
        }
       else
        {
         waiting=[true];
         arg002=msgf(function(res)
         {
          var _1;
          if(waiting[0])
           {
            waiting[0]=false;
            _1=ok({
             $:1,
             $0:res
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         });
         _this.mailbox.AddLast(arg002);
         _this.resume();
         value=setTimeout(function()
         {
          var _1;
          if(waiting[0])
           {
            waiting[0]=false;
            _1=ok({
             $:0
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         },timeout1);
         _=void value;
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     Receive:function(timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.TryReceive(timeout),function(_arg3)
       {
        var _,x;
        if(_arg3.$==1)
         {
          x=_arg3.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        return Concurrency.Return(_);
       });
      });
     },
     Scan:function(scanner,timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.TryScan(scanner,timeout),function(_arg8)
       {
        var _,x;
        if(_arg8.$==1)
         {
          x=_arg8.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        return Concurrency.Return(_);
       });
      });
     },
     Start:function()
     {
      var _,a,_this=this;
      if(this.started)
       {
        _=Operators.FailWith("The MailboxProcessor has already been started.");
       }
      else
       {
        this.started=true;
        a=Concurrency.Delay(function()
        {
         return Concurrency.TryWith(Concurrency.Delay(function()
         {
          return Concurrency.Bind(_this.initial.call(null,_this),function()
          {
           return Concurrency.Return(null);
          });
         }),function(_arg2)
         {
          _this.errorEvent.event.Trigger(_arg2);
          return Concurrency.Return(null);
         });
        });
        _=_this.startAsync(a);
       }
      return _;
     },
     TryReceive:function(timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg1,_arg2,_,_1,arg0,waiting,pending,arg02,arg03;
       ok=tupledArg[0];
       _arg1=tupledArg[1];
       _arg2=tupledArg[2];
       if(Unchecked.Equals(_this.mailbox.get_First(),null))
        {
         if(timeout1<0)
          {
           arg0=Concurrency.Delay(function()
           {
            var arg01;
            arg01=_this.dequeue();
            ok({
             $:1,
             $0:arg01
            });
            return Concurrency.Return(null);
           });
           _1=void(_this.savedCont={
            $:1,
            $0:arg0
           });
          }
         else
          {
           waiting=[true];
           pending=setTimeout(function()
           {
            var _2;
            if(waiting[0])
             {
              waiting[0]=false;
              _this.savedCont={
               $:0
              };
              _2=ok({
               $:0
              });
             }
            else
             {
              _2=null;
             }
            return _2;
           },timeout1);
           arg02=Concurrency.Delay(function()
           {
            var _2,arg01;
            if(waiting[0])
             {
              waiting[0]=false;
              clearTimeout(pending);
              arg01=_this.dequeue();
              ok({
               $:1,
               $0:arg01
              });
              _2=Concurrency.Return(null);
             }
            else
             {
              _2=Concurrency.Return(null);
             }
            return _2;
           });
           _1=void(_this.savedCont={
            $:1,
            $0:arg02
           });
          }
         _=_1;
        }
       else
        {
         arg03=_this.dequeue();
         _=ok({
          $:1,
          $0:arg03
         });
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     TryScan:function(scanner,timeout)
     {
      var timeout1,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      return Concurrency.Delay(function()
      {
       var scanInbox,matchValue1,_1,found1,arg00;
       scanInbox=function()
       {
        var m,found,matchValue,_;
        m=_this.mailbox.get_First();
        found={
         $:0
        };
        while(!Unchecked.Equals(m,null))
         {
          matchValue=scanner(m.v);
          if(matchValue.$==0)
           {
            _=m=m.n;
           }
          else
           {
            _this.mailbox.Remove(m);
            m=null;
            _=found=matchValue;
           }
         }
        return found;
       };
       matchValue1=scanInbox(null);
       if(matchValue1.$==1)
        {
         found1=matchValue1.$0;
         _1=Concurrency.Bind(found1,function(_arg5)
         {
          return Concurrency.Return({
           $:1,
           $0:_arg5
          });
         });
        }
       else
        {
         arg00=function(tupledArg)
         {
          var ok,_arg5,_arg6,_,scanNext,waiting,pending,scanNext1;
          ok=tupledArg[0];
          _arg5=tupledArg[1];
          _arg6=tupledArg[2];
          if(timeout1<0)
           {
            scanNext=function()
            {
             var arg0;
             arg0=Concurrency.Delay(function()
             {
              var matchValue,_2,c;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                _2=Concurrency.Bind(c,function(_arg61)
                {
                 ok({
                  $:1,
                  $0:_arg61
                 });
                 return Concurrency.Return(null);
                });
               }
              else
               {
                scanNext(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             });
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext(null);
           }
          else
           {
            waiting=[true];
            pending=setTimeout(function()
            {
             var _2;
             if(waiting[0])
              {
               waiting[0]=false;
               _this.savedCont={
                $:0
               };
               _2=ok({
                $:0
               });
              }
             else
              {
               _2=null;
              }
             return _2;
            },timeout1);
            scanNext1=function()
            {
             var arg0;
             arg0=Concurrency.Delay(function()
             {
              var matchValue,_2,c;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                _2=Concurrency.Bind(c,function(_arg7)
                {
                 var _3;
                 if(waiting[0])
                  {
                   waiting[0]=false;
                   clearTimeout(pending);
                   ok({
                    $:1,
                    $0:_arg7
                   });
                   _3=Concurrency.Return(null);
                  }
                 else
                  {
                   _3=Concurrency.Return(null);
                  }
                 return _3;
                });
               }
              else
               {
                scanNext1(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             });
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext1(null);
           }
          return _;
         };
         _1=Concurrency.FromContinuations(arg00);
        }
       return _1;
      });
     },
     dequeue:function()
     {
      var f;
      f=this.mailbox.get_First().v;
      this.mailbox.RemoveFirst();
      return f;
     },
     get_CurrentQueueLength:function()
     {
      return this.mailbox.get_Count();
     },
     get_DefaultTimeout:function()
     {
      return this["DefaultTimeout@"];
     },
     get_Error:function()
     {
      return this.errorEvent.event;
     },
     resume:function()
     {
      var matchValue,_,c;
      matchValue=this.savedCont;
      if(matchValue.$==1)
       {
        c=matchValue.$0;
        this.savedCont={
         $:0
        };
        _=this.startAsync(c);
       }
      else
       {
        _=null;
       }
      return _;
     },
     set_DefaultTimeout:function(v)
     {
      this["DefaultTimeout@"]=v;
      return;
     },
     startAsync:function(a)
     {
      return Concurrency.Start(a,this.token);
     }
    },{
     New:function(initial,token)
     {
      var r,matchValue,_,ct,value;
      r=Runtime.New(this,{});
      r.initial=initial;
      r.token=token;
      r.started=false;
      r.errorEvent=FSharpEvent.New();
      r.mailbox=T.New();
      r.savedCont={
       $:0
      };
      matchValue=r.token;
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        ct=matchValue.$0;
        value=Concurrency.Register(ct,function()
        {
         return function()
         {
          return r.resume();
         }();
        });
        _=void value;
       }
      r["DefaultTimeout@"]=-1;
      return r;
     },
     Start:function(initial,token)
     {
      var mb;
      mb=MailboxProcessor.New(initial,token);
      mb.Start();
      return mb;
     }
    }),
    Observable:{
     Aggregate:function(io,seed,fold)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state=[seed];
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state[0]))(v);
        },function(s)
        {
         state[0]=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Choose:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v);
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     CombineLatest:function(io1,io2,f)
     {
      var f1;
      f1=function(o)
      {
       var lv1,lv2,update,onNext,o1,onNext1,o2,d1,d2;
       lv1=[{
        $:0
       }];
       lv2=[{
        $:0
       }];
       update=function()
       {
        var matchValue,_,_1,v1,v2;
        matchValue=[lv1[0],lv2[0]];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            v1=matchValue[0].$0;
            v2=matchValue[1].$0;
            _1=Observable.Protect(function()
            {
             return(f(v1))(v2);
            },function(arg00)
            {
             return o.OnNext(arg00);
            },function(arg00)
            {
             return o.OnError(arg00);
            });
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
        else
         {
          _=null;
         }
        return _;
       };
       onNext=function(x)
       {
        lv1[0]={
         $:1,
         $0:x
        };
        return update(null);
       };
       o1=Observer.New(onNext,function()
       {
       },function()
       {
       });
       onNext1=function(y)
       {
        lv2[0]={
         $:1,
         $0:y
        };
        return update(null);
       };
       o2=Observer.New(onNext1,function()
       {
       },function()
       {
       });
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.Of(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      };
      return Observable.New(f1);
     },
     Concat:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var innerDisp,outerDisp,dispose;
       innerDisp=[{
        $:0
       }];
       outerDisp=io1.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
       },function()
       {
        var arg0;
        arg0=io2.Subscribe(o);
        innerDisp[0]={
         $:1,
         $0:arg0
        };
       }));
       dispose=function()
       {
        innerDisp[0].$==1?innerDisp[0].$0.Dispose():null;
        return outerDisp.Dispose();
       };
       return Disposable.Of(dispose);
      };
      return Observable.New(f);
     },
     Drop:function(count,io)
     {
      var f;
      f=function(o1)
      {
       var index,on,arg00;
       index=[0];
       on=function(v)
       {
        Ref.incr(index);
        return index[0]>count?o1.OnNext(v):null;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Filter:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v)?{
          $:1,
          $0:v
         }:{
          $:0
         };
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Map:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return f(v);
        },function(arg00)
        {
         return o1.OnNext(arg00);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Merge:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var completed1,completed2,arg00,disp1,arg002,disp2;
       completed1=[false];
       completed2=[false];
       arg00=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed1[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       });
       disp1=io1.Subscribe(arg00);
       arg002=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed2[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       });
       disp2=io2.Subscribe(arg002);
       return Disposable.Of(function()
       {
        disp1.Dispose();
        return disp2.Dispose();
       });
      };
      return Observable.New(f);
     },
     Never:function()
     {
      return Observable.New(function()
      {
       return Disposable.Of(function()
       {
       });
      });
     },
     New:function(f)
     {
      return Runtime.New(Observable1,{
       Subscribe1:f
      });
     },
     Observable:Runtime.Class({
      Subscribe:function(observer)
      {
       return this.Subscribe1.call(null,observer);
      }
     }),
     Of:function(f)
     {
      return Observable.New(function(o)
      {
       return Disposable.Of(f(function(x)
       {
        return o.OnNext(x);
       }));
      });
     },
     Protect:function(f,succeed,fail)
     {
      var matchValue,_,e,_1,e1,x;
      try
      {
       _={
        $:0,
        $0:f(null)
       };
      }
      catch(e)
      {
       _={
        $:1,
        $0:e
       };
      }
      matchValue=_;
      if(matchValue.$==1)
       {
        e1=matchValue.$0;
        _1=fail(e1);
       }
      else
       {
        x=matchValue.$0;
        _1=succeed(x);
       }
      return _1;
     },
     Range:function(start,count)
     {
      var f;
      f=function(o)
      {
       var i;
       for(i=start;i<=start+count;i++){
        o.OnNext(i);
       }
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     Return:function(x)
     {
      var f;
      f=function(o)
      {
       o.OnNext(x);
       o.OnCompleted();
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     SelectMany:function(io)
     {
      return Observable.New(function(o)
      {
       var disp,d;
       disp=[function()
       {
       }];
       d=Util.subscribeTo(io,function(o1)
       {
        var d1;
        d1=Util.subscribeTo(o1,function(v)
        {
         return o.OnNext(v);
        });
        disp[0]=function()
        {
         disp[0].call(null,null);
         return d1.Dispose();
        };
        return;
       });
       return Disposable.Of(function()
       {
        disp[0].call(null,null);
        return d.Dispose();
       });
      });
     },
     Sequence:function(ios)
     {
      var sequence;
      sequence=function(ios1)
      {
       var _,xs,x,rest;
       if(ios1.$==1)
        {
         xs=ios1.$1;
         x=ios1.$0;
         rest=sequence(xs);
         _=Observable.CombineLatest(x,rest,function(x1)
         {
          return function(y)
          {
           return Runtime.New(T1,{
            $:1,
            $0:x1,
            $1:y
           });
          };
         });
        }
       else
        {
         _=Observable.Return(Runtime.New(T1,{
          $:0
         }));
        }
       return _;
      };
      return sequence(List.ofSeq(ios));
     },
     Switch:function(io)
     {
      return Observable.New(function(o)
      {
       var index,disp,disp1;
       index=[0];
       disp=[{
        $:0
       }];
       disp1=Util.subscribeTo(io,function(o1)
       {
        var currentIndex,arg0,d;
        Ref.incr(index);
        disp[0].$==1?disp[0].$0.Dispose():null;
        currentIndex=index[0];
        arg0=Util.subscribeTo(o1,function(v)
        {
         return currentIndex===index[0]?o.OnNext(v):null;
        });
        d={
         $:1,
         $0:arg0
        };
        disp[0]=d;
        return;
       });
       return disp1;
      });
     }
    },
    ObservableModule:{
     Pairwise:function(e)
     {
      var f;
      f=function(o1)
      {
       var last,on,arg00;
       last=[{
        $:0
       }];
       on=function(v)
       {
        var matchValue,_,l;
        matchValue=last[0];
        if(matchValue.$==1)
         {
          l=matchValue.$0;
          _=o1.OnNext([l,v]);
         }
        else
         {
          _=null;
         }
        last[0]={
         $:1,
         $0:v
        };
        return;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Partition:function(f,e)
     {
      return[Observable.Filter(f,e),Observable.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state=[seed];
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state[0]))(v);
        },function(s)
        {
         state[0]=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Split:function(f,e)
     {
      var chooser,left,chooser1,right;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      left=Observable.Choose(chooser,e);
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      right=Observable.Choose(chooser1,e);
      return[left,right];
     }
    },
    Observer:{
     New:function(f,e,c)
     {
      return Runtime.New(Observer1,{
       onNext:f,
       onError:e,
       onCompleted:c
      });
     },
     Observer:Runtime.Class({
      OnCompleted:function()
      {
       return this.onCompleted.call(null,null);
      },
      OnError:function(e)
      {
       return this.onError.call(null,e);
      },
      OnNext:function(x)
      {
       return this.onNext.call(null,x);
      }
     }),
     Of:function(f)
     {
      return Runtime.New(Observer1,{
       onNext:function(x)
       {
        return f(x);
       },
       onError:function(x)
       {
        return Operators.Raise(x);
       },
       onCompleted:function()
       {
        return null;
       }
      });
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Option=Runtime.Safe(Global.WebSharper.Option);
  Control=Runtime.Safe(Global.WebSharper.Control);
  Disposable=Runtime.Safe(Control.Disposable);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Event=Runtime.Safe(Control.Event);
  Event1=Runtime.Safe(Event.Event);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  EventModule=Runtime.Safe(Control.EventModule);
  HotStream=Runtime.Safe(Control.HotStream);
  HotStream1=Runtime.Safe(HotStream.HotStream);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Error=Runtime.Safe(Global.Error);
  setTimeout=Runtime.Safe(Global.setTimeout);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  T=Runtime.Safe(LinkedList.T);
  MailboxProcessor=Runtime.Safe(Control.MailboxProcessor);
  Observable=Runtime.Safe(Control.Observable);
  Observer=Runtime.Safe(Control.Observer);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  Observable1=Runtime.Safe(Observable.Observable);
  List=Runtime.Safe(Global.WebSharper.List);
  T1=Runtime.Safe(List.T);
  return Observer1=Runtime.Safe(Observer.Observer);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Collections,BalancedTree,Operators,Arrays,Seq,List,T,JavaScript,JSModule,Enumerator,DictionaryUtil,Dictionary,Unchecked,FSharpMap,Pair,Option,MapUtil,FSharpSet,SetModule,SetUtil,Array,HashSetUtil,HashSetProxy,LinkedList,E,T1,ResizeArray,ResizeArrayProxy;
 Runtime.Define(Global,{
  WebSharper:{
   Collections:{
    BalancedTree:{
     Add:function(x,t)
     {
      return BalancedTree.Put(function()
      {
       return function(x1)
       {
        return x1;
       };
      },x,t);
     },
     Branch:function(node,left,right)
     {
      return{
       Node:node,
       Left:left,
       Right:right,
       Height:1+Operators.Max(left==null?0:left.Height,right==null?0:right.Height),
       Count:1+(left==null?0:left.Count)+(right==null?0:right.Count)
      };
     },
     Build:function(data,min,max)
     {
      var sz,_,center,left,right;
      sz=max-min+1;
      if(sz<=0)
       {
        _=null;
       }
      else
       {
        center=(min+max)/2>>0;
        left=BalancedTree.Build(data,min,center-1);
        right=BalancedTree.Build(data,center+1,max);
        _=BalancedTree.Branch(Arrays.get(data,center),left,right);
       }
      return _;
     },
     Contains:function(v,t)
     {
      return!((BalancedTree.Lookup(v,t))[0]==null);
     },
     Enumerate:function(flip,t)
     {
      var gen;
      gen=function(tupledArg)
      {
       var t1,spine,_,_1,t2,spine1,other;
       t1=tupledArg[0];
       spine=tupledArg[1];
       if(t1==null)
        {
         if(spine.$==1)
          {
           t2=spine.$0[0];
           spine1=spine.$1;
           other=spine.$0[1];
           _1={
            $:1,
            $0:[t2,[other,spine1]]
           };
          }
         else
          {
           _1={
            $:0
           };
          }
         _=_1;
        }
       else
        {
         _=flip?gen([t1.Right,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Left],
          $1:spine
         })]):gen([t1.Left,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Right],
          $1:spine
         })]);
        }
       return _;
      };
      return Seq.unfold(gen,[t,Runtime.New(T,{
       $:0
      })]);
     },
     Lookup:function(k,t)
     {
      var spine,t1,loop,_,matchValue,_1;
      spine=[];
      t1=t;
      loop=true;
      while(loop)
       {
        if(t1==null)
         {
          _=loop=false;
         }
        else
         {
          matchValue=Operators.Compare(k,t1.Node);
          if(matchValue===0)
           {
            _1=loop=false;
           }
          else
           {
            if(matchValue===1)
             {
              spine.unshift([true,t1.Node,t1.Left]);
              _1=t1=t1.Right;
             }
            else
             {
              spine.unshift([false,t1.Node,t1.Right]);
              _1=t1=t1.Left;
             }
           }
          _=_1;
         }
       }
      return[t1,spine];
     },
     OfSeq:function(data)
     {
      var data1;
      data1=Arrays.sort(Seq.toArray(Seq.distinct(data)));
      return BalancedTree.Build(data1,0,data1.length-1);
     },
     Put:function(combine,k,t)
     {
      var patternInput,t1,spine;
      patternInput=BalancedTree.Lookup(k,t);
      t1=patternInput[0];
      spine=patternInput[1];
      return t1==null?BalancedTree.Rebuild(spine,BalancedTree.Branch(k,null,null)):BalancedTree.Rebuild(spine,BalancedTree.Branch((combine(t1.Node))(k),t1.Left,t1.Right));
     },
     Rebuild:function(spine,t)
     {
      var h,t1,i,matchValue,_,x1,l,_1,_2,m,x2,r,_3,_4,m1;
      h=function(x)
      {
       return x==null?0:x.Height;
      };
      t1=t;
      for(i=0;i<=Arrays.length(spine)-1;i++){
       matchValue=Arrays.get(spine,i);
       if(matchValue[0])
        {
         x1=matchValue[1];
         l=matchValue[2];
         if(h(t1)>h(l)+1)
          {
           if(h(t1.Left)===h(t1.Right)+1)
            {
             m=t1.Left;
             _2=BalancedTree.Branch(m.Node,BalancedTree.Branch(x1,l,m.Left),BalancedTree.Branch(t1.Node,m.Right,t1.Right));
            }
           else
            {
             _2=BalancedTree.Branch(t1.Node,BalancedTree.Branch(x1,l,t1.Left),t1.Right);
            }
           _1=_2;
          }
         else
          {
           _1=BalancedTree.Branch(x1,l,t1);
          }
         _=_1;
        }
       else
        {
         x2=matchValue[1];
         r=matchValue[2];
         if(h(t1)>h(r)+1)
          {
           if(h(t1.Right)===h(t1.Left)+1)
            {
             m1=t1.Right;
             _4=BalancedTree.Branch(m1.Node,BalancedTree.Branch(t1.Node,t1.Left,m1.Left),BalancedTree.Branch(x2,m1.Right,r));
            }
           else
            {
             _4=BalancedTree.Branch(t1.Node,t1.Left,BalancedTree.Branch(x2,t1.Right,r));
            }
           _3=_4;
          }
         else
          {
           _3=BalancedTree.Branch(x2,t1,r);
          }
         _=_3;
        }
       t1=_;
      }
      return t1;
     },
     Remove:function(k,src)
     {
      var patternInput,t,spine,_,_1,_2,source,data,t1;
      patternInput=BalancedTree.Lookup(k,src);
      t=patternInput[0];
      spine=patternInput[1];
      if(t==null)
       {
        _=src;
       }
      else
       {
        if(t.Right==null)
         {
          _1=BalancedTree.Rebuild(spine,t.Left);
         }
        else
         {
          if(t.Left==null)
           {
            _2=BalancedTree.Rebuild(spine,t.Right);
           }
          else
           {
            source=Seq.append(BalancedTree.Enumerate(false,t.Left),BalancedTree.Enumerate(false,t.Right));
            data=Seq.toArray(source);
            t1=BalancedTree.Build(data,0,data.length-1);
            _2=BalancedTree.Rebuild(spine,t1);
           }
          _1=_2;
         }
        _=_1;
       }
      return _;
     },
     TryFind:function(v,t)
     {
      var x;
      x=(BalancedTree.Lookup(v,t))[0];
      return x==null?{
       $:0
      }:{
       $:1,
       $0:x.Node
      };
     }
    },
    Dictionary:Runtime.Class({
     Add:function(k,v)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        _=Operators.FailWith("An item with the same key has already been added.");
       }
      else
       {
        this.data[h]={
         K:k,
         V:v
        };
        _=void(this.count=this.count+1);
       }
      return _;
     },
     Clear:function()
     {
      this.data={};
      this.count=0;
      return;
     },
     ContainsKey:function(k)
     {
      return this.data.hasOwnProperty(this.hash.call(null,k));
     },
     GetEnumerator:function()
     {
      var s;
      s=JSModule.GetFieldValues(this.data);
      return Enumerator.Get(s);
     },
     Remove:function(k)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        JSModule.Delete(this.data,h);
        this.count=this.count-1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },
     get_Item:function(k)
     {
      var k1,_,x;
      k1=this.hash.call(null,k);
      if(this.data.hasOwnProperty(k1))
       {
        x=this.data[k1];
        _=x.V;
       }
      else
       {
        _=DictionaryUtil.notPresent();
       }
      return _;
     },
     set_Item:function(k,v)
     {
      var h;
      h=this.hash.call(null,k);
      !this.data.hasOwnProperty(h)?void(this.count=this.count+1):null;
      this.data[h]={
       K:k,
       V:v
      };
      return;
     }
    },{
     New:function(dictionary)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(dictionary,comparer)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function(capacity,comparer)
     {
      return Runtime.New(this,Dictionary.New3(comparer));
     },
     New12:function()
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function()
     {
      return Runtime.New(this,Dictionary.New12());
     },
     New3:function(comparer)
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New4:function(init,equals,hash)
     {
      var r,enumerator,x,x1;
      r=Runtime.New(this,{});
      r.hash=hash;
      r.count=0;
      r.data={};
      enumerator=Enumerator.Get(init);
      while(enumerator.MoveNext())
       {
        x=enumerator.get_Current();
        x1=x.K;
        r.data[r.hash.call(null,x1)]=x.V;
       }
      return r;
     }
    }),
    DictionaryUtil:{
     notPresent:function()
     {
      return Operators.FailWith("The given key was not present in the dictionary.");
     }
    },
    FSharpMap:Runtime.Class({
     Add:function(k,v)
     {
      var x,x1;
      x=this.tree;
      x1=Runtime.New(Pair,{
       Key:k,
       Value:v
      });
      return FSharpMap.New(BalancedTree.Add(x1,x));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(x)
      {
       return function(y)
       {
        return Operators.Compare(x,y);
       };
      },this,other);
     },
     ContainsKey:function(k)
     {
      var x,v;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return BalancedTree.Contains(v,x);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      var mapping,source,s;
      mapping=function(kv)
      {
       return{
        K:kv.Key,
        V:kv.Value
       };
      };
      source=BalancedTree.Enumerate(false,this.tree);
      s=Seq.map(mapping,source);
      return Enumerator.Get(s);
     },
     GetHashCode:function()
     {
      return Unchecked.Hash(Seq.toArray(this));
     },
     Remove:function(k)
     {
      var x,k1;
      x=this.tree;
      k1=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return FSharpMap.New(BalancedTree.Remove(k1,x));
     },
     TryFind:function(k)
     {
      var x,v,mapping,option;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      mapping=function(kv)
      {
       return kv.Value;
      };
      option=BalancedTree.TryFind(v,x);
      return Option.map(mapping,option);
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_Item:function(k)
     {
      var matchValue,_,v;
      matchValue=this.TryFind(k);
      if(matchValue.$==0)
       {
        _=Operators.FailWith("The given key was not present in the dictionary.");
       }
      else
       {
        v=matchValue.$0;
        _=v;
       }
      return _;
     },
     get_Tree:function()
     {
      return this.tree;
     }
    },{
     New:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     },
     New1:function(s)
     {
      return Runtime.New(this,FSharpMap.New(MapUtil.fromSeq(s)));
     }
    }),
    FSharpSet:Runtime.Class({
     Add:function(x)
     {
      return FSharpSet.New1(BalancedTree.Add(x,this.tree));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(e1)
      {
       return function(e2)
       {
        return Operators.Compare(e1,e2);
       };
      },this,other);
     },
     Contains:function(v)
     {
      return BalancedTree.Contains(v,this.tree);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      return Enumerator.Get(BalancedTree.Enumerate(false,this.tree));
     },
     GetHashCode:function()
     {
      return-1741749453+Unchecked.Hash(Seq.toArray(this));
     },
     IsProperSubsetOf:function(s)
     {
      return this.IsSubsetOf(s)?this.get_Count()<s.get_Count():false;
     },
     IsProperSupersetOf:function(s)
     {
      return this.IsSupersetOf(s)?this.get_Count()>s.get_Count():false;
     },
     IsSubsetOf:function(s)
     {
      return Seq.forall(function(arg00)
      {
       return s.Contains(arg00);
      },this);
     },
     IsSupersetOf:function(s)
     {
      var _this=this;
      return Seq.forall(function(arg00)
      {
       return _this.Contains(arg00);
      },s);
     },
     Remove:function(v)
     {
      return FSharpSet.New1(BalancedTree.Remove(v,this.tree));
     },
     add:function(x)
     {
      return FSharpSet.New1(BalancedTree.OfSeq(Seq.append(this,x)));
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_MaximumElement:function()
     {
      return Seq.head(BalancedTree.Enumerate(true,this.tree));
     },
     get_MinimumElement:function()
     {
      return Seq.head(BalancedTree.Enumerate(false,this.tree));
     },
     get_Tree:function()
     {
      return this.tree;
     },
     sub:function(x)
     {
      return SetModule.Filter(function(x1)
      {
       return!x.Contains(x1);
      },this);
     }
    },{
     New:function(s)
     {
      return Runtime.New(this,FSharpSet.New1(SetUtil.ofSeq(s)));
     },
     New1:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     }
    }),
    HashSetProxy:Runtime.Class({
     Add:function(item)
     {
      return this.add(item);
     },
     Clear:function()
     {
      this.data=Array.prototype.constructor.apply(Array,[]);
      this.count=0;
      return;
     },
     Contains:function(item)
     {
      var arr;
      arr=this.data[this.hash.call(null,item)];
      return arr==null?false:this.arrContains(item,arr);
     },
     CopyTo:function(arr)
     {
      var i,all,i1;
      i=0;
      all=HashSetUtil.concat(this.data);
      for(i1=0;i1<=all.length-1;i1++){
       Arrays.set(arr,i1,all[i1]);
      }
      return;
     },
     ExceptWith:function(xs)
     {
      var enumerator,item,value;
      enumerator=Enumerator.Get(xs);
      while(enumerator.MoveNext())
       {
        item=enumerator.get_Current();
        value=this.Remove(item);
       }
      return;
     },
     GetEnumerator:function()
     {
      return Enumerator.Get(HashSetUtil.concat(this.data));
     },
     IntersectWith:function(xs)
     {
      var other,all,i,item,value,_,value1;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      all=HashSetUtil.concat(this.data);
      for(i=0;i<=all.length-1;i++){
       item=all[i];
       value=other.Contains(item);
       if(!value)
        {
         value1=this.Remove(item);
         _=void value1;
        }
       else
        {
         _=null;
        }
      }
      return;
     },
     IsProperSubsetOf:function(xs)
     {
      var other;
      other=Arrays.ofSeq(xs);
      return this.count<Arrays.length(other)?this.IsSubsetOf(other):false;
     },
     IsProperSupersetOf:function(xs)
     {
      var other;
      other=Arrays.ofSeq(xs);
      return this.count>Arrays.length(other)?this.IsSupersetOf(other):false;
     },
     IsSubsetOf:function(xs)
     {
      var other,predicate,array;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      predicate=function(arg00)
      {
       return other.Contains(arg00);
      };
      array=HashSetUtil.concat(this.data);
      return Seq.forall(predicate,array);
     },
     IsSupersetOf:function(xs)
     {
      var predicate,x=this;
      predicate=function(arg00)
      {
       return x.Contains(arg00);
      };
      return Seq.forall(predicate,xs);
     },
     Overlaps:function(xs)
     {
      var predicate,x=this;
      predicate=function(arg00)
      {
       return x.Contains(arg00);
      };
      return Seq.exists(predicate,xs);
     },
     Remove:function(item)
     {
      var h,arr,_,_1;
      h=this.hash.call(null,item);
      arr=this.data[h];
      if(arr==null)
       {
        _=false;
       }
      else
       {
        if(this.arrRemove(item,arr))
         {
          this.count=this.count-1;
          _1=true;
         }
        else
         {
          _1=false;
         }
        _=_1;
       }
      return _;
     },
     RemoveWhere:function(cond)
     {
      var all,i,item,_,value;
      all=HashSetUtil.concat(this.data);
      for(i=0;i<=all.length-1;i++){
       item=all[i];
       if(cond(item))
        {
         value=this.Remove(item);
         _=void value;
        }
       else
        {
         _=null;
        }
      }
      return;
     },
     SetEquals:function(xs)
     {
      var other;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      return this.get_Count()===other.get_Count()?this.IsSupersetOf(other):false;
     },
     SymmetricExceptWith:function(xs)
     {
      var enumerator,item,_,value,value1;
      enumerator=Enumerator.Get(xs);
      while(enumerator.MoveNext())
       {
        item=enumerator.get_Current();
        if(this.Contains(item))
         {
          value=this.Remove(item);
          _=void value;
         }
        else
         {
          value1=this.Add(item);
          _=void value1;
         }
       }
      return;
     },
     UnionWith:function(xs)
     {
      var enumerator,item,value;
      enumerator=Enumerator.Get(xs);
      while(enumerator.MoveNext())
       {
        item=enumerator.get_Current();
        value=this.Add(item);
       }
      return;
     },
     add:function(item)
     {
      var h,arr,_,_1,value;
      h=this.hash.call(null,item);
      arr=this.data[h];
      if(arr==null)
       {
        this.data[h]=[item];
        this.count=this.count+1;
        _=true;
       }
      else
       {
        if(this.arrContains(item,arr))
         {
          _1=false;
         }
        else
         {
          value=arr.push(item);
          this.count=this.count+1;
          _1=true;
         }
        _=_1;
       }
      return _;
     },
     arrContains:function(item,arr)
     {
      var c,i,l;
      c=true;
      i=0;
      l=arr.length;
      while(c?i<l:false)
       {
        (this.equals.call(null,arr[i]))(item)?c=false:i=i+1;
       }
      return!c;
     },
     arrRemove:function(item,arr)
     {
      var c,i,l,_,start,ps,value;
      c=true;
      i=0;
      l=arr.length;
      while(c?i<l:false)
       {
        if((this.equals.call(null,arr[i]))(item))
         {
          start=i;
          ps=[];
          value=arr.splice.apply(arr,[start,1].concat(ps));
          _=c=false;
         }
        else
         {
          _=i=i+1;
         }
       }
      return!c;
     },
     get_Count:function()
     {
      return this.count;
     }
    },{
     New:function(init)
     {
      return Runtime.New(this,HashSetProxy.New3(init,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(comparer)
     {
      return Runtime.New(this,HashSetProxy.New3(Seq.empty(),function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function()
     {
      return Runtime.New(this,HashSetProxy.New3(Seq.empty(),function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function(init,comparer)
     {
      return Runtime.New(this,HashSetProxy.New3(init,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New3:function(init,equals,hash)
     {
      var r,enumerator,x,value;
      r=Runtime.New(this,{});
      r.equals=equals;
      r.hash=hash;
      r.data=Array.prototype.constructor.apply(Array,[]);
      r.count=0;
      enumerator=Enumerator.Get(init);
      while(enumerator.MoveNext())
       {
        x=enumerator.get_Current();
        value=r.add(x);
       }
      return r;
     }
    }),
    HashSetUtil:{
     concat:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o){
       r.push.apply(r,$o[k]);
      }
      ;
      return r;
     }
    },
    LinkedList:{
     E:Runtime.Class({
      Dispose:function()
      {
       return null;
      },
      MoveNext:function()
      {
       this.c=this.c.n;
       return!Unchecked.Equals(this.c,null);
      },
      get_Current:function()
      {
       return this.c.v;
      }
     },{
      New:function(l)
      {
       var r;
       r=Runtime.New(this,{});
       r.c=l;
       return r;
      }
     }),
     T:Runtime.Class({
      AddAfter:function(after,value)
      {
       var before,node,_;
       before=after.n;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(after.n,null)?void(this.p=node):null;
       after.n=node;
       if(!Unchecked.Equals(before,null))
        {
         before.p=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddBefore:function(before,value)
      {
       var after,node,_;
       after=before.p;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(before.p,null)?void(this.n=node):null;
       before.p=node;
       if(!Unchecked.Equals(after,null))
        {
         after.n=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddFirst:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddBefore(this.n,value);
        }
       return _;
      },
      AddLast:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddAfter(this.p,value);
        }
       return _;
      },
      Clear:function()
      {
       this.c=0;
       this.n=null;
       this.p=null;
       return;
      },
      Contains:function(value)
      {
       var found,node;
       found=false;
       node=this.n;
       while(!Unchecked.Equals(node,null)?!found:false)
        {
         node.v==value?found=true:node=node.n;
        }
       return found;
      },
      Find:function(value)
      {
       var node,notFound;
       node=this.n;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.n;
        }
       return notFound?null:node;
      },
      FindLast:function(value)
      {
       var node,notFound;
       node=this.p;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.p;
        }
       return notFound?null:node;
      },
      GetEnumerator:function()
      {
       return E.New(this);
      },
      Remove:function(node)
      {
       var before,after,_,_1;
       before=node.p;
       after=node.n;
       if(Unchecked.Equals(before,null))
        {
         _=void(this.n=after);
        }
       else
        {
         before.n=after;
         _=after;
        }
       if(Unchecked.Equals(after,null))
        {
         _1=void(this.p=before);
        }
       else
        {
         after.p=before;
         _1=before;
        }
       this.c=this.c-1;
       return;
      },
      Remove1:function(value)
      {
       var node,_;
       node=this.Find(value);
       if(Unchecked.Equals(node,null))
        {
         _=false;
        }
       else
        {
         this.Remove(node);
         _=true;
        }
       return _;
      },
      RemoveFirst:function()
      {
       return this.Remove(this.n);
      },
      RemoveLast:function()
      {
       return this.Remove(this.p);
      },
      get_Count:function()
      {
       return this.c;
      },
      get_First:function()
      {
       return this.n;
      },
      get_Last:function()
      {
       return this.p;
      }
     },{
      New:function()
      {
       return Runtime.New(this,T1.New1(Seq.empty()));
      },
      New1:function(coll)
      {
       var r,ie,_,node;
       r=Runtime.New(this,{});
       r.c=0;
       r.n=null;
       r.p=null;
       ie=Enumerator.Get(coll);
       if(ie.MoveNext())
        {
         r.n={
          p:null,
          n:null,
          v:ie.get_Current()
         };
         r.p=r.n;
         _=void(r.c=1);
        }
       else
        {
         _=null;
        }
       while(ie.MoveNext())
        {
         node={
          p:r.p,
          n:null,
          v:ie.get_Current()
         };
         r.p.n=node;
         r.p=node;
         r.c=r.c+1;
        }
       return r;
      }
     })
    },
    MapModule:{
     Exists:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.exists(predicate,m);
     },
     Filter:function(f,m)
     {
      var predicate,source,source1,data,t;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      source1=Seq.filter(predicate,source);
      data=Seq.toArray(source1);
      t=BalancedTree.Build(data,0,data.length-1);
      return FSharpMap.New(t);
     },
     FindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq.pick(chooser,m);
     },
     Fold:function(f,s,m)
     {
      var folder,source;
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(s1))(kv.Key))(kv.Value);
       };
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      return Seq.fold(folder,s,source);
     },
     FoldBack:function(f,m,s)
     {
      var folder,source;
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(kv.Key))(kv.Value))(s1);
       };
      };
      source=BalancedTree.Enumerate(true,m.get_Tree());
      return Seq.fold(folder,s,source);
     },
     ForAll:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.forall(predicate,m);
     },
     Iterate:function(f,m)
     {
      var action;
      action=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.iter(action,m);
     },
     Map:function(f,m)
     {
      var mapping,source,data,t;
      mapping=function(kv)
      {
       return Runtime.New(Pair,{
        Key:kv.Key,
        Value:(f(kv.Key))(kv.Value)
       });
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      data=Seq.map(mapping,source);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     OfArray:function(a)
     {
      var mapping,data,t;
      mapping=function(tupledArg)
      {
       var k,v;
       k=tupledArg[0];
       v=tupledArg[1];
       return Runtime.New(Pair,{
        Key:k,
        Value:v
       });
      };
      data=Seq.map(mapping,a);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     Partition:function(f,m)
     {
      var predicate,array,patternInput,y,x;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      array=Seq.toArray(BalancedTree.Enumerate(false,m.get_Tree()));
      patternInput=Arrays.partition(predicate,array);
      y=patternInput[1];
      x=patternInput[0];
      return[FSharpMap.New(BalancedTree.Build(x,0,x.length-1)),FSharpMap.New(BalancedTree.Build(y,0,y.length-1))];
     },
     Pick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.pick(chooser,m);
     },
     ToSeq:function(m)
     {
      var mapping,source;
      mapping=function(kv)
      {
       return[kv.Key,kv.Value];
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      return Seq.map(mapping,source);
     },
     TryFind:function(k,m)
     {
      return m.TryFind(k);
     },
     TryFindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq.tryPick(chooser,m);
     },
     TryPick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.tryPick(chooser,m);
     }
    },
    MapUtil:{
     fromSeq:function(s)
     {
      var a;
      a=Seq.toArray(Seq.delay(function()
      {
       return Seq.collect(function(matchValue)
       {
        var v,k;
        v=matchValue[1];
        k=matchValue[0];
        return[Runtime.New(Pair,{
         Key:k,
         Value:v
        })];
       },Seq.distinctBy(function(tuple)
       {
        return tuple[0];
       },s));
      }));
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    },
    Pair:Runtime.Class({
     CompareTo:function(other)
     {
      return Operators.Compare(this.Key,other.Key);
     },
     Equals:function(other)
     {
      return Unchecked.Equals(this.Key,other.Key);
     },
     GetHashCode:function()
     {
      return Unchecked.Hash(this.Key);
     }
    }),
    ResizeArray:{
     ResizeArrayProxy:Runtime.Class({
      Add:function(x)
      {
       return this.arr.push(x);
      },
      AddRange:function(x)
      {
       var _this=this;
       return Seq.iter(function(arg00)
       {
        return _this.Add(arg00);
       },x);
      },
      Clear:function()
      {
       var value;
       value=ResizeArray.splice(this.arr,0,Arrays.length(this.arr),[]);
       return;
      },
      CopyTo:function(arr)
      {
       return this.CopyTo1(arr,0);
      },
      CopyTo1:function(arr,offset)
      {
       return this.CopyTo2(0,arr,offset,this.get_Count());
      },
      CopyTo2:function(index,target,offset,count)
      {
       return Arrays.blit(this.arr,index,target,offset,count);
      },
      GetEnumerator:function()
      {
       return Enumerator.Get(this.arr);
      },
      GetRange:function(index,count)
      {
       return ResizeArrayProxy.New11(Arrays.sub(this.arr,index,count));
      },
      Insert:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,[items]);
       return;
      },
      InsertRange:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,Seq.toArray(items));
       return;
      },
      RemoveAt:function(x)
      {
       var value;
       value=ResizeArray.splice(this.arr,x,1,[]);
       return;
      },
      RemoveRange:function(index,count)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,count,[]);
       return;
      },
      Reverse:function()
      {
       return this.arr.reverse();
      },
      Reverse1:function(index,count)
      {
       return Arrays.reverse(this.arr,index,count);
      },
      ToArray:function()
      {
       return this.arr.slice();
      },
      get_Count:function()
      {
       return Arrays.length(this.arr);
      },
      get_Item:function(x)
      {
       return Arrays.get(this.arr,x);
      },
      set_Item:function(x,v)
      {
       return Arrays.set(this.arr,x,v);
      }
     },{
      New:function(el)
      {
       return Runtime.New(this,ResizeArrayProxy.New11(Seq.toArray(el)));
      },
      New1:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      },
      New11:function(arr)
      {
       var r;
       r=Runtime.New(this,{});
       r.arr=arr;
       return r;
      },
      New2:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      }
     }),
     splice:function($arr,$index,$howMany,$items)
     {
      var $0=this,$this=this;
      return Global.Array.prototype.splice.apply($arr,[$index,$howMany].concat($items));
     }
    },
    SetModule:{
     Filter:function(f,s)
     {
      var data;
      data=Seq.toArray(Seq.filter(f,s));
      return FSharpSet.New1(BalancedTree.Build(data,0,data.length-1));
     },
     FoldBack:function(f,a,s)
     {
      return Seq.fold(function(s1)
      {
       return function(x)
       {
        return(f(x))(s1);
       };
      },s,BalancedTree.Enumerate(true,a.get_Tree()));
     },
     Partition:function(f,a)
     {
      var patternInput,y,x;
      patternInput=Arrays.partition(f,Seq.toArray(a));
      y=patternInput[1];
      x=patternInput[0];
      return[FSharpSet.New1(BalancedTree.OfSeq(x)),FSharpSet.New1(BalancedTree.OfSeq(y))];
     }
    },
    SetUtil:{
     ofSeq:function(s)
     {
      var a;
      a=Seq.toArray(s);
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  BalancedTree=Runtime.Safe(Collections.BalancedTree);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  List=Runtime.Safe(Global.WebSharper.List);
  T=Runtime.Safe(List.T);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  DictionaryUtil=Runtime.Safe(Collections.DictionaryUtil);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Pair=Runtime.Safe(Collections.Pair);
  Option=Runtime.Safe(Global.WebSharper.Option);
  MapUtil=Runtime.Safe(Collections.MapUtil);
  FSharpSet=Runtime.Safe(Collections.FSharpSet);
  SetModule=Runtime.Safe(Collections.SetModule);
  SetUtil=Runtime.Safe(Collections.SetUtil);
  Array=Runtime.Safe(Global.Array);
  HashSetUtil=Runtime.Safe(Collections.HashSetUtil);
  HashSetProxy=Runtime.Safe(Collections.HashSetProxy);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  E=Runtime.Safe(LinkedList.E);
  T1=Runtime.Safe(LinkedList.T);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  return ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

/*!
 * Globalize
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

(function( window, undefined ) {

var Globalize,
	// private variables
	regexHex,
	regexInfinity,
	regexParseFloat,
	regexTrim,
	// private JavaScript utility functions
	arrayIndexOf,
	endsWith,
	extend,
	isArray,
	isFunction,
	isObject,
	startsWith,
	trim,
	truncate,
	zeroPad,
	// private Globalization utility functions
	appendPreOrPostMatch,
	expandFormat,
	formatDate,
	formatNumber,
	getTokenRegExp,
	getEra,
	getEraYear,
	parseExact,
	parseNegativePattern;

// Global variable (Globalize) or CommonJS module (globalize)
Globalize = function( cultureSelector ) {
	return new Globalize.prototype.init( cultureSelector );
};

if ( typeof require !== "undefined" &&
	typeof exports !== "undefined" &&
	typeof module !== "undefined" ) {
	// Assume CommonJS
	module.exports = Globalize;
} else {
	// Export as global variable
	window.Globalize = Globalize;
}

Globalize.cultures = {};

Globalize.prototype = {
	constructor: Globalize,
	init: function( cultureSelector ) {
		this.cultures = Globalize.cultures;
		this.cultureSelector = cultureSelector;

		return this;
	}
};
Globalize.prototype.init.prototype = Globalize.prototype;

// 1. When defining a culture, all fields are required except the ones stated as optional.
// 2. Each culture should have a ".calendars" object with at least one calendar named "standard"
//    which serves as the default calendar in use by that culture.
// 3. Each culture should have a ".calendar" object which is the current calendar being used,
//    it may be dynamically changed at any time to one of the calendars in ".calendars".
Globalize.cultures[ "default" ] = {
	// A unique name for the culture in the form <language code>-<country/region code>
	name: "en",
	// the name of the culture in the english language
	englishName: "English",
	// the name of the culture in its own language
	nativeName: "English",
	// whether the culture uses right-to-left text
	isRTL: false,
	// "language" is used for so-called "specific" cultures.
	// For example, the culture "es-CL" means "Spanish, in Chili".
	// It represents the Spanish-speaking culture as it is in Chili,
	// which might have different formatting rules or even translations
	// than Spanish in Spain. A "neutral" culture is one that is not
	// specific to a region. For example, the culture "es" is the generic
	// Spanish culture, which may be a more generalized version of the language
	// that may or may not be what a specific culture expects.
	// For a specific culture like "es-CL", the "language" field refers to the
	// neutral, generic culture information for the language it is using.
	// This is not always a simple matter of the string before the dash.
	// For example, the "zh-Hans" culture is netural (Simplified Chinese).
	// And the "zh-SG" culture is Simplified Chinese in Singapore, whose lanugage
	// field is "zh-CHS", not "zh".
	// This field should be used to navigate from a specific culture to it's
	// more general, neutral culture. If a culture is already as general as it
	// can get, the language may refer to itself.
	language: "en",
	// numberFormat defines general number formatting rules, like the digits in
	// each grouping, the group separator, and how negative numbers are displayed.
	numberFormat: {
		// [negativePattern]
		// Note, numberFormat.pattern has no "positivePattern" unlike percent and currency,
		// but is still defined as an array for consistency with them.
		//   negativePattern: one of "(n)|-n|- n|n-|n -"
		pattern: [ "-n" ],
		// number of decimal places normally shown
		decimals: 2,
		// string that separates number groups, as in 1,000,000
		",": ",",
		// string that separates a number from the fractional portion, as in 1.99
		".": ".",
		// array of numbers indicating the size of each number group.
		// TODO: more detailed description and example
		groupSizes: [ 3 ],
		// symbol used for positive numbers
		"+": "+",
		// symbol used for negative numbers
		"-": "-",
		// symbol used for NaN (Not-A-Number)
		"NaN": "NaN",
		// symbol used for Negative Infinity
		negativeInfinity: "-Infinity",
		// symbol used for Positive Infinity
		positiveInfinity: "Infinity",
		percent: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
			//   positivePattern: one of "n %|n%|%n|% n"
			pattern: [ "-n %", "n %" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent a percentage
			symbol: "%"
		},
		currency: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
			//   positivePattern: one of "$n|n$|$ n|n $"
			pattern: [ "($n)", "$n" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent currency
			symbol: "$"
		}
	},
	// calendars defines all the possible calendars used by this culture.
	// There should be at least one defined with name "standard", and is the default
	// calendar used by the culture.
	// A calendar contains information about how dates are formatted, information about
	// the calendar's eras, a standard set of the date formats,
	// translations for day and month names, and if the calendar is not based on the Gregorian
	// calendar, conversion functions to and from the Gregorian calendar.
	calendars: {
		standard: {
			// name that identifies the type of calendar this is
			name: "Gregorian_USEnglish",
			// separator of parts of a date (e.g. "/" in 11/05/1955)
			"/": "/",
			// separator of parts of a time (e.g. ":" in 05:44 PM)
			":": ":",
			// the first day of the week (0 = Sunday, 1 = Monday, etc)
			firstDay: 0,
			days: {
				// full day names
				names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
				// abbreviated day names
				namesAbbr: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
				// shortest day names
				namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
			},
			months: {
				// full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
				names: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
				// abbreviated month names
				namesAbbr: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ]
			},
			// AM and PM designators in one of these forms:
			// The usual view, and the upper and lower case versions
			//   [ standard, lowercase, uppercase ]
			// The culture does not use AM or PM (likely all standard date formats use 24 hour time)
			//   null
			AM: [ "AM", "am", "AM" ],
			PM: [ "PM", "pm", "PM" ],
			eras: [
				// eras in reverse chronological order.
				// name: the name of the era in this culture (e.g. A.D., C.E.)
				// start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
				// offset: offset in years from gregorian calendar
				{
					"name": "A.D.",
					"start": null,
					"offset": 0
				}
			],
			// when a two digit year is given, it will never be parsed as a four digit
			// year greater than this year (in the appropriate era for the culture)
			// Set it as a full year (e.g. 2029) or use an offset format starting from
			// the current year: "+19" would correspond to 2029 if the current year 2010.
			twoDigitYearMax: 2029,
			// set of predefined date and time patterns used by the culture
			// these represent the format someone in this culture would expect
			// to see given the portions of the date that are shown.
			patterns: {
				// short date pattern
				d: "M/d/yyyy",
				// long date pattern
				D: "dddd, MMMM dd, yyyy",
				// short time pattern
				t: "h:mm tt",
				// long time pattern
				T: "h:mm:ss tt",
				// long date, short time pattern
				f: "dddd, MMMM dd, yyyy h:mm tt",
				// long date, long time pattern
				F: "dddd, MMMM dd, yyyy h:mm:ss tt",
				// month/day pattern
				M: "MMMM dd",
				// month/year pattern
				Y: "yyyy MMMM",
				// S is a sortable format that does not vary by culture
				S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
			}
			// optional fields for each calendar:
			/*
			monthsGenitive:
				Same as months but used when the day preceeds the month.
				Omit if the culture has no genitive distinction in month names.
				For an explaination of genitive months, see http://blogs.msdn.com/michkap/archive/2004/12/25/332259.aspx
			convert:
				Allows for the support of non-gregorian based calendars. This convert object is used to
				to convert a date to and from a gregorian calendar date to handle parsing and formatting.
				The two functions:
					fromGregorian( date )
						Given the date as a parameter, return an array with parts [ year, month, day ]
						corresponding to the non-gregorian based year, month, and day for the calendar.
					toGregorian( year, month, day )
						Given the non-gregorian year, month, and day, return a new Date() object
						set to the corresponding date in the gregorian calendar.
			*/
		}
	},
	// For localized strings
	messages: {}
};

Globalize.cultures[ "default" ].calendar = Globalize.cultures[ "default" ].calendars.standard;

Globalize.cultures.en = Globalize.cultures[ "default" ];

Globalize.cultureSelector = "en";

//
// private variables
//

regexHex = /^0x[a-f0-9]+$/i;
regexInfinity = /^[+\-]?infinity$/i;
regexParseFloat = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/;
regexTrim = /^\s+|\s+$/g;

//
// private JavaScript utility functions
//

arrayIndexOf = function( array, item ) {
	if ( array.indexOf ) {
		return array.indexOf( item );
	}
	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[i] === item ) {
			return i;
		}
	}
	return -1;
};

endsWith = function( value, pattern ) {
	return value.substr( value.length - pattern.length ) === pattern;
};

extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target) ) {
		target = {};
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];

					} else {
						clone = src && isObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

isArray = Array.isArray || function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Array]";
};

isFunction = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Function]";
};

isObject = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Object]";
};

startsWith = function( value, pattern ) {
	return value.indexOf( pattern ) === 0;
};

trim = function( value ) {
	return ( value + "" ).replace( regexTrim, "" );
};

truncate = function( value ) {
	if ( isNaN( value ) ) {
		return NaN;
	}
	return Math[ value < 0 ? "ceil" : "floor" ]( value );
};

zeroPad = function( str, count, left ) {
	var l;
	for ( l = str.length; l < count; l += 1 ) {
		str = ( left ? ("0" + str) : (str + "0") );
	}
	return str;
};

//
// private Globalization utility functions
//

appendPreOrPostMatch = function( preMatch, strings ) {
	// appends pre- and post- token match strings while removing escaped characters.
	// Returns a single quote count which is used to determine if the token occurs
	// in a string literal.
	var quoteCount = 0,
		escaped = false;
	for ( var i = 0, il = preMatch.length; i < il; i++ ) {
		var c = preMatch.charAt( i );
		switch ( c ) {
			case "\'":
				if ( escaped ) {
					strings.push( "\'" );
				}
				else {
					quoteCount++;
				}
				escaped = false;
				break;
			case "\\":
				if ( escaped ) {
					strings.push( "\\" );
				}
				escaped = !escaped;
				break;
			default:
				strings.push( c );
				escaped = false;
				break;
		}
	}
	return quoteCount;
};

expandFormat = function( cal, format ) {
	// expands unspecified or single character date formats into the full pattern.
	format = format || "F";
	var pattern,
		patterns = cal.patterns,
		len = format.length;
	if ( len === 1 ) {
		pattern = patterns[ format ];
		if ( !pattern ) {
			throw "Invalid date format string \'" + format + "\'.";
		}
		format = pattern;
	}
	else if ( len === 2 && format.charAt(0) === "%" ) {
		// %X escape format -- intended as a custom format string that is only one character, not a built-in format.
		format = format.charAt( 1 );
	}
	return format;
};

formatDate = function( value, format, culture ) {
	var cal = culture.calendar,
		convert = cal.convert,
		ret;

	if ( !format || !format.length || format === "i" ) {
		if ( culture && culture.name.length ) {
			if ( convert ) {
				// non-gregorian calendar, so we cannot use built-in toLocaleString()
				ret = formatDate( value, cal.patterns.F, culture );
			}
			else {
				var eraDate = new Date( value.getTime() ),
					era = getEra( value, cal.eras );
				eraDate.setFullYear( getEraYear(value, cal, era) );
				ret = eraDate.toLocaleString();
			}
		}
		else {
			ret = value.toString();
		}
		return ret;
	}

	var eras = cal.eras,
		sortable = format === "s";
	format = expandFormat( cal, format );

	// Start with an empty string
	ret = [];
	var hour,
		zeros = [ "0", "00", "000" ],
		foundDay,
		checkedDay,
		dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
		quoteCount = 0,
		tokenRegExp = getTokenRegExp(),
		converted;

	function padZeros( num, c ) {
		var r, s = num + "";
		if ( c > 1 && s.length < c ) {
			r = ( zeros[c - 2] + s);
			return r.substr( r.length - c, c );
		}
		else {
			r = s;
		}
		return r;
	}

	function hasDay() {
		if ( foundDay || checkedDay ) {
			return foundDay;
		}
		foundDay = dayPartRegExp.test( format );
		checkedDay = true;
		return foundDay;
	}

	function getPart( date, part ) {
		if ( converted ) {
			return converted[ part ];
		}
		switch ( part ) {
			case 0:
				return date.getFullYear();
			case 1:
				return date.getMonth();
			case 2:
				return date.getDate();
			default:
				throw "Invalid part value " + part;
		}
	}

	if ( !sortable && convert ) {
		converted = convert.fromGregorian( value );
	}

	for ( ; ; ) {
		// Save the current index
		var index = tokenRegExp.lastIndex,
			// Look for the next pattern
			ar = tokenRegExp.exec( format );

		// Append the text before the pattern (or the end of the string if not found)
		var preMatch = format.slice( index, ar ? ar.index : format.length );
		quoteCount += appendPreOrPostMatch( preMatch, ret );

		if ( !ar ) {
			break;
		}

		// do not replace any matches that occur inside a string literal.
		if ( quoteCount % 2 ) {
			ret.push( ar[0] );
			continue;
		}

		var current = ar[ 0 ],
			clength = current.length;

		switch ( current ) {
			case "ddd":
				//Day of the week, as a three-letter abbreviation
			case "dddd":
				// Day of the week, using the full name
				var names = ( clength === 3 ) ? cal.days.namesAbbr : cal.days.names;
				ret.push( names[value.getDay()] );
				break;
			case "d":
				// Day of month, without leading zero for single-digit days
			case "dd":
				// Day of month, with leading zero for single-digit days
				foundDay = true;
				ret.push(
					padZeros( getPart(value, 2), clength )
				);
				break;
			case "MMM":
				// Month, as a three-letter abbreviation
			case "MMMM":
				// Month, using the full name
				var part = getPart( value, 1 );
				ret.push(
					( cal.monthsGenitive && hasDay() ) ?
					( cal.monthsGenitive[ clength === 3 ? "namesAbbr" : "names" ][ part ] ) :
					( cal.months[ clength === 3 ? "namesAbbr" : "names" ][ part ] )
				);
				break;
			case "M":
				// Month, as digits, with no leading zero for single-digit months
			case "MM":
				// Month, as digits, with leading zero for single-digit months
				ret.push(
					padZeros( getPart(value, 1) + 1, clength )
				);
				break;
			case "y":
				// Year, as two digits, but with no leading zero for years less than 10
			case "yy":
				// Year, as two digits, with leading zero for years less than 10
			case "yyyy":
				// Year represented by four full digits
				part = converted ? converted[ 0 ] : getEraYear( value, cal, getEra(value, eras), sortable );
				if ( clength < 4 ) {
					part = part % 100;
				}
				ret.push(
					padZeros( part, clength )
				);
				break;
			case "h":
				// Hours with no leading zero for single-digit hours, using 12-hour clock
			case "hh":
				// Hours with leading zero for single-digit hours, using 12-hour clock
				hour = value.getHours() % 12;
				if ( hour === 0 ) hour = 12;
				ret.push(
					padZeros( hour, clength )
				);
				break;
			case "H":
				// Hours with no leading zero for single-digit hours, using 24-hour clock
			case "HH":
				// Hours with leading zero for single-digit hours, using 24-hour clock
				ret.push(
					padZeros( value.getHours(), clength )
				);
				break;
			case "m":
				// Minutes with no leading zero for single-digit minutes
			case "mm":
				// Minutes with leading zero for single-digit minutes
				ret.push(
					padZeros( value.getMinutes(), clength )
				);
				break;
			case "s":
				// Seconds with no leading zero for single-digit seconds
			case "ss":
				// Seconds with leading zero for single-digit seconds
				ret.push(
					padZeros( value.getSeconds(), clength )
				);
				break;
			case "t":
				// One character am/pm indicator ("a" or "p")
			case "tt":
				// Multicharacter am/pm indicator
				part = value.getHours() < 12 ? ( cal.AM ? cal.AM[0] : " " ) : ( cal.PM ? cal.PM[0] : " " );
				ret.push( clength === 1 ? part.charAt(0) : part );
				break;
			case "f":
				// Deciseconds
			case "ff":
				// Centiseconds
			case "fff":
				// Milliseconds
				ret.push(
					padZeros( value.getMilliseconds(), 3 ).substr( 0, clength )
				);
				break;
			case "z":
				// Time zone offset, no leading zero
			case "zz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), clength )
				);
				break;
			case "zzz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), 2 ) +
					// Hard coded ":" separator, rather than using cal.TimeSeparator
					// Repeated here for consistency, plus ":" was already assumed in date parsing.
					":" + padZeros( Math.abs(value.getTimezoneOffset() % 60), 2 )
				);
				break;
			case "g":
			case "gg":
				if ( cal.eras ) {
					ret.push(
						cal.eras[ getEra(value, eras) ].name
					);
				}
				break;
		case "/":
			ret.push( cal["/"] );
			break;
		default:
			throw "Invalid date format pattern \'" + current + "\'.";
		}
	}
	return ret.join( "" );
};

// formatNumber
(function() {
	var expandNumber;

	expandNumber = function( number, precision, formatInfo ) {
		var groupSizes = formatInfo.groupSizes,
			curSize = groupSizes[ 0 ],
			curGroupIndex = 1,
			factor = Math.pow( 10, precision ),
			rounded = Math.round( number * factor ) / factor;

		if ( !isFinite(rounded) ) {
			rounded = number;
		}
		number = rounded;

		var numberString = number+"",
			right = "",
			split = numberString.split( /e/i ),
			exponent = split.length > 1 ? parseInt( split[1], 10 ) : 0;
		numberString = split[ 0 ];
		split = numberString.split( "." );
		numberString = split[ 0 ];
		right = split.length > 1 ? split[ 1 ] : "";

		var l;
		if ( exponent > 0 ) {
			right = zeroPad( right, exponent, false );
			numberString += right.slice( 0, exponent );
			right = right.substr( exponent );
		}
		else if ( exponent < 0 ) {
			exponent = -exponent;
			numberString = zeroPad( numberString, exponent + 1, true );
			right = numberString.slice( -exponent, numberString.length ) + right;
			numberString = numberString.slice( 0, -exponent );
		}

		if ( precision > 0 ) {
			right = formatInfo[ "." ] +
				( (right.length > precision) ? right.slice(0, precision) : zeroPad(right, precision) );
		}
		else {
			right = "";
		}

		var stringIndex = numberString.length - 1,
			sep = formatInfo[ "," ],
			ret = "";

		while ( stringIndex >= 0 ) {
			if ( curSize === 0 || curSize > stringIndex ) {
				return numberString.slice( 0, stringIndex + 1 ) + ( ret.length ? (sep + ret + right) : right );
			}
			ret = numberString.slice( stringIndex - curSize + 1, stringIndex + 1 ) + ( ret.length ? (sep + ret) : "" );

			stringIndex -= curSize;

			if ( curGroupIndex < groupSizes.length ) {
				curSize = groupSizes[ curGroupIndex ];
				curGroupIndex++;
			}
		}

		return numberString.slice( 0, stringIndex + 1 ) + sep + ret + right;
	};

	formatNumber = function( value, format, culture ) {
		if ( !isFinite(value) ) {
			if ( value === Infinity ) {
				return culture.numberFormat.positiveInfinity;
			}
			if ( value === -Infinity ) {
				return culture.numberFormat.negativeInfinity;
			}
			return culture.numberFormat[ "NaN" ];
		}
		if ( !format || format === "i" ) {
			return culture.name.length ? value.toLocaleString() : value.toString();
		}
		format = format || "D";

		var nf = culture.numberFormat,
			number = Math.abs( value ),
			precision = -1,
			pattern;
		if ( format.length > 1 ) precision = parseInt( format.slice(1), 10 );

		var current = format.charAt( 0 ).toUpperCase(),
			formatInfo;

		switch ( current ) {
			case "D":
				pattern = "n";
				number = truncate( number );
				if ( precision !== -1 ) {
					number = zeroPad( "" + number, precision, true );
				}
				if ( value < 0 ) number = "-" + number;
				break;
			case "N":
				formatInfo = nf;
				/* falls through */
			case "C":
				formatInfo = formatInfo || nf.currency;
				/* falls through */
			case "P":
				formatInfo = formatInfo || nf.percent;
				pattern = value < 0 ? formatInfo.pattern[ 0 ] : ( formatInfo.pattern[1] || "n" );
				if ( precision === -1 ) precision = formatInfo.decimals;
				number = expandNumber( number * (current === "P" ? 100 : 1), precision, formatInfo );
				break;
			default:
				throw "Bad number format specifier: " + current;
		}

		var patternParts = /n|\$|-|%/g,
			ret = "";
		for ( ; ; ) {
			var index = patternParts.lastIndex,
				ar = patternParts.exec( pattern );

			ret += pattern.slice( index, ar ? ar.index : pattern.length );

			if ( !ar ) {
				break;
			}

			switch ( ar[0] ) {
				case "n":
					ret += number;
					break;
				case "$":
					ret += nf.currency.symbol;
					break;
				case "-":
					// don't make 0 negative
					if ( /[1-9]/.test(number) ) {
						ret += nf[ "-" ];
					}
					break;
				case "%":
					ret += nf.percent.symbol;
					break;
			}
		}

		return ret;
	};

}());

getTokenRegExp = function() {
	// regular expression for matching date and time tokens in format strings.
	return (/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g);
};

getEra = function( date, eras ) {
	if ( !eras ) return 0;
	var start, ticks = date.getTime();
	for ( var i = 0, l = eras.length; i < l; i++ ) {
		start = eras[ i ].start;
		if ( start === null || ticks >= start ) {
			return i;
		}
	}
	return 0;
};

getEraYear = function( date, cal, era, sortable ) {
	var year = date.getFullYear();
	if ( !sortable && cal.eras ) {
		// convert normal gregorian year to era-shifted gregorian
		// year by subtracting the era offset
		year -= cal.eras[ era ].offset;
	}
	return year;
};

// parseExact
(function() {
	var expandYear,
		getDayIndex,
		getMonthIndex,
		getParseRegExp,
		outOfRange,
		toUpper,
		toUpperArray;

	expandYear = function( cal, year ) {
		// expands 2-digit year into 4 digits.
		if ( year < 100 ) {
			var now = new Date(),
				era = getEra( now ),
				curr = getEraYear( now, cal, era ),
				twoDigitYearMax = cal.twoDigitYearMax;
			twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt( twoDigitYearMax, 10 ) : twoDigitYearMax;
			year += curr - ( curr % 100 );
			if ( year > twoDigitYearMax ) {
				year -= 100;
			}
		}
		return year;
	};

	getDayIndex = function	( cal, value, abbr ) {
		var ret,
			days = cal.days,
			upperDays = cal._upperDays;
		if ( !upperDays ) {
			cal._upperDays = upperDays = [
				toUpperArray( days.names ),
				toUpperArray( days.namesAbbr ),
				toUpperArray( days.namesShort )
			];
		}
		value = toUpper( value );
		if ( abbr ) {
			ret = arrayIndexOf( upperDays[1], value );
			if ( ret === -1 ) {
				ret = arrayIndexOf( upperDays[2], value );
			}
		}
		else {
			ret = arrayIndexOf( upperDays[0], value );
		}
		return ret;
	};

	getMonthIndex = function( cal, value, abbr ) {
		var months = cal.months,
			monthsGen = cal.monthsGenitive || cal.months,
			upperMonths = cal._upperMonths,
			upperMonthsGen = cal._upperMonthsGen;
		if ( !upperMonths ) {
			cal._upperMonths = upperMonths = [
				toUpperArray( months.names ),
				toUpperArray( months.namesAbbr )
			];
			cal._upperMonthsGen = upperMonthsGen = [
				toUpperArray( monthsGen.names ),
				toUpperArray( monthsGen.namesAbbr )
			];
		}
		value = toUpper( value );
		var i = arrayIndexOf( abbr ? upperMonths[1] : upperMonths[0], value );
		if ( i < 0 ) {
			i = arrayIndexOf( abbr ? upperMonthsGen[1] : upperMonthsGen[0], value );
		}
		return i;
	};

	getParseRegExp = function( cal, format ) {
		// converts a format string into a regular expression with groups that
		// can be used to extract date fields from a date string.
		// check for a cached parse regex.
		var re = cal._parseRegExp;
		if ( !re ) {
			cal._parseRegExp = re = {};
		}
		else {
			var reFormat = re[ format ];
			if ( reFormat ) {
				return reFormat;
			}
		}

		// expand single digit formats, then escape regular expression characters.
		var expFormat = expandFormat( cal, format ).replace( /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1" ),
			regexp = [ "^" ],
			groups = [],
			index = 0,
			quoteCount = 0,
			tokenRegExp = getTokenRegExp(),
			match;

		// iterate through each date token found.
		while ( (match = tokenRegExp.exec(expFormat)) !== null ) {
			var preMatch = expFormat.slice( index, match.index );
			index = tokenRegExp.lastIndex;

			// don't replace any matches that occur inside a string literal.
			quoteCount += appendPreOrPostMatch( preMatch, regexp );
			if ( quoteCount % 2 ) {
				regexp.push( match[0] );
				continue;
			}

			// add a regex group for the token.
			var m = match[ 0 ],
				len = m.length,
				add;
			switch ( m ) {
				case "dddd": case "ddd":
				case "MMMM": case "MMM":
				case "gg": case "g":
					add = "(\\D+)";
					break;
				case "tt": case "t":
					add = "(\\D*)";
					break;
				case "yyyy":
				case "fff":
				case "ff":
				case "f":
					add = "(\\d{" + len + "})";
					break;
				case "dd": case "d":
				case "MM": case "M":
				case "yy": case "y":
				case "HH": case "H":
				case "hh": case "h":
				case "mm": case "m":
				case "ss": case "s":
					add = "(\\d\\d?)";
					break;
				case "zzz":
					add = "([+-]?\\d\\d?:\\d{2})";
					break;
				case "zz": case "z":
					add = "([+-]?\\d\\d?)";
					break;
				case "/":
					add = "(\\/)";
					break;
				default:
					throw "Invalid date format pattern \'" + m + "\'.";
			}
			if ( add ) {
				regexp.push( add );
			}
			groups.push( match[0] );
		}
		appendPreOrPostMatch( expFormat.slice(index), regexp );
		regexp.push( "$" );

		// allow whitespace to differ when matching formats.
		var regexpStr = regexp.join( "" ).replace( /\s+/g, "\\s+" ),
			parseRegExp = { "regExp": regexpStr, "groups": groups };

		// cache the regex for this format.
		return re[ format ] = parseRegExp;
	};

	outOfRange = function( value, low, high ) {
		return value < low || value > high;
	};

	toUpper = function( value ) {
		// "he-IL" has non-breaking space in weekday names.
		return value.split( "\u00A0" ).join( " " ).toUpperCase();
	};

	toUpperArray = function( arr ) {
		var results = [];
		for ( var i = 0, l = arr.length; i < l; i++ ) {
			results[ i ] = toUpper( arr[i] );
		}
		return results;
	};

	parseExact = function( value, format, culture ) {
		// try to parse the date string by matching against the format string
		// while using the specified culture for date field names.
		value = trim( value );
		var cal = culture.calendar,
			// convert date formats into regular expressions with groupings.
			// use the regexp to determine the input format and extract the date fields.
			parseInfo = getParseRegExp( cal, format ),
			match = new RegExp( parseInfo.regExp ).exec( value );
		if ( match === null ) {
			return null;
		}
		// found a date format that matches the input.
		var groups = parseInfo.groups,
			era = null, year = null, month = null, date = null, weekDay = null,
			hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
			pmHour = false;
		// iterate the format groups to extract and set the date fields.
		for ( var j = 0, jl = groups.length; j < jl; j++ ) {
			var matchGroup = match[ j + 1 ];
			if ( matchGroup ) {
				var current = groups[ j ],
					clength = current.length,
					matchInt = parseInt( matchGroup, 10 );
				switch ( current ) {
					case "dd": case "d":
						// Day of month.
						date = matchInt;
						// check that date is generally in valid range, also checking overflow below.
						if ( outOfRange(date, 1, 31) ) return null;
						break;
					case "MMM": case "MMMM":
						month = getMonthIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "M": case "MM":
						// Month.
						month = matchInt - 1;
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "y": case "yy":
					case "yyyy":
						year = clength < 4 ? expandYear( cal, matchInt ) : matchInt;
						if ( outOfRange(year, 0, 9999) ) return null;
						break;
					case "h": case "hh":
						// Hours (12-hour clock).
						hour = matchInt;
						if ( hour === 12 ) hour = 0;
						if ( outOfRange(hour, 0, 11) ) return null;
						break;
					case "H": case "HH":
						// Hours (24-hour clock).
						hour = matchInt;
						if ( outOfRange(hour, 0, 23) ) return null;
						break;
					case "m": case "mm":
						// Minutes.
						min = matchInt;
						if ( outOfRange(min, 0, 59) ) return null;
						break;
					case "s": case "ss":
						// Seconds.
						sec = matchInt;
						if ( outOfRange(sec, 0, 59) ) return null;
						break;
					case "tt": case "t":
						// AM/PM designator.
						// see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
						// the AM tokens. If not, fail the parse for this format.
						pmHour = cal.PM && ( matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2] );
						if (
							!pmHour && (
								!cal.AM || ( matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2] )
							)
						) return null;
						break;
					case "f":
						// Deciseconds.
					case "ff":
						// Centiseconds.
					case "fff":
						// Milliseconds.
						msec = matchInt * Math.pow( 10, 3 - clength );
						if ( outOfRange(msec, 0, 999) ) return null;
						break;
					case "ddd":
						// Day of week.
					case "dddd":
						// Day of week.
						weekDay = getDayIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(weekDay, 0, 6) ) return null;
						break;
					case "zzz":
						// Time zone offset in +/- hours:min.
						var offsets = matchGroup.split( /:/ );
						if ( offsets.length !== 2 ) return null;
						hourOffset = parseInt( offsets[0], 10 );
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						var minOffset = parseInt( offsets[1], 10 );
						if ( outOfRange(minOffset, 0, 59) ) return null;
						tzMinOffset = ( hourOffset * 60 ) + ( startsWith(matchGroup, "-") ? -minOffset : minOffset );
						break;
					case "z": case "zz":
						// Time zone offset in +/- hours.
						hourOffset = matchInt;
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						tzMinOffset = hourOffset * 60;
						break;
					case "g": case "gg":
						var eraName = matchGroup;
						if ( !eraName || !cal.eras ) return null;
						eraName = trim( eraName.toLowerCase() );
						for ( var i = 0, l = cal.eras.length; i < l; i++ ) {
							if ( eraName === cal.eras[i].name.toLowerCase() ) {
								era = i;
								break;
							}
						}
						// could not find an era with that name
						if ( era === null ) return null;
						break;
				}
			}
		}
		var result = new Date(), defaultYear, convert = cal.convert;
		defaultYear = convert ? convert.fromGregorian( result )[ 0 ] : result.getFullYear();
		if ( year === null ) {
			year = defaultYear;
		}
		else if ( cal.eras ) {
			// year must be shifted to normal gregorian year
			// but not if year was not specified, its already normal gregorian
			// per the main if clause above.
			year += cal.eras[( era || 0 )].offset;
		}
		// set default day and month to 1 and January, so if unspecified, these are the defaults
		// instead of the current day/month.
		if ( month === null ) {
			month = 0;
		}
		if ( date === null ) {
			date = 1;
		}
		// now have year, month, and date, but in the culture's calendar.
		// convert to gregorian if necessary
		if ( convert ) {
			result = convert.toGregorian( year, month, date );
			// conversion failed, must be an invalid match
			if ( result === null ) return null;
		}
		else {
			// have to set year, month and date together to avoid overflow based on current date.
			result.setFullYear( year, month, date );
			// check to see if date overflowed for specified month (only checked 1-31 above).
			if ( result.getDate() !== date ) return null;
			// invalid day of week.
			if ( weekDay !== null && result.getDay() !== weekDay ) {
				return null;
			}
		}
		// if pm designator token was found make sure the hours fit the 24-hour clock.
		if ( pmHour && hour < 12 ) {
			hour += 12;
		}
		result.setHours( hour, min, sec, msec );
		if ( tzMinOffset !== null ) {
			// adjust timezone to utc before applying local offset.
			var adjustedMin = result.getMinutes() - ( tzMinOffset + result.getTimezoneOffset() );
			// Safari limits hours and minutes to the range of -127 to 127.  We need to use setHours
			// to ensure both these fields will not exceed this range.	adjustedMin will range
			// somewhere between -1440 and 1500, so we only need to split this into hours.
			result.setHours( result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60 );
		}
		return result;
	};
}());

parseNegativePattern = function( value, nf, negativePattern ) {
	var neg = nf[ "-" ],
		pos = nf[ "+" ],
		ret;
	switch ( negativePattern ) {
		case "n -":
			neg = " " + neg;
			pos = " " + pos;
			/* falls through */
		case "n-":
			if ( endsWith(value, neg) ) {
				ret = [ "-", value.substr(0, value.length - neg.length) ];
			}
			else if ( endsWith(value, pos) ) {
				ret = [ "+", value.substr(0, value.length - pos.length) ];
			}
			break;
		case "- n":
			neg += " ";
			pos += " ";
			/* falls through */
		case "-n":
			if ( startsWith(value, neg) ) {
				ret = [ "-", value.substr(neg.length) ];
			}
			else if ( startsWith(value, pos) ) {
				ret = [ "+", value.substr(pos.length) ];
			}
			break;
		case "(n)":
			if ( startsWith(value, "(") && endsWith(value, ")") ) {
				ret = [ "-", value.substr(1, value.length - 2) ];
			}
			break;
	}
	return ret || [ "", value ];
};

//
// public instance functions
//

Globalize.prototype.findClosestCulture = function( cultureSelector ) {
	return Globalize.findClosestCulture.call( this, cultureSelector );
};

Globalize.prototype.format = function( value, format, cultureSelector ) {
	return Globalize.format.call( this, value, format, cultureSelector );
};

Globalize.prototype.localize = function( key, cultureSelector ) {
	return Globalize.localize.call( this, key, cultureSelector );
};

Globalize.prototype.parseInt = function( value, radix, cultureSelector ) {
	return Globalize.parseInt.call( this, value, radix, cultureSelector );
};

Globalize.prototype.parseFloat = function( value, radix, cultureSelector ) {
	return Globalize.parseFloat.call( this, value, radix, cultureSelector );
};

Globalize.prototype.culture = function( cultureSelector ) {
	return Globalize.culture.call( this, cultureSelector );
};

//
// public singleton functions
//

Globalize.addCultureInfo = function( cultureName, baseCultureName, info ) {

	var base = {},
		isNew = false;

	if ( typeof cultureName !== "string" ) {
		// cultureName argument is optional string. If not specified, assume info is first
		// and only argument. Specified info deep-extends current culture.
		info = cultureName;
		cultureName = this.culture().name;
		base = this.cultures[ cultureName ];
	} else if ( typeof baseCultureName !== "string" ) {
		// baseCultureName argument is optional string. If not specified, assume info is second
		// argument. Specified info deep-extends specified culture.
		// If specified culture does not exist, create by deep-extending default
		info = baseCultureName;
		isNew = ( this.cultures[ cultureName ] == null );
		base = this.cultures[ cultureName ] || this.cultures[ "default" ];
	} else {
		// cultureName and baseCultureName specified. Assume a new culture is being created
		// by deep-extending an specified base culture
		isNew = true;
		base = this.cultures[ baseCultureName ];
	}

	this.cultures[ cultureName ] = extend(true, {},
		base,
		info
	);
	// Make the standard calendar the current culture if it's a new culture
	if ( isNew ) {
		this.cultures[ cultureName ].calendar = this.cultures[ cultureName ].calendars.standard;
	}
};

Globalize.findClosestCulture = function( name ) {
	var match;
	if ( !name ) {
		return this.findClosestCulture( this.cultureSelector ) || this.cultures[ "default" ];
	}
	if ( typeof name === "string" ) {
		name = name.split( "," );
	}
	if ( isArray(name) ) {
		var lang,
			cultures = this.cultures,
			list = name,
			i, l = list.length,
			prioritized = [];
		for ( i = 0; i < l; i++ ) {
			name = trim( list[i] );
			var pri, parts = name.split( ";" );
			lang = trim( parts[0] );
			if ( parts.length === 1 ) {
				pri = 1;
			}
			else {
				name = trim( parts[1] );
				if ( name.indexOf("q=") === 0 ) {
					name = name.substr( 2 );
					pri = parseFloat( name );
					pri = isNaN( pri ) ? 0 : pri;
				}
				else {
					pri = 1;
				}
			}
			prioritized.push({ lang: lang, pri: pri });
		}
		prioritized.sort(function( a, b ) {
			if ( a.pri < b.pri ) {
				return 1;
			} else if ( a.pri > b.pri ) {
				return -1;
			}
			return 0;
		});
		// exact match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			match = cultures[ lang ];
			if ( match ) {
				return match;
			}
		}

		// neutral language match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			do {
				var index = lang.lastIndexOf( "-" );
				if ( index === -1 ) {
					break;
				}
				// strip off the last part. e.g. en-US => en
				lang = lang.substr( 0, index );
				match = cultures[ lang ];
				if ( match ) {
					return match;
				}
			}
			while ( 1 );
		}

		// last resort: match first culture using that language
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			for ( var cultureKey in cultures ) {
				var culture = cultures[ cultureKey ];
				if ( culture.language == lang ) {
					return culture;
				}
			}
		}
	}
	else if ( typeof name === "object" ) {
		return name;
	}
	return match || null;
};

Globalize.format = function( value, format, cultureSelector ) {
	var culture = this.findClosestCulture( cultureSelector );
	if ( value instanceof Date ) {
		value = formatDate( value, format, culture );
	}
	else if ( typeof value === "number" ) {
		value = formatNumber( value, format, culture );
	}
	return value;
};

Globalize.localize = function( key, cultureSelector ) {
	return this.findClosestCulture( cultureSelector ).messages[ key ] ||
		this.cultures[ "default" ].messages[ key ];
};

Globalize.parseDate = function( value, formats, culture ) {
	culture = this.findClosestCulture( culture );

	var date, prop, patterns;
	if ( formats ) {
		if ( typeof formats === "string" ) {
			formats = [ formats ];
		}
		if ( formats.length ) {
			for ( var i = 0, l = formats.length; i < l; i++ ) {
				var format = formats[ i ];
				if ( format ) {
					date = parseExact( value, format, culture );
					if ( date ) {
						break;
					}
				}
			}
		}
	} else {
		patterns = culture.calendar.patterns;
		for ( prop in patterns ) {
			date = parseExact( value, patterns[prop], culture );
			if ( date ) {
				break;
			}
		}
	}

	return date || null;
};

Globalize.parseInt = function( value, radix, cultureSelector ) {
	return truncate( Globalize.parseFloat(value, radix, cultureSelector) );
};

Globalize.parseFloat = function( value, radix, cultureSelector ) {
	// radix argument is optional
	if ( typeof radix !== "number" ) {
		cultureSelector = radix;
		radix = 10;
	}

	var culture = this.findClosestCulture( cultureSelector );
	var ret = NaN,
		nf = culture.numberFormat;

	if ( value.indexOf(culture.numberFormat.currency.symbol) > -1 ) {
		// remove currency symbol
		value = value.replace( culture.numberFormat.currency.symbol, "" );
		// replace decimal seperator
		value = value.replace( culture.numberFormat.currency["."], culture.numberFormat["."] );
	}

	//Remove percentage character from number string before parsing
	if ( value.indexOf(culture.numberFormat.percent.symbol) > -1){
		value = value.replace( culture.numberFormat.percent.symbol, "" );
	}

	// remove spaces: leading, trailing and between - and number. Used for negative currency pt-BR
	value = value.replace( / /g, "" );

	// allow infinity or hexidecimal
	if ( regexInfinity.test(value) ) {
		ret = parseFloat( value );
	}
	else if ( !radix && regexHex.test(value) ) {
		ret = parseInt( value, 16 );
	}
	else {

		// determine sign and number
		var signInfo = parseNegativePattern( value, nf, nf.pattern[0] ),
			sign = signInfo[ 0 ],
			num = signInfo[ 1 ];

		// #44 - try parsing as "(n)"
		if ( sign === "" && nf.pattern[0] !== "(n)" ) {
			signInfo = parseNegativePattern( value, nf, "(n)" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		// try parsing as "-n"
		if ( sign === "" && nf.pattern[0] !== "-n" ) {
			signInfo = parseNegativePattern( value, nf, "-n" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}

		sign = sign || "+";

		// determine exponent and number
		var exponent,
			intAndFraction,
			exponentPos = num.indexOf( "e" );
		if ( exponentPos < 0 ) exponentPos = num.indexOf( "E" );
		if ( exponentPos < 0 ) {
			intAndFraction = num;
			exponent = null;
		}
		else {
			intAndFraction = num.substr( 0, exponentPos );
			exponent = num.substr( exponentPos + 1 );
		}
		// determine decimal position
		var integer,
			fraction,
			decSep = nf[ "." ],
			decimalPos = intAndFraction.indexOf( decSep );
		if ( decimalPos < 0 ) {
			integer = intAndFraction;
			fraction = null;
		}
		else {
			integer = intAndFraction.substr( 0, decimalPos );
			fraction = intAndFraction.substr( decimalPos + decSep.length );
		}
		// handle groups (e.g. 1,000,000)
		var groupSep = nf[ "," ];
		integer = integer.split( groupSep ).join( "" );
		var altGroupSep = groupSep.replace( /\u00A0/g, " " );
		if ( groupSep !== altGroupSep ) {
			integer = integer.split( altGroupSep ).join( "" );
		}
		// build a natively parsable number string
		var p = sign + integer;
		if ( fraction !== null ) {
			p += "." + fraction;
		}
		if ( exponent !== null ) {
			// exponent itself may have a number patternd
			var expSignInfo = parseNegativePattern( exponent, nf, "-n" );
			p += "e" + ( expSignInfo[0] || "+" ) + expSignInfo[ 1 ];
		}
		if ( regexParseFloat.test(p) ) {
			ret = parseFloat( p );
		}
	}
	return ret;
};

Globalize.culture = function( cultureSelector ) {
	// setter
	if ( typeof cultureSelector !== "undefined" ) {
		this.cultureSelector = cultureSelector;
	}
	// getter
	return this.findClosestCulture( cultureSelector ) || this.cultures[ "default" ];
};

}( this ));
;
// Knockout JavaScript library v3.1.0
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function() {(function(p){var A=this||(0,eval)("this"),w=A.document,K=A.navigator,t=A.jQuery,C=A.JSON;(function(p){"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?p(module.exports||exports):"function"===typeof define&&define.amd?define(["exports"],p):p(A.ko={})})(function(z){function G(a,c){return null===a||typeof a in M?a===c:!1}function N(a,c){var d;return function(){d||(d=setTimeout(function(){d=p;a()},c))}}function O(a,c){var d;return function(){clearTimeout(d);d=setTimeout(a,
c)}}function H(b,c,d,e){a.d[b]={init:function(b,h,g,k,l){var n,r;a.ba(function(){var g=a.a.c(h()),k=!d!==!g,s=!r;if(s||c||k!==n)s&&a.ca.fa()&&(r=a.a.lb(a.e.childNodes(b),!0)),k?(s||a.e.U(b,a.a.lb(r)),a.gb(e?e(l,g):l,b)):a.e.da(b),n=k},null,{G:b});return{controlsDescendantBindings:!0}}};a.g.aa[b]=!1;a.e.Q[b]=!0}var a="undefined"!==typeof z?z:{};a.b=function(b,c){for(var d=b.split("."),e=a,f=0;f<d.length-1;f++)e=e[d[f]];e[d[d.length-1]]=c};a.s=function(a,c,d){a[c]=d};a.version="3.1.0";a.b("version",
a.version);a.a=function(){function b(a,b){for(var c in a)a.hasOwnProperty(c)&&b(c,a[c])}function c(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function d(a,b){a.__proto__=b;return a}var e={__proto__:[]}instanceof Array,f={},h={};f[K&&/Firefox\/2/i.test(K.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];f.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");b(f,function(a,b){if(b.length)for(var c=0,
d=b.length;c<d;c++)h[b[c]]=a});var g={propertychange:!0},k=w&&function(){for(var a=3,b=w.createElement("div"),c=b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+ ++a+"]><i></i><![endif]--\x3e",c[0];);return 4<a?a:p}();return{mb:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],r:function(a,b){for(var c=0,d=a.length;c<d;c++)b(a[c],c)},l:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var c=0,d=a.length;c<d;c++)if(a[c]===
b)return c;return-1},hb:function(a,b,c){for(var d=0,e=a.length;d<e;d++)if(b.call(c,a[d],d))return a[d];return null},ma:function(b,c){var d=a.a.l(b,c);0<d?b.splice(d,1):0===d&&b.shift()},ib:function(b){b=b||[];for(var c=[],d=0,e=b.length;d<e;d++)0>a.a.l(c,b[d])&&c.push(b[d]);return c},ya:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)c.push(b(a[d],d));return c},la:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)b(a[d],d)&&c.push(a[d]);return c},$:function(a,b){if(b instanceof Array)a.push.apply(a,
b);else for(var c=0,d=b.length;c<d;c++)a.push(b[c]);return a},Y:function(b,c,d){var e=a.a.l(a.a.Sa(b),c);0>e?d&&b.push(c):d||b.splice(e,1)},na:e,extend:c,ra:d,sa:e?d:c,A:b,Oa:function(a,b){if(!a)return a;var c={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=b(a[d],d,a));return c},Fa:function(b){for(;b.firstChild;)a.removeNode(b.firstChild)},ec:function(b){b=a.a.R(b);for(var c=w.createElement("div"),d=0,e=b.length;d<e;d++)c.appendChild(a.M(b[d]));return c},lb:function(b,c){for(var d=0,e=b.length,g=[];d<
e;d++){var k=b[d].cloneNode(!0);g.push(c?a.M(k):k)}return g},U:function(b,c){a.a.Fa(b);if(c)for(var d=0,e=c.length;d<e;d++)b.appendChild(c[d])},Bb:function(b,c){var d=b.nodeType?[b]:b;if(0<d.length){for(var e=d[0],g=e.parentNode,k=0,h=c.length;k<h;k++)g.insertBefore(c[k],e);k=0;for(h=d.length;k<h;k++)a.removeNode(d[k])}},ea:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.shift();if(1<a.length){var c=a[0],d=a[a.length-1];for(a.length=0;c!==d;)if(a.push(c),
c=c.nextSibling,!c)return;a.push(d)}}return a},Db:function(a,b){7>k?a.setAttribute("selected",b):a.selected=b},ta:function(a){return null===a||a===p?"":a.trim?a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},oc:function(b,c){for(var d=[],e=(b||"").split(c),g=0,k=e.length;g<k;g++){var h=a.a.ta(e[g]);""!==h&&d.push(h)}return d},kc:function(a,b){a=a||"";return b.length>a.length?!1:a.substring(0,b.length)===b},Sb:function(a,b){if(a===b)return!0;if(11===a.nodeType)return!1;if(b.contains)return b.contains(3===
a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==(b.compareDocumentPosition(a)&16);for(;a&&a!=b;)a=a.parentNode;return!!a},Ea:function(b){return a.a.Sb(b,b.ownerDocument.documentElement)},eb:function(b){return!!a.a.hb(b,a.a.Ea)},B:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},q:function(b,c,d){var e=k&&g[c];if(!e&&t)t(b).bind(c,d);else if(e||"function"!=typeof b.addEventListener)if("undefined"!=typeof b.attachEvent){var h=function(a){d.call(b,a)},f="on"+c;b.attachEvent(f,
h);a.a.u.ja(b,function(){b.detachEvent(f,h)})}else throw Error("Browser doesn't support addEventListener or attachEvent");else b.addEventListener(c,d,!1)},ha:function(b,c){if(!b||!b.nodeType)throw Error("element must be a DOM node when calling triggerEvent");var d;"input"===a.a.B(b)&&b.type&&"click"==c.toLowerCase()?(d=b.type,d="checkbox"==d||"radio"==d):d=!1;if(t&&!d)t(b).trigger(c);else if("function"==typeof w.createEvent)if("function"==typeof b.dispatchEvent)d=w.createEvent(h[c]||"HTMLEvents"),
d.initEvent(c,!0,!0,A,0,0,0,0,0,!1,!1,!1,!1,0,b),b.dispatchEvent(d);else throw Error("The supplied element doesn't support dispatchEvent");else if(d&&b.click)b.click();else if("undefined"!=typeof b.fireEvent)b.fireEvent("on"+c);else throw Error("Browser doesn't support triggering events");},c:function(b){return a.v(b)?b():b},Sa:function(b){return a.v(b)?b.o():b},ua:function(b,c,d){if(c){var e=/\S+/g,g=b.className.match(e)||[];a.a.r(c.match(e),function(b){a.a.Y(g,b,d)});b.className=g.join(" ")}},Xa:function(b,
c){var d=a.a.c(c);if(null===d||d===p)d="";var e=a.e.firstChild(b);!e||3!=e.nodeType||a.e.nextSibling(e)?a.e.U(b,[b.ownerDocument.createTextNode(d)]):e.data=d;a.a.Vb(b)},Cb:function(a,b){a.name=b;if(7>=k)try{a.mergeAttributes(w.createElement("<input name='"+a.name+"'/>"),!1)}catch(c){}},Vb:function(a){9<=k&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},Tb:function(a){if(k){var b=a.style.width;a.style.width=0;a.style.width=b}},ic:function(b,c){b=a.a.c(b);c=a.a.c(c);for(var d=
[],e=b;e<=c;e++)d.push(e);return d},R:function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c]);return b},mc:6===k,nc:7===k,oa:k,ob:function(b,c){for(var d=a.a.R(b.getElementsByTagName("input")).concat(a.a.R(b.getElementsByTagName("textarea"))),e="string"==typeof c?function(a){return a.name===c}:function(a){return c.test(a.name)},g=[],k=d.length-1;0<=k;k--)e(d[k])&&g.push(d[k]);return g},fc:function(b){return"string"==typeof b&&(b=a.a.ta(b))?C&&C.parse?C.parse(b):(new Function("return "+b))():
null},Ya:function(b,c,d){if(!C||!C.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");return C.stringify(a.a.c(b),c,d)},gc:function(c,d,e){e=e||{};var g=e.params||{},k=e.includeFields||this.mb,h=c;if("object"==typeof c&&"form"===a.a.B(c))for(var h=c.action,f=k.length-1;0<=f;f--)for(var u=a.a.ob(c,k[f]),D=u.length-1;0<=D;D--)g[u[D].name]=
u[D].value;d=a.a.c(d);var y=w.createElement("form");y.style.display="none";y.action=h;y.method="post";for(var p in d)c=w.createElement("input"),c.name=p,c.value=a.a.Ya(a.a.c(d[p])),y.appendChild(c);b(g,function(a,b){var c=w.createElement("input");c.name=a;c.value=b;y.appendChild(c)});w.body.appendChild(y);e.submitter?e.submitter(y):y.submit();setTimeout(function(){y.parentNode.removeChild(y)},0)}}}();a.b("utils",a.a);a.b("utils.arrayForEach",a.a.r);a.b("utils.arrayFirst",a.a.hb);a.b("utils.arrayFilter",
a.a.la);a.b("utils.arrayGetDistinctValues",a.a.ib);a.b("utils.arrayIndexOf",a.a.l);a.b("utils.arrayMap",a.a.ya);a.b("utils.arrayPushAll",a.a.$);a.b("utils.arrayRemoveItem",a.a.ma);a.b("utils.extend",a.a.extend);a.b("utils.fieldsIncludedWithJsonPost",a.a.mb);a.b("utils.getFormFields",a.a.ob);a.b("utils.peekObservable",a.a.Sa);a.b("utils.postJson",a.a.gc);a.b("utils.parseJson",a.a.fc);a.b("utils.registerEventHandler",a.a.q);a.b("utils.stringifyJson",a.a.Ya);a.b("utils.range",a.a.ic);a.b("utils.toggleDomNodeCssClass",
a.a.ua);a.b("utils.triggerEvent",a.a.ha);a.b("utils.unwrapObservable",a.a.c);a.b("utils.objectForEach",a.a.A);a.b("utils.addOrRemoveItem",a.a.Y);a.b("unwrap",a.a.c);Function.prototype.bind||(Function.prototype.bind=function(a){var c=this,d=Array.prototype.slice.call(arguments);a=d.shift();return function(){return c.apply(a,d.concat(Array.prototype.slice.call(arguments)))}});a.a.f=new function(){function a(b,h){var g=b[d];if(!g||"null"===g||!e[g]){if(!h)return p;g=b[d]="ko"+c++;e[g]={}}return e[g]}
var c=0,d="__ko__"+(new Date).getTime(),e={};return{get:function(c,d){var e=a(c,!1);return e===p?p:e[d]},set:function(c,d,e){if(e!==p||a(c,!1)!==p)a(c,!0)[d]=e},clear:function(a){var b=a[d];return b?(delete e[b],a[d]=null,!0):!1},L:function(){return c++ +d}}};a.b("utils.domData",a.a.f);a.b("utils.domData.clear",a.a.f.clear);a.a.u=new function(){function b(b,c){var e=a.a.f.get(b,d);e===p&&c&&(e=[],a.a.f.set(b,d,e));return e}function c(d){var e=b(d,!1);if(e)for(var e=e.slice(0),k=0;k<e.length;k++)e[k](d);
a.a.f.clear(d);a.a.u.cleanExternalData(d);if(f[d.nodeType])for(e=d.firstChild;d=e;)e=d.nextSibling,8===d.nodeType&&c(d)}var d=a.a.f.L(),e={1:!0,8:!0,9:!0},f={1:!0,9:!0};return{ja:function(a,c){if("function"!=typeof c)throw Error("Callback must be a function");b(a,!0).push(c)},Ab:function(c,e){var k=b(c,!1);k&&(a.a.ma(k,e),0==k.length&&a.a.f.set(c,d,p))},M:function(b){if(e[b.nodeType]&&(c(b),f[b.nodeType])){var d=[];a.a.$(d,b.getElementsByTagName("*"));for(var k=0,l=d.length;k<l;k++)c(d[k])}return b},
removeNode:function(b){a.M(b);b.parentNode&&b.parentNode.removeChild(b)},cleanExternalData:function(a){t&&"function"==typeof t.cleanData&&t.cleanData([a])}}};a.M=a.a.u.M;a.removeNode=a.a.u.removeNode;a.b("cleanNode",a.M);a.b("removeNode",a.removeNode);a.b("utils.domNodeDisposal",a.a.u);a.b("utils.domNodeDisposal.addDisposeCallback",a.a.u.ja);a.b("utils.domNodeDisposal.removeDisposeCallback",a.a.u.Ab);(function(){a.a.Qa=function(b){var c;if(t)if(t.parseHTML)c=t.parseHTML(b)||[];else{if((c=t.clean([b]))&&
c[0]){for(b=c[0];b.parentNode&&11!==b.parentNode.nodeType;)b=b.parentNode;b.parentNode&&b.parentNode.removeChild(b)}}else{var d=a.a.ta(b).toLowerCase();c=w.createElement("div");d=d.match(/^<(thead|tbody|tfoot)/)&&[1,"<table>","</table>"]||!d.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!d.indexOf("<td")||!d.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||[0,"",""];b="ignored<div>"+d[1]+b+d[2]+"</div>";for("function"==typeof A.innerShiv?c.appendChild(A.innerShiv(b)):
c.innerHTML=b;d[0]--;)c=c.lastChild;c=a.a.R(c.lastChild.childNodes)}return c};a.a.Va=function(b,c){a.a.Fa(b);c=a.a.c(c);if(null!==c&&c!==p)if("string"!=typeof c&&(c=c.toString()),t)t(b).html(c);else for(var d=a.a.Qa(c),e=0;e<d.length;e++)b.appendChild(d[e])}})();a.b("utils.parseHtmlFragment",a.a.Qa);a.b("utils.setHtml",a.a.Va);a.w=function(){function b(c,e){if(c)if(8==c.nodeType){var f=a.w.xb(c.nodeValue);null!=f&&e.push({Rb:c,cc:f})}else if(1==c.nodeType)for(var f=0,h=c.childNodes,g=h.length;f<g;f++)b(h[f],
e)}var c={};return{Na:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);c[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},Hb:function(a,b){var f=c[a];if(f===p)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return f.apply(null,b||[]),!0}finally{delete c[a]}},Ib:function(c,e){var f=
[];b(c,f);for(var h=0,g=f.length;h<g;h++){var k=f[h].Rb,l=[k];e&&a.a.$(l,e);a.w.Hb(f[h].cc,l);k.nodeValue="";k.parentNode&&k.parentNode.removeChild(k)}},xb:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();a.b("memoization",a.w);a.b("memoization.memoize",a.w.Na);a.b("memoization.unmemoize",a.w.Hb);a.b("memoization.parseMemoText",a.w.xb);a.b("memoization.unmemoizeDomNodeAndDescendants",a.w.Ib);a.Ga={throttle:function(b,c){b.throttleEvaluation=c;var d=null;return a.h({read:b,write:function(a){clearTimeout(d);
d=setTimeout(function(){b(a)},c)}})},rateLimit:function(a,c){var d,e,f;"number"==typeof c?d=c:(d=c.timeout,e=c.method);f="notifyWhenChangesStop"==e?O:N;a.Ma(function(a){return f(a,d)})},notify:function(a,c){a.equalityComparer="always"==c?null:G}};var M={undefined:1,"boolean":1,number:1,string:1};a.b("extenders",a.Ga);a.Fb=function(b,c,d){this.target=b;this.za=c;this.Qb=d;this.sb=!1;a.s(this,"dispose",this.F)};a.Fb.prototype.F=function(){this.sb=!0;this.Qb()};a.N=function(){a.a.sa(this,a.N.fn);this.H=
{}};var F="change";z={V:function(b,c,d){var e=this;d=d||F;var f=new a.Fb(e,c?b.bind(c):b,function(){a.a.ma(e.H[d],f)});e.o&&e.o();e.H[d]||(e.H[d]=[]);e.H[d].push(f);return f},notifySubscribers:function(b,c){c=c||F;if(this.qb(c))try{a.k.jb();for(var d=this.H[c].slice(0),e=0,f;f=d[e];++e)f.sb||f.za(b)}finally{a.k.end()}},Ma:function(b){var c=this,d=a.v(c),e,f,h;c.ia||(c.ia=c.notifySubscribers,c.notifySubscribers=function(a,b){b&&b!==F?"beforeChange"===b?c.bb(a):c.ia(a,b):c.cb(a)});var g=b(function(){d&&
h===c&&(h=c());e=!1;c.Ka(f,h)&&c.ia(f=h)});c.cb=function(a){e=!0;h=a;g()};c.bb=function(a){e||(f=a,c.ia(a,"beforeChange"))}},qb:function(a){return this.H[a]&&this.H[a].length},Wb:function(){var b=0;a.a.A(this.H,function(a,d){b+=d.length});return b},Ka:function(a,c){return!this.equalityComparer||!this.equalityComparer(a,c)},extend:function(b){var c=this;b&&a.a.A(b,function(b,e){var f=a.Ga[b];"function"==typeof f&&(c=f(c,e)||c)});return c}};a.s(z,"subscribe",z.V);a.s(z,"extend",z.extend);a.s(z,"getSubscriptionsCount",
z.Wb);a.a.na&&a.a.ra(z,Function.prototype);a.N.fn=z;a.tb=function(a){return null!=a&&"function"==typeof a.V&&"function"==typeof a.notifySubscribers};a.b("subscribable",a.N);a.b("isSubscribable",a.tb);a.ca=a.k=function(){function b(a){d.push(e);e=a}function c(){e=d.pop()}var d=[],e,f=0;return{jb:b,end:c,zb:function(b){if(e){if(!a.tb(b))throw Error("Only subscribable things can act as dependencies");e.za(b,b.Kb||(b.Kb=++f))}},t:function(a,d,e){try{return b(),a.apply(d,e||[])}finally{c()}},fa:function(){if(e)return e.ba.fa()},
pa:function(){if(e)return e.pa}}}();a.b("computedContext",a.ca);a.b("computedContext.getDependenciesCount",a.ca.fa);a.b("computedContext.isInitial",a.ca.pa);a.m=function(b){function c(){if(0<arguments.length)return c.Ka(d,arguments[0])&&(c.P(),d=arguments[0],c.O()),this;a.k.zb(c);return d}var d=b;a.N.call(c);a.a.sa(c,a.m.fn);c.o=function(){return d};c.O=function(){c.notifySubscribers(d)};c.P=function(){c.notifySubscribers(d,"beforeChange")};a.s(c,"peek",c.o);a.s(c,"valueHasMutated",c.O);a.s(c,"valueWillMutate",
c.P);return c};a.m.fn={equalityComparer:G};var E=a.m.hc="__ko_proto__";a.m.fn[E]=a.m;a.a.na&&a.a.ra(a.m.fn,a.N.fn);a.Ha=function(b,c){return null===b||b===p||b[E]===p?!1:b[E]===c?!0:a.Ha(b[E],c)};a.v=function(b){return a.Ha(b,a.m)};a.ub=function(b){return"function"==typeof b&&b[E]===a.m||"function"==typeof b&&b[E]===a.h&&b.Yb?!0:!1};a.b("observable",a.m);a.b("isObservable",a.v);a.b("isWriteableObservable",a.ub);a.T=function(b){b=b||[];if("object"!=typeof b||!("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");
b=a.m(b);a.a.sa(b,a.T.fn);return b.extend({trackArrayChanges:!0})};a.T.fn={remove:function(b){for(var c=this.o(),d=[],e="function"!=typeof b||a.v(b)?function(a){return a===b}:b,f=0;f<c.length;f++){var h=c[f];e(h)&&(0===d.length&&this.P(),d.push(h),c.splice(f,1),f--)}d.length&&this.O();return d},removeAll:function(b){if(b===p){var c=this.o(),d=c.slice(0);this.P();c.splice(0,c.length);this.O();return d}return b?this.remove(function(c){return 0<=a.a.l(b,c)}):[]},destroy:function(b){var c=this.o(),d=
"function"!=typeof b||a.v(b)?function(a){return a===b}:b;this.P();for(var e=c.length-1;0<=e;e--)d(c[e])&&(c[e]._destroy=!0);this.O()},destroyAll:function(b){return b===p?this.destroy(function(){return!0}):b?this.destroy(function(c){return 0<=a.a.l(b,c)}):[]},indexOf:function(b){var c=this();return a.a.l(c,b)},replace:function(a,c){var d=this.indexOf(a);0<=d&&(this.P(),this.o()[d]=c,this.O())}};a.a.r("pop push reverse shift sort splice unshift".split(" "),function(b){a.T.fn[b]=function(){var a=this.o();
this.P();this.kb(a,b,arguments);a=a[b].apply(a,arguments);this.O();return a}});a.a.r(["slice"],function(b){a.T.fn[b]=function(){var a=this();return a[b].apply(a,arguments)}});a.a.na&&a.a.ra(a.T.fn,a.m.fn);a.b("observableArray",a.T);var I="arrayChange";a.Ga.trackArrayChanges=function(b){function c(){if(!d){d=!0;var c=b.notifySubscribers;b.notifySubscribers=function(a,b){b&&b!==F||++f;return c.apply(this,arguments)};var k=[].concat(b.o()||[]);e=null;b.V(function(c){c=[].concat(c||[]);if(b.qb(I)){var d;
if(!e||1<f)e=a.a.Aa(k,c,{sparse:!0});d=e;d.length&&b.notifySubscribers(d,I)}k=c;e=null;f=0})}}if(!b.kb){var d=!1,e=null,f=0,h=b.V;b.V=b.subscribe=function(a,b,d){d===I&&c();return h.apply(this,arguments)};b.kb=function(b,c,l){function h(a,b,c){return r[r.length]={status:a,value:b,index:c}}if(d&&!f){var r=[],m=b.length,q=l.length,s=0;switch(c){case "push":s=m;case "unshift":for(c=0;c<q;c++)h("added",l[c],s+c);break;case "pop":s=m-1;case "shift":m&&h("deleted",b[s],s);break;case "splice":c=Math.min(Math.max(0,
0>l[0]?m+l[0]:l[0]),m);for(var m=1===q?m:Math.min(c+(l[1]||0),m),q=c+q-2,s=Math.max(m,q),B=[],u=[],D=2;c<s;++c,++D)c<m&&u.push(h("deleted",b[c],c)),c<q&&B.push(h("added",l[D],c));a.a.nb(u,B);break;default:return}e=r}}}};a.ba=a.h=function(b,c,d){function e(){q=!0;a.a.A(v,function(a,b){b.F()});v={};x=0;n=!1}function f(){var a=g.throttleEvaluation;a&&0<=a?(clearTimeout(t),t=setTimeout(h,a)):g.wa?g.wa():h()}function h(){if(!r&&!q){if(y&&y()){if(!m){p();return}}else m=!1;r=!0;try{var b=v,d=x;a.k.jb({za:function(a,
c){q||(d&&b[c]?(v[c]=b[c],++x,delete b[c],--d):v[c]||(v[c]=a.V(f),++x))},ba:g,pa:!x});v={};x=0;try{var e=c?s.call(c):s()}finally{a.k.end(),d&&a.a.A(b,function(a,b){b.F()}),n=!1}g.Ka(l,e)&&(g.notifySubscribers(l,"beforeChange"),l=e,g.wa&&!g.throttleEvaluation||g.notifySubscribers(l))}finally{r=!1}x||p()}}function g(){if(0<arguments.length){if("function"===typeof B)B.apply(c,arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
return this}n&&h();a.k.zb(g);return l}function k(){return n||0<x}var l,n=!0,r=!1,m=!1,q=!1,s=b;s&&"object"==typeof s?(d=s,s=d.read):(d=d||{},s||(s=d.read));if("function"!=typeof s)throw Error("Pass a function that returns the value of the ko.computed");var B=d.write,u=d.disposeWhenNodeIsRemoved||d.G||null,D=d.disposeWhen||d.Da,y=D,p=e,v={},x=0,t=null;c||(c=d.owner);a.N.call(g);a.a.sa(g,a.h.fn);g.o=function(){n&&!x&&h();return l};g.fa=function(){return x};g.Yb="function"===typeof d.write;g.F=function(){p()};
g.ga=k;var w=g.Ma;g.Ma=function(a){w.call(g,a);g.wa=function(){g.bb(l);n=!0;g.cb(g)}};a.s(g,"peek",g.o);a.s(g,"dispose",g.F);a.s(g,"isActive",g.ga);a.s(g,"getDependenciesCount",g.fa);u&&(m=!0,u.nodeType&&(y=function(){return!a.a.Ea(u)||D&&D()}));!0!==d.deferEvaluation&&h();u&&k()&&u.nodeType&&(p=function(){a.a.u.Ab(u,p);e()},a.a.u.ja(u,p));return g};a.$b=function(b){return a.Ha(b,a.h)};z=a.m.hc;a.h[z]=a.m;a.h.fn={equalityComparer:G};a.h.fn[z]=a.h;a.a.na&&a.a.ra(a.h.fn,a.N.fn);a.b("dependentObservable",
a.h);a.b("computed",a.h);a.b("isComputed",a.$b);(function(){function b(a,f,h){h=h||new d;a=f(a);if("object"!=typeof a||null===a||a===p||a instanceof Date||a instanceof String||a instanceof Number||a instanceof Boolean)return a;var g=a instanceof Array?[]:{};h.save(a,g);c(a,function(c){var d=f(a[c]);switch(typeof d){case "boolean":case "number":case "string":case "function":g[c]=d;break;case "object":case "undefined":var n=h.get(d);g[c]=n!==p?n:b(d,f,h)}});return g}function c(a,b){if(a instanceof Array){for(var c=
0;c<a.length;c++)b(c);"function"==typeof a.toJSON&&b("toJSON")}else for(c in a)b(c)}function d(){this.keys=[];this.ab=[]}a.Gb=function(c){if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");return b(c,function(b){for(var c=0;a.v(b)&&10>c;c++)b=b();return b})};a.toJSON=function(b,c,d){b=a.Gb(b);return a.a.Ya(b,c,d)};d.prototype={save:function(b,c){var d=a.a.l(this.keys,b);0<=d?this.ab[d]=c:(this.keys.push(b),this.ab.push(c))},get:function(b){b=a.a.l(this.keys,
b);return 0<=b?this.ab[b]:p}}})();a.b("toJS",a.Gb);a.b("toJSON",a.toJSON);(function(){a.i={p:function(b){switch(a.a.B(b)){case "option":return!0===b.__ko__hasDomDataOptionValue__?a.a.f.get(b,a.d.options.Pa):7>=a.a.oa?b.getAttributeNode("value")&&b.getAttributeNode("value").specified?b.value:b.text:b.value;case "select":return 0<=b.selectedIndex?a.i.p(b.options[b.selectedIndex]):p;default:return b.value}},X:function(b,c,d){switch(a.a.B(b)){case "option":switch(typeof c){case "string":a.a.f.set(b,a.d.options.Pa,
p);"__ko__hasDomDataOptionValue__"in b&&delete b.__ko__hasDomDataOptionValue__;b.value=c;break;default:a.a.f.set(b,a.d.options.Pa,c),b.__ko__hasDomDataOptionValue__=!0,b.value="number"===typeof c?c:""}break;case "select":if(""===c||null===c)c=p;for(var e=-1,f=0,h=b.options.length,g;f<h;++f)if(g=a.i.p(b.options[f]),g==c||""==g&&c===p){e=f;break}if(d||0<=e||c===p&&1<b.size)b.selectedIndex=e;break;default:if(null===c||c===p)c="";b.value=c}}}})();a.b("selectExtensions",a.i);a.b("selectExtensions.readValue",
a.i.p);a.b("selectExtensions.writeValue",a.i.X);a.g=function(){function b(b){b=a.a.ta(b);123===b.charCodeAt(0)&&(b=b.slice(1,-1));var c=[],d=b.match(e),g,m,q=0;if(d){d.push(",");for(var s=0,B;B=d[s];++s){var u=B.charCodeAt(0);if(44===u){if(0>=q){g&&c.push(m?{key:g,value:m.join("")}:{unknown:g});g=m=q=0;continue}}else if(58===u){if(!m)continue}else if(47===u&&s&&1<B.length)(u=d[s-1].match(f))&&!h[u[0]]&&(b=b.substr(b.indexOf(B)+1),d=b.match(e),d.push(","),s=-1,B="/");else if(40===u||123===u||91===
u)++q;else if(41===u||125===u||93===u)--q;else if(!g&&!m){g=34===u||39===u?B.slice(1,-1):B;continue}m?m.push(B):m=[B]}}return c}var c=["true","false","null","undefined"],d=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,e=RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]","g"),f=/[\])"'A-Za-z0-9_$]+$/,h={"in":1,"return":1,"typeof":1},g={};return{aa:[],W:g,Ra:b,qa:function(e,l){function f(b,e){var l,k=a.getBindingHandler(b);
if(k&&k.preprocess?e=k.preprocess(e,b,f):1){if(k=g[b])l=e,0<=a.a.l(c,l)?l=!1:(k=l.match(d),l=null===k?!1:k[1]?"Object("+k[1]+")"+k[2]:l),k=l;k&&m.push("'"+b+"':function(_z){"+l+"=_z}");q&&(e="function(){return "+e+" }");h.push("'"+b+"':"+e)}}l=l||{};var h=[],m=[],q=l.valueAccessors,s="string"===typeof e?b(e):e;a.a.r(s,function(a){f(a.key||a.unknown,a.value)});m.length&&f("_ko_property_writers","{"+m.join(",")+" }");return h.join(",")},bc:function(a,b){for(var c=0;c<a.length;c++)if(a[c].key==b)return!0;
return!1},va:function(b,c,d,e,g){if(b&&a.v(b))!a.ub(b)||g&&b.o()===e||b(e);else if((b=c.get("_ko_property_writers"))&&b[d])b[d](e)}}}();a.b("expressionRewriting",a.g);a.b("expressionRewriting.bindingRewriteValidators",a.g.aa);a.b("expressionRewriting.parseObjectLiteral",a.g.Ra);a.b("expressionRewriting.preProcessBindings",a.g.qa);a.b("expressionRewriting._twoWayBindings",a.g.W);a.b("jsonExpressionRewriting",a.g);a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",a.g.qa);(function(){function b(a){return 8==
a.nodeType&&h.test(f?a.text:a.nodeValue)}function c(a){return 8==a.nodeType&&g.test(f?a.text:a.nodeValue)}function d(a,d){for(var e=a,g=1,k=[];e=e.nextSibling;){if(c(e)&&(g--,0===g))return k;k.push(e);b(e)&&g++}if(!d)throw Error("Cannot find closing comment tag to match: "+a.nodeValue);return null}function e(a,b){var c=d(a,b);return c?0<c.length?c[c.length-1].nextSibling:a.nextSibling:null}var f=w&&"\x3c!--test--\x3e"===w.createComment("test").text,h=f?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,
g=f?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,k={ul:!0,ol:!0};a.e={Q:{},childNodes:function(a){return b(a)?d(a):a.childNodes},da:function(c){if(b(c)){c=a.e.childNodes(c);for(var d=0,e=c.length;d<e;d++)a.removeNode(c[d])}else a.a.Fa(c)},U:function(c,d){if(b(c)){a.e.da(c);for(var e=c.nextSibling,g=0,k=d.length;g<k;g++)e.parentNode.insertBefore(d[g],e)}else a.a.U(c,d)},yb:function(a,c){b(a)?a.parentNode.insertBefore(c,a.nextSibling):a.firstChild?a.insertBefore(c,a.firstChild):a.appendChild(c)},rb:function(c,
d,e){e?b(c)?c.parentNode.insertBefore(d,e.nextSibling):e.nextSibling?c.insertBefore(d,e.nextSibling):c.appendChild(d):a.e.yb(c,d)},firstChild:function(a){return b(a)?!a.nextSibling||c(a.nextSibling)?null:a.nextSibling:a.firstChild},nextSibling:function(a){b(a)&&(a=e(a));return a.nextSibling&&c(a.nextSibling)?null:a.nextSibling},Xb:b,lc:function(a){return(a=(f?a.text:a.nodeValue).match(h))?a[1]:null},wb:function(d){if(k[a.a.B(d)]){var g=d.firstChild;if(g){do if(1===g.nodeType){var f;f=g.firstChild;
var h=null;if(f){do if(h)h.push(f);else if(b(f)){var q=e(f,!0);q?f=q:h=[f]}else c(f)&&(h=[f]);while(f=f.nextSibling)}if(f=h)for(h=g.nextSibling,q=0;q<f.length;q++)h?d.insertBefore(f[q],h):d.appendChild(f[q])}while(g=g.nextSibling)}}}}})();a.b("virtualElements",a.e);a.b("virtualElements.allowedBindings",a.e.Q);a.b("virtualElements.emptyNode",a.e.da);a.b("virtualElements.insertAfter",a.e.rb);a.b("virtualElements.prepend",a.e.yb);a.b("virtualElements.setDomNodeChildren",a.e.U);(function(){a.J=function(){this.Nb=
{}};a.a.extend(a.J.prototype,{nodeHasBindings:function(b){switch(b.nodeType){case 1:return null!=b.getAttribute("data-bind");case 8:return a.e.Xb(b);default:return!1}},getBindings:function(a,c){var d=this.getBindingsString(a,c);return d?this.parseBindingsString(d,c,a):null},getBindingAccessors:function(a,c){var d=this.getBindingsString(a,c);return d?this.parseBindingsString(d,c,a,{valueAccessors:!0}):null},getBindingsString:function(b){switch(b.nodeType){case 1:return b.getAttribute("data-bind");
case 8:return a.e.lc(b);default:return null}},parseBindingsString:function(b,c,d,e){try{var f=this.Nb,h=b+(e&&e.valueAccessors||""),g;if(!(g=f[h])){var k,l="with($context){with($data||{}){return{"+a.g.qa(b,e)+"}}}";k=new Function("$context","$element",l);g=f[h]=k}return g(c,d)}catch(n){throw n.message="Unable to parse bindings.\nBindings value: "+b+"\nMessage: "+n.message,n;}}});a.J.instance=new a.J})();a.b("bindingProvider",a.J);(function(){function b(a){return function(){return a}}function c(a){return a()}
function d(b){return a.a.Oa(a.k.t(b),function(a,c){return function(){return b()[c]}})}function e(a,b){return d(this.getBindings.bind(this,a,b))}function f(b,c,d){var e,g=a.e.firstChild(c),k=a.J.instance,f=k.preprocessNode;if(f){for(;e=g;)g=a.e.nextSibling(e),f.call(k,e);g=a.e.firstChild(c)}for(;e=g;)g=a.e.nextSibling(e),h(b,e,d)}function h(b,c,d){var e=!0,g=1===c.nodeType;g&&a.e.wb(c);if(g&&d||a.J.instance.nodeHasBindings(c))e=k(c,null,b,d).shouldBindDescendants;e&&!n[a.a.B(c)]&&f(b,c,!g)}function g(b){var c=
[],d={},e=[];a.a.A(b,function y(g){if(!d[g]){var k=a.getBindingHandler(g);k&&(k.after&&(e.push(g),a.a.r(k.after,function(c){if(b[c]){if(-1!==a.a.l(e,c))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+e.join(", "));y(c)}}),e.length--),c.push({key:g,pb:k}));d[g]=!0}});return c}function k(b,d,k,f){var h=a.a.f.get(b,r);if(!d){if(h)throw Error("You cannot apply bindings multiple times to the same element.");a.a.f.set(b,r,!0)}!h&&f&&a.Eb(b,k);var l;if(d&&"function"!==
typeof d)l=d;else{var n=a.J.instance,m=n.getBindingAccessors||e,x=a.h(function(){(l=d?d(k,b):m.call(n,b,k))&&k.D&&k.D();return l},null,{G:b});l&&x.ga()||(x=null)}var t;if(l){var w=x?function(a){return function(){return c(x()[a])}}:function(a){return l[a]},z=function(){return a.a.Oa(x?x():l,c)};z.get=function(a){return l[a]&&c(w(a))};z.has=function(a){return a in l};f=g(l);a.a.r(f,function(c){var d=c.pb.init,e=c.pb.update,g=c.key;if(8===b.nodeType&&!a.e.Q[g])throw Error("The binding '"+g+"' cannot be used with virtual elements");
try{"function"==typeof d&&a.k.t(function(){var a=d(b,w(g),z,k.$data,k);if(a&&a.controlsDescendantBindings){if(t!==p)throw Error("Multiple bindings ("+t+" and "+g+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");t=g}}),"function"==typeof e&&a.h(function(){e(b,w(g),z,k.$data,k)},null,{G:b})}catch(f){throw f.message='Unable to process binding "'+g+": "+l[g]+'"\nMessage: '+f.message,f;}})}return{shouldBindDescendants:t===p}}
function l(b){return b&&b instanceof a.I?b:new a.I(b)}a.d={};var n={script:!0};a.getBindingHandler=function(b){return a.d[b]};a.I=function(b,c,d,e){var g=this,k="function"==typeof b&&!a.v(b),f,h=a.h(function(){var f=k?b():b,l=a.a.c(f);c?(c.D&&c.D(),a.a.extend(g,c),h&&(g.D=h)):(g.$parents=[],g.$root=l,g.ko=a);g.$rawData=f;g.$data=l;d&&(g[d]=l);e&&e(g,c,l);return g.$data},null,{Da:function(){return f&&!a.a.eb(f)},G:!0});h.ga()&&(g.D=h,h.equalityComparer=null,f=[],h.Jb=function(b){f.push(b);a.a.u.ja(b,
function(b){a.a.ma(f,b);f.length||(h.F(),g.D=h=p)})})};a.I.prototype.createChildContext=function(b,c,d){return new a.I(b,this,c,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);d&&d(a)})};a.I.prototype.extend=function(b){return new a.I(this.D||this.$data,this,null,function(c,d){c.$rawData=d.$rawData;a.a.extend(c,"function"==typeof b?b():b)})};var r=a.a.f.L(),m=a.a.f.L();a.Eb=function(b,c){if(2==arguments.length)a.a.f.set(b,m,c),
c.D&&c.D.Jb(b);else return a.a.f.get(b,m)};a.xa=function(b,c,d){1===b.nodeType&&a.e.wb(b);return k(b,c,l(d),!0)};a.Lb=function(c,e,g){g=l(g);return a.xa(c,"function"===typeof e?d(e.bind(null,g,c)):a.a.Oa(e,b),g)};a.gb=function(a,b){1!==b.nodeType&&8!==b.nodeType||f(l(a),b,!0)};a.fb=function(a,b){!t&&A.jQuery&&(t=A.jQuery);if(b&&1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");b=b||A.document.body;h(l(a),
b,!0)};a.Ca=function(b){switch(b.nodeType){case 1:case 8:var c=a.Eb(b);if(c)return c;if(b.parentNode)return a.Ca(b.parentNode)}return p};a.Pb=function(b){return(b=a.Ca(b))?b.$data:p};a.b("bindingHandlers",a.d);a.b("applyBindings",a.fb);a.b("applyBindingsToDescendants",a.gb);a.b("applyBindingAccessorsToNode",a.xa);a.b("applyBindingsToNode",a.Lb);a.b("contextFor",a.Ca);a.b("dataFor",a.Pb)})();var L={"class":"className","for":"htmlFor"};a.d.attr={update:function(b,c){var d=a.a.c(c())||{};a.a.A(d,function(c,
d){d=a.a.c(d);var h=!1===d||null===d||d===p;h&&b.removeAttribute(c);8>=a.a.oa&&c in L?(c=L[c],h?b.removeAttribute(c):b[c]=d):h||b.setAttribute(c,d.toString());"name"===c&&a.a.Cb(b,h?"":d.toString())})}};(function(){a.d.checked={after:["value","attr"],init:function(b,c,d){function e(){return d.has("checkedValue")?a.a.c(d.get("checkedValue")):b.value}function f(){var g=b.checked,f=r?e():g;if(!a.ca.pa()&&(!k||g)){var h=a.k.t(c);l?n!==f?(g&&(a.a.Y(h,f,!0),a.a.Y(h,n,!1)),n=f):a.a.Y(h,f,g):a.g.va(h,d,"checked",
f,!0)}}function h(){var d=a.a.c(c());b.checked=l?0<=a.a.l(d,e()):g?d:e()===d}var g="checkbox"==b.type,k="radio"==b.type;if(g||k){var l=g&&a.a.c(c())instanceof Array,n=l?e():p,r=k||l;k&&!b.name&&a.d.uniqueName.init(b,function(){return!0});a.ba(f,null,{G:b});a.a.q(b,"click",f);a.ba(h,null,{G:b})}}};a.g.W.checked=!0;a.d.checkedValue={update:function(b,c){b.value=a.a.c(c())}}})();a.d.css={update:function(b,c){var d=a.a.c(c());"object"==typeof d?a.a.A(d,function(c,d){d=a.a.c(d);a.a.ua(b,c,d)}):(d=String(d||
""),a.a.ua(b,b.__ko__cssValue,!1),b.__ko__cssValue=d,a.a.ua(b,d,!0))}};a.d.enable={update:function(b,c){var d=a.a.c(c());d&&b.disabled?b.removeAttribute("disabled"):d||b.disabled||(b.disabled=!0)}};a.d.disable={update:function(b,c){a.d.enable.update(b,function(){return!a.a.c(c())})}};a.d.event={init:function(b,c,d,e,f){var h=c()||{};a.a.A(h,function(g){"string"==typeof g&&a.a.q(b,g,function(b){var h,n=c()[g];if(n){try{var r=a.a.R(arguments);e=f.$data;r.unshift(e);h=n.apply(e,r)}finally{!0!==h&&(b.preventDefault?
b.preventDefault():b.returnValue=!1)}!1===d.get(g+"Bubble")&&(b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation())}})})}};a.d.foreach={vb:function(b){return function(){var c=b(),d=a.a.Sa(c);if(!d||"number"==typeof d.length)return{foreach:c,templateEngine:a.K.Ja};a.a.c(c);return{foreach:d.data,as:d.as,includeDestroyed:d.includeDestroyed,afterAdd:d.afterAdd,beforeRemove:d.beforeRemove,afterRender:d.afterRender,beforeMove:d.beforeMove,afterMove:d.afterMove,templateEngine:a.K.Ja}}},init:function(b,
c){return a.d.template.init(b,a.d.foreach.vb(c))},update:function(b,c,d,e,f){return a.d.template.update(b,a.d.foreach.vb(c),d,e,f)}};a.g.aa.foreach=!1;a.e.Q.foreach=!0;a.d.hasfocus={init:function(b,c,d){function e(e){b.__ko_hasfocusUpdating=!0;var k=b.ownerDocument;if("activeElement"in k){var f;try{f=k.activeElement}catch(h){f=k.body}e=f===b}k=c();a.g.va(k,d,"hasfocus",e,!0);b.__ko_hasfocusLastValue=e;b.__ko_hasfocusUpdating=!1}var f=e.bind(null,!0),h=e.bind(null,!1);a.a.q(b,"focus",f);a.a.q(b,"focusin",
f);a.a.q(b,"blur",h);a.a.q(b,"focusout",h)},update:function(b,c){var d=!!a.a.c(c());b.__ko_hasfocusUpdating||b.__ko_hasfocusLastValue===d||(d?b.focus():b.blur(),a.k.t(a.a.ha,null,[b,d?"focusin":"focusout"]))}};a.g.W.hasfocus=!0;a.d.hasFocus=a.d.hasfocus;a.g.W.hasFocus=!0;a.d.html={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.Va(b,c())}};H("if");H("ifnot",!1,!0);H("with",!0,!1,function(a,c){return a.createChildContext(c)});var J={};a.d.options={init:function(b){if("select"!==
a.a.B(b))throw Error("options binding applies only to SELECT elements");for(;0<b.length;)b.remove(0);return{controlsDescendantBindings:!0}},update:function(b,c,d){function e(){return a.a.la(b.options,function(a){return a.selected})}function f(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c}function h(c,d){if(r.length){var e=0<=a.a.l(r,a.i.p(d[0]));a.a.Db(d[0],e);m&&!e&&a.k.t(a.a.ha,null,[b,"change"])}}var g=0!=b.length&&b.multiple?b.scrollTop:null,k=a.a.c(c()),l=d.get("optionsIncludeDestroyed");
c={};var n,r;r=b.multiple?a.a.ya(e(),a.i.p):0<=b.selectedIndex?[a.i.p(b.options[b.selectedIndex])]:[];k&&("undefined"==typeof k.length&&(k=[k]),n=a.a.la(k,function(b){return l||b===p||null===b||!a.a.c(b._destroy)}),d.has("optionsCaption")&&(k=a.a.c(d.get("optionsCaption")),null!==k&&k!==p&&n.unshift(J)));var m=!1;c.beforeRemove=function(a){b.removeChild(a)};k=h;d.has("optionsAfterRender")&&(k=function(b,c){h(0,c);a.k.t(d.get("optionsAfterRender"),null,[c[0],b!==J?b:p])});a.a.Ua(b,n,function(c,e,g){g.length&&
(r=g[0].selected?[a.i.p(g[0])]:[],m=!0);e=b.ownerDocument.createElement("option");c===J?(a.a.Xa(e,d.get("optionsCaption")),a.i.X(e,p)):(g=f(c,d.get("optionsValue"),c),a.i.X(e,a.a.c(g)),c=f(c,d.get("optionsText"),g),a.a.Xa(e,c));return[e]},c,k);a.k.t(function(){d.get("valueAllowUnset")&&d.has("value")?a.i.X(b,a.a.c(d.get("value")),!0):(b.multiple?r.length&&e().length<r.length:r.length&&0<=b.selectedIndex?a.i.p(b.options[b.selectedIndex])!==r[0]:r.length||0<=b.selectedIndex)&&a.a.ha(b,"change")});a.a.Tb(b);
g&&20<Math.abs(g-b.scrollTop)&&(b.scrollTop=g)}};a.d.options.Pa=a.a.f.L();a.d.selectedOptions={after:["options","foreach"],init:function(b,c,d){a.a.q(b,"change",function(){var e=c(),f=[];a.a.r(b.getElementsByTagName("option"),function(b){b.selected&&f.push(a.i.p(b))});a.g.va(e,d,"selectedOptions",f)})},update:function(b,c){if("select"!=a.a.B(b))throw Error("values binding applies only to SELECT elements");var d=a.a.c(c());d&&"number"==typeof d.length&&a.a.r(b.getElementsByTagName("option"),function(b){var c=
0<=a.a.l(d,a.i.p(b));a.a.Db(b,c)})}};a.g.W.selectedOptions=!0;a.d.style={update:function(b,c){var d=a.a.c(c()||{});a.a.A(d,function(c,d){d=a.a.c(d);b.style[c]=d||""})}};a.d.submit={init:function(b,c,d,e,f){if("function"!=typeof c())throw Error("The value for a submit binding must be a function");a.a.q(b,"submit",function(a){var d,e=c();try{d=e.call(f.$data,b)}finally{!0!==d&&(a.preventDefault?a.preventDefault():a.returnValue=!1)}})}};a.d.text={init:function(){return{controlsDescendantBindings:!0}},
update:function(b,c){a.a.Xa(b,c())}};a.e.Q.text=!0;a.d.uniqueName={init:function(b,c){if(c()){var d="ko_unique_"+ ++a.d.uniqueName.Ob;a.a.Cb(b,d)}}};a.d.uniqueName.Ob=0;a.d.value={after:["options","foreach"],init:function(b,c,d){function e(){g=!1;var e=c(),f=a.i.p(b);a.g.va(e,d,"value",f)}var f=["change"],h=d.get("valueUpdate"),g=!1;h&&("string"==typeof h&&(h=[h]),a.a.$(f,h),f=a.a.ib(f));!a.a.oa||"input"!=b.tagName.toLowerCase()||"text"!=b.type||"off"==b.autocomplete||b.form&&"off"==b.form.autocomplete||
-1!=a.a.l(f,"propertychange")||(a.a.q(b,"propertychange",function(){g=!0}),a.a.q(b,"focus",function(){g=!1}),a.a.q(b,"blur",function(){g&&e()}));a.a.r(f,function(c){var d=e;a.a.kc(c,"after")&&(d=function(){setTimeout(e,0)},c=c.substring(5));a.a.q(b,c,d)})},update:function(b,c,d){var e=a.a.c(c());c=a.i.p(b);if(e!==c)if("select"===a.a.B(b)){var f=d.get("valueAllowUnset");d=function(){a.i.X(b,e,f)};d();f||e===a.i.p(b)?setTimeout(d,0):a.k.t(a.a.ha,null,[b,"change"])}else a.i.X(b,e)}};a.g.W.value=!0;a.d.visible=
{update:function(b,c){var d=a.a.c(c()),e="none"!=b.style.display;d&&!e?b.style.display="":!d&&e&&(b.style.display="none")}};(function(b){a.d[b]={init:function(c,d,e,f,h){return a.d.event.init.call(this,c,function(){var a={};a[b]=d();return a},e,f,h)}}})("click");a.C=function(){};a.C.prototype.renderTemplateSource=function(){throw Error("Override renderTemplateSource");};a.C.prototype.createJavaScriptEvaluatorBlock=function(){throw Error("Override createJavaScriptEvaluatorBlock");};a.C.prototype.makeTemplateSource=
function(b,c){if("string"==typeof b){c=c||w;var d=c.getElementById(b);if(!d)throw Error("Cannot find template with ID "+b);return new a.n.j(d)}if(1==b.nodeType||8==b.nodeType)return new a.n.Z(b);throw Error("Unknown template type: "+b);};a.C.prototype.renderTemplate=function(a,c,d,e){a=this.makeTemplateSource(a,e);return this.renderTemplateSource(a,c,d)};a.C.prototype.isTemplateRewritten=function(a,c){return!1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,c).data("isRewritten")};a.C.prototype.rewriteTemplate=
function(a,c,d){a=this.makeTemplateSource(a,d);c=c(a.text());a.text(c);a.data("isRewritten",!0)};a.b("templateEngine",a.C);a.Za=function(){function b(b,c,d,g){b=a.g.Ra(b);for(var k=a.g.aa,l=0;l<b.length;l++){var n=b[l].key;if(k.hasOwnProperty(n)){var r=k[n];if("function"===typeof r){if(n=r(b[l].value))throw Error(n);}else if(!r)throw Error("This template engine does not support the '"+n+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+a.g.qa(b,
{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+"')";return g.createJavaScriptEvaluatorBlock(d)+c}var c=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,d=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return{Ub:function(b,c,d){c.isTemplateRewritten(b,d)||c.rewriteTemplate(b,function(b){return a.Za.dc(b,c)},d)},dc:function(a,f){return a.replace(c,function(a,c,d,e,n){return b(n,c,d,f)}).replace(d,function(a,c){return b(c,"\x3c!-- ko --\x3e",
"#comment",f)})},Mb:function(b,c){return a.w.Na(function(d,g){var k=d.nextSibling;k&&k.nodeName.toLowerCase()===c&&a.xa(k,b,g)})}}}();a.b("__tr_ambtns",a.Za.Mb);(function(){a.n={};a.n.j=function(a){this.j=a};a.n.j.prototype.text=function(){var b=a.a.B(this.j),b="script"===b?"text":"textarea"===b?"value":"innerHTML";if(0==arguments.length)return this.j[b];var c=arguments[0];"innerHTML"===b?a.a.Va(this.j,c):this.j[b]=c};var b=a.a.f.L()+"_";a.n.j.prototype.data=function(c){if(1===arguments.length)return a.a.f.get(this.j,
b+c);a.a.f.set(this.j,b+c,arguments[1])};var c=a.a.f.L();a.n.Z=function(a){this.j=a};a.n.Z.prototype=new a.n.j;a.n.Z.prototype.text=function(){if(0==arguments.length){var b=a.a.f.get(this.j,c)||{};b.$a===p&&b.Ba&&(b.$a=b.Ba.innerHTML);return b.$a}a.a.f.set(this.j,c,{$a:arguments[0]})};a.n.j.prototype.nodes=function(){if(0==arguments.length)return(a.a.f.get(this.j,c)||{}).Ba;a.a.f.set(this.j,c,{Ba:arguments[0]})};a.b("templateSources",a.n);a.b("templateSources.domElement",a.n.j);a.b("templateSources.anonymousTemplate",
a.n.Z)})();(function(){function b(b,c,d){var e;for(c=a.e.nextSibling(c);b&&(e=b)!==c;)b=a.e.nextSibling(e),d(e,b)}function c(c,d){if(c.length){var e=c[0],f=c[c.length-1],h=e.parentNode,m=a.J.instance,q=m.preprocessNode;if(q){b(e,f,function(a,b){var c=a.previousSibling,d=q.call(m,a);d&&(a===e&&(e=d[0]||b),a===f&&(f=d[d.length-1]||c))});c.length=0;if(!e)return;e===f?c.push(e):(c.push(e,f),a.a.ea(c,h))}b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.fb(d,b)});b(e,f,function(b){1!==b.nodeType&&8!==
b.nodeType||a.w.Ib(b,[d])});a.a.ea(c,h)}}function d(a){return a.nodeType?a:0<a.length?a[0]:null}function e(b,e,h,n,r){r=r||{};var m=b&&d(b),m=m&&m.ownerDocument,q=r.templateEngine||f;a.Za.Ub(h,q,m);h=q.renderTemplate(h,n,r,m);if("number"!=typeof h.length||0<h.length&&"number"!=typeof h[0].nodeType)throw Error("Template engine must return an array of DOM nodes");m=!1;switch(e){case "replaceChildren":a.e.U(b,h);m=!0;break;case "replaceNode":a.a.Bb(b,h);m=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+
e);}m&&(c(h,n),r.afterRender&&a.k.t(r.afterRender,null,[h,n.$data]));return h}var f;a.Wa=function(b){if(b!=p&&!(b instanceof a.C))throw Error("templateEngine must inherit from ko.templateEngine");f=b};a.Ta=function(b,c,h,n,r){h=h||{};if((h.templateEngine||f)==p)throw Error("Set a template engine before calling renderTemplate");r=r||"replaceChildren";if(n){var m=d(n);return a.h(function(){var f=c&&c instanceof a.I?c:new a.I(a.a.c(c)),p=a.v(b)?b():"function"==typeof b?b(f.$data,f):b,f=e(n,r,p,f,h);
"replaceNode"==r&&(n=f,m=d(n))},null,{Da:function(){return!m||!a.a.Ea(m)},G:m&&"replaceNode"==r?m.parentNode:m})}return a.w.Na(function(d){a.Ta(b,c,h,d,"replaceNode")})};a.jc=function(b,d,f,h,r){function m(a,b){c(b,s);f.afterRender&&f.afterRender(b,a)}function q(a,c){s=r.createChildContext(a,f.as,function(a){a.$index=c});var d="function"==typeof b?b(a,s):b;return e(null,"ignoreTargetNode",d,s,f)}var s;return a.h(function(){var b=a.a.c(d)||[];"undefined"==typeof b.length&&(b=[b]);b=a.a.la(b,function(b){return f.includeDestroyed||
b===p||null===b||!a.a.c(b._destroy)});a.k.t(a.a.Ua,null,[h,b,q,f,m])},null,{G:h})};var h=a.a.f.L();a.d.template={init:function(b,c){var d=a.a.c(c());"string"==typeof d||d.name?a.e.da(b):(d=a.e.childNodes(b),d=a.a.ec(d),(new a.n.Z(b)).nodes(d));return{controlsDescendantBindings:!0}},update:function(b,c,d,e,f){var m=c(),q;c=a.a.c(m);d=!0;e=null;"string"==typeof c?c={}:(m=c.name,"if"in c&&(d=a.a.c(c["if"])),d&&"ifnot"in c&&(d=!a.a.c(c.ifnot)),q=a.a.c(c.data));"foreach"in c?e=a.jc(m||b,d&&c.foreach||
[],c,b,f):d?(f="data"in c?f.createChildContext(q,c.as):f,e=a.Ta(m||b,f,c,b)):a.e.da(b);f=e;(q=a.a.f.get(b,h))&&"function"==typeof q.F&&q.F();a.a.f.set(b,h,f&&f.ga()?f:p)}};a.g.aa.template=function(b){b=a.g.Ra(b);return 1==b.length&&b[0].unknown||a.g.bc(b,"name")?null:"This template engine does not support anonymous templates nested within its templates"};a.e.Q.template=!0})();a.b("setTemplateEngine",a.Wa);a.b("renderTemplate",a.Ta);a.a.nb=function(a,c,d){if(a.length&&c.length){var e,f,h,g,k;for(e=
f=0;(!d||e<d)&&(g=a[f]);++f){for(h=0;k=c[h];++h)if(g.value===k.value){g.moved=k.index;k.moved=g.index;c.splice(h,1);e=h=0;break}e+=h}}};a.a.Aa=function(){function b(b,d,e,f,h){var g=Math.min,k=Math.max,l=[],n,p=b.length,m,q=d.length,s=q-p||1,t=p+q+1,u,w,y;for(n=0;n<=p;n++)for(w=u,l.push(u=[]),y=g(q,n+s),m=k(0,n-1);m<=y;m++)u[m]=m?n?b[n-1]===d[m-1]?w[m-1]:g(w[m]||t,u[m-1]||t)+1:m+1:n+1;g=[];k=[];s=[];n=p;for(m=q;n||m;)q=l[n][m]-1,m&&q===l[n][m-1]?k.push(g[g.length]={status:e,value:d[--m],index:m}):
n&&q===l[n-1][m]?s.push(g[g.length]={status:f,value:b[--n],index:n}):(--m,--n,h.sparse||g.push({status:"retained",value:d[m]}));a.a.nb(k,s,10*p);return g.reverse()}return function(a,d,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};a=a||[];d=d||[];return a.length<=d.length?b(a,d,"added","deleted",e):b(d,a,"deleted","added",e)}}();a.b("utils.compareArrays",a.a.Aa);(function(){function b(b,c,f,h,g){var k=[],l=a.h(function(){var l=c(f,g,a.a.ea(k,b))||[];0<k.length&&(a.a.Bb(k,l),h&&a.k.t(h,null,[f,
l,g]));k.length=0;a.a.$(k,l)},null,{G:b,Da:function(){return!a.a.eb(k)}});return{S:k,h:l.ga()?l:p}}var c=a.a.f.L();a.a.Ua=function(d,e,f,h,g){function k(b,c){v=r[c];u!==c&&(z[b]=v);v.Ia(u++);a.a.ea(v.S,d);s.push(v);y.push(v)}function l(b,c){if(b)for(var d=0,e=c.length;d<e;d++)c[d]&&a.a.r(c[d].S,function(a){b(a,d,c[d].ka)})}e=e||[];h=h||{};var n=a.a.f.get(d,c)===p,r=a.a.f.get(d,c)||[],m=a.a.ya(r,function(a){return a.ka}),q=a.a.Aa(m,e,h.dontLimitMoves),s=[],t=0,u=0,w=[],y=[];e=[];for(var z=[],m=[],
v,x=0,A,C;A=q[x];x++)switch(C=A.moved,A.status){case "deleted":C===p&&(v=r[t],v.h&&v.h.F(),w.push.apply(w,a.a.ea(v.S,d)),h.beforeRemove&&(e[x]=v,y.push(v)));t++;break;case "retained":k(x,t++);break;case "added":C!==p?k(x,C):(v={ka:A.value,Ia:a.m(u++)},s.push(v),y.push(v),n||(m[x]=v))}l(h.beforeMove,z);a.a.r(w,h.beforeRemove?a.M:a.removeNode);for(var x=0,n=a.e.firstChild(d),E;v=y[x];x++){v.S||a.a.extend(v,b(d,f,v.ka,g,v.Ia));for(t=0;q=v.S[t];n=q.nextSibling,E=q,t++)q!==n&&a.e.rb(d,q,E);!v.Zb&&g&&(g(v.ka,
v.S,v.Ia),v.Zb=!0)}l(h.beforeRemove,e);l(h.afterMove,z);l(h.afterAdd,m);a.a.f.set(d,c,s)}})();a.b("utils.setDomNodeChildrenFromArrayMapping",a.a.Ua);a.K=function(){this.allowTemplateRewriting=!1};a.K.prototype=new a.C;a.K.prototype.renderTemplateSource=function(b){var c=(9>a.a.oa?0:b.nodes)?b.nodes():null;if(c)return a.a.R(c.cloneNode(!0).childNodes);b=b.text();return a.a.Qa(b)};a.K.Ja=new a.K;a.Wa(a.K.Ja);a.b("nativeTemplateEngine",a.K);(function(){a.La=function(){var a=this.ac=function(){if(!t||
!t.tmpl)return 0;try{if(0<=t.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,e,f){f=f||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var h=b.data("precompiled");h||(h=b.text()||"",h=t.template(null,"{{ko_with $item.koBindingContext}}"+h+"{{/ko_with}}"),b.data("precompiled",h));b=[e.$data];e=t.extend({koBindingContext:e},f.templateOptions);e=t.tmpl(h,b,e);e.appendTo(w.createElement("div"));
t.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){w.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(t.tmpl.tag.ko_code={open:"__.push($1 || '');"},t.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};a.La.prototype=new a.C;var b=new a.La;0<b.ac&&a.Wa(b);a.b("jqueryTmplTemplateEngine",a.La)})()})})();})();
;
/*! 
* DevExpress PhoneJS
* Version: 13.2.9
* Build date: Apr 15, 2014
*
* Copyright (c) 2012 - 2014 Developer Express Inc. ALL RIGHTS RESERVED
* EULA: http://phonejs.devexpress.com/EULA
*/
"use strict";window.DevExpress||(function(n,t,i){function u(t){function f(){while(r.length){u=!0;var e=r.shift(),t=e();if(t!==i&&t.then){n.when(t).always(f);return}}u=!1}function e(n,i){t?(r[0]&&i&&i(r[0]),r=[n]):r.push(n),u||f()}function o(){return u}var r=[],u=!1;return{add:e,busy:o}}var r,f;(function(n){if(n=n.split("."),n[0]<1||n[0]===1&&n[1]<10)throw Error("Your version of jQuery is too old. Please upgrade jQuery to 1.10.0 or later.");})(n.fn.jquery),r=function(){var i=function(n,t,i){return function(){var r=this.callBase;this.callBase=n[t];try{return i.apply(this,arguments)}finally{this.callBase=r}}},r=function(n){var t=function(){};return t.prototype=n.prototype,new t},t=function(){},u=function(t){var r=this,u;return t?(u=n.map(t,function(n,t){return t}),n.each(["toString","toLocaleString","valueOf"],function(){t[this]&&u.push(this)}),n.each(u,function(){var u=n.isFunction(r.prototype[this])&&n.isFunction(t[this]);r.prototype[this]=u?i(r.parent.prototype,this,t[this]):t[this]}),r):r},f=function(){var t=this;return n.each(arguments,function(){this.ctor&&t._includedCtors.push(this.ctor);for(var n in this)if(n!=="ctor"){if(n in t.prototype)throw Error("Member name collision: "+n);t.prototype[n]=this[n]}}),t},e=function(n){return this.parent===n?!0:!this.parent||!this.parent.subclassOf?!1:this.parent.subclassOf(n)};return t.inherit=function(t){var i=function(){if(!this||this.constructor!==i)throw Error("A class must be instantiated using the 'new' keyword");var t=this,r=t.ctor;r&&r.apply(t,arguments),n.each(t.constructor._includedCtors,function(){this.call(t)})};return i.prototype=r(this),i.inherit=this.inherit,i.redefine=u,i.include=f,i.subclassOf=e,i.parent=this,i._includedCtors=this._includedCtors?this._includedCtors.slice(0):[],i.prototype.constructor=i,i.redefine(t),i},t}(),f=function(){var t=document.createElement("a"),i=["protocol","hostname","port","pathname","search","hash"],r=function(n){return n.charAt(0)!=="/"&&(n="/"+n),n};return function(u){t.href=u;var f={};return n.each(i,function(){f[this]=t[this]}),f.pathname=r(f.pathname),f}}(),t.DevExpress=t.DevExpress||{};var e=function(t){var i=n.Deferred();return setTimeout(function(){i.resolve(t())},60),i},o=function(){var t=[];return{add:function(i){var r=n.inArray(i,t);r===-1&&t.push(i)},remove:function(i){var r=n.inArray(i,t);r!==-1&&t.splice(r,1)},fire:function(){var n=t.pop(),i=!!n;return i&&n(),i},hasCallback:function(){return t.length>0}}}(),s=function(){var n="body";return function(t){return arguments.length&&(n=t),n}}();n.extend(t.DevExpress,{abstract:function(){throw Error("Not implemented");},Class:r,createQueue:u,enqueue:u().add,enqueueAsync:e,parseUrl:f,backButtonCallback:o,hardwareBackButton:n.Callbacks(),overlayTargetContainer:s})}(jQuery,this),function(n,t,i){var e=function(n){return n===i||n===null?"":String(n)},r=function(n){return e(n).charAt(0).toUpperCase()+n.substr(1)},u=function(n){return e(n).replace(/([a-z\d])([A-Z])/g,"$1 $2").split(/[\s_-]+/)},f=function(t){return n.map(u(t),function(n){return n.toLowerCase()}).join("-")},o=function(n){return f(n).replace(/-/g,"_")},s=function(t,i){return n.map(u(t),function(n,t){return n=n.toLowerCase(),(i||t>0)&&(n=r(n)),n}).join("")},h=function(n){return r(f(n).replace(/-/g," "))},c=function(t){return n.map(u(t),function(n){return r(n.toLowerCase())}).join(" ")};t.inflector={dasherize:f,camelize:s,humanize:h,titleize:c,underscore:o}}(jQuery,DevExpress),function(n,t,i){var h={iPhone:"iPhone",iPhone5:"iPhone 5",iPad:"iPad",iPadMini:"iPad Mini",androidPhone:"Android Mobile",androidTablet:"Android",win8:"MSAppHost",win8Phone:"Windows Phone 8",msSurface:"MSIE ARM Tablet PC",desktop:"desktop",tizen:"Tizen Mobile"},c={ios:[5,6,7],android:[2,3,4],win8:[8],tizen:[2],desktop:[],generic:[]},u,l=function(n){if(n)u=e(n);else{if(!u){n=i;try{n=y()}catch(t){n=s()}finally{n||(n=s())}u=e(n)}return u}},e=function(t){if(t==="genericPhone")return{deviceType:"phone",platform:"generic",generic:!0};if(n.isPlainObject(t))return r(t);var i;if(t){if(i=h[t],!i)throw Error("Unknown device");}else i=navigator.userAgent;return a(i)},r=function(t){var i={phone:t.deviceType==="phone",tablet:t.deviceType==="tablet",android:t.platform==="android",ios:t.platform==="ios",win8:t.platform==="win8",tizen:t.platform==="tizen",generic:t.platform==="generic"};return n.extend({},o,u,i,t)},a=function(n){return f.ios(n)||f.android(n)||f.win8(n)||f.tizen(n)||f.desktop(n)||v},o={deviceType:"",platform:"",version:[],phone:!1,tablet:!1,android:!1,ios:!1,win8:!1,tizen:!1,generic:!1},v=n.extend(o,{platform:"generic",deviceType:"desktop",generic:!0}),f={ios:function(n){if(/ip(hone|od|ad)/i.test(n)){var i=/ip(hone|od)/i.test(n),t=n.match(/os (\d+)_(\d+)_?(\d+)?/i),u=t?[parseInt(t[1],10),parseInt(t[2],10),parseInt(t[3]||0,10)]:[];return r({deviceType:i?"phone":"tablet",platform:"ios",version:u})}},android:function(n){if(/android|htc_|silk/i.test(n)){var i=/mobile/i.test(n),t=n.match(/android (\d+)\.(\d+)\.?(\d+)?/i),u=t?[parseInt(t[1],10),parseInt(t[2],10),parseInt(t[3]||0,10)]:[];return r({deviceType:i?"phone":"tablet",platform:"android",version:u})}},win8:function(n){var t=/windows phone/i.test(n),u=!t&&/arm(.*)trident/i.test(n),e=!t&&!u&&/msapphost/i.test(n),i,f;if(t||u||e)return i=n.match(/windows phone (\d+).(\d+)/i)||n.match(/windows nt (\d+).(\d+)/i),f=i?[parseInt(i[1],10),parseInt(i[2],10)]:[],r({deviceType:t?"phone":u?"tablet":"desktop",platform:"win8",version:f})},tizen:function(n){if(/tizen/i.test(n)){var i=/mobile/i.test(n),t=n.match(/tizen (\d+)\.(\d+)/i),u=t?[parseInt(t[1],10),parseInt(t[2],10)]:[];return r({deviceType:i?"phone":"tablet",platform:"tizen",version:u})}},desktop:function(n){if(/desktop/i.test(n))return r({deviceType:"desktop",platform:"desktop"})}},y=function(){var n;return(window.top["dx-force-device-object"]||window.top["dx-force-device"])&&(n=window.top["dx-force-device-object"]||window.top["dx-force-device"]),n},s=function(){return window.sessionStorage&&(sessionStorage.getItem("dx-force-device")||sessionStorage.getItem("dx-simulator-device"))},p=function(t){var i=c[t.platform],r=t.version&&t.version[0],u=i[i.length-1],f,e;return r?(f=n.inArray(parseInt(r,10),i)!==-1,e=f?r:u," dx-version-major-"+e):u?" dx-version-major-"+u:""},w=e();t.devices={attachCss:function(t,i){var f=n(t),r,u;i=i||this.current(),r=this.real(),u=i.deviceType?" dx-device-"+i.deviceType:"",f.addClass("dx-device-"+r.platform).addClass("dx-theme-"+i.platform).addClass("dx-theme-"+i.platform+"-typography").addClass(u).addClass(p(i))},current:l,real:function(){return n.extend({},w)},isRippleEmulator:function(){return!!window.tinyHippos},isSimulator:function(){try{return window.top!==window.self&&window.top["dx-force-device"]}catch(n){return!1}}}}(jQuery,DevExpress),function(n,t){var f=/(webkit)[ \/]([\w.]+)/,e=/(opera)(?:.*version)?[ \/]([\w.]+)/,o=/(msie) ([\w.]+)/,s=/(mozilla)(?:.*? rv:([\w.]+))?/,u=navigator.userAgent.toLowerCase(),h=function(){var n={},t=f.exec(u)||e.exec(u)||o.exec(u)||u.indexOf("compatible")<0&&s.exec(u)||[],i=t[1],r=t[2];return i&&(n[i]=!0,n.version=r),n}();t.browser=h}(jQuery,DevExpress,this),function(n,t,i){var f=["","Webkit","Moz","O","ms"],e=document.createElement("dx").style,o={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MsTransitionEnd",transition:"transitionend"},u=function(n){var i,u,r;for(n=t.inflector.camelize(n,!0),i=0,u=f.length;i<u;i++)if(r=f[i]+n,r in e)return r},r=function(n){return!!u(n)},s=(t.devices.real().deviceType==="desktop"||t.devices.isSimulator())&&t.browser.msie;t.support={touch:"ontouchstart"in i,pointer:i.navigator.pointerEnabled,transform3d:!s&&r("perspective"),transition:r("transition"),transitionEndEventName:o[u("transition")],animation:r("animation"),winJS:"WinJS"in i,styleProp:u,supportProp:r,hasKo:!!i.ko,hasNg:!i.ko&&!!i.angular,inputType:function(n){if(n==="text")return!0;var t=document.createElement("input");try{return t.setAttribute("type",n),t.value="wrongValue",!t.value}catch(i){return!1}}}}(jQuery,DevExpress,this),function(n,t,i){var v=/left|right/,y=/top|bottom/,s=/fit|flip|none/,f=function(n){switch(typeof n){case"string":return n.split(/\s+/,2);case"object":return[n.x||n.h,n.y||n.v];case"number":return[n];default:return n}},h=function(t){var i={h:"center",v:"center"},r=f(t);return r&&n.each(r,function(){var n=String(this).toLowerCase();v.test(n)?i.h=n:y.test(n)&&(i.v=n)}),i},p=function(n){var t=f(n),i=parseInt(t&&t[0],10),r=parseInt(t&&t[1],10);return isFinite(i)||(i=0),isFinite(r)||(r=i),{h:i,v:r}},w=function(n){var t=f(n),i=String(t&&t[0]).toLowerCase(),r=String(t&&t[1]).toLowerCase();return s.test(i)||(i="none"),s.test(r)||(r=i),{h:i,v:r}},c=function(n){switch(n){case"center":return.5;case"right":case"bottom":return 1;default:return 0}},e=function(n){switch(n){case"left":return"right";case"right":return"left";case"top":return"bottom";case"bottom":return"top";default:return n}},o=function(n){n.myLocation=n.atLocation+c(n.atAlign)*n.atSize-c(n.myAlign)*n.mySize+n.offset},r={fit:function(n,t){var i=!1;return n.myLocation>t.max&&(n.myLocation=t.max,i=!0),n.myLocation<t.min&&(n.myLocation=t.min,i=!0),i},flip:function(t,i){if(t.myAlign==="center"&&t.atAlign==="center")return!1;if(t.myLocation<i.min||t.myLocation>i.max){var r=n.extend({},t,{myAlign:e(t.myAlign),atAlign:e(t.atAlign),offset:-t.offset});if(o(r),r.myLocation>=i.min&&r.myLocation<=i.max||r.myLocation>t.myLocation)return t.myLocation=r.myLocation,!0}return!1}},u,b={h:{location:0,flip:!1,fit:!1},v:{location:0,flip:!1,fit:!1}},l=function(f,e){var y=n(f),g=y.offset(),v=n.extend(!0,{},b,{h:{location:g.left},v:{location:g.top}}),k,d;if(!e)return v;var nt=h(e.my),tt=h(e.at),s=e.of||window,it=p(e.offset),rt=w(e.collision),c={mySize:y.outerWidth(),myAlign:nt.h,atAlign:tt.h,offset:it.h,collision:rt.h},l={mySize:y.outerHeight(),myAlign:nt.v,atAlign:tt.v,offset:it.v,collision:rt.v};return s.preventDefault?(c.atLocation=s.pageX,l.atLocation=s.pageY,c.atSize=0,l.atSize=0):(s=n(s),n.isWindow(s[0])?(c.atLocation=s.scrollLeft(),l.atLocation=s.scrollTop(),c.atSize=s.width(),l.atSize=s.height()):s[0].nodeType===9?(c.atLocation=0,l.atLocation=0,c.atSize=s.width(),l.atSize=s.height()):(k=s.offset(),c.atLocation=k.left,l.atLocation=k.top,c.atSize=s.outerWidth(),l.atSize=s.outerHeight())),o(c),o(l),d=function(){var r=n(window),f=r.width(),e=r.height(),o=r.scrollLeft(),s=r.scrollTop(),h=document.width>document.documentElement.clientWidth,v=document.height>document.documentElement.clientHeight,y=t.support.touch?document.documentElement.clientWidth/(v?f-u:f):1,p=t.support.touch?document.documentElement.clientHeight/(h?e-u:e):1;return u===i&&(u=a()),{h:{min:o,max:o+r.width()/y-c.mySize},v:{min:s,max:s+r.height()/p-l.mySize}}}(),r[c.collision]&&(v.h[c.collision]=r[c.collision](c,d.h)),r[l.collision]&&(v.v[l.collision]=r[l.collision](l,d.v)),n.extend(!0,v,{h:{location:Math.round(c.myLocation)},v:{location:Math.round(l.myLocation)}}),v},k=function(t,i){var u=n(t),r;return i?(r=i.h&&i.v?i:l(u,i),u.offset({left:r.h.location,top:r.v.location}),r):u.offset()},a;n.extend(t,{calculatePosition:l,position:k,inverseAlign:e}),a=function(){var t=n("<div>").css({width:100,height:100,overflow:"scroll",position:"absolute",top:-9999}).appendTo(n("body")),i=t.get(0).offsetWidth-t.get(0).clientWidth;return t.remove(),i}}(jQuery,DevExpress),function(n,t){var r={},u=function(t,i){if(n.isPlainObject(t)){n.each(t,u);return}r[t]=i},e=function(){var i=n.makeArray(arguments);n.each(i,function(){delete r[this]})},f;u({func:{execute:function(t){n.isFunction(t.action)&&(t.result=t.action.apply(t.context,t.args),t.handled=!0)}},url:{execute:function(n){typeof n.action=="string"&&n.action.charAt(0)!=="#"&&(document.location=n.action)}},hash:{execute:function(n){typeof n.action=="string"&&n.action.charAt(0)==="#"&&(document.location.hash=n.action)}}}),f=t.Class.inherit({ctor:function(t,i){i=i||{},this._action=t||n.noop,this._context=i.context||window,this._beforeExecute=i.beforeExecute||n.noop,this._afterExecute=i.afterExecute||n.noop,this._component=i.component,this._excludeValidators=i.excludeValidators},execute:function(){var n={action:this._action,args:Array.prototype.slice.call(arguments),context:this._context,component:this._component,canceled:!1,handled:!1},t;if(this._validateAction(n))return(this._beforeExecute.call(this._context,n),n.canceled)?void 0:(t=this._executeAction(n),this._afterExecute.call(this._context,n),t)},_validateAction:function(t){var i=this._excludeValidators;return n.each(r,function(r,u){if(!i||!(n.inArray(r,i)>-1))return u.validate&&u.validate(t),t.canceled?!1:void 0}),!t.canceled},_executeAction:function(t){var i;return n.each(r,function(n,r){return r.execute&&r.execute(t),t.handled?(i=t.result,!1):void 0}),i}}),n.extend(t,{registerActionExecutor:u,unregisterActionExecutor:e,Action:f})}(jQuery,DevExpress),function(n,t,i){function cr(t,i){return(t.textContent||t.innerText||n(t).text()||"").toLowerCase().indexOf((i||"").toLowerCase())>-1}function rt(t,r){var e,u,f;for(f in r)(e=t[f],u=r[f],t!==u)&&(n.isPlainObject(u)?t[f]=rt(n.isPlainObject(e)?e:{},u):u!==i&&(t[f]=u));return t}var et=Math.PI,ot=Math.LN10,st=Math.cos,ht=Math.sin,l=Math.abs,ct=Math.log,lt=Math.floor,at=Math.ceil,vt=Math.max,lr=Math.min,a=window.isNaN,b=window.Number,v=window.NaN,f=["millisecond","second","minute","hour","day","week","month","quarter","year"],yt=function(n){return n!==null&&n!==i},o=function(t){return n.type(t)==="string"},s=function(t){return n.isNumeric(t)},y=function(t){return n.type(t)==="object"},pt=function(t){return n.type(t)==="array"},k=function(t){return n.type(t)==="date"},wt=function(t){return n.type(t)==="function"},r=function(n){switch(n){case"millisecond":return 1;case"second":return r("millisecond")*1e3;case"minute":return r("second")*60;case"hour":return r("minute")*60;case"day":return r("hour")*24;case"week":return r("day")*7;case"month":return r("day")*30;case"quarter":return r("month")*3;case"year":return r("day")*365;default:return 0}},h=function(n,t){return r(n)*t},bt=function(n){for(var t,i,f=["millisecond","second","minute","hour","day","month","year"],e={},u=f.length-1;u>=0;u--)i=f[u],t=Math.floor(n/r(i)),t>0&&(e[i+"s"]=t,n-=h(i,t));return e},kt=function(t){var i=0;return y(t)&&n.each(t,function(n,t){i+=h(n.substr(0,n.length-1),t)}),o(t)&&(i=h(t,1)),i},dt=function(n){return n.toExponential().split("e")[1]},gt=function(t,i){var r,u=0;return r={year:t.getFullYear()!==i.getFullYear(),month:t.getMonth()!==i.getMonth(),day:t.getDate()!==i.getDate(),hour:t.getHours()!==i.getHours(),minute:t.getMinutes()!==i.getMinutes(),second:t.getSeconds()!==i.getSeconds()},n.each(r,function(n,t){t&&u++}),r.count=u,r},ni=function(n,t){return n&&t&&n.getFullYear()===t.getFullYear()&&n.getMonth()===t.getMonth()},ti=function(n){return new Date(n.getFullYear(),n.getMonth(),1)},p=function(n){var t,i;return s(n)&&(t=n.toString(),i=t.indexOf("."),i>=0)?c(n)?t.substr(i+1,t.indexOf("e")-i-1):(t=n.toFixed(20),t.substr(i+1,t.length-i+1)):""},ii=function(n){var i=p(n),t;if(i)for(t=0;t<i.length;t++)if(i.charAt(t)!=="0")return t+1;return 0},u=function(n,t,i){return n+(i?-1:1)*t},c=function(n){return s(n)&&n.toString().indexOf("e")!==-1},ri=function(n,t,i){var r=null,f;return k(n)?(f=o(t)?tt(t.toLowerCase()):t,r=new Date(n.getTime()),f.years&&r.setFullYear(u(r.getFullYear(),f.years,i)),f.quarters&&r.setMonth(u(r.getMonth(),3*f.quarters,i)),f.months&&r.setMonth(u(r.getMonth(),f.months,i)),f.weeks&&r.setDate(u(r.getDate(),7*f.weeks,i)),f.days&&r.setDate(u(r.getDate(),f.days,i)),f.hours&&r.setHours(u(r.getHours(),f.hours,i)),f.minutes&&r.setMinutes(u(r.getMinutes(),f.minutes,i)),f.seconds&&r.setSeconds(u(r.getSeconds(),f.seconds,i)),f.milliseconds&&r.setMilliseconds(u(n.getMilliseconds(),f.milliseconds,i))):r=u(n,t,i),r},g=function(t){var r=-1,i;return o(t)?t:y(t)?(n.each(t,function(n,t){for(i=0;i<f.length;i++)t&&(n===f[i]+"s"||n===f[i])&&r<i&&(r=i)}),f[r]):""},ui=function(n,i){var r,u,f=g(i);switch(f){case"second":n.setMilliseconds(0);break;case"minute":n.setSeconds(0,0);break;case"hour":n.setMinutes(0,0,0);break;case"year":n.setMonth(0);case"month":n.setDate(1);case"day":n.setHours(0,0,0,0);break;case"week":r=n.getDate(),n.getDay()!==0&&(r+=7-n.getDay()),n.setDate(r),n.setHours(0,0,0,0);break;case"quarter":u=t.formatHelper.getFirstQuarterMonth(n.getMonth()),n.getMonth()!==u&&n.setMonth(u),n.setDate(1),n.setHours(0,0,0,0)}},w=function(n,t){return t>20&&(t=20),s(n)?c(n)?b(n.toExponential(t)):b(n.toFixed(t)):void 0},nt=function(n){var r,u=n.toString(),f=u.indexOf("."),t,i;return c(n)?(i=e(n),i<0?Math.abs(i):0):f!==-1?(t=f+1,r=u.substring(t,t+20),r.length):0},fi=function(n,t,i){var r=nt(n),u=nt(t);return w(i,r<u?u:r)},ei=function(n){var i=p(n),r,t;if(i)for(t=1;t<=i.length;t++)if(r=w(n,t),r!==0&&i[t-2]&&i[t-1]&&i[t-2]===i[t-1])return r;return n},tt=function(n){var t={};switch(n){case"year":t.years=1;break;case"month":t.months=1;break;case"quarter":t.months=3;break;case"week":t.days=7;break;case"day":t.days=1;break;case"hour":t.hours=1;break;case"minute":t.minutes=1;break;case"second":t.seconds=1;break;case"millisecond":t.milliseconds=1}return t},oi=function(n){return(n%360+360)%360},si=function(n){return 90-n},it=function(n){return et*n/180},hi=function(n){var t=it(n);return{cos:st(t),sin:ht(t)}},ci=1e-14,e=function(n){var t=l(n),i;return a(t)?v:t>0?(t=ct(t)/ot,i=at(t),i-t<ci?i:lt(t)):0},li=function(n,t,i){var u=vt(e(n),e(t)),r=-e(l(t-n)/i),f;return!a(u)&&!a(r)?(l(u)<=4?(f="fixedPoint",r<0&&(r=0),r>4&&(r=4)):(f="exponential",r+=u-1,r>3&&(r=3)),{format:f,precision:r}):null},ai=function(n,t,i,r){var s=Math.floor,e,o,u,f;if(e=s(n.x+n.width/2),o=s(t.x+t.width/2),n.y+n.height<t.y)u=i||n.y+n.height,f=t.y;else if(n.y>t.y+t.height)u=i||n.y,f=t.y+t.height;else if(n.x>t.x+t.width||n.x+n.width<t.x)n.y-t.y<t.y+t.height-(n.y+n.height)?(u=i||n.y,f=t.y):(u=i||n.y+n.height,f=t.y+t.height);else return;return r?[u,e,f,o]:[e,u,o,f]},vi=function(t){var i=n(window),r,u=function(){var n=i.width(),u=i.height();clearTimeout(r),r=setTimeout(function(){i.width()===n&&i.height()===u&&t()},100)};return u.stop=function(){return clearTimeout(r),this},u},yi=function(){function i(i){t&&n.isFunction(t.info)&&t.info(i)}function r(i){t&&n.isFunction(t.warn)&&t.warn(i)}function u(i){t&&n.isFunction(t.error)&&t.error(i)}var t=window.console;return{info:i,warn:r,error:u}}(),pi=function(){function n(n,t){if(!n)throw new Error(t);}function t(t,r){n(t!==null&&t!==i,r)}return{assert:n,assertParam:t}}(),wi=function(){var u,t=n.Callbacks(),i=n(window),r=!1,o=t.add,s=t.remove,f=function(){return[i.width(),i.height()].join()},e=function(){var n=f();n!==u&&(u=n,t.fire())};return u=f(),t.add=function(){var n=o.apply(t,arguments);if(!r&&t.has()){i.on("resize",e);r=!0}return n},t.remove=function(){var n=s.apply(t,arguments);return!t.has()&&r&&(i.off("resize",e),r=!1),n},t}(),bi=function(){var u=t.devices.real(),f=u.platform==="android"&&/^4\.0(\.\d)?/.test(u.version.join("."))&&navigator.userAgent.indexOf("Chrome")===-1,i=document.activeElement,r;f&&(r=n("<input>").addClass("dx-hidden-input").appendTo("body"),setTimeout(function(){r.focus(),setTimeout(function(){r.hide(),r.remove()},100)},100)),i&&i!==document.body&&i.blur&&i.blur()},ki=function(t){var i=n("<div />");return window.WinJS?WinJS.Utilities.setInnerHTMLUnsafe(i.get(0),t):i.append(t),i.contents()},di=function(){var n=1;return function(){return"DevExpress_"+n++}}(),gi=function(){var n=1;return function(){return"DevExpressPattern_"+n++}}(),nr=function(n,t,i){var r,u;n=n||{};for(r in t)t.hasOwnProperty(r)&&(u=t[r],r in n&&!i||(n[r]=u));return n},tr=function(){function n(){}return function(t){return n.prototype=t,new n}}(),ir=function(t,i){var r=n.Deferred(),u=i||this;return setTimeout(function(){var i=t.call(u);i&&i.done&&n.isFunction(i.done)?i.done(function(){r.resolveWith(u)}):r.resolveWith(u)},0),r.promise()},rr=function(n,t){return Math.log(n)/Math.log(t)},ur=function(n,t){return Math.pow(t,n)},fr=function(){for(var t=arguments[0],i,n=0;n<arguments.length-1;n++)i=new RegExp("\\{"+n+"\\}","gm"),t=t.replace(i,arguments[n+1]);return t},er=function(t){var i,r={left:{},top:{}},f=t.getRoot(),u;return f&&(i=f.element,i.getScreenCTM?(u=i.getScreenCTM(),u?(r.left=i.createSVGPoint().matrixTransform(u).x+(document.body.scrollLeft||document.documentElement.scrollLeft),r.top=i.createSVGPoint().matrixTransform(u).y+(document.body.scrollTop||document.documentElement.scrollTop)):(r.left=document.body.scrollLeft||document.documentElement.scrollLeft,r.top=document.body.scrollTop||document.documentElement.scrollTop)):(r.left=n(i).offset().left,r.top=n(i).offset().top)),r},or=function(t,r,u){var f=[],e=0;return n.each(r,function(r,o){var s=0,h=u?u(o):o;n.each(h,function(n){var r=t[n];if(r!==h[n]&&r!==i)return s=0,!1;s++}),s===e&&s>0?f.push(o):s>e&&(f.length=0,f.push(o),e=s)}),f},sr=function(n){return(n+"").replace(/([\+\*\?\\\.\[\^\]\$\(\)\{\}\>\<\|\=\!\:])/g,"\\$1")},hr=function(n,t,i){return n.replace(new RegExp("("+sr(t)+")","gi"),i)},ut,ft;n.expr[":"].dxicontains=n.expr.createPseudo(function(n){return function(t){return cr(t,n)}}),ut=function(){function t(n){return n<10?"0"+n:n}return d.getUTCFullYear()+"-"+t(d.getUTCMonth()+1)+"-"+t(d.getUTCDate())+"T"+t(d.getUTCHours())+":"+t(d.getUTCMinutes())+":"+t(d.getUTCSeconds())+"Z"},ft=function(){var t=Date.parse("2011-04-26T13:16:50Z");return t===130382381e4?function(n){return new Date(Date.parse(n))}:function(t){var i,u,f=/^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,r=f.exec(t)||[];return r[1]?(i=n.map(r[1].split(/\D/),function(n){return parseInt(n,10)||0}),i[1]-=1,i=new Date(Date.UTC.apply(Date,i)),!i.getDate())?v:(r[5]&&(u=parseInt(r[5],10)*60,r[6]&&(u+=parseInt(r[6],10)),r[4]=="+"&&(u*=-1),u&&i.setUTCMinutes(i.getUTCMinutes()+u)),i):v}}(),t.utils={dateUnitIntervals:f,dateToIso8601String:ut,dateFromIso8601String:ft,isDefined:yt,isString:o,isNumber:s,isObject:y,isArray:pt,isDate:k,isFunction:wt,getLog:rr,raiseTo:ur,normalizeAngle:oi,convertAngleToRendererSpace:si,degreesToRadians:it,getCosAndSin:hi,getDecimalOrder:e,getAppropriateFormat:li,getFraction:p,adjustValue:ei,convertMillisecondsToDateUnits:bt,convertDateTickIntervalToMilliseconds:kt,convertDateUnitToMilliseconds:h,getDateUnitInterval:g,getDatesDifferences:gt,correctDateWithUnitBeginning:ui,roundValue:w,isExponential:c,applyPrecisionByMinDelta:fi,getSignificantDigitPosition:ii,addInterval:ri,getDateIntervalByString:tt,sameMonthAndYear:ni,getFirstMonthDate:ti,getPower:dt,logger:yi,debug:pi,getLabelConnectorCoord:ai,createResizeHandler:vi,windowResizeCallbacks:wi,resetActiveElement:bi,createMarkupFromString:ki,getNextClipId:di,getNextPatternId:gi,extendFromObject:nr,clone:tr,executeAsync:ir,stringFormat:fr,getRootOffset:er,findBestMatches:or,replaceAll:hr,deepExtendArraySafe:rt}}(jQuery,DevExpress),function(n,t,i){var e=t.support,r="dxTranslator",o=/matrix(3d)?\((.+?)\)/,s=/translate(?:3d)?\((.+?)\)/,h=function(n){var t,i,r;return e.transform3d?(r=u(n),t={left:r.x,top:r.y}):(i=n.position(),t={left:i.left,top:i.top}),t},c=function(n,t){if(!e.transform3d){n.css(t);return}var r=u(n),o=t.left,s=t.top;o!==i&&(r.x=o||0),s!==i&&(r.y=s||0),n.css({transform:f(r),transformOrigin:"0% 0%"})},u=function(n){var i=n.data(r);if(!i){var u=n.css("transform")||f({x:0,y:0}),t=u.match(o),e=t&&t[1];t?(t=t[2].split(","),e==="3d"?t=t.slice(12,15):(t.push(0),t=t.slice(4,7))):t=[0,0,0],i={x:parseFloat(t[0]),y:parseFloat(t[1]),z:parseFloat(t[2])},l(n,i)}return i},l=function(n,t){n.data(r,t)},a=function(n){n.removeData(r)},v=function(n){var t=n.match(s);if(t&&t[1])return t=t[1].split(","),t={x:parseFloat(t[0]),y:parseFloat(t[1]),z:parseFloat(t[2])}},f=function(n){return"translate("+(n.x||0)+"px, "+(n.y||0)+"px)"};t.translator={move:c,locate:h,clearCache:a,parseTranslate:v,getTranslate:u,getTranslateCss:f}}(jQuery,DevExpress),function(n,t){var s=1e3/60,r=function(n){return this.setTimeout(n,s)},u=function(n){return this.clearTimeout(n)},f=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame,o=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame,e;f&&o&&(r=f,u=o),f&&!o&&(e={},r=function(n){var t=f.call(window,function(){try{if(t in e)return;n.apply(this,arguments)}finally{delete e[t]}});return t},u=function(n){e[n]=!0}),r=n.proxy(r,window),u=n.proxy(u,window),n.extend(t,{requestAnimationFrame:r,cancelAnimationFrame:u})}(jQuery,DevExpress),function(n,t){t.Animator=t.Class.inherit({ctor:function(){this._finished=!0,this._stopped=!1},start:function(){this._stopped=!1,this._finished=!1,this._stepCore()},stop:function(){this._stopped=!0},_stepCore:function(){if(this._isStopped()){this._stop();return}if(this._isFinished()){this._finished=!0,this._complete();return}this._step(),t.requestAnimationFrame.call(window,n.proxy(this._stepCore,this))},_step:t.abstract,_isFinished:n.noop,_stop:n.noop,_complete:n.noop,_isStopped:function(){return this._stopped},inProgress:function(){return!(this._stopped||this._finished)}})}(jQuery,DevExpress),function(n,t,i){var f=t.translator,e=t.support,s=e.transitionEndEventName+".dxFX",w=/cubic-bezier\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/,b=/^([+-])=(.*)/i,o="dxSimulatedTransitionTimeoutKey",u="dxAnimData",r="transform",k={animate:function(t,i){var h=n.now()+i.delay,r=n.Deferred(),u=n.Deferred(),f=n.Deferred();t.one(s,function(t){(t.forceEnd||n.now()-h>=i.duration)&&u.reject()});return t.data(o,setTimeout(function(){f.reject()},i.duration+i.delay)),n.when(u,f).fail(n.proxy(function(){this._cleanup(t),r.resolveWith(t,[i,t])},this)),t.css("transform"),t.css({transitionProperty:"all",transitionDelay:i.delay+"ms",transitionDuration:i.duration+"ms",transitionTimingFunction:i.easing}),y(t,i.to),i.duration||t.trigger({type:e.transitionEndEventName,forceEnd:!0}),r.promise()},_cleanup:function(n){n.css("transition","none").off(s);var t=n.data(o);clearTimeout(t),n.removeData(o)},stop:function(t,i){var r=t.data(u);r&&(i?t.trigger({type:e.transitionEndEventName,forceEnd:!0}):(n.each(r.to,function(n){t.css(n,t.css(n))}),this._cleanup(t)))}},h={animate:function(t,e){var h=n.Deferred(),s=t.data(u),o=this;return s?(n.each(e.to,function(n){e.from[n]===i&&(e.from[n]=o._normalizeValue(t.css(n)))}),e.to[r]&&(e.from[r]=o._parseTransform(e.from[r]),e.to[r]=o._parseTransform(e.to[r])),s.frameAnimation={to:e.to,from:e.from,currentValue:e.from,easing:nt(e.easing),duration:e.duration,startTime:(new Date).valueOf(),finish:function(){this.currentValue=this.to,this.draw(),h.resolve()},draw:function(){var i=n.extend({},this.currentValue);i[r]&&(i[r]=n.map(i[r],function(n,t){return t==="translate"?f.getTranslateCss(n):t==="scale"?"scale("+n+")":t.substr(0,t.length-1)==="rotate"?t+"("+n+"deg)":void 0}).join(" ")),t.css(i)}},e.delay?(s.frameAnimation.startTime+=e.delay,s.frameAnimation.delayTimeout=setTimeout(function(){o._animationStep(t)},e.delay)):o._animationStep(t),h.promise()):h.reject().promise()},_parseTransform:function(t){var i={};return n.each(t.match(/(\w|\d)+\([^\)]*\)\s*/g),function(n,t){var e=f.parseTranslate(t),u=t.match(/scale\((.+?)\)/),r=t.match(/(rotate.)\((.+)deg\)/);e&&(i.translate=e),u&&u[1]&&(i.scale=parseFloat(u[1])),r&&r[1]&&(i[r[1]]=parseFloat(r[2]))}),i},stop:function(n,t){var r=n.data(u),i=r&&r.frameAnimation;i&&(clearTimeout(i.delayTimeout),t&&i.finish())},_animationStep:function(i){var e=i.data(u),r=e&&e.frameAnimation,f;if(r){if(f=(new Date).valueOf(),f>=r.startTime+r.duration){r.finish();return}r.currentValue=this._calcStepValue(r,f-r.startTime),r.draw(),t.requestAnimationFrame(n.proxy(function(){this._animationStep(i)},this))}},_calcStepValue:function(t,i){var r=function(u,f){var e=n.isArray(f)?[]:{},o=function(r){var e=i/t.duration,o=i,s=1*u[r],h=f[r]-u[r],c=t.duration;return n.easing[t.easing](e,o,s,h,c)};return n.each(f,function(n,t){if(typeof t=="string"&&parseFloat(t,10)===!1)return!0;e[n]=typeof t=="object"?r(u[n],t):o(n)}),e};return r(t.from,t.to)},_normalizeValue:function(n){var t=parseFloat(n,10);return t===!1?n:t}},d={transition:e.transition?k:h,frame:h},c=function(n){return d[n&&n.strategy||"transition"]},g={linear:"cubic-bezier(0, 0, 1, 1)",ease:"cubic-bezier(0.25, 0.1, 0.25, 1)","ease-in":"cubic-bezier(0.42, 0, 1, 1)","ease-out":"cubic-bezier(0, 0, 0.58, 1)","ease-in-out":"cubic-bezier(0.42, 0, 0.58, 1)"},nt=function(t){var i,r,u;return(t=g[t]||t,i=t.match(w),!i)?"linear":(i=i.slice(1,5),n.each(i,function(n,t){i[n]=parseFloat(t)}),r="cubicbezier_"+i.join("_").replace(/\./g,"p"),n.isFunction(n.easing[r])||(u=function(n,t,i,r){var u=3*n,f=3*(i-n)-u,o=1-u-f,e=3*t,s=3*(r-t)-e,h=1-e-s,c=function(n){return n*(u+n*(f+n*o))},l=function(n){return n*(e+n*(s+n*h))},a=function(n){for(var t=n,r=0,i;r<14;){if(i=c(t)-n,Math.abs(i)<.001)break;t=t-i/v(t),r++}return t},v=function(n){return u+n*(2*f+n*3*o)};return function(n){return l(a(n))}},n.easing[r]=function(n,t,r,f,e){return f*u(i[0],i[1],i[2],i[3])(t/e)+r}),r)},l=function(t,i){n.each(["from","to"],function(){if(!n.isPlainObject(t[this]))throw Error("Animation with the '"+i+"' type requires '"+this+"' configuration as an plain object.");})},tt={setup:function(){}},it={validateConfig:function(n){l(n,"slide")},setup:function(n,t){var i,r;f.clearCache(n),i=n.position(),this._resetPosition(n),r=n.position(),i.left-=r.left,i.top-=r.top,this._setUpConfig(i,t.from),this._setUpConfig(i,t.to)},_resetPosition:function(n){n.css({transform:"none",top:0,left:0}),f.clearCache(n),n.css("transform")},_setUpConfig:function(n,t){t.left="left"in t?t.left:"+=0",t.top="top"in t?t.top:"+=0",this._initNewPosition(n,t),e.transform3d&&this._locationToTranslate(t)},_initNewPosition:function(n,t){var r=this._getRelativeValue(t.left);r!==i&&(t.left=r+n.left),r=this._getRelativeValue(t.top),r!==i&&(t.top=r+n.top)},_getRelativeValue:function(n){var t;if(typeof n=="string"&&(t=b.exec(n)))return parseInt(t[1]+"1")*t[2]},_locationToTranslate:function(n){var t={x:n.left,y:n.top};delete n.left,delete n.top,n[r]=f.getTranslateCss(t)}},rt={setup:function(t,i){var r=i.from,u=n.isPlainObject(r)?t.css("opacity"):String(r),f=String(i.to);i.from={opacity:u},i.to={opacity:f}}},ut={validateConfig:function(n){l(n,"pop")},setup:function(n,t){var i=t.from,u=t.to,f="opacity"in i?i.opacity:n.css("opacity"),e="opacity"in u?u.opacity:1,o="scale"in i?i.scale:0,s="scale"in u?u.scale:1;t.from={opacity:f},t.from[r]=this._getCssTransform(o),t.to={opacity:e},t.to[r]=this._getCssTransform(s)},_getCssTransform:function(n){return"scale("+n+")"}},a={custom:tt,slide:it,fade:rt,pop:ut},ft=function(n){var t=a[n];if(!t)throw Error('Unknown animation type "'+n+'"');return t},et={type:"custom",from:{},to:{},duration:400,complete:n.noop,easing:"ease",delay:0},ot=function(t,i){i=n.extend(!0,{},et,i);var r=n(t),u=ft(i.type);return r.length?(v(r,i.from),v(r,i.to),n.isFunction(u.validateConfig)&&u.validateConfig(i),u.setup(r,i),p(r),y(r,i.from),st(r,i).done(i.complete)):n.Deferred().resolve().promise()},v=function(i,r){if(r.position){var u=t.calculatePosition(i,r.position);n.extend(r,{left:u.h.location,top:u.v.location}),delete r.position}},y=function(t,i){n.each(i,function(n,i){t.css(n,i)})},st=function(i,r){var f=n.Deferred();return i.data(u,r),t.fx.off&&(r.duration=0),c(r).animate(i,r).done(function(){i.removeData(u),f.resolveWith(this,[i,r])}),f.promise()},ht=function(n){return!!n.data(u)},p=function(t,i){var r=n(t);c(r.data(u)).stop(r,i),r.removeData(u)};t.fx={off:!1,animationTypes:a,animate:ot,animating:ht,stop:p}}(jQuery,DevExpress),function(n,t){function e(n){return/^(localhost$|127\.)/i.test(n)}var r=window.location,u="dxproxy.devexpress.com:8000",f=r.protocol==="ms-appx:",o=r.host===u,s=e(r.hostname),h=function(){return r.pathname.split("/")[1]},c=function(n){var i=t.parseUrl(n);return e(i.hostname)?"http://"+u+"/"+h()+"_"+i.port+i.pathname+i.search:n},l=t.EndpointSelector=function(n){this.config=n};l.prototype={urlFor:function(n){var t=this.config[n];if(!t)throw Error("Unknown endpoint key");return o?c(t.local):t.production&&(f&&!Debug.debuggerEnabled||!f&&!s)?t.production:t.local}}}(jQuery,DevExpress),function(n,t,i){var r=t.utils,f,u;t.NumericFormat={currency:"C",fixedpoint:"N",exponential:"",percent:"P",decimal:"D"},t.LargeNumberFormatPostfixes={1:"K",2:"M",3:"B",4:"T"},f=4,u=10,t.LargeNumberFormatPowers={largenumber:"auto",thousands:1,millions:2,billions:3,trillions:4},t.DateTimeFormat={longdate:"D",longtime:"T",monthandday:"M",monthandyear:"Y",quarterandyear:"qq",shortdate:"d",shorttime:"t",millisecond:"fff",second:"T",minute:"t",hour:"t",day:"dd",week:"dd",month:"MMMM",quarter:"qq",year:"yyyy",longdatelongtime:"D",shortdateshorttime:"d"},t.formatHelper={romanDigits:["I","II","III","IV"],_addFormatSeparator:function(n,t){var i=" ";return t?n+i+t:n},_getDateTimeFormatPattern:function(n){return Globalize.findClosestCulture().calendar.patterns[t.DateTimeFormat[n.toLowerCase()]]},_isDateFormatContains:function(i){var r=!1;return n.each(t.DateTimeFormat,function(n){return r=n===i.toLowerCase(),!r}),r},getQuarter:function(n){return Math.floor(n/3)},getQuarterString:function(n,t){var i="",r=this.getQuarter(n.getMonth());switch(t){case"q":i=this.romanDigits[r];break;case"qq":i="Q"+this.romanDigits[r];break;case"Q":i=(r+1).toString();break;case"QQ":i="Q"+(r+1).toString()}return i},getFirstQuarterMonth:function(n){return this.getQuarter(n)*3},_formatCustomString:function(n,t){var f=/qq|q|QQ|Q/g,i,u="",r=0;for(f.lastIndex=0;r<t.length;)i=f.exec(t),(!i||i.index>r)&&(u+=Globalize.format(n,t.substring(r,i?i.index:t.length))),i?(u+=this.getQuarterString(n,i[0]),r=i.index+i[0].length):r=t.length;return u},_parseNumberFormatString:function(i){var u,r={};if(i&&typeof i=="string")return u=i.toLowerCase().split(" "),n.each(u,function(n,i){i in t.NumericFormat?r.formatType=i:i in t.LargeNumberFormatPowers&&(r.power=t.LargeNumberFormatPowers[i])}),r.power&&!r.formatType&&(r.formatType="fixedpoint"),r.formatType?r:void 0},_calculateNumberPower:function(n,t,r,u){var f=Math.abs(n),e=0;if(f>1)while(f&&f>=t&&(u===i||e<u))e++,f=f/t;else if(f>0&&f<1)while(f<1&&(r===i||e>r))e--,f=f*t;return e},_getNumberByPower:function(n,t,i){for(var r=n;t>0;)r=r/i,t--;while(t<0)r=r*i,t++;return r},_formatNumber:function(n,i,r){var u;return i.power==="auto"&&(i.power=this._calculateNumberPower(n,1e3,0,f)),i.power&&(n=this._getNumberByPower(n,i.power,1e3)),u=t.LargeNumberFormatPostfixes[i.power]||"",this._formatNumberCore(n,i.formatType,r)+u},_formatNumberExponential:function(n,t){var r=this._calculateNumberPower(n,u),f=this._getNumberByPower(n,r,u),e;return t=t===i?1:t,f.toFixed(t||0)>=u&&(r++,f=f/u),e=(r>=0?"+":"")+r.toString(),this._formatNumberCore(f,"fixedpoint",t)+"E"+e},_formatNumberCore:function(n,i,u){return i==="exponential"?this._formatNumberExponential(n,u):Globalize.format(n,t.NumericFormat[i]+(r.isNumber(u)?u:0))},_formatDate:function(n,i){var u=t.DateTimeFormat[i.toLowerCase()];return(i=i.toLowerCase(),i==="quarterandyear"&&(u=this.getQuarterString(n,u)+" yyyy"),i==="quarter")?this.getQuarterString(n,u):i==="longdatelongtime"?this._formatDate(n,"longdate")+" "+this._formatDate(n,"longtime"):i==="shortdateshorttime"?this._formatDate(n,"shortDate")+" "+this._formatDate(n,"shortTime"):Globalize.format(n,u)},format:function(n,t,i){if(t&&t.format){if(t.dateType)return this._formatDateEx(n,t);if(r.isNumber(n)&&isFinite(n))return this._formatNumberEx(n,t)}return this._format(n,t,i)},_format:function(n,t,i){var u;return!r.isString(t)||t===""||!r.isNumber(n)&&!r.isDate(n)?r.isDefined(n)?n.toString():"":(u=this._parseNumberFormatString(t),r.isNumber(n)&&u)?this._formatNumber(n,u,i):r.isDate(n)&&this._isDateFormatContains(t)?this._formatDate(n,t):!u&&!this._isDateFormatContains(t)?this._formatCustomString(n,t):void 0},_formatNumberEx:function(n,i){var a=this,v=t.NumericFormat[i.format.toLowerCase()],f=Globalize.culture().numberFormat,w=i.currencyCulture&&Globalize.cultures[i.currencyCulture]?Globalize.cultures[i.currencyCulture].numberFormat.currency:f.currency,b=f.percent,c=a._getUnitFormatSettings(n,i),k=c.unit,y=c.precision,nt=c.showTrailingZeros,tt=c.includeGroupSeparator,it=f[","],rt=f["."],r,l,o,u,d=/n|\$|-|%/g,e="",s,p,g,h;n=a._applyUnitToValue(n,k),r=Math.abs(n),l=n<0;switch(v){case"D":if(o="n",r=Math[l?"ceil":"floor"](r),y>0){for(s=""+r,p=s.length;p<y;p+=1)s="0"+s;r=s}l&&(r="-"+r);break;case"N":u=f;case"C":u=u||w;case"P":u=u||b,o=l?u.pattern[0]:u.pattern[1]||"n",r=Globalize.format(r*(v==="P"?100:1),"N"+y),nt||(r=a._excludeTrailingZeros(r,rt)),tt||(r=r.replace(new RegExp("\\"+it,"g"),""));break;default:throw"Illegal numeric format: '"+v+"'";}for(;;)if(g=d.lastIndex,h=d.exec(o),e+=o.slice(g,h?h.index:o.length),h)switch(h[0]){case"-":/[1-9]/.test(r)&&(e+=f["-"]);break;case"$":e+=w.symbol;break;case"%":e+=b.symbol;break;case"n":e+=r+k}else break;return(i.plus&&n>0?"+":"")+e},_excludeTrailingZeros:function(n,t){var u=n.indexOf(t),r,i;if(u<0)return n;for(r=n.length,i=r-1;i>=u&&(n[i]==="0"||i===u);i--)r--;return n.substring(0,r)},_getUnitFormatSettings:function(n,t){var e=t.unit||"",u=t.precision||0,h=t.includeGroupSeparator||!1,s=t.showTrailingZeros===i?!0:t.showTrailingZeros,f=t.significantDigits||1,r,o;if(e.toLowerCase()==="auto")if(s=!1,r=Math.abs(n),f<1&&(f=1),r>=1e9?(e="B",r/=1e9):r>=1e6?(e="M",r/=1e6):r>=1e3?(e="K",r/=1e3):e="",r==0)u=0;else if(r<1)for(u=f,o=Math.pow(10,-f);r<o;)o/=10,u++;else u=r>=100?f-3:r>=10?f-2:f-1;return u<0&&(u=0),{unit:e,precision:u,showTrailingZeros:s,includeGroupSeparator:h}},_applyUnitToValue:function(n,t){return t=="B"?n.toFixed(1)/1e9:t=="M"?n/1e6:t=="K"?n/1e3:n},_formatDateEx:function(t,r){var f=this,l="Q",c=r.format,u=r.dateType,h=Globalize.culture().calendars.standard,o=i,s,e;if(c=c.toLowerCase(),u!=="num"||c==="dayofweek")switch(c){case"monthyear":return f._formatDate(t,"monthandyear");case"quarteryear":return f.getQuarterString(t,"QQ")+" "+t.getFullYear();case"daymonthyear":return f._formatDate(t,u+"Date");case"datehour":return o=new Date(t.getTime()),o.setMinutes(0),e=u==="timeOnly"?"":f._formatDate(t,u+"Date"),u==="timeOnly"?f._formatDate(o,"shorttime"):e+" "+f._formatDate(o,"shorttime");case"datehourminute":return e=u==="timeOnly"?"":f._formatDate(t,u+"Date"),u==="timeOnly"?f._formatDate(t,"shorttime"):e+" "+f._formatDate(t,"shorttime");case"datehourminutesecond":return e=u==="timeOnly"?"":f._formatDate(t,u+"Date"),u==="timeOnly"?f._formatDate(t,"longtime"):e+" "+f._formatDate(t,"longtime");case"year":return e=t.toString(),u==="abbr"?e.slice(2,4):e;case"quarter":return l+t.toString();case"month":return s=t-1,u==="abbr"?h.months.namesAbbr[s]:h.months.names[s];case"hour":return u==="long"?(o=new Date,o.setHours(t),o.setMinutes(0),f._formatDate(o,"shorttime")):t.toString();case"dayofweek":return s=n.inArray(t,["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]),u!=="num"?u==="abbr"?h.days.namesAbbr[s]:h.days.names[s]:((s-h.firstDay+1+7)%8).toString();default:return t.toString()}else return t.toString()},getTimeFormat:function(n){return n?this._getDateTimeFormatPattern("longtime"):this._getDateTimeFormatPattern("shorttime")},getDateFormatByDifferences:function(n){var i="";return(n.millisecond&&(i=t.DateTimeFormat.millisecond),(n.hour||n.minute||n.second)&&(i=this._addFormatSeparator(this.getTimeFormat(n.second),i)),n.year&&n.month&&n.day)?this._addFormatSeparator(this._getDateTimeFormatPattern("shortdate"),i):n.year&&n.month?t.DateTimeFormat.monthandyear:n.year?t.DateTimeFormat.year:n.month&&n.day?this._addFormatSeparator(this._getDateTimeFormatPattern("monthandday"),i):n.month?t.DateTimeFormat.month:n.day?this._addFormatSeparator("dddd, dd",i):i},getDateFormatByTicks:function(n){var f,t,u,i,e;if(n.length>1)for(t=r.getDatesDifferences(n[0],n[1]),i=1;i<n.length-1;i++)u=r.getDatesDifferences(n[i],n[i+1]),t.count<u.count&&(t=u);else t={year:!0,month:!0,day:!0,hour:n[0].getHours()>0,minute:n[0].getMinutes()>0,second:n[0].getSeconds()>0};return f=this.getDateFormatByDifferences(t)},getDateFormatByTickInterval:function(n,t,i){var e,u,f,s={quarter:"month",week:"day"},o=function(n,t,i){switch(t){case"year":n.month=i;case"quarter":case"month":n.day=i;case"week":case"day":n.hour=i;case"hour":n.minute=i;case"minute":n.second=i;case"second":n.millisecond=i}},h=function(n,t,i){!i.getMilliseconds()&&i.getSeconds()?i.getSeconds()-t.getSeconds()==1&&(n.millisecond=!0,n.second=!1):!i.getSeconds()&&i.getMinutes()?i.getMinutes()-t.getMinutes()==1&&(n.second=!0,n.minute=!1):!i.getMinutes()&&i.getHours()?i.getHours()-t.getHours()==1&&(n.minute=!0,n.hour=!1):!i.getHours()&&i.getDate()>1?i.getDate()-t.getDate()==1&&(n.hour=!0,n.day=!1):i.getDate()===1&&i.getMonth()?i.getMonth()-t.getMonth()==1&&(n.day=!0,n.month=!1):!i.getMonth()&&i.getFullYear()&&i.getFullYear()-t.getFullYear()==1&&(n.month=!0,n.year=!1)};return i=r.isString(i)?i.toLowerCase():i,u=r.getDatesDifferences(n,t),n!==t&&h(u,n>t?t:n,n>t?n:t),f=r.getDateUnitInterval(u),o(u,f,!0),f=r.getDateUnitInterval(i||"second"),o(u,f,!1),u[s[f]||f]=!0,e=this.getDateFormatByDifferences(u)}}}(jQuery,DevExpress),function(n){function r(n){this.baseColor=n;var t;n&&(t=String(n).toLowerCase().replace(/ /g,""),t=e[t]?"#"+e[t]:t,t=o(t)),t=t||{},this.r=i(t[0]),this.g=i(t[1]),this.b=i(t[2])}function o(n){for(var f,t=0,r=u.length,i;t<r;++t)if(i=u[t].re.exec(n),i)return u[t].process(i);return null}function i(n){return n<0||isNaN(n)?0:n>255?255:n}function s(n,t,i){return"#"+(16777216|n<<16|t<<8|i).toString(16).slice(1)}var e={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dodgerblue:"1e90ff",feldspar:"d19275",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslateblue:"8470ff",lightslategray:"778899",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"ff0000",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",violetred:"d02090",wheat:"f5deb3",white:"ffffff",whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"},u=[{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,process:function(n){return[parseInt(n[1],10),parseInt(n[2],10),parseInt(n[3],10)]}},{re:/^#(\w{2})(\w{2})(\w{2})$/,process:function(n){return[parseInt(n[1],16),parseInt(n[2],16),parseInt(n[3],16)]}},{re:/^#(\w{1})(\w{1})(\w{1})$/,process:function(n){return[parseInt(n[1]+n[1],16),parseInt(n[2]+n[2],16),parseInt(n[3]+n[3],16)]}}],f=Math.round;r.prototype={constructor:r,highlight:function(n){return n=n||10,this.alter(n).toHex()},darken:function(n){return n=n||10,this.alter(-n).toHex()},alter:function(n){var t=new r;return t.r=i(this.r+n),t.g=i(this.g+n),t.b=i(this.b+n),t},blend:function(n,t){var e=n instanceof r?n:new r(n),u=new r;return u.r=i(f(this.r*(1-t)+e.r*t)),u.g=i(f(this.g*(1-t)+e.g*t)),u.b=i(f(this.b*(1-t)+e.b*t)),u},toHex:function(){return s(this.r,this.g,this.b)}},n.Color=r}(DevExpress),function(n,t){var r=function(){var i={};return{setup:function(n){this.localizeString=function(r){var u=new RegExp("(^|[^a-zA-Z_0-9"+n+"-]+)("+n+"{1,2})([a-zA-Z_0-9-]+)","g"),f=n+n;return r.replace(u,function(r,u,e,o){var s=u+n+o;return e!==f&&(Globalize.cultures["default"].messages[o]?s=u+Globalize.localize(o):i[o]=t.inflector.humanize(o)),s})}},localizeNode:function(t){var i=this;n(t).each(function(t,r){r.nodeType&&(r.nodeType===3?r.nodeValue=i.localizeString(r.nodeValue):(n.each(r.attributes||[],function(n,t){typeof t.value=="string"&&(t.value=i.localizeString(t.value))}),n(r).contents().each(function(n,t){i.localizeNode(t)})))})},getDictionary:function(t){return t?i:n.extend({},i,Globalize.cultures["default"].messages)}}}();r.setup("@"),t.localization=r}(jQuery,DevExpress),Globalize.addCultureInfo("default",{messages:{Yes:"Yes",No:"No",Cancel:"Cancel",Clear:"Clear",Done:"Done",Loading:"Loading...",Select:"Select...",Search:"Search",Back:"Back","dxLookup-searchPlaceholder":"Minimum character number: {0}","dxCollectionContainerWidget-noDataText":"No data to display","dxList-pullingDownText":"Pull down to refresh...","dxList-pulledDownText":"Release to refresh...","dxList-refreshingText":"Refreshing...","dxList-pageLoadingText":"Loading...","dxListEditDecorator-delete":"Delete","dxList-nextButtonText":"More","dxScrollView-pullingDownText":"Pull down to refresh...","dxScrollView-pulledDownText":"Release to refresh...","dxScrollView-refreshingText":"Refreshing...","dxScrollView-reachBottomText":"Loading...","dxSwitch-onText":"ON","dxSwitch-offText":"OFF"}}),function(n,t,i){var o=t.support.hasKo,s=function(n){return n.replace(/\[/g,".").replace(/\]/g,"")},u=function(n){return o?ko.utils.unwrapObservable(n):n},h=function(n){return o&&ko.isObservable(n)},c=function(n,t){return t==="this"?n:n[t]},l=function(n,t,i){if(t==="this")throw Error("Cannot assign to self");var r=n[t];h(r)?r(i):n[t]=i},f=function(t){if(arguments.length>1&&(t=n.makeArray(arguments)),!t||t==="this")return function(n){return n};if(n.isFunction(t))return t;if(n.isArray(t))return v(t);t=s(t);var i=t.split(".");return function(t,r){r=r||{};var f=u(t);return n.each(i,function(){if(!f)return!1;var t=u(f[this]);n.isFunction(t)&&!r.functionsAsIs&&(t=t.call(f)),f=t}),f}},v=function(t){var r={};return n.each(t,function(){r[this]=f(this)}),function(t,u){var f={};return n.each(r,function(n){var s=this(t,u),e,o,h,r;if(s!==i){for(e=f,o=n.split("."),h=o.length-1,r=0;r<h;r++)e=e[o[r]]={};e[o[r]]=s}}),f}},y=function(r){r=r||"this",r=s(r);var o=r.lastIndexOf("."),a=f(r.substr(0,o)),e=r.substr(1+o);return function(r,f,o){o=o||{};var v=a(r,{functionsAsIs:o.functionsAsIs}),s=c(v,e);o.functionsAsIs||!n.isFunction(s)||h(s)?(s=u(s),o.merge&&n.isPlainObject(f)&&(s===i||n.isPlainObject(s))?(s||l(v,e,{}),t.utils.deepExtendArraySafe(u(c(v,e)),f)):l(v,e,f)):v[e](f)}},p=function(n){return[n[0],n.length<3?"=":n[1].toLowerCase(),n.length<2?!0:n[n.length-1]]},w=function(t){return n.isArray(t)||(t=[t]),n.map(t,function(t){return{selector:n.isFunction(t)||typeof t=="string"?t:t.getter||t.field||t.selector,desc:!!(t.desc||String(t.dir).charAt(0).toLowerCase()==="d")}})},a=t.Class.inherit({ctor:function(n){n&&(n=String(n)),this._value=this._normalize(n||this._generate())},_normalize:function(n){for(n=n.replace(/[^a-f0-9]/ig,"").toLowerCase();n.length<32;)n+="0";return[n.substr(0,8),n.substr(8,4),n.substr(12,4),n.substr(16,4),n.substr(20,12)].join("-")},_generate:function(){for(var t="",n=0;n<32;n++)t+=Math.round(Math.random()*15).toString(16);return t},toString:function(){return this._value},valueOf:function(){return this._value},toJSON:function(){return this._value}}),r=function(n,t){return n instanceof Date?n.getTime():n instanceof a?n.valueOf():!t&&typeof n=="string"?n.toLowerCase():n},b=function(t,i,u){var e,o,f;if(n.isArray(t)){for(e=n.map(i,function(n,t){return t}),f=0;f<e.length;f++)if(o=e[f],r(i[o],!0)!=r(u[o],!0))return!1;return!0}return r(i,!0)==r(u,!0)},k="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",d=function(t){var r,i;for(n.isArray(t)||(t=g(String(t))),r="",i=0;i<t.length;i+=3){var e=t[i],u=t[i+1],f=t[i+2];r+=n.map([e>>2,(e&3)<<4|u>>4,isNaN(u)?64:(u&15)<<2|f>>6,isNaN(f)?64:f&63],function(n){return k.charAt(n)}).join("")}return r},g=function(n){for(var i=[],t,r=0;r<n.length;r++)t=n.charCodeAt(r),t<128?i.push(t):t<2048?i.push(192+(t>>6),128+(t&63)):t<65536?i.push(224+(t>>12),128+(t>>6&63),128+(t&63)):t<2097152&&i.push(240+(t>>18),128+(t>>12&63),128+(t>>6&63),128+(t&63));return i},nt=function(){var n={timeout:"Network connection timeout",error:"Unspecified network error",parsererror:"Unexpected server response"},t=function(t){var i=n[t];return i?i:t};return function(n,i){return n.status<400?t(i):n.statusText}}(),e=t.data={utils:{compileGetter:f,compileSetter:y,normalizeBinaryCriterion:p,normalizeSortingInfo:w,toComparable:r,keysEqual:b,errorMessageFromXhr:nt},Guid:a,base64_encode:d,queryImpl:{},queryAdapters:{},query:function(){var t=n.isArray(arguments[0])?"array":"remote";return e.queryImpl[t].apply(this,arguments)},errorHandler:null,_handleError:function(n){e.errorHandler&&e.errorHandler(n)}}}(jQuery,DevExpress),function(n,t,i){var a=t.Class,u=t.data,c=u.queryImpl,f=u.utils.compileGetter,r=u.utils.toComparable,e=a.inherit({toArray:function(){var n=[];for(this.reset();this.next();)n.push(this.current());return n},countable:function(){return!1}}),o=e.inherit({ctor:function(n){this.array=n,this.index=-1},next:function(){return this.index+1<this.array.length?(this.index++,!0):!1},current:function(){return this.array[this.index]},reset:function(){this.index=-1},toArray:function(){return this.array.slice(0)},countable:function(){return!0},count:function(){return this.array.length}}),s=e.inherit({ctor:function(n){this.iter=n},next:function(){return this.iter.next()},current:function(){return this.iter.current()},reset:function(){return this.iter.reset()}}),h=e.inherit({ctor:function(n,t,i){this.iter=n,this.rules=[{getter:t,desc:i}]},thenBy:function(n,t){var i=new h(this.sortedIter||this.iter,n,t);return this.sortedIter||(i.rules=this.rules.concat(i.rules)),i},next:function(){return this._ensureSorted(),this.sortedIter.next()},current:function(){return this._ensureSorted(),this.sortedIter.current()},reset:function(){delete this.sortedIter},countable:function(){return this.sortedIter||this.iter.countable()},count:function(){return this.sortedIter?this.sortedIter.count():this.iter.count()},_ensureSorted:function(){this.sortedIter||(n.each(this.rules,function(){this.getter=f(this.getter)}),this.sortedIter=new o(this.iter.toArray().sort(n.proxy(this._compare,this))))},_compare:function(n,t){var i,s;if(n===t)return 0;for(i=0,s=this.rules.length;i<s;i++){var e=this.rules[i],u=r(e.getter(n)),o=r(e.getter(t)),f=e.desc?-1:1;if(u<o)return-f;if(u>o)return f;if(u!==o)return u?f:-f}return 0}}),l=function(){function o(n,t,i){return function(u){u=r(n(u));var f=c(t)?u===t:u==t;return i&&(f=!f),f}}function c(n){return n===""||n===0||n===null||n===!1||n===i}var s=function(t){var u=[],i=["return function(d) { return "],f=0,r=!1;return n.each(t,function(){n.isArray(this)||n.isFunction(this)?(r&&i.push(" && "),u.push(l(this)),i.push("op[",f,"](d)"),f++,r=!0):(i.push(/and|&/i.test(this)?" && ":" || "),r=!1)}),i.push(" }"),new Function("op",i.join(""))(u)},e=function(n){return t.utils.isDefined(n)?n.toString():""},h=function(n){n=u.utils.normalizeBinaryCriterion(n);var i=f(n[0]),s=n[1],t=n[2];t=r(t);switch(s.toLowerCase()){case"=":return o(i,t);case"<>":return o(i,t,!0);case">":return function(n){return r(i(n))>t};case"<":return function(n){return r(i(n))<t};case">=":return function(n){return r(i(n))>=t};case"<=":return function(n){return r(i(n))<=t};case"startswith":return function(n){return r(e(i(n))).indexOf(t)===0};case"endswith":return function(n){var u=r(e(i(n)));return u.lastIndexOf(t)===u.length-e(t).length};case"contains":return function(n){return r(e(i(n))).indexOf(t)>-1};case"notcontains":return function(n){return r(e(i(n))).indexOf(t)===-1}}throw Error("Unknown filter operation: "+s);};return function(t){return n.isFunction(t)?t:n.isArray(t[0])?s(t):h(t)}}(),v=s.inherit({ctor:function(n,t){this.callBase(n),this.criteria=l(t)},next:function(){while(this.iter.next())if(this.criteria(this.current()))return!0;return!1}}),y=e.inherit({ctor:function(n,t){this.iter=n,this.getter=t},next:function(){return this._ensureGrouped(),this.groupedIter.next()},current:function(){return this._ensureGrouped(),this.groupedIter.current()},reset:function(){delete this.groupedIter},countable:function(){return!!this.groupedIter},count:function(){return this.groupedIter.count()},_ensureGrouped:function(){var r,t;if(!this.groupedIter){var i={},e=[],u=this.iter,s=f(this.getter);for(u.reset();u.next();)r=u.current(),t=s(r),t in i?i[t].push(r):(i[t]=[r],e.push(t));this.groupedIter=new o(n.map(e,function(n){return{key:n,items:i[n]}}))}}}),p=s.inherit({ctor:function(n,t){this.callBase(n),this.getter=f(t)},current:function(){return this.getter(this.callBase())},countable:function(){return this.iter.countable()},count:function(){return this.iter.count()}}),w=s.inherit({ctor:function(n,t,i){this.callBase(n),this.skip=Math.max(0,t),this.take=Math.max(0,i),this.pos=0},next:function(){if(this.pos>=this.skip+this.take)return!1;while(this.pos<this.skip&&this.iter.next())this.pos++;return this.pos++,this.iter.next()},reset:function(){this.callBase(),this.pos=0},countable:function(){return this.iter.countable()},count:function(){return Math.min(this.iter.count()-this.skip,this.take)}});c.array=function(t,r){r=r||{},t instanceof e||(t=new o(t));var b=function(n){var t=r.errorHandler;t&&t(n),u._handleError(n)},s=function(r,u,f){var o=n.Deferred().fail(b),e;try{for(t.reset(),arguments.length<2&&(u=arguments[0],r=t.next()?t.current():i),e=r;t.next();)e=u(e,t.current());o.resolve(f?f(e):e)}catch(s){o.reject(s)}return o.promise()},k=function(i){return n.isFunction(i)||n.isArray(i)||(i=n.makeArray(arguments)),l(new p(t,i))},a=function(n){return k(f(n))},l=function(n){return c.array(n,r)};return{toArray:function(){return t.toArray()},enumerate:function(){var i=n.Deferred().fail(b);try{i.resolve(t.toArray())}catch(r){i.reject(r)}return i.promise()},sortBy:function(n,i){return l(new h(t,n,i))},thenBy:function(n,i){if(t instanceof h)return l(t.thenBy(n,i));throw Error();},filter:function(i){return n.isArray(i)||(i=n.makeArray(arguments)),l(new v(t,i))},slice:function(n,r){return r===i&&(r=Number.MAX_VALUE),l(new w(t,n,r))},select:k,groupBy:function(n){return l(new y(t,n))},aggregate:s,count:function(){if(t.countable()){var i=n.Deferred().fail(b);try{i.resolve(t.count())}catch(r){i.reject(r)}return i.promise()}return s(0,function(n){return 1+n})},sum:function(n){return n?a(n).sum():s(0,function(n,t){return n+t})},min:function(n){return n?a(n).min():s(function(n,t){return t<n?t:n})},max:function(n){return n?a(n).max():s(function(n,t){return t>n?t:n})},avg:function(n){if(n)return a(n).avg();var t=0;return s(0,function(n,i){return t++,n+i},function(n){return t?n/t:i})}}}}(jQuery,DevExpress),function(n,t){var r=t.data,u=r.queryImpl;u.remote=function(t,i,f){f=f||[],i=i||{};var o=function(n,t){return{name:n,args:t}},s=function(e){var o=n.Deferred(),h,c,s,l,a=function(n){var t=i.errorHandler;t&&t(n),r._handleError(n),o.reject(n)};try{for(h=i.adapter||"odata",n.isFunction(h)||(h=r.queryAdapters[h]),c=h(i),s=[].concat(f).concat(e);s.length;){if(l=s[0],String(l.name)!=="enumerate"&&(!c[l.name]||c[l.name].apply(c,l.args)===!1))break;s.shift()}c.exec(t).done(function(t,r){if(s.length){var f=u.array(t,{errorHandler:i.errorHandler});n.each(s,function(){f=f[this.name].apply(f,this.args)}),f.done(n.proxy(o.resolve,o)).fail(n.proxy(o.reject,o))}else o.resolve(t,r)}).fail(a)}catch(v){a(v)}return o.promise()},e={};return n.each(["sortBy","thenBy","filter","slice","select","groupBy"],function(){var n=this;e[n]=function(){return u.remote(t,i,f.concat(o(n,arguments)))}}),n.each(["count","min","max","sum","avg","aggregate","enumerate"],function(){var n=this;e[n]=function(){return s.call(this,o(n,arguments))}}),e}}(jQuery,DevExpress),function(n,t,i){var f=t.data,c=t.utils,o=f.Guid,a=/^\/Date\((-?\d+)((\+|-)?(\d+)?)\)\/$/,v=/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})/,l="application/json;odata=verbose",y=function(t,i){var u;t=n.extend({method:"get",url:"",params:{},payload:null,headers:{}},t),i=i||{},u=i.beforeSend,u&&u(t);var o=(t.method||"get").toLowerCase(),r=o==="get",f=r&&i.jsonp,s=n.extend({},t.params),h=r?s:JSON.stringify(t.payload),c=!r&&n.param(s),e=t.url,a=!r&&l;return c&&(e+=(e.indexOf("?")>-1?"&":"?")+c),f&&(h.$format="json"),{url:e,data:h,dataType:f?"jsonp":"json",jsonp:f&&"$callback",type:o,timeout:3e4,headers:t.headers,contentType:a,accepts:{json:[l,"text/plain"].join()},xhrFields:{withCredentials:i.withCredentials}}},s=function(t,i){var r=n.Deferred();return n.ajax(y(t,i)).always(function(t,u){var f=b(t,u),e=f.error,o=f.data,h=f.nextUrl,c;e?r.reject(e):i.countOnly?r.resolve(f.count):h?s({url:h},i).fail(n.proxy(r.reject,r)).done(function(n){r.resolve(o.concat(n))}):(isFinite(f.count)&&(c={totalCount:f.count}),r.resolve(o,c))}),r.promise()},p=function(n){var t,i=n;for(("message"in n)&&(t=n.message.value?n.message.value:n.message);i=i.innererror||i.internalexception;)if(t=i.message,i.internalexception&&t.indexOf("inner exception")===-1)break;return t},w=function(t,i){var u;if(i==="nocontent")return null;var r=200,e="Unknown error",o=t;if(i!=="success"){r=t.status,e=f.utils.errorMessageFromXhr(t,i);try{o=n.parseJSON(t.responseText)}catch(s){}}return(u=o&&(o.error||o["odata.error"]),u)?(e=p(u)||e,r===200&&(r=500),u.code&&(r=Number(u.code)),n.extend(Error(e),{httpStatus:r,errorDetails:u})):r!==200?n.extend(Error(e),{httpStatus:r}):void 0},b=function(t,i){var r=w(t,i);return r?{error:r}:n.isPlainObject(t)?"d"in t&&(c.isArray(t.d)||c.isObject(t.d))?k(t,i):d(t,i):{data:t}},k=function(n){var i=n.d;return i?(i=i.results||i,h(i,function(n,t){var i=n[t].match(a);i&&(n[t]=new Date(Number(i[1])+i[2]*6e4))}),{data:i,nextUrl:n.d.__next,count:n.d.__count}):{error:Error("Malformed or unsupported JSON response received")}},d=function(n){var r=n.value||n;return r?(h(r,function(n,i){v.test(n[i])&&(n[i]=t.utils.dateFromIso8601String(n[i]))}),{data:r,nextUrl:n["odata.nextLink"],count:n["odata.count"]}):{error:Error("Malformed or unsupported JSON response received")}},u=t.Class.inherit({ctor:function(n){this._value=n},valueOf:function(){return this._value}}),g=function(){var n=function(n){return n=String(n),n.length<2&&(n="0"+n),n};return function(t){var i=["datetime'",t.getUTCFullYear(),"-",n(t.getUTCMonth()+1),"-",n(t.getUTCDate())];return(t.getUTCHours()||t.getUTCMinutes()||t.getUTCSeconds()||t.getUTCMilliseconds())&&(i.push("T",n(t.getUTCHours()),":",n(t.getUTCMinutes()),":",n(t.getUTCSeconds())),t.getUTCMilliseconds()&&i.push(".",t.getUTCMilliseconds())),i.push("'"),i.join("")}}(),r=function(n){return n instanceof u?n.valueOf():n.replace(/\./g,"/")},e=function(n){return n instanceof Date?g(n):n instanceof o?"guid'"+n+"'":n instanceof u?n.valueOf():typeof n=="string"?"'"+n.replace(/'/g,"''")+"'":String(n)},nt=function(t){if(n.isPlainObject(t)){var i=[];return n.each(t,function(n,t){i.push(r(n)+"="+e(t))}),i.join()}return e(t)},h=function(t,i){n.each(t,function(n,r){r!==null&&typeof r=="object"?h(r,i):typeof r=="string"&&i(t,n)})},tt={String:function(n){return n+""},Int32:function(n){return~~n},Int64:function(n){return n instanceof u?n:new u(n+"L")},Guid:function(n){return n instanceof o?n:new o(n)}},it=function(){var t=function(n){return function(t,i,r){r.push(t," ",n," ",i)}},i=function(n,t){return function(i,r,u){t?u.push(n,"(",r,",",i,")"):u.push(n,"(",i,",",r,")")}},o={"=":t("eq"),"<>":t("ne"),">":t("gt"),">=":t("ge"),"<":t("lt"),"<=":t("le"),startswith:i("startswith"),endswith:i("endswith"),contains:i("substringof",!0),notcontains:i("not substringof",!0)},s=function(n,t){n=f.utils.normalizeBinaryCriterion(n);var i=n[1],u=o[i.toLowerCase()];if(!u)throw Error("Unknown filter operation: "+i);u(r(n[0]),e(n[2]),t)},h=function(t,i){var r=!1;n.each(t,function(){n.isArray(this)?(r&&i.push(" and "),i.push("("),u(this,i),i.push(")"),r=!0):(i.push(/and|&/i.test(this)?" and ":" or "),r=!1)})},u=function(t,i){n.isArray(t[0])?h(t,i):s(t,i)};return function(n){var t=[];return u(n,t),t.join("")}}(),rt=function(t){var o=[],u=[],f,h,c,e,l=function(){return h||c!==i},a=function(n,t,i){if(l()||typeof n!="string")return!1;i&&(o=[]);var u=r(n);t&&(u+=" desc"),o.push(u)},v=function(){var u={};return t.expand&&n.each(n.makeArray(t.expand),function(){u[r(this)]=1}),f&&n.each(f,function(){var n=this.split(".");n.length<2||(n.pop(),u[r(n.join("."))]=1)}),n.map(u,function(n,t){return t}).join()||i},y=function(){var n={};return e||(o.length&&(n.$orderby=o.join(",")),h&&(n.$skip=h),c!==i&&(n.$top=c),f&&(n.$select=r(f.join())),n.$expand=v()),u.length&&(n.$filter=it(u.length<2?u[0]:u)),e&&(n.$top=0),(t.requireTotalCount||e)&&(n.$inlinecount="allpages"),n};return{exec:function(i){return s({url:i,params:n.extend(y(),t&&t.params)},{beforeSend:t.beforeSend,jsonp:t.jsonp,withCredentials:t.withCredentials,countOnly:e})},sortBy:function(n,t){return a(n,t,!0)},thenBy:function(n,t){return a(n,t,!1)},slice:function(n,t){if(l())return!1;h=n,c=t},filter:function(t){if(l()||n.isFunction(t))return!1;n.isArray(t)||(t=n.makeArray(arguments)),u.length&&u.push("and"),u.push(t)},select:function(t){if(f||n.isFunction(t))return!1;n.isArray(t)||(t=n.makeArray(arguments)),f=t},count:function(){e=!0}}};n.extend(!0,f,{EdmLiteral:u,utils:{odata:{sendRequest:s,serializePropName:r,serializeValue:e,serializeKey:nt,keyConverters:tt}},queryAdapters:{odata:rt}})}(jQuery,DevExpress),function(n,t){function e(t,i){return t=t.groupBy(i[0].selector),i.length>1&&(t=t.select(function(t){return n.extend({},t,{items:e(u.query(t.items),i.slice(1)).toArray()})})),t}function h(t,i){var r=[];return n.each(t,function(t,u){var f=n.grep(i,function(n){return u.selector==n.selector});f.length<1&&r.push(u)}),r.concat(i)}var o=t.Class,r=t.abstract,u=t.data,f=u.utils.normalizeSortingInfo,s=["loading","loaded","modifying","modified","inserting","inserted","updating","updated","removing","removed"];u.Store=o.inherit({ctor:function(t){var i=this;t=t||{},n.each(s,function(){var r=i[this]=n.Callbacks();this in t&&r.add(t[this])}),this._key=t.key,this._errorHandler=t.errorHandler,this._useDefaultSearch=!0},_customLoadOptions:function(){return null},key:function(){return this._key},keyOf:function(n){return this._keyGetter||(this._keyGetter=u.utils.compileGetter(this.key())),this._keyGetter(n)},_requireKey:function(){if(!this.key())throw Error("Key expression is required for this operation");},load:function(n){var t=this;return n=n||{},this.loading.fire(n),this._loadImpl(n).done(function(n,i){t.loaded.fire(n,i)})},_loadImpl:function(t){var o=t.filter,u=t.sort,s=t.select,r=t.group,c=t.skip,l=t.take,i=this.createQuery(t);return o&&(i=i.filter(o)),r&&(r=f(r)),(u||r)&&(u=f(u||[]),r&&(u=h(r,u)),n.each(u,function(n){i=i[n?"thenBy":"sortBy"](this.selector,this.desc)})),s&&(i=i.select(s)),r&&(i=e(i,r)),(l||c)&&(i=i.slice(c||0,l)),i.enumerate()},createQuery:r,totalCount:function(n){return this._addFailHandlers(this._totalCountImpl(n))},_totalCountImpl:function(n){n=n||{};var t=this.createQuery(),i=n.group,r=n.filter;return r&&(t=t.filter(r)),i&&(i=f(i),t=e(t,i)),t.count()},byKey:function(n,t){return this._addFailHandlers(this._byKeyImpl(n,t))},_byKeyImpl:r,insert:function(n){var t=this;return t.modifying.fire(),t.inserting.fire(n),t._addFailHandlers(t._insertImpl(n).done(function(n,i){t.inserted.fire(n,i),t.modified.fire()}))},_insertImpl:r,update:function(n,t){var i=this;return i.modifying.fire(),i.updating.fire(n,t),i._addFailHandlers(i._updateImpl(n,t).done(function(n,t){i.updated.fire(n,t),i.modified.fire()}))},_updateImpl:r,remove:function(n){var t=this;return t.modifying.fire(),t.removing.fire(n),t._addFailHandlers(t._removeImpl(n).done(function(n){t.removed.fire(n),t.modified.fire()}))},_removeImpl:r,_addFailHandlers:function(n){return n.fail(this._errorHandler,u._handleError)}})}(jQuery,DevExpress),function(n,t,i){var r=t.data,e=r.Guid,u=function(){var i=n.Deferred();return i.resolve.apply(i,arguments).promise()},f=function(){var i=n.Deferred();return i.reject.apply(i,arguments).promise()};r.ArrayStore=r.Store.inherit({ctor:function(t){t=n.isArray(t)?{data:t}:t||{},this.callBase(t),this._array=t.data||[]},createQuery:function(){return r.query(this._array,{errorHandler:this._errorHandler})},_byKeyImpl:function(n){return u(this._array[this._indexByKey(n)])},_insertImpl:function(t){var s=this.key(),r,o={};if(n.extend(o,t),s){if(r=this.keyOf(o),r===i||typeof r=="object"&&n.isEmptyObject(r)){if(n.isArray(s))throw Error("Compound keys cannot be auto-generated");r=o[s]=String(new e)}else if(this._array[this._indexByKey(r)]!==i)return f(Error("Attempt to insert an item with the duplicate key"))}else r=o;return this._array.push(o),u(t,r)},_updateImpl:function(n,i){var r,e;if(this.key()){if(e=this._indexByKey(n),e<0)return f(Error("Data item not found"));r=this._array[e]}else r=n;return t.utils.deepExtendArraySafe(r,i),u(n,i)},_removeImpl:function(n){var t=this._indexByKey(n);return t>-1&&this._array.splice(t,1),u(n)},_indexByKey:function(n){for(var t=0,i=this._array.length;t<i;t++)if(r.utils.keysEqual(this.key(),this.keyOf(this._array[t]),n))return t;return-1},clear:function(){this._array=[]}})}(jQuery,DevExpress),function(n,t){var f=t.Class,r=t.abstract,u=t.data,e=f.inherit({ctor:function(t,i){var u,f,r;if(this._store=t,this._dirty=!1,u=this._immediate=i.immediate,f=Math.max(100,i.flushInterval||1e4),!u){r=n.proxy(this.save,this),setInterval(r,f);n(window).on("beforeunload",r);window.cordova&&document.addEventListener("pause",r,!1)}},notifyChanged:function(){this._dirty=!0,this._immediate&&this.save()},load:function(){this._store._array=this._loadImpl(),this._dirty=!1},save:function(){this._dirty&&(this._saveImpl(this._store._array),this._dirty=!1)},_loadImpl:r,_saveImpl:r}),o=e.inherit({ctor:function(n,t){this.callBase(n,t);var i=t.name;if(!i)throw Error("Name is required");this._key="dx-data-localStore-"+i},_loadImpl:function(){var n=localStorage.getItem(this._key);return n?JSON.parse(n):[]},_saveImpl:function(n){n.length?localStorage.setItem(this._key,JSON.stringify(n)):localStorage.removeItem(this._key)}}),s={dom:o};u.LocalStore=u.ArrayStore.inherit({ctor:function(n){n=typeof n=="string"?{name:n}:n||{},this.callBase(n),this._backend=new s[n.backend||"dom"](this,n),this._backend.load()},clear:function(){this.callBase(),this._backend.notifyChanged()},_insertImpl:function(t){var i=this._backend;return this.callBase(t).done(n.proxy(i.notifyChanged,i))},_updateImpl:function(t,i){var r=this._backend;return this.callBase(t,i).done(n.proxy(r.notifyChanged,r))},_removeImpl:function(t){var i=this._backend;return this.callBase(t).done(n.proxy(i.notifyChanged,i))}})}(jQuery,DevExpress),function(n,t){var h=t.Class,r=t.data,u=r.utils.odata,f=function(t){if(!t)return t;var i={};return n.each(t,function(n,t){i[n]=u.serializeValue(t)}),i},e=function(n,t){var i=u.keyConverters[n];if(!i)throw Error("Unknown key type: "+n);return i(t)},o={_extractServiceOptions:function(n){n=n||{},this._url=String(n.url).replace(/\/+$/,""),this._beforeSend=n.beforeSend,this._jsonp=n.jsonp,this._withCredentials=n.withCredentials},_sendRequest:function(n,t,i,r){return u.sendRequest({url:n,method:t,params:i||{},payload:r},{beforeSend:this._beforeSend,jsonp:this._jsonp,withCredentials:this._withCredentials})}},s=r.Store.inherit({ctor:function(n){this.callBase(n),this._extractServiceOptions(n),this._keyType=n.keyType},_customLoadOptions:function(){return["expand","customQueryParams"]},_byKeyImpl:function(t,i){var r={};return i&&i.expand&&(r.$expand=n.map(n.makeArray(i.expand),u.serializePropName).join()),this._sendRequest(this._byKeyUrl(t),"GET",r)},createQuery:function(n){return n=n||{},r.query(this._url,{beforeSend:this._beforeSend,errorHandler:this._errorHandler,jsonp:this._jsonp,withCredentials:this._withCredentials,params:f(n.customQueryParams),expand:n.expand,requireTotalCount:n.requireTotalCount})},_insertImpl:function(t){this._requireKey();var r=this,i=n.Deferred();return n.when(this._sendRequest(this._url,"POST",null,t)).done(function(n){i.resolve(t,r.keyOf(n))}).fail(n.proxy(i.reject,i)),i.promise()},_updateImpl:function(t,i){var r=n.Deferred();return n.when(this._sendRequest(this._byKeyUrl(t),"MERGE",null,i)).done(function(){r.resolve(t,i)}).fail(n.proxy(r.reject,r)),r.promise()},_removeImpl:function(t){var i=n.Deferred();return n.when(this._sendRequest(this._byKeyUrl(t),"DELETE")).done(function(){i.resolve(t)}).fail(n.proxy(i.reject,i)),i.promise()},_byKeyUrl:function(t){var i=this._keyType;return n.isPlainObject(i)?n.each(i,function(n,i){t[n]=e(i,t[n])}):i&&(t=e(i,t)),this._url+"("+encodeURIComponent(u.serializeKey(t))+")"}}).include(o),c=h.inherit({ctor:function(t){var i=this;i._extractServiceOptions(t),i._errorHandler=t.errorHandler,n.each(t.entities||[],function(r,u){i[r]=new s(n.extend({},t,{url:i._url+"/"+encodeURIComponent(u.name||r)},u))})},get:function(n,t){return this.invoke(n,t,"GET")},invoke:function(t,i,u){u=u||"POST";var e=n.Deferred();return n.when(this._sendRequest(this._url+"/"+encodeURIComponent(t),u,f(i))).done(function(n){n&&t in n&&(n=n[t]),e.resolve(n)}).fail([this._errorHandler,r._handleError,n.proxy(e.reject,e)]),e.promise()},objectLink:function(n,t){var i=this[n];if(!i)throw Error("Unknown entity name or alias: "+n);return{__metadata:{uri:i._byKeyUrl(t)}}}}).include(o);n.extend(r,{ODataStore:s,ODataContext:c})}(jQuery,DevExpress),function(n,t){function r(n){return function(t,i){t&&t.getResponseHeader?n.reject(Error(u.utils.errorMessageFromXhr(t,i))):n.reject.apply(n,arguments)}}function f(n){return"_customize"+t.inflector.camelize(n,!0)}function e(n){return"_"+n+"Path"}var u=t.data;u.RestStore=u.Store.inherit({ctor:function(t){var i=this;i.callBase(t),t=t||{},i._url=String(t.url).replace(/\/+$/,""),i._jsonp=t.jsonp,i._withCredentials=t.withCredentials,n.each(["Load","Insert","Update","Remove","ByKey","Operation"],function(){var n=t["customize"+this];n&&(i[f(this)]=n)}),n.each(["load","insert","update","remove","byKey"],function(){var n=t[this+"Path"];n&&(i[e(this)]=n)})},_loadImpl:function(t){var i=n.Deferred(),u={url:this._formatUrlNoKey("load"),type:"GET"};return n.when(this._createAjax(u,"load",t)).done(n.proxy(i.resolve,i)).fail(r(i)),this._addFailHandlers(i.promise())},createQuery:function(){throw Error("Not supported");},_insertImpl:function(t){var i=n.Deferred(),u=this,f={url:this._formatUrlNoKey("insert"),type:"POST",contentType:"application/json",data:JSON.stringify(t)};return n.when(this._createAjax(f,"insert")).done(function(n){i.resolve(t,u.key()&&u.keyOf(n))}).fail(r(i)),i.promise()},_updateImpl:function(t,i){var u=n.Deferred(),f={url:this._formatUrlWithKey("update",t),type:"PUT",contentType:"application/json",data:JSON.stringify(i)};return n.when(this._createAjax(f,"update")).done(function(){u.resolve(t,i)}).fail(r(u)),u.promise()},_removeImpl:function(t){var i=n.Deferred(),u={url:this._formatUrlWithKey("remove",t),type:"DELETE"};return n.when(this._createAjax(u,"remove")).done(function(){i.resolve(t)}).fail(r(i)),i.promise()},_byKeyImpl:function(t){var i=n.Deferred(),u={url:this._formatUrlWithKey("byKey",t),type:"GET"};return n.when(this._createAjax(u,"byKey")).done(function(n){i.resolve(n)}).fail(r(i)),i.promise()},_createAjax:function(t,i,r){function o(n){return"done"in n&&"fail"in n}var e,u;if(this._jsonp&&t.type==="GET"?t.dataType="jsonp":n.extend(!0,t,{xhrFields:{withCredentials:this._withCredentials}}),e=this[f("operation")],e&&(u=e(t,i,r),u)){if(o(u))return u;t=u}if(e=this[f(i)],e&&(u=e(t,r),u)){if(o(u))return u;t=u}return n.ajax(t)},_formatUrlNoKey:function(t){var r=this._url,i=this[e(t)];return i?n.isFunction(i)?i(r):r+"/"+i:r},_formatUrlWithKey:function(t,i){var u=this._url,r=this[e(t)];return r?n.isFunction(r)?r(u,i):u+"/"+r+"/"+encodeURIComponent(i):u+"/"+encodeURIComponent(i)}})}(jQuery,DevExpress),function(n,t,i){function u(t){return t&&n.isFunction(t.done)&&n.isFunction(t.fail)&&n.isFunction(t.promise)}function r(t){return n.Deferred().resolve(t).promise()}function f(t,i){if(!n.isFunction(i))throw Error(w+t);}function y(n){throw Error(b+n);}function e(n){function t(n){var t=n[0],i=n[1];return!t||!t.getResponseHeader?null:o.utils.errorMessageFromXhr(t,i)}return function(i){var r;r=i instanceof Error?i:Error(t(arguments)||i&&String(i)||"Unknown error"),n.reject(r)}}var o=t.data,p="CustomStore does not support creating queries",w="Required option is not specified or is not a function: ",b="Invalid return value: ",s="totalCount",h="load",c="byKey",l="insert",a="update",v="remove";o.CustomStore=o.Store.inherit({ctor:function(n){n=n||{},this.callBase(n),this._useDefaultSearch=!1,this._loadFunc=n[h],this._totalCountFunc=n[s],this._byKeyFunc=n[c]||n.lookup,this._insertFunc=n[l],this._updateFunc=n[a],this._removeFunc=n[v]},createQuery:function(){throw Error(p);},_totalCountImpl:function(t){var h=this._totalCountFunc,i,o=n.Deferred();return f(s,h),i=h(t),u(i)||(i=Number(i),isFinite(i)||y(s),i=r(i)),i.done(function(n){o.resolve(Number(n))}).fail(e(o)),o.promise()},_loadImpl:function(t){var c=this._loadFunc,o,s=n.Deferred();return f(h,c),o=c(t),n.isArray(o)?o=r(o):o===null||o===i?o=r([]):u(o)||y(h),o.done(function(n,t){s.resolve(n,t)}).fail(e(s)),this._addFailHandlers(s.promise())},_byKeyImpl:function(t){var s=this._byKeyFunc,i,o=n.Deferred();return f(c,s),i=s(t),u(i)||(i=r(i)),i.done(function(n){o.resolve(n)}).fail(e(o)),o.promise()},_insertImpl:function(t){var s=this._insertFunc,i,o=n.Deferred();return f(l,s),i=s(t),u(i)||(i=r(i)),i.done(function(n){o.resolve(t,n)}).fail(e(o)),o.promise()},_updateImpl:function(t,i){var h=this._updateFunc,o,s=n.Deferred();return f(a,h),o=h(t,i),u(o)||(o=r()),o.done(function(){s.resolve(t,i)}).fail(e(s)),s.promise()},_removeImpl:function(t){var s=this._removeFunc,i,o=n.Deferred();return f(v,s),i=s(t),u(i)||(i=r()),i.done(function(){o.resolve(t)}).fail(e(o)),o.promise()}})}(jQuery,DevExpress),function(n,t,i){function s(t){function f(){var i={};return n.each(["load","byKey","lookup","totalCount","insert","update","remove"],function(){i[this]=t[this],delete t[this]}),new e(i)}function s(n){var t=r[o[n.type]];return delete n.type,new t(n)}function h(t){return new e({load:function(){return n.getJSON(t)}})}var u;return typeof t=="string"&&(t=h(t)),t===i&&(t=[]),t=n.isArray(t)||t instanceof r.Store?{store:t}:n.extend({},t),u=t.store,"load"in t?u=f():n.isArray(u)?u=new r.ArrayStore(u):n.isPlainObject(u)&&(u=s(n.extend({},u))),t.store=u,t}function h(t){switch(t.length){case 0:return i;case 1:return t[0]}return n.makeArray(t)}function u(n){return function(){var t=h(arguments);return t!==i&&(this._storeLoadOptions[n]=t),this._storeLoadOptions[n]}}function l(n,t){t.refresh=!n._paginate||n._pageIndex===0,t.searchValue!==null&&(t.searchString=t.searchValue)}var r=t.data,e=r.CustomStore,c=t.Class,o={jaydata:"JayDataStore",breeze:"BreezeStore",odata:"ODataStore",local:"LocalStore",array:"ArrayStore"},f=c.inherit({ctor:function(t){t=s(t),this._store=t.store,this._storeLoadOptions=this._extractLoadOptions(t),this._mapFunc=t.map,this._postProcessFunc=t.postProcess,this._pageIndex=0,this._pageSize=t.pageSize!==i?t.pageSize:20,this._items=[],this._totalCount=-1,this._isLoaded=!1,this._loadingCount=0,this._preferSync=t._preferSync,this._loadQueue=this._createLoadQueue(),this._searchValue="searchValue"in t?t.searchValue:null,this._searchOperation=t.searchOperation||"contains",this._searchExpr=t.searchExpr,this._paginate=t.paginate,this._paginate===i&&(this._paginate=!this.group()),this._isLastPage=!this._paginate,this._userData={},this.changed=n.Callbacks(),this.loadError=n.Callbacks(),this.loadingChanged=n.Callbacks()},dispose:function(){this.changed.empty(),this.loadError.empty(),this.loadingChanged.empty(),delete this._store,this._disposed=!0},_extractLoadOptions:function(t){var r={},i=["sort","filter","select","group","requireTotalCount"],u=this._store._customLoadOptions();return u&&(i=i.concat(u)),n.each(i,function(){r[this]=t[this]}),r},loadOptions:function(){return this._storeLoadOptions},items:function(){return this._items},pageIndex:function(n){return n!==i&&(this._pageIndex=n,this._isLastPage=!this._paginate),this._pageIndex},paginate:function(n){if(arguments.length<1)return this._paginate;n=!!n,this._paginate!==n&&(this._paginate=n,this.pageIndex(0))},isLastPage:function(){return this._isLastPage},sort:u("sort"),filter:function(){var n=h(arguments);return n!==i&&(this._storeLoadOptions.filter=n,this.pageIndex(0)),this._storeLoadOptions.filter},group:u("group"),select:u("select"),searchValue:function(n){return n!==i&&(this.pageIndex(0),this._searchValue=n),this._searchValue},searchOperation:function(n){return n!==i&&(this.pageIndex(0),this._searchOperation=n),this._searchOperation},searchExpr:function(t){var i=arguments.length;return i&&(i>1&&(t=n.makeArray(arguments)),this.pageIndex(0),this._searchExpr=t),this._searchExpr},store:function(){return this._store},key:function(){return this._store&&this._store.key()},totalCount:function(){return this._totalCount},isLoaded:function(){return this._isLoaded},isLoading:function(){return this._loadingCount>0},_createLoadQueue:function(){return t.createQueue()},_changeLoadingCount:function(n){var i=this.isLoading(),t;this._loadingCount+=n,t=this.isLoading(),i^t&&this.loadingChanged.fire(t)},_scheduleLoadCallbacks:function(n){var t=this;t._changeLoadingCount(1),n.always(function(){t._changeLoadingCount(-1)})},_scheduleChangedCallbacks:function(n){var t=this;n.done(function(){t.changed.fire()})},load:function(){function e(){return r._disposed?i:r._loadFromStore(f,t)}var r=this,t=n.Deferred(),u=this.loadError,f;return this._scheduleLoadCallbacks(t),this._scheduleChangedCallbacks(t),f=this._createStoreLoadOptions(),this._loadQueue.add(function(){return e(),t.promise()},function(){r._changeLoadingCount(-1)}),t.promise().fail(n.proxy(u.fire,u))},_addSearchOptions:function(n){this._disposed||(this.store()._useDefaultSearch?this._addSearchFilter(n):(n.searchValue=this._searchValue,n.searchExpr=this._searchExpr))},_createStoreLoadOptions:function(){var t=n.extend({},this._storeLoadOptions);return this._addSearchOptions(t),this._paginate&&(t.pageIndex=this._pageIndex,this._pageSize&&(t.skip=this._pageIndex*this._pageSize,t.take=this._pageSize)),t.userData=this._userData,l(this,t),t},_addSearchFilter:function(t){var u=this._searchValue,f=this._searchOperation,i=this._searchExpr,r=[];u&&(i||(i="this"),n.isArray(i)||(i=[i]),n.each(i,function(n,t){r.length&&r.push("or"),r.push([t,f,u])}),t.filter=t.filter?[r,t.filter]:r)},_loadFromStore:function(i,r){function f(n,f){function e(){u._processStoreLoadResult(n,f,i,r)}u._preferSync?e():t.utils.executeAsync(e)}var u=this;return this.store().load(i).done(f).fail(n.proxy(r.reject,r))},_processStoreLoadResult:function(t,i,r,u){function e(){return f._isLoaded=!0,f._totalCount=isFinite(i.totalCount)?i.totalCount:-1,u.resolve(t,i)}function o(){f.store().totalCount(r).done(function(n){i.totalCount=n,e()}).fail(function(){})}var f=this;f._disposed||(t=f._transformLoadedData(t),n.isPlainObject(i)||(i={}),f._items=t,(!t.length||!f._paginate||f._pageSize&&t.length<f._pageSize)&&(f._isLastPage=!0),r.requireTotalCount&&!isFinite(i.totalCount)?o():e())},_transformLoadedData:function(t){var i=n.makeArray(t);return this._mapFunc&&(i=n.map(i,this._mapFunc)),this._postProcessFunc&&(i=this._postProcessFunc(i)),i}});r.Store.redefine({toDataSource:function(t){return new f(n.extend({store:this},t))}}),n.extend(!0,r,{DataSource:f,createDataSource:function(n){return new f(n)},utils:{storeTypeRegistry:o,normalizeDataSourceOptions:s}})}(jQuery,DevExpress),DevExpress.social={},function(n,t,i){function o(){}var ft=t.social,r=window.location,et=window.navigator,w=window.encodeURIComponent,ot=window.decodeURIComponent,s=et.standalone,h=!1,p;if(window.cordova)n(document).on("deviceready",function(){h=!0});var b="dx-facebook-access-token",c="dx-facebook-step1",l="dx-facebook-step2",u=null,k=null,d=n.Callbacks(),f,g=function(){return!!u},st=function(){return{accessToken:u,expiresIn:u?k:0}},a=ft.Facebook={loginRedirectUrl:"FacebookLoginCallback.html",connectionChanged:d,isConnected:g,getAccessTokenObject:st,jsonp:!1},ht=function(n,t){o(),t=t||{},f=h?"https://www.facebook.com/connect/login_success.html":ct();var u=(t.permissions||[]).join(),i="https://www.facebook.com/dialog/oauth?display=popup&client_id="+n+"&redirect_uri="+w(f)+"&scope="+w(u)+"&response_type=token";s&&e(c,r.href),h?at(i):lt(i)},ct=function(){var n=r.pathname.split(/\//g);return n.pop(),n.push(a.loginRedirectUrl),r.protocol+"//"+r.host+n.join("/")},lt=function(n){var t=512,i=320,r=(screen.width-t)/2,u=(screen.height-i)/2;window.open(n,null,"width="+t+",height="+i+",toolbar=0,scrollbars=0,status=0,resizable=0,menuBar=0,left="+r+",top="+u)},at=function(n){var t=window.open(n,"_blank");t.addEventListener("exit",function(){f=null}),t.addEventListener("loadstop",function(n){var i=unescape(n.url);i.indexOf(f)===0&&(t.close(),v(i))})},vt=function(){var n=window.opener;s?(e(l,r.href),r.href=y(c)):n&&n.DevExpress&&(n.DevExpress.social.Facebook._processLoginRedirectUrl(r.href),window.close())},v=function(n){var t=yt(n);k=t.expires_in,nt(t.access_token),f=null},yt=function(t){var r=t.split("#")[1],u,i;return r?(u=r.split(/&/g),i={},n.each(u,function(){var t=this.split("=");i[t[0]]=ot(t[1])}),i):{}},pt=function(){o(),nt(null)},nt=function(n){n!==u&&(u=n,e(b,n),d.fire(!!n))},tt=function(t,r,f){if(o(),!g())throw Error("Not connected");typeof r!="string"&&(f=r,r=i),r=(r||"get").toLowerCase();var e=n.Deferred(),s=arguments;return n.ajax({url:"https://graph.facebook.com/"+t,type:r,data:n.extend({access_token:u},f),dataType:a.jsonp&&r==="get"?"jsonp":"json"}).done(function(n){n=n||it(),n.error?e.reject(n.error):e.resolve(n)}).fail(function(i){var u,o;try{if(u=n.parseJSON(i.responseText),o=s[3]||0,o++<3&&u.error.code==190&&u.error.error_subcode==466){setTimeout(function(){tt(t,r,f,o).done(function(n){e.resolve(n)}).fail(function(n){e.reject(n)})},500);return}}catch(h){u=it()}e.reject(u.error)}),e.promise()},it=function(){return{error:{message:"Unknown error"}}},rt=function(){if(!ut())throw Error("HTML5 sessionStorage or jQuery.cookie plugin is required");},ut=function(){return!!(n.cookie||window.sessionStorage)},e=function(t,i){rt(),i=JSON.stringify(i),window.sessionStorage?i===null?sess.removeItem(t):sessionStorage.setItem(t,i):n.cookie(t,i)},y=function(t){rt();try{return JSON.parse(window.sessionStorage?sessionStorage.getItem(t):n.cookie(t))}catch(i){return null}};ut()&&(u=y(b)),s&&(p=y(l),p&&(v(p),e(c,null),e(l,null))),n.extend(a,{login:ht,logout:pt,handleLoginRedirect:vt,_processLoginRedirectUrl:v,api:tt})}(jQuery,DevExpress),function(n,t){var f=t.ui={},r="20px",e=function(i){var u,f,e,o,l,c;i=n.extend({},i);var a=t.devices.current(),o=t.devices.real(),s=i.allowZoom,h=i.allowPan,v="allowSelection"in i?i.allowSelection:a.platform=="desktop";if(t.overlayTargetContainer(".dx-viewport"),u="meta[name=viewport]",n(u).length||n("<meta />").attr("name","viewport").appendTo("head"),f=["width=device-width"],e=[],s?e.push("pinch-zoom"):f.push("initial-scale=1.0","maximum-scale=1.0, user-scalable=no"),h&&e.push("pan-x","pan-y"),h||s?n("html").css("-ms-overflow-style","-ms-autohiding-scrollbar"):n("html, body").css("overflow","hidden"),!v){if(o.ios)n(document).on("selectstart",function(){return!1});n(".dx-viewport").css("user-select","none")}if(n(u).attr("content",f.join()),n("html").css("-ms-touch-action",e.join(" ")||"none"),t.support.touch)n(document).off(".dxInitViewport").on("touchmove.dxInitViewport",function(n){var t=n.originalEvent.touches.length,i=!s&&t>1,r=!h&&t===1&&!n.isScrollingEvent;(i||r)&&n.preventDefault()});if(navigator.userAgent.match(/IEMobile\/10\.0/)&&(n(document.head).append(n("<style/>").text("@-ms-viewport{ width: auto!important; user-zoom: fixed; max-zoom: 1; min-zoom: 1; }")),n(window).bind("load resize",function(){var r=44,u=21,f=72,i="Notify"in window.external,e=i?r:0,o=i?u:f,s=n(window).width()<n(window).height()?Math.round(screen.availHeight*(document.body.clientWidth/screen.availWidth))-o:Math.round(screen.availWidth*(document.body.clientHeight/screen.availHeight))-e;document.body.style.setProperty("min-height",s+"px","important")})),o=t.devices.real(),o.ios)if(l=document.location.protocol=="file:",l){n(".dx-viewport").css("position","relative"),n("body").css({"box-sizing":"border-box"}),n("body").css(o.version[0]>6?{"padding-top":r}:{"padding-bottom":r}),c=function(){var t="height=device-"+(Math.abs(window.orientation)===90?"width":"height");n(u).attr("content",f.join()+","+t)};n(window).on("orientationchange",c);c()}else n(window).on("resize",function(){var i=n(window).width();setTimeout(function(){n("body").width(i)},0)})},o=t.Class.inherit({getTemplateClass:function(){return u},supportDefaultTemplate:function(){return!1},getDefaultTemplate:function(){return null}}),u=t.Class.inherit({ctor:function(t){this._template=this._element=n(t).detach()},render:function(n){var t=this._template.clone();return n.append(t),t},dispose:n.noop});t.registerActionExecutor({designMode:{validate:function(n){t.designMode&&(n.canceled=!0)}},gesture:{validate:function(n){if(n.args.length)for(var i=n.args[0],t=i.itemElement||i.element;t&&t.length;){if(t.data("dxGesture")){n.canceled=!0;break}t=t.parent()}}},disabled:{validate:function(n){if(n.args.length){var t=n.args[0],i=t.itemElement||t.element;i&&i.is(".dx-state-disabled, .dx-state-disabled *")&&(n.canceled=!0)}}}}),n.extend(f,{TemplateProvider:o,Template:u,initViewport:e})}(jQuery,DevExpress),function(n,t){var c=t.ui,l=n.event,a=l.special,v={mouse:/mouse/i,touch:/^touch/i,keyboard:/^key/i,pointer:/pointer/i},u=function(t){var i="other";return n.each(v,function(n){if(this.test(t.type))return i=n,!1}),i},f=function(n){return u(n)==="pointer"},e=function(n){return u(n)==="mouse"||f(n)&&n.pointerType==="mouse"},r=function(n){return u(n)==="touch"||f(n)&&n.pointerType==="touch"},o=function(n){return u(n)==="keyboard"},s=function(t,i){return typeof t=="string"?s(t.split(/\s+/g),i):(n.each(t,function(n,r){t[n]=r+"."+i}),t.join(" "))},y=function(n){var t;return f(n)&&r(n)?(t=(n.originalEvent.originalEvent||n.originalEvent).changedTouches[0],{x:t.pageX,y:t.pageY,time:n.timeStamp}):e(n)?{x:n.pageX,y:n.pageY,time:n.timeStamp}:r(n)?(t=(n.changedTouches||n.originalEvent.changedTouches)[0],{x:t.pageX,y:t.pageY,time:n.timeStamp}):void 0},p=function(n,t){return{x:t.x-n.x,y:t.y-n.y,time:t.time-n.time||1}},w=function(n){return e(n)||f(n)?0:r(n)?n.originalEvent.touches.length:void 0},b=function(t){var i=n(t.target),u=i.is("input, textarea, select");return e(t)?u||t.which>1:r(t)?u&&i.is(":focus")||(t.originalEvent.changedTouches||t.originalEvent.originalEvent.changedTouches).length!==1:void 0},h=function(t,i){var u=n.Event(t,i),s=u.originalEvent,f=n.event.props.slice();return(e(t)||r(t))&&n.merge(f,n.event.mouseHooks.props),o(t)&&n.merge(f,n.event.keyHooks.props),s&&n.each(f,function(){u[this]=s[this]}),u},k=function(t){var i=h(t.originalEvent,t);return n.event.trigger(i,null,t.target||i.target),i},d=function(t,i){var r=n(t.target).data("dxGestureEvent");return!r||r===i?(n(t.target).data("dxGestureEvent",i),!0):!1},g=function(t,i){var r={};"noBubble"in i&&(r.noBubble=i.noBubble),"bindType"in i&&(r.bindType=i.bindType),"delegateType"in i&&(r.delegateType=i.delegateType),n.each(["setup","teardown","add","remove","trigger","handle","_default","dispose"],function(t,u){i[u]&&(r[u]=function(){var t=n.makeArray(arguments);return t.unshift(this),i[u].apply(i,t)})}),a[t]=r};c.events={eventSource:u,isPointerEvent:f,isMouseEvent:e,isTouchEvent:r,isKeyboardEvent:o,addNamespace:s,hasTouches:w,eventData:y,eventDelta:p,needSkipEvent:b,createEvent:h,fireEvent:k,handleGestureEvent:d,registerEvent:g}}(jQuery,DevExpress),function(n,t,i){var u="dxComponents",f=t.ui,r=t.data.utils,e=t.Class.inherit({NAME:null,_defaultOptions:function(){return{}},_optionsByReference:function(){return{}},ctor:function(i,r){this._$element=n(i),this._element().data(this.NAME,this),this._element().data(u)||this._element().data(u,[]),this._element().data(u).push(this.NAME),this._options={},this._updateLockCount=0,this._requireRefresh=!1,this.optionChanged=n.Callbacks(),this.disposing=n.Callbacks(),this.beginUpdate();try{var e=t.devices.current(),o=f.optionsByDevice(e,this.NAME)||{};this.option(this._defaultOptions()),this.option(o),this._initOptions(r||{})}finally{this.endUpdate()}},_initOptions:function(n){this.option(n)},_optionValuesEqual:function(n,t,i){return(t=r.toComparable(t,!0),i=r.toComparable(i,!0),t&&i&&t.jquery&&i.jquery)?i.is(t):t===null||typeof t!="object"?t===i:!1},_init:n.noop,_render:n.noop,_clean:n.noop,_modelByElement:n.noop,_invalidate:function(){this._requireRefresh=!0},_refresh:function(){this._clean(),this._render()},_dispose:function(){this._clean(),this.optionChanged.empty(),this.disposing.fireWith(this).empty()},_createAction:function(i,r){var u=this,f,e,o;return r=n.extend({},r),f=r.element||u._element(),e=u._modelByElement(f),r.context=e||u,r.component=u,o=new t.Action(i,r),function(t){return arguments.length||(t={}),n.isPlainObject(t)||(t={actionValue:t}),o.execute.call(o,n.extend(t,{component:u,element:f,model:e}))}},_createActionByOption:function(n,t){if(typeof n!="string")throw Error("Option name type is unexpected");return this._createAction(this.option(n),t)},_optionChanged:function(){},_element:function(){return this._$element},instance:function(){return this},beginUpdate:function(){this._updateLockCount++},endUpdate:function(){if(this._updateLockCount--,!this._updateLockCount)if(this._initializing||this._initialized)this._requireRefresh&&(this._requireRefresh=!1,this._refresh());else{this._initializing=!0;try{this._init()}finally{this._initializing=!1,this._initialized=!0}this._render()}},option:function(t){var i=this,u=t,f=arguments[1];if(arguments.length<2&&n.type(u)!=="object")return r.compileGetter(u)(i._options,{functionsAsIs:!0});typeof u=="string"&&(t={},t[u]=f),i.beginUpdate();try{n.each(t,function(n,t){var u=r.compileGetter(n)(i._options,{functionsAsIs:!0}),f;i._optionValuesEqual(n,u,t)||(r.compileSetter(n)(i._options,t,{functionsAsIs:!0,merge:!i._optionsByReference()[n]}),f=n.split(/[.\[]/)[0],i._initialized&&(i.optionChanged.fireWith(i,[f,t,u]),i._optionChanged(f,t,u)))})}finally{i.endUpdate()}}}),o=function(r,u){f[r]=u,u.prototype.NAME=r,n.fn[r]=function(f){var h=typeof f=="string",e=i,o,s;return h?(o=f,s=n.makeArray(arguments).slice(1),this.each(function(){var u=n(this).data(r),f,h;if(!u)throw Error(t.utils.stringFormat("Component {0} has not been initialized on this element",r));f=u[o],h=f.apply(u,s),e===i&&(e=h)})):(this.each(function(){var t=n(this).data(r);t?t.option(f):new u(this,f)}),e=this),e}},s=function(t){t=n(t);var i=t.data(u);return i?n.map(i,function(n){return t.data(n)}):[]},h=function(){n.each(s(this),function(){this._dispose()})},c=n.cleanData;n.cleanData=function(t){return n.each(t,h),c.apply(this,arguments)},n.extend(f,{Component:e,registerComponent:o})}(jQuery,DevExpress),function(n,t,i){var r=window.ko,o,v,y,p,w,b;if(t.support.hasKo){(function(n){if(n=n.split("."),n[0]<2||n[0]==2&&n[1]<3)throw Error("Your version of KnockoutJS is too old. Please upgrade KnockoutJS to 2.3.0 or later.");})(r.version);var e=t.ui,s=e.events,h="dxKoLocks",l="dxKoCreation",k=function(){var n={},t=function(t){return n[t]||0};return{obtain:function(i){n[i]=t(i)+1},release:function(i){var r=t(i);r===1?delete n[i]:n[i]=r-1},locked:function(n){return t(n)>0}}},d=function(t){r.bindingHandlers[t]={init:function(i,u){var f=n(i),o={},s={},c=function(n,i){var e=f.data(t),u=f.data(h),c=r.utils.unwrapObservable(i);if(e){if(u.locked(n))return;u.obtain(n);try{e.option(n,c)}finally{u.release(n)}}else o[n]=c,r.isWriteableObservable(i)&&(s[n]=i)},a=function(n,t){if(n in s){var r=this._$element,i=r.data(h);if(!i.locked(n)){i.obtain(n);try{s[n](t)}finally{i.release(n)}}}};return r.computed(function(){var e=f.data(t);e&&e.beginUpdate(),n.each(r.unwrap(u()),function(n,t){r.computed(function(){c(n,t)},null,{disposeWhenNodeIsRemoved:i})}),e&&e.endUpdate()},null,{disposeWhenNodeIsRemoved:i}),o&&(f.data(l,!0),f[t](o),o=null,f.data(h,new k),f.data(t).optionChanged.add(a)),{controlsDescendantBindings:e[t].subclassOf(e.Widget)}}}},g=e.Component.inherit({_modelByElement:function(n){if(n.length)return r.dataFor(n.get(0))}}),nt=e.registerComponent,tt=function(n,t){nt(n,t),d(n)},c=e.Template.inherit({ctor:function(t){this.callBase.apply(this,arguments),this._template=n("<div>").append(t),this._registerKoTemplate()},_cleanTemplateElement:function(){this._element.each(function(){r.cleanNode(this)})},_registerKoTemplate:function(){var n=this._template.get(0);new r.templateSources.anonymousTemplate(n).nodes(n)},render:function(t,u){var e;u=u!==i?u:r.dataFor(t.get(0))||{};var o=r.contextFor(t[0]),s=o?o.createChildContext(u):u,f=n("<div />").appendTo(t);return r.renderTemplate(this._template.get(0),s,null,f.get(0)),e=f.contents(),t.append(e),f.remove(),e},dispose:function(){this._template.remove()}}),it=e.TemplateProvider.inherit({getTemplateClass:function(){return c},supportDefaultTemplate:function(n){return this._createdWithKo(n)?!0:this.callBase(n)},getDefaultTemplate:function(n){if(this._createdWithKo(n))return a(n.NAME)},_createdWithKo:function(n){return!!n._element().data(l)}});r.bindingHandlers.dxAction={update:function(i,u,f,e){var h=n(i),o=r.utils.unwrapObservable(u()),c=o,s={context:i},l;o.execute&&(c=o.execute,n.extend(s,o)),l=new t.Action(c,s);h.off(".dxActionBinding").on("dxclick.dxActionBinding",function(n){l.execute({element:h,model:e,evaluate:function(n){var u=e,f;return n.length>0&&n[0]==="$"&&(u=r.contextFor(i)),f=t.data.utils.compileGetter(n),f(u)},jQueryEvent:n}),s.bubbling||n.stopPropagation()})}};var a=function(){var n={};return function(i){if(u[i]||(i="base"),!n[i]){var r=u[i](),f=t.utils.createMarkupFromString(r);n[i]=new c(f)}return n[i]}}(),f=function(t,r,u,f){u=u===i?!0:u;var e=n.map(r,function(n,t){return t+":"+n}).join(",");return f=f||"","<"+t+' data-bind="'+e+'" '+f+">"+(u?"<\/"+t+">":"")},rt={css:"{ 'dx-state-disabled': $data.disabled, 'dx-state-invisible': !($data.visible === undefined || ko.unwrap($data.visible)) }"},u={base:function(){var n=[f("div",rt,!1)],t=f("div",{html:"html"}),i=f("div",{text:"text"}),r=f("div",{text:"String($data)"});return n.push("<!-- ko if: $data.html && !$data.text -->",t,"<!-- /ko -->","<!-- ko if: !$data.html && $data.text -->",i,"<!-- /ko -->","<!-- ko ifnot: $.isPlainObject($data) -->",r,"<!-- /ko -->","<\/div>"),n.join("")}};u.dxPivotTabs=function(){var n=u.base(),t=f("span",{text:"title"}),i=n.indexOf(">")+1,r=n.length-6;return n=[n.substring(0,i),t,n.substring(r,n.length)],n.join("")},u.dxPanorama=function(){var n=u.base(),i=f("div",{text:"header"},!0,'class="dx-panorama-item-header"'),t=n.indexOf(">")+1;return n=[n.substring(0,t),"<!-- ko if: $data.header -->",i,"<!-- /ko -->",n.substring(t,n.length)],n.join("")},u.dxList=function(){var n=u.base(),t=f("div",{text:"key"});return n=[n.substring(0,n.length-6),"<!-- ko if: $data.key -->"+t+"<!-- /ko -->","<\/div>"],n.join("")},u.dxToolbar=function(){var i=u.base();return i=[i.substring(0,i.length-6),"<!-- ko if: $data.widget -->"],n.each(["button","tabs","dropDownMenu"],function(){var r=t.inflector.camelize(["dx","-",this].join("")),n={};n[r]="$data.options",i.push("<!-- ko if: $data.widget === '",this,"' -->",f("div",n),"<!-- /ko -->")}),i.push("<!-- /ko -->"),i.join("")},u.dxGallery=function(){var n=u.base(),t=f("div",{text:"String($data)"}),i=f("img",{attr:"{ src: String($data) }"},!1);return n=n.replace(t,i)},u.dxTabs=function(){var n=u.base(),t=f("div",{text:"text"}),i=f("span",{attr:"{ 'class': 'dx-icon-' + $data.icon }",css:"{ 'dx-icon': true }"}),r=f("img",{attr:"{ src: $data.iconSrc }",css:"{ 'dx-icon': true }"},!1),e="<!-- ko if: $data.icon -->"+i+"<!-- /ko --><!-- ko if: !$data.icon && $data.iconSrc -->"+r+'<!-- /ko --><span class="dx-tab-text" data-bind="text: $data.text"><\/span>';return n=n.replace("<!-- ko if: !$data.html && $data.text -->","<!-- ko if: !$data.html && ($data.text || $data.icon || $data.iconSrc) -->").replace(t,e)},u.dxActionSheet=function(){return f("div",{dxButton:"{ text: $data.text, clickAction: $data.clickAction, type: $data.type, disabled: !!ko.unwrap($data.disabled) }"})},u.dxNavBar=u.dxTabs,o=function(n,t){var i=function(){r.cleanNode(this)};t?n.each(i):n.find("*").each(i)},v=n.fn.empty,n.fn.empty=function(){return o(this,!1),v.apply(this,arguments)},y=n.fn.remove,n.fn.remove=function(n,t){if(!t){var i=this;n&&(i=i.filter(n)),o(i,!0)}return y.call(this,n,t)},p=n.fn.html,n.fn.html=function(n){return typeof n=="string"&&o(this,!1),p.apply(this,arguments)},n.extend(e,{Component:g,registerComponent:tt,TemplateProvider:it,Template:c,defaultTemplate:a}),w=s.registerEvent,b=function(t,i){w(t,i);var u=s.addNamespace(t,t+"Binding");r.bindingHandlers[t]={update:function(t,i,f,e){var s=n(t),o=r.utils.unwrapObservable(i()),h=o.execute?o.execute:o;s.off(u).on(u,n.isPlainObject(o)?o:{},function(n){h(e,n)})}}},n.extend(s,{registerEvent:b})}}(jQuery,DevExpress),function(n,t,i){var p,w;if(t.support.hasNg){var b=window.angular,u=t.ui,h=u.events,e=t.data.utils.compileSetter,o=t.data.utils.compileGetter,c="dxNgCreation",k="dxTemplates",l="dxNgCompiler",a="dxDefaultCompilerGetter",d="template",v=b.module("dx",[]),g=t.Class.inherit({ctor:function(t){this._componentName=t.componentName,this._compile=t.compile,this._$element=t.$element,this._componentDisposing=n.Callbacks(),this._$templates=this._extractTemplates()},init:function(n){this._scope=n.scope,this._$element=n.$element,this._ngOptions=n.ngOptions,this._$element.data(c,!0),n.ngOptions.data&&this._initDataScope(n.ngOptions.data)},initDefaultCompilerGetter:function(){var n=this;n._$element.data(a,function(t){return n._compilerByTemplate(t)})},initTemplateCompilers:function(){var t=this;this._$templates&&this._$templates.each(function(i,r){n(r).data(l,t._compilerByTemplate(r))})},initComponentWithBindings:function(){this._initComponent(this._scope),this._initComponentBindings()},_initDataScope:function(t){if(typeof t=="string"){var r=t,i=this._scope;t=i.$eval(t),this._scope=i.$new(),this._synchronizeDataScopes(i,this._scope,t,r)}n.extend(this._scope,t)},_synchronizeDataScopes:function(t,i,r,u){var f=this;n.each(r,function(n){f._synchronizeScopeField({parentScope:t,childScope:i,fieldPath:n,parentPrefix:u})})},_initComponent:function(n){this._component=this._$element[this._componentName](this._evalOptions(n)).data(this._componentName)},_initComponentBindings:function(){var t=this,i={};t._ngOptions.bindingOptions&&n.each(t._ngOptions.bindingOptions,function(n,r){var f=n.search(/\[|\./),u=f>-1?n.substring(0,f):n,e;i[u]||(i[u]={}),i[u][n]=r,e=t._scope.$watch(r,function(i,r){i!==r&&t._component.option(n,i)},!0),t._component.disposing.add(function(){e(),t._componentDisposing.fire()})}),t._component.optionChanged.add(function(r,u){t._scope.$root.$$phase!=="$digest"&&i&&i[r]&&y(function(t){n.each(i[r],function(n,i){var s=e(i),h=o(n),f={};f[r]=u,s(t,h(f))})},t._scope)})},_extractTemplates:function(){var t,i;return u[this._componentName].subclassOf(u.Widget)&&n.trim(this._$element.html())&&(i=!this._$element.children().first().attr("data-options"),t=i?n("<div/>").attr("data-options","dxTemplate: { name: '"+d+"' }").append(this._$element.contents()):this._$element.children().detach(),this._$element.data(k,t)),t},_compilerByTemplate:function(t){var r=this,u=this._getScopeItemsPath();return function(f,e){var s=n(t).clone(),h,o;if(f!==i){h=f.$id,o=h?f:r._createScopeWithData(f);s.on("$destroy",function(){var n=!o.$parent;n||o.$destroy()})}else o=r._scope;return u&&r._synchronizeScopes(o,u,e),y(r._compile(s),o),s}},_getScopeItemsPath:function(){if(u[this._componentName].subclassOf(u.CollectionContainerWidget)&&this._ngOptions.bindingOptions)return this._ngOptions.bindingOptions.items},_createScopeWithData:function(t){var i=this._scope.$new();return typeof t=="object"?n.extend(i,t):i.scopeValue=t,i},_synchronizeScopes:function(t,i,r){var f=this,u=o(i+"["+r+"]")(this._scope);n.isPlainObject(u)||(u={scopeValue:u}),n.each(u,function(n){f._synchronizeScopeField({parentScope:f._scope,childScope:t,fieldPath:n,parentPrefix:i,itemIndex:r})})},_synchronizeScopeField:function(n){var r=n.parentScope,c=n.childScope,t=n.fieldPath,l=n.parentPrefix,u=n.itemIndex,y=t==="scopeValue"?"":"."+t,a=u!==i,f=[l],s,v,h;a&&f.push("[",u,"]"),f.push(y),s=f.join(""),v=r.$watch(s,function(n,i){n!==i&&e(t)(c,n)}),h=c.$watch(t,function(n,t){if(n!==t){if(a&&!o(l)(r)[u]){h();return}e(s)(r,n)}}),this._componentDisposing.add([v,h])},_evalOptions:function(t){var i=n.extend({},this._ngOptions);return delete i.data,delete i.bindingOptions,this._ngOptions.bindingOptions&&n.each(this._ngOptions.bindingOptions,function(n,r){i[n]=t.$eval(r)}),i}}),y=function(n,t){t.$root.$$phase?n(t):t.$apply(function(){n(t)})},nt=u.Component.inherit({_modelByElement:function(n){if(n.length)return n.scope()},_createActionByOption:function(){var n=this.callBase.apply(this,arguments),t=this;return function(){var r=this,i=t._modelByElement(t._element()),u=arguments;return!i||i.$root.$$phase?n.apply(r,u):i.$apply(function(){return n.apply(r,u)})}}}),tt=u.registerComponent,it=function(n,t){tt(n,t),v.directive(n,["$compile",function(t){return{restrict:"A",compile:function(i){var r=new g({componentName:n,compile:t,$element:i});return function(t,i,u){r.init({scope:t,$element:i,ngOptions:u[n]?t.$eval(u[n]):{}}),r.initTemplateCompilers(),r.initDefaultCompilerGetter(),r.initComponentWithBindings()}}}}])},s=u.Template.inherit({ctor:function(){this.callBase.apply(this,arguments),this._compiler=this._template.data(l)},render:function(t,i,r){var u=this._compiler,f=n.isFunction(u)?u(i,r):u;return t.append(f),f},setCompiler:function(n){this._compiler=n(this._element)}}),rt=u.TemplateProvider.inherit({getTemplateClass:function(n){return this._createdWithNg(n)?s:this.callBase(n)},supportDefaultTemplate:function(n){return this._createdWithNg(n)?!0:this.callBase(n)},getDefaultTemplate:function(n){if(this._createdWithNg(n)){var i=n._element().data(a),t=ut(n.NAME);return t.setCompiler(i),t}},_createdWithNg:function(n){return!!n._element().data(c)}}),ut=function(){var n={};return function(t){return r[t]||(t="base"),n[t]||(n[t]=r[t]()),new s(n[t])}}(),f={container:function(){return n("<div/>").attr("ng-class","{ 'dx-state-invisible': !visible && visible != undefined, 'dx-state-disabled': !!disabled }").attr("ng-switch","").attr("on","html && 'html' || text && 'text' || scopeValue && 'scopeValue'")},html:function(){return n("<div/>").attr("ng-switch-when","html").attr("ng-bind-html-unsafe","html")},text:function(){return n("<div/>").attr("ng-switch-when","text").attr("ng-bind","text")},primitive:function(){return n("<div/>").attr("ng-switch-when","scopeValue").attr("ng-bind-html-unsafe","'' + scopeValue")}},r={base:function(){return f.container().append(f.html()).append(f.text()).append(f.primitive())}};r.dxList=function(){return r.base().attr("on","html && 'html' || text && 'text' || scopeValue && 'scopeValue' || key && 'key'").append(n("<div/>").attr("ng-switch-when","key").attr("ng-bind","key"))},r.dxToolbar=function(){var i=r.base().attr("on","html && 'html' || text && 'text' || scopeValue && 'scopeValue' || widget");return n.each(["button","tabs","dropDownMenu"],function(r,u){var f="dx-"+t.inflector.dasherize(this);n("<div/>").attr("ng-switch-when",u).attr(f,"options").appendTo(i)}),i},r.dxGallery=function(){return f.container().append(f.html()).append(f.text()).append(n("<img/>").attr("ng-switch-when","scopeValue").attr("ng-src","{{'' + scopeValue}}"))},r.dxTabs=function(){var i=f.container().attr("on","html && 'html' ||  icon && 'icon' ||  iconSrc && 'iconSrc' ||  text && 'text' || scopeValue && 'scopeValue'"),t=n("<span/>").addClass("dx-tab-text").attr("ng-bind","text"),r=n("<span/>").attr("ng-switch-when","icon").addClass("dx-icon").attr("ng-class","'dx-icon-' + icon").add(t.attr("ng-switch-when","icon")),u=n("<img/>").attr("ng-switch-when","iconSrc").addClass("dx-icon").attr("ng-src","{{iconSrc}}").add(t.attr("ng-switch-when","iconSrc"));return i.append(f.html()).append(r).append(u).append(t.attr("ng-switch-when","text")).append(f.primitive())},r.dxActionSheet=function(){return n("<div/>").attr("dx-button","{ bindingOptions: { text: 'text', clickAction: 'clickAction', type: 'type', disabled: 'disabled' } }")},r.dxNavBar=r.dxTabs,n.extend(u,{Component:nt,registerComponent:it,Template:s,TemplateProvider:rt}),p=h.registerEvent,w=function(t,i){p(t,i);var r=t.slice(0,2)+t.charAt(2).toUpperCase()+t.slice(3);v.directive(r,["$parse",function(i){return function(u,f,e){var h=n.trim(e[r]),o,s={};h.charAt(0)==="{"?(s=u.$eval(h),o=i(s.execute)):o=i(e[r]);f.on(t,s,function(n){u.$apply(function(){o(u,{$event:n})})})}}])},n.extend(h,{registerEvent:w})}}(jQuery,DevExpress),function(n,t){var u=t.ui,e={text:"Ok",clickAction:function(){return!0}},r="dx-dialog",o=r+"-wrapper",s=r+"-root",h=r+"-content",c=r+"-message",l=r+"-buttons",a=r+"-button",v=function(i){function nt(){return f.show(),v.promise()}function w(n){f.hide().done(function(){f._element().remove()}),v.resolve(y||n)}var b=this,y,v;if(!u.dxPopup)throw new Error("DevExpress.ui.dxPopup required");v=n.Deferred(),i=n.extend(u.optionsByDevice(t.devices.current(),"dxDialog"),i);var k=n(".dx-viewport"),d=n("<div/>").addClass(r).appendTo(k),g=n("<div/>").addClass(c).html(String(i.message)),p=n("<div/>").addClass(l),f=d.dxPopup({title:i.title||b.title,height:"auto",width:function(){var r=n(window).height()>n(window).width(),t=(r?"p":"l")+"Width";return i.hasOwnProperty(t)?i[t]:i.width},contentReadyAction:function(){f.content().addClass(h).append(g).append(p)},animation:{show:{type:"pop",duration:400},hide:{type:"pop",duration:400,to:{opacity:0,scale:0},from:{opacity:1,scale:1}}}}).data("dxPopup");return f._wrapper().addClass(o),i.position&&f.option("position",i.position),n.each(i.buttons||[e],function(){var i=n("<div/>").addClass(a).appendTo(p),r=new t.Action(this.clickAction,{context:f});i.dxButton(n.extend(this,{clickAction:function(){y=r.execute(arguments),w()}}))}),f._wrapper().addClass(s),{show:nt,hide:w}},f=function(t,i){var r,f=n.isPlainObject(t)?t:{title:i,message:t};return r=u.dialog.custom(f),r.show()},y=function(t,i){var r,f=n.isPlainObject(t)?t:{title:i,message:t,buttons:[{text:Globalize.localize("Yes"),clickAction:function(){return!0}},{text:Globalize.localize("No"),clickAction:function(){return!1}}]};return r=u.dialog.custom(f),r.show()},p=function(i,r,e){var o,s;if(o=n.isPlainObject(i)?i:{message:i},!u.dxToast){f(o.message);return}r&&(o.type=r),e&&(o.displayTime=e),s=n("<div/>").appendTo(".dx-viewport").addClass("dx-static").dxToast(o).data("dxToast"),s.option("hiddenAction",function(n){n.element.remove(),new t.Action(o.hiddenAction,{context:n.model}).execute(arguments)}),s.show()};n.extend(u,{notify:p,dialog:{custom:v,alert:f,confirm:y}})}(jQuery,DevExpress),function(n,t){var r=t.data,u="_dataSourceOptions",f="_handleDataSourceChanged",e="_handleDataSourceLoadError",o="_handleDataSourceLoadingChanged";t.ui.DataHelperMixin={ctor:function(){this.disposing.add(function(){this._disposeDataSource()})},_refreshDataSource:function(){this._initDataSource(),this._loadDataSource()},_initDataSource:function(){var t=this.option("dataSource"),i,f;this._disposeDataSource(),t&&(t instanceof r.DataSource?(this._isSharedDataSource=!0,this._dataSource=t):(i=u in this?this[u]():{},f=this._dataSourceType?this._dataSourceType():r.DataSource,this._dataSource=new f(n.extend(!0,{},i,r.utils.normalizeDataSourceOptions(t)))),this._addDataSourceHandlers())},_addDataSourceHandlers:function(){f in this&&this._addDataSourceChangeHandler(),e in this&&this._addDataSourceLoadErrorHandler(),o in this&&this._addDataSourceLoadingChangedHandler()},_addDataSourceChangeHandler:function(){var t=this,n=this._dataSource;this._dataSourceChangedHandler=function(){t[f](n.items())},n.changed.add(this._dataSourceChangedHandler)},_addDataSourceLoadErrorHandler:function(){this._dataSourceLoadErrorHandler=n.proxy(this[e],this),this._dataSource.loadError.add(this._dataSourceLoadErrorHandler)},_addDataSourceLoadingChangedHandler:function(){this._dataSourceLoadingChangedHandler=n.proxy(this[o],this),this._dataSource.loadingChanged.add(this._dataSourceLoadingChangedHandler)},_loadDataSource:function(){if(this._dataSource){var n=this._dataSource;n.isLoaded()?this._dataSourceChangedHandler():n.load()}},_disposeDataSource:function(){this._dataSource&&(this._isSharedDataSource?(delete this._isSharedDataSource,this._dataSource.changed.remove(this._dataSourceChangedHandler),this._dataSource.loadError.remove(this._dataSourceLoadErrorHandler),this._dataSource.loadingChanged.remove(this._dataSourceLoadingChangedHandler)):this._dataSource.dispose(),delete this._dataSource,delete this._dataSourceChangedHandler,delete this._dataSourceLoadErrorHandler,delete this._dataSourceLoadingChangedHandler)}}}(jQuery,DevExpress),function(n){var r={2:"touch",3:"pen",4:"mouse"},u={filter:function(t,i){var u=i.pointerType;return n.isNumeric(u)&&(t.pointerType=r[u]),t},props:n.event.mouseHooks.props.concat(["pointerId","originalTarget","namespace","width","height","pressure","result","tiltX","charCode","tiltY","detail","isPrimary","prevValue"])};n.each(["MSPointerDown","MSPointerMove","MSPointerUp","MSPointerCancel","MSPointerOver","MSPointerOut","MSPointerEnter","MSPointerLeave","pointerdown","pointermove","pointerup","pointercancel","pointerover","pointerout","pointerenter","pointerleave"],function(){n.event.fixHooks[this]=u})}(jQuery,DevExpress),function(n){var r={filter:function(t,i){return i.changedTouches.length&&n.each(["pageX","pageY","screenX","screenY","clientX","clientY"],function(){t[this]=i.changedTouches[0][this]}),t},props:n.event.mouseHooks.props.concat(["touches","changedTouches","targetTouches","detail","result","namespace","originalTarget","charCode","prevValue"])};n.each(["touchstart","touchmove","touchend","touchcancel"],function(){n.event.fixHooks[this]=r})}(jQuery,DevExpress),function(n,t){var h=t.ui,f=t.support,u=t.devices.real(),r=h.events,c="dxPointerEvents",l={dxpointerdown:"mousedown",dxpointermove:"mousemove",dxpointerup:"mouseup",dxpointercancel:""},a={dxpointerdown:"touchstart",dxpointermove:"touchmove",dxpointerup:"touchend",dxpointercancel:"touchcancel"},w={dxpointerdown:"pointerdown",dxpointermove:"pointermove",dxpointerup:"pointerup",dxpointercancel:"pointercancel"},e={dxpointerdown:"touchstart mousedown",dxpointermove:"touchmove mousemove",dxpointerup:"touchend mouseup",dxpointercancel:"touchcancel"},o=function(){return f.touch&&!(u.tablet||u.phone)?e:f.touch?a:l}(),v=function(n){return u.platform==="ios"&&(n==="dxpointerdown"||n==="dxpointerup")},s=t.Class.inherit({ctor:function(n,t){this._eventName=n,this._eventNamespace=[c,".",this._eventName].join(""),this._originalEvents=t,this._pointerId=0,this._handlerCount=0},_handler:function(t){if(this._eventName==="dxpointerdown"&&n(t.target).data("dxGestureEvent",null),r.isTouchEvent(t)&&v(this._eventName)){var i=t.changedTouches[0];if(this._pointerId===i.identifier)return;this._pointerId=i.identifier}return r.fireEvent({type:this._eventName,pointerType:r.eventSource(t),originalEvent:t})},setup:function(){if(!(this._handlerCount>0))n(document).on(r.addNamespace(this._originalEvents,this._eventNamespace),n.proxy(this._handler,this))},add:function(){this._handlerCount++},remove:function(){this._handlerCount--},teardown:function(){this._handlerCount||n(document).off("."+this._eventNamespace)},dispose:function(){n(document).off("."+this._eventNamespace)}}),y=s.inherit({EVENT_LOCK_TIMEOUT:100,_handler:function(t){if(r.isTouchEvent(t)&&(this._skipNextEvents=!0),!r.isMouseEvent(t)||!this._mouseLocked){if(r.isMouseEvent(t)&&this._skipNextEvents){this._skipNextEvents=!1,this._mouseLocked=!0,clearTimeout(this._unlockMouseTimer),this._unlockMouseTimer=setTimeout(n.proxy(function(){this._mouseLocked=!1},this),this.EVENT_LOCK_TIMEOUT);return}return this.callBase(t)}},dispose:function(){this.callBase(),this._skipNextEvents=!1,this._mouseLocked=!1,clearTimeout(this._unlockMouseTimer)}}),p=function(){return o===e?y:s};n.each(o,function(n,t){var i=p();r.registerEvent(n,new i(n,t))})}(jQuery,DevExpress),function(n,t,i){var a=navigator.userAgent,h=i.screen,v=t.ui,y=t.utils,u=v.events,p=t.support,o=t.devices.real(),w="dxSpecialEvents",f="dxClick"+w,e="dxclick",s="dxClickScrollableParent",c="dxClickScrollableParentOffset",l=function(){var n=o.deviceType==="phone"&&h.height<=480,t=o.deviceType==="tablet"&&i.devicePixelRatio<2,r=o.platform==="ios"&&o.version[0]>6;return r&&(n||t)}(),b=function(){if(!p.touch)return!0;var t=a.match(/Chrome\/([0-9]+)/)||[],r=!!t[0],u=~~t[1],f=o.platform==="android";if(r)if(f){if(u>31&&i.innerWidth<=h.width||n("meta[name=viewport][content*='user-scalable=no']").length)return!0}else return!0;return!1}(),k=t.Class.inherit({TOUCH_BOUNDARY:10,ctor:function(){this._startX=0,this._startY=0,this._handlerCount=0,this._target=null},_touchWasMoved:function(n){var t=this.TOUCH_BOUNDARY;return Math.abs(n.pageX-this._startX)>t||Math.abs(n.pageY-this._startY)>t},_getClosestScrollable:function(t){var r=n(),i;if(t.data(s))r=t.data(s);else for(i=t;i.length;){if(i[0].scrollHeight-i[0].offsetHeight>1){r=i,t.data(s,r);break}i=i.parent()}return r},_saveClosestScrollableOffset:function(n){var t=this._getClosestScrollable(n);t.length&&n.data(c,t.scrollTop())},_closestScrollableWasMoved:function(n){var t=n.data(s);return t&&t.scrollTop()!==n.data(c)},_hasClosestScrollable:function(n){var t=this._getClosestScrollable(n);return t.length?t.is("body")?!1:t===window?!1:t.css("overflow")==="hidden"?!1:!0:!1},_handleStart:function(t){u.isMouseEvent(t)&&t.which!==1||(this._saveClosestScrollableOffset(n(t.target)),this._target=t.target,this._startX=t.pageX,this._startY=t.pageY)},_handleEnd:function(t){var i=n(t.target);!i.is(this._target)||this._touchWasMoved(t)||this._closestScrollableWasMoved(i)||l&&this._hasClosestScrollable(i)||(i.is("input, textarea")||t.dxPreventBlur||y.resetActiveElement(),u.handleGestureEvent(t,e)&&u.fireEvent({type:e,originalEvent:t}),this._touchEndTarget=i,this._reset())},_handleCancel:function(){this._reset()},_reset:function(){this._target=null},_handleClick:function(t){var i=n(t.target);i.is(this._target)&&this._hasClosestScrollable(i)&&u.handleGestureEvent(t,e)&&u.fireEvent({type:e,originalEvent:t}),this._reset()},_preventFocus:function(n){n.preventDefault()},_handleMouseDown:function(t){this._touchEndTarget&&!n(t.target).is(this._touchEndTarget)&&(this._preventFocus(t),this._touchEndTarget=null)},_handleElementMouseDown:function(t){n(t.target).is("input, textarea")||this._preventFocus(t)},_makeElementClickable:function(n){n.attr("onclick")||n.attr("onclick","void(0)")},setup:function(t){var i=n(t),r;i.on(u.addNamespace("mousedown",f),n.proxy(this._handleElementMouseDown,this));if((this._makeElementClickable(i),!(this._handlerCount>0))&&(r=n(document).on(u.addNamespace("dxpointerdown",f),n.proxy(this._handleStart,this)).on(u.addNamespace("dxpointerup",f),n.proxy(this._handleEnd,this)).on(u.addNamespace("dxpointercancel",f),n.proxy(this._handleCancel,this)).on(u.addNamespace("mousedown",f),n.proxy(this._handleMouseDown,this)),l))r.on(u.addNamespace("click",f),n.proxy(this._handleClick,this))},add:function(){this._handlerCount++},remove:function(){this._handlerCount--},teardown:function(t){this._handlerCount||(n(t).off("."+f),this.dispose())},dispose:function(){n(document).off("."+f)}}),d=t.Class.inherit({bindType:"click",delegateType:"click",handle:function(n,t){if(u.handleGestureEvent(t,e))return t.handleObj.handler.call(n,t)}});u.registerEvent(e,new(b?d:k))}(jQuery,DevExpress,window),function(n,t){var o=t.ui,u=o.events,c=n.event.special,s="dxSpecialEvents",f="dxHold",e="dxhold",r=s+"HoldTimer",h=t.Class.inherit({HOLD_TIMEOUT:750,TOUCH_BOUNDARY:5,_startX:0,_startY:0,_touchWasMoved:function(n){var t=this.TOUCH_BOUNDARY;return Math.abs(n.pageX-this._startX)>t||Math.abs(n.pageY-this._startY)>t},setup:function(t,i){t=n(t);var s=function(n){t.data(r)||(this._startX=n.pageX,this._startY=n.pageY,t.data(r,setTimeout(function(){t.removeData(r),u.handleGestureEvent(n,e)&&u.fireEvent({type:e,originalEvent:n})},i&&"timeout"in i?i.timeout:this.HOLD_TIMEOUT)))},h=function(n){this._touchWasMoved(n)&&o()},o=function(){clearTimeout(t.data(r)),t.removeData(r)};t.on(u.addNamespace("dxpointerdown",f),n.proxy(s,this)).on(u.addNamespace("dxpointermove",f),n.proxy(h,this)).on(u.addNamespace("dxpointerup",f),n.proxy(o,this))},teardown:function(t){t=n(t),clearTimeout(t.data(r)),t.removeData(r).off("."+f)}});u.registerEvent(e,new h)}(jQuery,DevExpress),function(n,t){var o=t.ui,c=t.utils,r=o.events,l="dxswipestart",s="dxswipe",a="dxswipeend",v="dxswipecancel",f="dxSwipeEventDataKey",h="dxGesture",y={defaultItemSizeFunc:function(){return this._activeSwipeable.width()},isSwipeAngleAllowed:function(n){return Math.abs(n.y)<=Math.abs(n.x)},getBounds:function(){return[this._maxLeftOffset,this._maxRightOffset]},calcOffsetRatio:function(n){var t=r.eventData(n);return(t.x-(this._startEventData&&this._startEventData.x||0))/this._itemSizeFunc().call(this,n)},isFastSwipe:function(n){var t=r.eventData(n);return this.FAST_SWIPE_SPEED_LIMIT*Math.abs(t.x-this._tickData.x)>=t.time-this._tickData.time}},p={defaultItemSizeFunc:function(){return this._activeSwipeable.height()},isSwipeAngleAllowed:function(n){return Math.abs(n.y)>=Math.abs(n.x)},getBounds:function(){return[this._maxTopOffset,this._maxBottomOffset]},calcOffsetRatio:function(n){var t=r.eventData(n);return(t.y-(this._startEventData&&this._startEventData.y||0))/this._itemSizeFunc().call(this,n)},isFastSwipe:function(n){var t=r.eventData(n);return this.FAST_SWIPE_SPEED_LIMIT*Math.abs(t.y-this._tickData.y)>=t.time-this._tickData.time}},w={horizontal:y,vertical:p},b=t.Class.inherit({STAGE_SLEEP:0,STAGE_TOUCHED:1,STAGE_SWIPING:2,TICK_INTERVAL:300,FAST_SWIPE_SPEED_LIMIT:5,ctor:function(){this._attachEvents()},_getStrategy:function(){return w[this._data("direction")]},_defaultItemSizeFunc:function(){return this._getStrategy().defaultItemSizeFunc.call(this)},_itemSizeFunc:function(){return this._data("itemSizeFunc")||this._defaultItemSizeFunc},_data:function(n,t){var i=this._activeSwipeable.data(f);if(arguments.length===1)return i[n];arguments.length===2&&(i[n]=t)},_closestSwipeable:function(t){for(var i=n(t.target),r;i.length;){if(r=n(i).data(f),r)return n(i);i=i.parent()}},_handleStart:function(n){if(!r.needSkipEvent(n)&&!(this._swipeStage>this.STAGE_SLEEP)){var t=this._activeSwipeable=this._closestSwipeable(n);t&&(this._parentsLength=this._activeSwipeable.parents().length,this._startEventData=r.eventData(n),this._tickData={time:0},this._swipeStage=this.STAGE_TOUCHED)}},_handleMove:function(n){this._activeSwipeable&&this._swipeStage!==this.STAGE_SLEEP&&(this._swipeStage===this.STAGE_TOUCHED&&this._handleFirstMove(n),this._swipeStage===this.STAGE_SWIPING&&this._handleNextMoves(n))},_handleFirstMove:function(t){var i=r.eventDelta(this._startEventData,r.eventData(t)),u;if((i.x||i.y)&&r.handleGestureEvent(t,s)){if(!this._getStrategy().isSwipeAngleAllowed.call(this,i)||r.needSkipEvent(t)){this._fireSwipeCancelEvent(t),this._reset();return}if(o.feedback.reset(),n(":focus",this._activeSwipeable).length&&c.resetActiveElement(),t.originalEvent){if(u=this._data("direction"),t.originalEvent.pointerMoveData[u]!==this._parentsLength)return;t.originalEvent.isScrollingEvent=!1}if(this._prepareGesture(),t=r.fireEvent({type:"dxswipestart",originalEvent:t,target:this._activeSwipeable.get(0)}),t.cancel){this._fireSwipeCancelEvent(t),this._reset();return}this._maxLeftOffset=t.maxLeftOffset,this._maxRightOffset=t.maxRightOffset,this._maxTopOffset=t.maxTopOffset,this._maxBottomOffset=t.maxBottomOffset,this._swipeStage=this.STAGE_SWIPING}},_fireSwipeCancelEvent:function(n){r.fireEvent({type:"dxswipecancel",originalEvent:n,target:this._activeSwipeable.get(0)})},_handleBodyPointerMove:function(n){if(this._activeSwipeable&&n.originalEvent){var t=n.originalEvent.pointerMoveData||{},i=this._data("direction"),r=t[i];if(r&&r>this._parentsLength){this._reset();return}t[i]=this._parentsLength,n.originalEvent.pointerMoveData=t}},_handleNextMoves:function(n){var u=this._getStrategy(),i=r.eventData(n),t=u.calcOffsetRatio.call(this,n);t=this._fitOffset(t,this._data("elastic")),i.time-this._tickData.time>this.TICK_INTERVAL&&(this._tickData=i),r.fireEvent({type:"dxswipe",originalEvent:n,offset:t,target:this._activeSwipeable.get(0)})},_handleEnd:function(n){if((t.devices.isRippleEmulator()||!r.hasTouches(n))&&this._activeSwipeable){if(this._swipeStage!==this.STAGE_SWIPING){this._reset();return}var f=this._getStrategy(),e=f.calcOffsetRatio.call(this,n),o=f.isFastSwipe.call(this,n),i=e,u=this._calcTargetOffset(e,o);i=this._fitOffset(i,this._data("elastic")),u=this._fitOffset(u,!1),r.fireEvent({type:"dxswipeend",offset:i,targetOffset:u,target:this._activeSwipeable.get(0),originalEvent:n}),this._reset()}},_fitOffset:function(n,t){var r=this._getStrategy(),i=r.getBounds.call(this);return n<-i[0]?t?(-2*i[0]+n)/3:-i[0]:n>i[1]?t?(2*i[1]+n)/3:i[1]:n},_calcTargetOffset:function(n,t){var i;return t?(i=Math.ceil(Math.abs(n)),n<0&&(i=-i)):i=Math.round(n),i},_prepareGesture:function(){clearTimeout(this._gestureEndTimer),this._activeSwipeable.data(h,!0)},_forgetGesture:function(){var t=this._activeSwipeable;this._gestureEndTimer=setTimeout(n.proxy(function(){t&&t.data(h,!1)},this),400)},_reset:function(){this._forgetGesture(),this._activeSwipeable=null,this._swipeStage=this.STAGE_SLEEP},_attachEvents:function(){n("body").on(r.addNamespace("dxpointermove","dxSwipe"),n.proxy(this._handleBodyPointerMove,this));n(document).on(r.addNamespace("dxpointerdown","dxSwipe"),n.proxy(this._handleStart,this)).on(r.addNamespace("dxpointermove","dxSwipe"),n.proxy(this._handleMove,this)).on(r.addNamespace("dxpointerup dxpointercancel","dxSwipe"),n.proxy(this._handleEnd,this))},isDisposed:function(){return this._disposed},dispose:function(){this._disposed=!0,this._activeSwipeable&&this._reset(),n("body").off(".dxSwipe"),n(document).off(".dxSwipe")}}),u=null,e=0;n.each([l,s,a,v],function(t,i){r.registerEvent(i,{noBubble:!0,setup:function(t,i){n(t).data(f,n.extend(n(t).data(f)||{elastic:!0,direction:"horizontal"},i)),(!u||u.isDisposed())&&(u=new b)},add:function(){e++},remove:function(){e--},teardown:function(t){var t=n(t);(t.is(u._activeSwipeable)&&u._reset(),t.data(f)&&t.removeData(f),e)||u&&(u.dispose(),u=null)}})})}(jQuery,DevExpress),function(n,t){var o=t.ui,u=o.events,f="dxmousewheel",e="dxWheel",s=10,r;n.event.fixHooks.DOMMouseScroll=n.event.mouseHooks,r={setup:function(t){var f=n(t);f.on(u.addNamespace("mousewheel DOMMouseScroll",e),n.proxy(r._handleWheel,r))},teardown:function(t){var i=n(t);i.off("."+e)},_handleWheel:function(n){var t=this._getWheelDelta(n.originalEvent);u.fireEvent({type:f,originalEvent:n,delta:t})},_getWheelDelta:function(n){return n.wheelDelta/60||-n.detail/1.5}},u.registerEvent(f,r)}(jQuery,DevExpress),function(n,t,i){var u=t.ui,s="UIFeedback",f="dx-feedback",h="dx-state-active",c="dx-state-disabled",a="dx-state-invisible",v="dx-state-hovered",y=30,p=400,r,e=u.events;u.feedback={reset:function(){l(!0)}},u.Widget=u.Component.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{disabled:!1,visible:!0,activeStateEnabled:!0,width:i,height:i,clickAction:null,hoverStateEnabled:!1})},_init:function(){this.callBase(),this._feedbackShowTimeout=y,this._feedbackHideTimeout=p},_render:function(){this.callBase(),this._element().addClass("dx-widget"),this._toggleDisabledState(this.option("disabled")),this._toggleVisibility(this.option("visible")),this._refreshFeedback(),this._renderDimensions(),this._renderClick()},_dispose:function(){this._clearTimers(),r&&r.closest(this._element()).length&&(r=null),this.callBase()},_clean:function(){this.callBase(),this._element().empty()},_clearTimers:function(){clearTimeout(this._feedbackHideTimer),clearTimeout(this._feedbackShowTimer)},_toggleVisibility:function(n){this._element().toggleClass(a,!n)},_toggleHoverState:function(n){this.option("hoverStateEnabled")&&this._element().toggleClass(v,n)},_renderDimensions:function(){var n=this.option("width"),t=this.option("height");this._element().width(n),this._element().height(t)},_refreshFeedback:function(){this._feedbackDisabled()?(this._feedbackOff(),this._element().removeClass(f)):this._element().addClass(f)},_renderClick:function(){var t=this,n=e.addNamespace("dxclick",this.NAME);this._clickAction=this._createActionByOption("clickAction");this._element().off(n).on(n,function(n){t._clickAction({jQueryEvent:n})})},_feedbackDisabled:function(){return!this.option("activeStateEnabled")||this.option("disabled")},_feedbackOn:function(t,i){this._feedbackDisabled()||(this._clearTimers(),i?this._feedbackShow(t):this._feedbackShowTimer=window.setTimeout(n.proxy(this._feedbackShow,this,t),this._feedbackShowTimeout),this._saveActiveElement())},_feedbackShow:function(t){var i=this._element();this._activeStateUnit&&(i=n(t).closest(this._activeStateUnit)),i.hasClass(c)||(i.addClass(h),this._toggleHoverState(!1))},_saveActiveElement:function(){r=this._element()},_feedbackOff:function(t){this._clearTimers(),t?this._feedbackHide():this._feedbackHideTimer=window.setTimeout(n.proxy(this._feedbackHide,this),this._feedbackHideTimeout)},_feedbackHide:function(){var n=this._element();this._activeStateUnit&&(n=n.find(this._activeStateUnit)),n.removeClass(h),this._toggleHoverState(!this.option("disabled")),this._clearActiveElement()},_clearActiveElement:function(){var i=this._element().get(0),t=r&&r.get(0);t&&(t===i||n.contains(i,t))&&(r=null)},_toggleDisabledState:function(n){this._element().toggleClass(c,n),this._toggleHoverState(!n)},_optionChanged:function(n,t){switch(n){case"disabled":this._toggleDisabledState(t),this._refreshFeedback();break;case"activeStateEnabled":this._refreshFeedback();break;case"hoverStateEnabled":this._toggleHoverState();break;case"visible":this._toggleVisibility(t);break;case"width":case"height":this._renderDimensions();break;case"clickAction":this._renderClick();break;default:this.callBase.apply(this,arguments)}},repaint:function(){this._refresh()}});var w=function(n,t){var h=n.jQueryEvent,s=n.element,i,u;e.needSkipEvent(h)||(r&&o(r)._feedbackOff(!0),i=s.closest("."+f),i.length&&(u=o(i),u._feedbackOn(s,t),t&&u._feedbackOff()))},l=function(n){r&&o(r)._feedbackOff(n)},o=function(t){var i;return n.each(t.data("dxComponents"),function(n,r){if(u[r].subclassOf(u.Widget))return i=t.data(r),!1}),i};n(function(){var i=new t.Action(w);n(document).on(e.addNamespace("dxpointerdown",s),function(t){i.execute({jQueryEvent:t,element:n(t.target)})}).on(e.addNamespace("dxpointerup dxpointercancel",s),function(t){var u=r&&n(t.target).closest("."+f).get(0)===r.get(0);u&&i.execute({jQueryEvent:t,element:n(t.target)},!0),l()})})}(jQuery,DevExpress),function(n,t){var r=t.ui,u="template",f="[data-options*='dxTemplate']",e="dxTemplates",o=function(t){var i=n(t).data("options");return n.trim(i).charAt(0)!=="{"&&(i="{"+i+"}"),new Function("return "+i)().dxTemplate},s=r.Widget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{contentReadyAction:n.noop})},_init:function(){this.callBase(),this._templateProvider=new r.TemplateProvider,this._initTemplates(),this._initContentReadyAction()},_clean:n.noop,_createTemplate:function(n){return new(this._templateProvider.getTemplateClass(this))(n)},_initTemplates:function(){var n=this,t={},i=this._element().data(e),r=i?i:this._element().contents().filter(f);r.length?r.each(function(){var i=o(this);if(i){if(!i.name)throw Error("Template name was not specified");t[i.name]=n._createTemplate(this)}}):t[u]=n._createTemplate(n._element().contents()),this._externalTemplates={},this._templates=t},_initContentReadyAction:function(){this._contentReadyAction=this._createActionByOption("contentReadyAction",{excludeValidators:["gesture","designMode","disabled"]})},_render:function(){this.callBase(),this._renderContent()},_renderContent:function(){this._renderContentImpl(),this._fireContentReadyAction()},_renderContentImpl:t.abstract,_fireContentReadyAction:function(){this._contentReadyAction({excludeValidators:["disabled","gesture"]})},_getTemplate:function(n){var i=this._acquireTemplate.apply(this,arguments);if(!i&&this._templateProvider.supportDefaultTemplate(this)&&(i=this._templateProvider.getDefaultTemplate(this),!i))throw Error(t.utils.stringFormat('Template "{0}" was not found and no default template specified!',n));return i},_acquireTemplate:function(t){if(t==null)return t;if(t.nodeType||t.jquery)return t=n(t),t.is("script")&&(t=t.html()),this._createTemplate(t);if(typeof t=="string")return this._getTemplates()[t];if(n.isFunction(t)){var i=n.makeArray(arguments).slice(1);return this._acquireTemplate(t.apply(this,i))}return this._acquireTemplate(t.toString())},_optionChanged:function(n){switch(n){case"contentReadyAction":this._initContentReadyAction();break;default:this.callBase.apply(this,arguments)}},_cleanTemplates:function(){n.each(this._templates,function(n,t){t.dispose()})},_dispose:function(){this._cleanTemplates(),this._contentReadyAction=null,this.callBase()},addTemplate:function(t){n.extend(this._templates,t)},addExternalTemplate:function(t){n.extend(this._externalTemplates,t)},_getTemplates:function(){return n.extend({},this._templates,this._externalTemplates)}});r.ContainerWidget=s}(jQuery,DevExpress),function(n,t){var o=t.utils.isString,r,f=[],h=DevExpress.Class.inherit({_compile:function(n,t){return t},_render:function(n){return n},ctor:function(t){this._element=n(t),this._element.length===1&&(this._element[0].nodeName.toLowerCase()!=="script"&&(this._element=n("<div />").append(this._element)),this._template=this._compile(this._element.html()||"",this._element))},render:function(t,i){var r;if(this._template)return r=this._render(this._template,i),o(r)&&(r=n.parseHTML(r)),r=n(r),t&&t.append(r),r},dispose:n.noop}),s=function(n){if(n&&n.compile&&n.render)return h.inherit({allowRenderToDetachedContainer:n.allowRenderToDetachedContainer!==!1,_compile:n.compile,_render:n.render});throw Error("Template Engine must contains compile and render methods");},e,u;window.ko&&(e=function(){},e.prototype=ko.utils.extend(new ko.templateEngine,{renderTemplateSource:function(n,t){var u=n.data("precompiledTemplate");return u||(u=new r(n.domElement),n.data("precompiledTemplate",u)),u.render(null,t.$data)},allowTemplateRewriting:!1})),DevExpress.ui.setTemplateEngine=function(n){if(o(n)){if(r=f&&f[n],!r&&n!=="default")throw Error(t.utils.stringFormat('Template Engine "{0}" is not supported',n));}else r=s(n)||r;window.ko&&ko.setTemplateEngine(r?new e:new ko.nativeTemplateEngine)},DevExpress.ui.TemplateProvider=DevExpress.ui.TemplateProvider.inherit({getTemplateClass:function(){return r?r:this.callBase.apply(this,arguments)}}),u=function(n,t){f[n]=s(t)},u("jquery-tmpl",{compile:function(n,t){return t},render:function(n,t){return n.tmpl(t)}}),u("jsrender",{compile:function(t){return n.templates(t)},render:function(n,t){return n.render(t)}}),u("mustache",{compile:function(n){return Mustache.compile(n)},render:function(n,t){return n(t)}}),u("hogan",{compile:function(n){return Hogan.compile(n)},render:function(n,t){return n.render(t)}}),u("underscore",{compile:function(n){return _.template(n)},render:function(n,t){return n(t)}}),u("handlebars",{compile:function(n){return Handlebars.compile(n)},render:function(n,t){return n(t)}}),u("doT",{compile:function(n){return doT.template(n)},render:function(n,t){return n(t)}})}(jQuery,DevExpress),function(n,t,i){var r=t.ui,u=r.events,f=r.ContainerWidget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{items:[],itemTemplate:"item",itemRender:null,itemClickAction:null,itemRenderedAction:null,noDataText:Globalize.localize("dxCollectionContainerWidget-noDataText"),dataSource:null})},_init:function(){this.callBase(),this._cleanRenderedItems(),this._refreshDataSource()},_dataSourceOptions:function(){var t={paginate:!1,_preferSync:!1};return n.isArray(this.option("dataSource"))&&(t._preferSync=!0),t},_cleanRenderedItems:function(){this._renderedItemsCount=0},_optionChanged:function(n,t,i){switch(n){case"items":this._cleanRenderedItems(),this._invalidate();break;case"dataSource":this._refreshDataSource(),this._dataSource||this.option("items",[]),this._renderEmptyMessage();break;case"noDataText":this._renderEmptyMessage();break;case"itemRenderedAction":this._createItemRenderAction();break;case"itemTemplate":this._itemTemplateName=null,this._invalidate();break;case"itemRender":this._itemRender=null,this._invalidate();break;case"itemClickAction":break;default:this.callBase(n,t,i)}},_expectNextPageLoading:function(){this._startIndexForAppendedItems=0},_expectLastItemLoading:function(){this._startIndexForAppendedItems=-1},_forgetNextPageLoading:function(){this._startIndexForAppendedItems=null},_handleDataSourceChanged:function(n){var t=this.option("items");this._initialized&&t&&this._shouldAppendItems()?(this._renderedItemsCount=t.length,this._dataSource.isLastPage()&&this._startIndexForAppendedItems===-1||(this.option().items=t.concat(n.slice(this._startIndexForAppendedItems))),this._renderContent(),this._forgetNextPageLoading()):this.option("items",n)},_handleDataSourceLoadError:function(){this._forgetNextPageLoading()},_shouldAppendItems:function(){return this._startIndexForAppendedItems!=null&&this._allowDinamicItemsAppend()},_allowDinamicItemsAppend:function(){return!1},_clean:function(){this._itemContainer().empty()},_refresh:function(){this._cleanRenderedItems(),this.callBase.apply(this,arguments)},_itemContainer:function(){return this._element()},_itemClass:t.abstract,_itemSelector:function(){return"."+this._itemClass()},_itemDataKey:t.abstract,_itemElements:function(){return this._itemContainer().find(this._itemSelector())},_render:function(){this.callBase(),this._attachClickEvent()},_attachClickEvent:function(){var t=this._itemSelector(),i=u.addNamespace("dxclick",this.NAME);this._itemContainer().off(i,t).on(i,t,n.proxy(this._handleItemClick,this))},_handleItemClick:function(n){this._handleItemJQueryEvent(n,"itemClickAction")},_renderContentImpl:function(){var n=this.option("items")||[];this._renderedItemsCount?this._renderItems(n.slice(this._renderedItemsCount)):this._renderItems(n)},_renderItems:function(t){t.length&&n.each(t,n.proxy(this._renderItem,this)),this._renderEmptyMessage()},_renderItem:function(n,t,i){var o;i=i||this._itemContainer();var f=this._getItemRenderer(),s=this._getItemTemplateName(),e=this._getTemplate(t.template||s,n,t),r,u={index:n,item:t,container:i};return r=f?this._createItemByRenderer(f,u):e?this._createItemByTemplate(e,u):this._createItemByRenderer(this._itemRenderDefault,u),r.addClass(this._itemClass()).data(this._itemDataKey(),t),o={itemElement:r,itemData:t,itemIndex:n},this._postprocessRenderItem(o),this._getItemRenderAction()({itemElement:r,itemData:t}),r},_createItemRenderAction:function(){return this._itemRenderAction=this._createActionByOption("itemRenderedAction",{element:this._element(),excludeValidators:["gesture","designMode","disabled"]})},_getItemRenderAction:function(){return this._itemRenderAction||this._createItemRenderAction()},_getItemRenderer:function(){return this._itemRender=this._itemRender||this.option("itemRender")},_createItemByRenderer:function(t,i){var r=n("<div />").appendTo(i.container),u=t.call(this,i.item,i.index,r);return u!=null&&r[0]!==u[0]&&r.append(u),r},_getItemTemplateName:function(){return this._itemTemplateName=this._itemTemplateName||this.option("itemTemplate")},_createItemByTemplate:function(n,t){return n.render(t.container,t.item,t.index,"ignoreTarget")},_itemRenderDefault:function(t,r,u){n.isPlainObject(t)?(t.visible===i||t.visible||u.hide(),t.disabled&&u.addClass("dx-state-disabled"),t.text&&u.text(t.text),t.html&&u.html(t.html)):u.html(String(t))},_postprocessRenderItem:n.noop,_renderEmptyMessage:function(){var t=this.option("noDataText"),i=this.option("items"),u=this._dataSource&&this._dataSource.isLoading(),r=!t||i&&i.length||u;r&&this._$nodata&&(this._$nodata.remove(),this._$nodata=null),r||(this._$nodata=this._$nodata||n("<div />").addClass("dx-empty-message"),this._$nodata.appendTo(this._itemContainer()).text(t))},_handleItemJQueryEvent:function(t,i,r,u){this._handleItemEvent(t.target,i,n.extend(r,{jQueryEvent:t}),u)},_handleItemEvent:function(t,i,r,u){var f=this._closestItemElement(n(t)),e=this._createActionByOption(i,u);return r=n.extend({itemElement:f,itemData:this._getItemData(f)},r),e(r)},_closestItemElement:function(t){return n(t).closest(this._itemSelector())},_getItemData:function(n){return n.data(this._itemDataKey())}}).include(r.DataHelperMixin);r.CollectionContainerWidget=f}(jQuery,DevExpress),function(n,t){var r=t.ui,u=r.events,f=r.CollectionContainerWidget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{selectedIndex:-1,itemSelectAction:null})},_render:function(){this.callBase(),this._renderSelectedIndex(this.option("selectedIndex")),this._attachSelectedEvent()},_attachSelectedEvent:function(){var t=this._itemSelector(),r=this._createAction(this._handleItemSelect),f=n.proxy(this._handleItemClick,this),i=u.addNamespace("dxclick",this.NAME);this._element().off(i,t).on(i,t,function(i){var u=n(i.target).closest(t);r({itemElement:u,jQueryEvent:i}),f(i)})},_handleItemSelect:function(t){var r=t.jQueryEvent,i=t.component;if(!u.needSkipEvent(r)){var e=i.option("items"),o=n(r.target).closest(i._itemSelector()).data(i._itemDataKey()),f=n.inArray(o,e);i.option("selectedIndex")!==f&&i._onItemSelectAction(f)}},_onItemSelectAction:function(n){this.option("selectedIndex",n)},_renderSelectedIndex:t.abstract,_renderEmptyMessage:n.noop,_attachClickEvent:n.noop,_optionChanged:function(n,t,i){switch(n){case"selectedIndex":this._renderSelectedIndex(t,i),this._handleItemEvent(this._selectedItemElement(t),"itemSelectAction",null,{excludeValidators:["gesture"]});break;case"itemSelectAction":break;default:this.callBase.apply(this,arguments)}},_selectedItemElement:function(n){return this._itemElements().eq(n)}});r.SelectableCollectionWidget=f}(jQuery,DevExpress),function(n,t){var f=function(i){var r=t.devices.real(),u=r.platform,f=r.version,e=f&&f[0]<4&&u==="android",o=!e&&n.inArray(u,["ios","android","win8"])>-1,s=u!==i.platform,h=i.platform==="generic",c=r.platform==="generic"&&i.platform==="desktop";return o&&(!s||h)||c},e=/chrome/i.test(navigator.userAgent),r={},u;r.dxActionSheet=function(n){if(n.platform==="ios"&&n.tablet)return{usePopover:!0}},r.dxRadioGroup=function(n){if(n.tablet)return{layout:"horizontal"}},r.dxDateBox=function(n){if(n.android||n.win8)return{useNativePicker:!1}},r.dxDatePickerRoller=function(n){if(n.platform==="win8")return{clickableItems:!0}},r.dxDatePicker=function(n){return n.platform!=="win8"?{width:333,height:331}:{fullScreen:!0,showNames:!0}},r.dxDialog=function(t){return t.platform==="ios"?{width:276}:t.platform==="win8"&&!t.phone?{width:"60%"}:t.platform==="win8"?{width:function(){return n(window).width()},position:{my:"top center",at:"top center",of:window,offset:"0 0"}}:t.platform==="android"?{lWidth:"60%",pWidth:"80%"}:void 0},r.dxDropDownMenu=function(n){if(n.platform==="ios")return{usePopover:!0}},r.dxLoadIndicator=function(){var t=DevExpress.devices.real(),i=t.platform==="android"&&!e;if(DevExpress.browser.msie&&DevExpress.browser.version[0]<=10||i)return{viaImage:!0}},r.dxLoadPanel=function(n){if(n.platform==="desktop")return{width:180}},u={show:{type:"slide",duration:400,from:{position:{my:"top",at:"bottom",of:window}},to:{position:{my:"center",at:"center",of:window}}},hide:{type:"slide",duration:400,from:{position:{my:"center",at:"center",of:window}},to:{position:{my:"top",at:"bottom",of:window}}}},r.dxLookup=function(t){return t.platform==="win8"&&t.phone?{showCancelButton:!1,fullScreen:!0}:t.platform==="win8"&&!t.phone?{popupWidth:"60%"}:t.platform==="ios"&&t.phone?{fullScreen:!0,animation:u}:t.platform==="ios"&&t.tablet?{popupWidth:function(){return Math.min(n(window).width(),n(window).height())*.4},popupHeight:function(){return Math.min(n(window).width(),n(window).height())*.4},usePopover:!0}:void 0},r.dxPopup=function(n){return n.platform==="win8"&&!n.phone?{width:"60%"}:n.platform==="win8"&&n.phone?{position:{my:"top center",at:"top center",of:window,offset:"0 0"}}:n.platform==="ios"?{animation:u}:void 0},r.dxScrollable=function(n){var t=DevExpress.devices.real();if(f(n)){if(t.android)return{useSimulatedScrollBar:!0}}else return{useNative:!1,useSimulatedScrollBar:!0}},r.dxScrollView=function(t){var i=r.dxScrollable(t)||{},u=DevExpress.devices.real();return(u.platform==="ios"||t.platform==="desktop"||t.platform==="generic")&&n.extend(i,{refreshStrategy:"pullDown"}),u.platform==="android"&&n.extend(i,{refreshStrategy:"swipeDown"}),u.platform==="win8"&&n.extend(i,{refreshStrategy:"slideDown"}),i},r.dxList=function(t){var i=r.dxScrollable(t)||{};return"useNative"in i&&(i.useNativeScrolling=i.useNative,delete i.useNative),delete i.useSimulatedScrollBar,t.platform==="desktop"&&n.extend(i,{showNextButton:!0,autoPagingEnabled:!1,editConfig:{selectionMode:"control"}}),(t.platform==="ios"||t.platform==="ios7")&&n.extend(i,{editConfig:{deleteMode:t.version===7?"slideItem":"slideButton"}}),t.platform==="android"&&n.extend(i,{editConfig:{deleteMode:"swipe"}}),t.platform==="win8"&&n.extend(i,{editConfig:{deleteMode:"hold"}}),t.platform==="generic"&&n.extend(i,{editConfig:{deleteMode:"slideItem"}}),i},r.dxOverlay=function(){var r=t.devices.real(),u=r.platform,i=r.version,f=u==="android"&&(i[0]<4||i[0]==4&&i[1]<=1);if(f)return{animation:{show:{type:"fade",duration:400},hide:{type:"fade",duration:400,to:{opacity:0},from:{opacity:1}}}}},r.dxToast=function(t){if(t.platform==="win8")return{position:{my:"top center",at:"top center",of:window,offset:"0 0"},width:function(){return n(window).width()-20}}},r.dxToolbar=function(n){return n.platform==="ios"?{submenuType:"dxActionSheet"}:n.platform==="win8"?{submenuType:"dxList"}:n.platform==="android"?{submenuType:"dxDropDownMenu"}:void 0},t.ui.optionsByDevice=function(n,t){var i=r[t];return i&&i(n)}}(jQuery,DevExpress),function(n,t){var r=t.ui,u={_instance:null,_positionAliases:[{top:{my:"bottom center",at:"top center"}},{bottom:{my:"top center",at:"bottom center"}},{right:{my:"left center",at:"right center"}},{left:{my:"right center",at:"left center"}}],_getPositionByAlias:function(t){var i=null;return n.each(this._positionAliases,function(n,r){if(r[t])return i=r[t],!1}),i},_normalizePosition:function(i){return t.utils.isString(i)?n.extend(i,this._getPositionByAlias(i)):i},_createTooltip:function(t){var r=this,u={position:{my:"bottom center",at:"top center"},visible:!0,isTooltip:!0,hiddenAction:function(){delete r._instance}},f=t.content,i;delete t.content,t=n.extend(!0,u,t),t.position=this._normalizePosition(t.position),t.position.of=t.target,i=n("<div />").html(f).dxPopover(t),this._instance=i.dxPopover("instance")},show:function(n){return this._instance||this._createTooltip(n),this._instance},hide:function(){var t=n.Deferred();return this._instance.hide().done(function(){t.resolve()}),t.promise()}};n.extend(r,{tooltip:u})}(jQuery,DevExpress));if(!DevExpress.MOD_WIDGETS){if(!window.DevExpress)throw Error("Required module is not referenced: core");(function(n,t){var r=t.ui,e="dxScrollable",o="dx-scrollable",s="dx-scrollable-disabled",h="dx-scrollable-container",c="dx-scrollable-content",u="vertical",f="horizontal",l="both";r.registerComponent(e,r.Component.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{disabled:!1,scrollAction:null,direction:u,showScrollbar:!0,useNative:!0,updateAction:null,useSimulatedScrollBar:!1,useKeyboard:!0,inertiaEnabled:!0,bounceEnabled:!0,scrollByContent:!0,scrollByThumb:!1,startAction:null,endAction:null,bounceAction:null,stopAction:null})},_init:function(){this.callBase(),this._initMarkup(),this._attachWindowResizeCallback(),this._attachNativeScrollbarsCustomizationCss(),this._locked=!1},_initMarkup:function(){var t=this._element().addClass(o),i=this._$container=n("<div>").addClass(h),r=this._$content=n("<div>").addClass(c);r.append(t.contents()).appendTo(i),i.appendTo(t)},_attachWindowResizeCallback:function(){var n=this;n._windowResizeCallback=function(){n.update()},t.utils.windowResizeCallbacks.add(n._windowResizeCallback)},_attachNativeScrollbarsCustomizationCss:function(){navigator.platform.indexOf("Mac")>-1&&DevExpress.browser.webkit||this._element().addClass("dx-scrollable-customizable-scrollbars")},_render:function(){this.callBase(),this._renderDisabledState(),this._renderDirection(),this._createStrategy(),this._createActions(),this.update()},_renderDisabledState:function(){this._$element.toggleClass(s,this.option("disabled"))},_renderDirection:function(){this._element().removeClass("dx-scrollable-"+f).removeClass("dx-scrollable-"+u).removeClass("dx-scrollable-"+l).addClass("dx-scrollable-"+this.option("direction"))},_createStrategy:function(){this._strategy=this.option("useNative")||t.designMode?new r.NativeScrollableStrategy(this):new r.SimulatedScrollableStrategy(this),this._strategy.render()},_createActions:function(){this._strategy.createActions()},_clean:function(){this._strategy.dispose()},_dispose:function(){this._detachWindowResizeCallback(),this.callBase()},_detachWindowResizeCallback:function(){t.utils.windowResizeCallbacks.remove(this._windowResizeCallback)},_optionChanged:function(n){switch(n){case"disabled":this._renderDisabledState();break;case"startAction":case"endAction":case"stopAction":case"updateAction":case"scrollAction":case"bounceAction":this._createActions();break;case"inertiaEnabled":case"bounceEnabled":case"scrollByContent":case"scrollByThumb":case"bounceEnabled":case"useNative":case"useKeyboard":case"direction":case"showScrollbar":case"useSimulatedScrollBar":this._invalidate();break;default:this.callBase.apply(this,arguments)}},_location:function(){return this._strategy.location()},_normalizeLocation:function(t){var i=this.option("direction");return{x:n.isPlainObject(t)?-t.x||0:i!==u?-t:0,y:n.isPlainObject(t)?-t.y||0:i!==f?-t:0}},_isLocked:function(){return this._locked},_lock:function(){this._locked=!0},_unlock:function(){this._locked=!1},content:function(){return this._$content},scrollOffset:function(){var n=this._location();return{top:-n.top,left:-n.left}},clientHeight:function(){return this._$container.height()},scrollHeight:function(){return this.content().height()},clientWidth:function(){return this._$container.width()},scrollWidth:function(){return this.content().width()},update:function(){return this._strategy.update(),n.Deferred().resolve().promise()},scrollBy:function(n){n=this._normalizeLocation(n),this._strategy.scrollBy(n)},scrollTo:function(n){n=this._normalizeLocation(n);var t=this._location();this.scrollBy({x:t.left-n.x,y:t.top-n.y})}}))})(jQuery,DevExpress),function(n,t){var u=t.ui,c=u.events,e="dxScrollbar",o="dx-scrollable-scrollbar",s="dx-scrollable-scroll",l="dx-scrollable-scrollbars-hidden",a="vertical",f="horizontal",h=15,r={onScroll:"onScroll",onHover:"onHover",always:"always",never:"never"};u.registerComponent(e,u.Widget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{direction:null,visible:!1,activeStateEnabled:!1,visibilityMode:r.onScroll,containerSize:0,contentSize:0})},_init:function(){this.callBase(),this._isHovered=!1},_render:function(){this._renderThumb(),this.callBase(),this._renderDirection(),this._update()},_renderThumb:function(){this._$thumb=n("<div>").addClass(s),this._element().addClass(o).append(this._$thumb)},isThumb:function(n){return!!this._element().find(n).length},_isHoverMode:function(){return this.option("visibilityMode")===r.onHover},_renderDirection:function(){var n=this.option("direction");this._element().addClass("dx-scrollbar-"+n),this._dimension=n===f?"width":"height",this._prop=n===f?"left":"top"},cursorEnter:function(){this._isHovered=!0,this.option("visible",!0)},cursorLeave:function(){this._isHovered=!1,this.option("visible",!1)},_renderDimensions:function(){this._$thumb.height(this.option("height")),this._$thumb.width(this.option("width"))},_toggleVisibility:function(n){n=this._adjustVisibility(n),this.option().visible=n,this._$thumb.toggleClass("dx-state-invisible",!n)},_adjustVisibility:function(n){if(this.containerToContentRatio()&&!this._needScrollbar())return!1;switch(this.option("visibilityMode")){case r.onHover:n=n||!!this._isHovered;break;case r.never:n=!1;break;case r.always:n=!0}return n},moveTo:function(i){if(!this._isHidden()){n.isPlainObject(i)&&(i=i[this._prop]||0);var r={};r[this._prop]=this._calculateScrollBarPosition(i),t.translator.move(this._$thumb,r)}},_calculateScrollBarPosition:function(n){return-n*this._thumbRatio},_update:function(){var n=this.option("containerSize"),i=this.option("contentSize"),t;this._containerToContentRatio=n/i,t=Math.round(Math.max(Math.round(n*this._containerToContentRatio),h)),this._thumbRatio=(n-t)/(i-n),this.option(this._dimension,t),this._element().toggle(this._needScrollbar())},_isHidden:function(){return this.option("visibilityMode")===r.never},_needScrollbar:function(){return!this._isHidden()&&this._containerToContentRatio<1},containerToContentRatio:function(){return this._containerToContentRatio},_normalizeSize:function(t){return n.isPlainObject(t)?t[this._dimension]||0:t},_optionChanged:function(n,t){if(!this._isHidden())switch(n){case"containerSize":case"contentSize":this.option()[n]=this._normalizeSize(t),this._update();break;case"visibilityMode":case"direction":this._invalidate();break;default:this.callBase.apply(this,arguments)}}}))}(jQuery,DevExpress),function(n,t,i){var f=t.ui,u=f.events,y=t.devices,p=Math.abs,o="dxNativeScrollable",c="dx-scrollable-native",tt="dx-scrollable-scrollbar-simulated",it="dx-scrollable-scrollbars-hidden",e="vertical",s="horizontal",w="dxGesture",rt=400,ut=500;f.NativeScrollableStrategy=t.Class.inherit({ctor:function(n){this._init(n),this._attachScrollHandler()},_init:function(t){this._component=t,this._$element=t._element(),this._$container=t._$container,this._$content=t._$content,this._direction=t.option("direction"),this._useSimulatedScrollBar=t.option("useSimulatedScrollBar"),this._showScrollbar=t.option("showScrollbar"),this.option=n.proxy(t.option,t),this._createActionByOption=n.proxy(t._createActionByOption,t),this._isLocked=n.proxy(t._isLocked,t)},_attachScrollHandler:function(){this._$container.on(u.addNamespace("scroll",o),n.proxy(this._handleScroll,this))},render:function(){this._$element.addClass(c).addClass(c+"-"+y.real().platform).toggleClass(it,!this._showScrollbar),this._showScrollbar&&this._useSimulatedScrollBar&&this._renderScrollbars()},_renderScrollbars:function(){this._scrollbars={},this._hideScrollbarTimeout=0,this._$element.addClass(tt),this._renderScrollbar(e),this._renderScrollbar(s)},_renderScrollbar:function(t){if(this._isDirection(t)){var i=n("<div>").dxScrollbar({direction:t}).appendTo(this._$element);this._scrollbars[t]=i.dxScrollbar("instance")}},_isDirection:function(n){return n===e?this._direction!==s:n===s?this._direction!==e:n===this._direction},_eachScrollbar:function(t){t=n.proxy(t,this),n.each(this._scrollbars||{},function(n,i){t(i)})},createActions:function(){var n={excludeValidators:["gesture"]};this._scrollAction=this._createActionByOption("scrollAction",n),this._updateAction=this._createActionByOption("updateAction",n)},_createActionArgs:function(){var n=this.location();return{jQueryEvent:k,scrollOffset:{top:-n.top,left:-n.left},reachedLeft:this._isDirection(s)?n.left>=0:i,reachedRight:this._isDirection(s)?n.left<=this._containerSize.width-this._contentSize.width:i,reachedTop:this._isDirection(e)?n.top>=0:i,reachedBottom:this._isDirection(e)?n.top<=this._containerSize.height-this._contentSize.height:i}},_handleScroll:function(n){if(!this._isScrollLocationChanged()){n.stopImmediatePropagation();return}k=n,this._moveScrollbars(),this._scrollAction(this._createActionArgs()),this._treatNativeGesture(),this._lastLocation=this.location()},_isScrollLocationChanged:function(){var n=this.location(),t=this._lastLocation||{},i=t.top!==n.top,r=t.left!==n.left;return i||r},_moveScrollbars:function(){this._eachScrollbar(function(n){n.moveTo(this.location()),n.option("visible",!0)}),this._hideScrollbars()},_hideScrollbars:function(){clearTimeout(this._hideScrollbarTimeout),this._hideScrollbarTimeout=setTimeout(n.proxy(function(){this._eachScrollbar(function(n){n.option("visible",!1)})},this),ut)},_treatNativeGesture:function(){this._prepareGesture(),this._forgetGesture()},_prepareGesture:function(){this._gestureEndTimer?(clearTimeout(this._gestureEndTimer),this._gestureEndTimer=null):this._$element.data(w,!0),f.feedback.reset()},_forgetGesture:function(){this._gestureEndTimer=setTimeout(n.proxy(function(){this._$element.data(w,!1),this._gestureEndTimer=null},this),rt)},location:function(){return{left:-this._$container.scrollLeft(),top:-this._$container.scrollTop()}},update:function(){this._update(),this._updateAction(this._createActionArgs())},_update:function(){this._updateDimensions(),this._updateScrollbars(),this._updateScrollingAbility()},_updateDimensions:function(){this._containerSize={height:this._$container.height(),width:this._$container.width()},this._contentSize={height:this._component.content().height(),width:this._component.content().width()}},_updateScrollbars:function(){this._eachScrollbar(function(n){var t=this._isDirection(e)?"height":"width";n.option({containerSize:this._containerSize[t],contentSize:this._contentSize[t]})})},_updateScrollingAbility:function(){var n=this._$content.height()>this._containerSize.height,t=this._$content.width()>this._containerSize.width;this._canScroll=n&&this._isDirection(e)||t&&this._isDirection(s)},_handleStart:function(){this._update()},_handleEnd:n.noop,_handleMove:function(n){this._canScroll&&(n.originalEvent.isScrollingEvent=!0)},dispose:function(){this===r&&(r=null),this._$element.removeClass(function(n,t){var i=t.match(new RegExp(c+"\\S*","g"));if(i.length)return i.join(" ")}),this._$container.off(u.addNamespace("scroll",o)),this._removeScrollbars(),clearTimeout(this._gestureEndTimer)},_removeScrollbars:function(){this._eachScrollbar(function(n){n._element().remove()})},scrollBy:function(n){var t=this.location();this._$container.scrollTop(-t.top-n.y),this._$container.scrollLeft(-t.left-n.x)}});var b=0,v=1,ft=2,r,h=b,l,k,a=null,d=10,g=function(t){var i=n(t).closest("."+c),u,r;if(i.length)return u=i.data("dxComponents"),n.each(u,function(n,t){var u=f[t];if(u===f.dxScrollable||u.subclassOf(f.dxScrollable))return r=i.data(t),!1}),r&&r.option("disabled")?g(i.parent()):r._strategy},et=function(){h=b,r=null},ot=function(){y.real().platform==="ios"&&n(":focus",r._$element).length&&t.utils.resetActiveElement()},st=function(n){u.needSkipEvent(n)||(r=g(n.target),r&&(l=r._$element.parents().length,h=v,r._handleStart(n),a=u.eventData(n)))},ht=function(n){if(r&&h==v&&n.originalEvent){var t=n.originalEvent.pointerMoveData||{},i=r.option("direction"),u=t[i];if(u&&u>l){nt();return}t[i]=l,n.originalEvent.pointerMoveData=t}},ct=function(n){var t,f,i;if(r){if(t=n.originalEvent.pointerMoveData,f=r.option("direction"),t&&t[f]!==l)return;if(r._isLocked()){n.preventDefault();return}h==v&&(ot(n),h=ft),r._handleMove(n),a&&(i=u.eventDelta(a,u.eventData(n)),(p(i.x)>d||p(i.y)>d)&&(r._prepareGesture(),a=null))}},nt=function(n){r&&(r._handleEnd(n),r._forgetGesture(),et())};n(function(){var i={context:f.dxScrollable,excludeValidators:["gesture","designMode"]},r=new t.Action(st,i),e=new t.Action(ct,i),s=new t.Action(nt,i),h=new t.Action(ht,i);n("body").on(u.addNamespace("dxpointermove",o),function(n){h.execute(n)});n(document).on(u.addNamespace("dxpointerdown",o),function(n){r.execute(n)}).on(u.addNamespace("dxpointermove",o),function(n){e.execute(n)}).on(u.addNamespace("dxpointerup dxpointercancel",o),function(n){s.execute(n)})})}(jQuery,DevExpress),function(n,t,i){var h=t.ui,u=h.events,s=Math,f="dxSimulatedScrollable",tt="dx-scrollable-simulated",si="dxScrollbar",hi="dx-scrollable-scrollbar",ci="dx-scrollable-scroll",yt="dx-scrollable-scrollbars-hidden",c="vertical",e="horizontal",w=.92,ut=.5,pt=400,ft=1,et=20,wt=ft/5,it=s.round(1e3/60),bt=pt/it,kt=(1-s.pow(w,bt))/(1-w),dt=ut,ot="dxGesture",l={PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40},st=t.Animator.inherit({ctor:function(n){this.callBase(),this.scroller=n},VELOCITY_LIMIT:ft,_isFinished:function(){return s.abs(this.scroller._velocity)<=this.VELOCITY_LIMIT},_step:function(){this.scroller._scrollStep(this.scroller._velocity),this.scroller._velocity*=this._acceleration()},_acceleration:function(){return this.scroller._inBounds()?w:ut},_complete:function(){this.scroller._scrollComplete()},_stop:function(){this.scroller._handleStop()}}),gt=st.inherit({VELOCITY_LIMIT:wt,_isFinished:function(){return this.scroller._crossBoundOnNextStep()||this.callBase()},_acceleration:function(){return w},_complete:function(){this.scroller._move(this.scroller._bounceLocation),this.callBase()}}),ni=h.Scroller=t.Class.inherit({ctor:function(n){this._initOptions(n),this._initAnimators(),this._initScrollbar(),this._initCallbacks(),this._topReached=!1,this._bottomReached=!1},_initOptions:function(t){var i=this;this._location=0,this._axis=t.direction===e?"x":"y",this._prop=t.direction===e?"left":"top",this._dimension=t.direction===e?"width":"height",this._scrollProp=t.direction===e?"scrollLeft":"scrollTop",n.each(t,function(n,t){i["_"+n]=t})},_initAnimators:function(){this._inertiaAnimator=new st(this),this._bounceAnimator=new gt(this)},_initScrollbar:function(){this._$scrollbar=n("<div>").dxScrollbar({direction:this._direction,visible:this._scrollByThumb,visibilityMode:this._visibilityModeNormalize(this._scrollbarVisible),containerSize:this._containerSize(),contentSize:this._contentSize()}).appendTo(this._$container),this._scrollbar=this._$scrollbar.dxScrollbar("instance")},_visibilityModeNormalize:function(n){return n===!0?"onScroll":n===!1?"never":n},_initCallbacks:function(){this.topBouncedCallbacks=n.Callbacks(),this.bottomBouncedCallbacks=n.Callbacks()},_scrollStep:function(n){var t=this._location;this._location=this._location+n,this._suppressBounce(),this._move(),this._scrollAction(),t!==this._location&&this._$element.triggerHandler("scroll")},_move:function(n){this._location=n!==i?n:this._location,this._moveContent(),this._moveScrollbar()},_moveContent:function(){var n={};n[this._prop]=this._location,t.translator.move(this._$content,n)},_moveScrollbar:function(){this._scrollbar.moveTo(this._calculateScrollBarPosition())},_calculateScrollBarPosition:function(){return this._location},_suppressBounce:function(){this._bounceEnabled||this._inBounds(this._location)||(this._velocity=0,this._location=this._boundLocation())},_boundLocation:function(){var n=this._location;return n>this._maxOffset?n=this._maxOffset:n<this._minOffset&&(n=this._minOffset),n},_scrollComplete:function(){this._inBounds()&&(this._hideScrollbar(),this._roundLocation(),this._completeDeferred&&this._completeDeferred.resolve()),this._scrollToBounds()},_roundLocation:function(){this._location=s.round(this._location),this._move()},_scrollToBounds:function(){this._inBounds()||(this._bounceAction(),this._setupBounce(),this._bounceAnimator.start())},_setupBounce:function(){var n=this._bounceLocation=this._boundLocation(),t=n-this._location;this._velocity=t/kt},_inBounds:function(n){return n=n!==i?n:this._location,n>=this._minOffset&&n<=this._maxOffset},_crossBoundOnNextStep:function(){var n=this._location,t=n+this._velocity;return n<this._minOffset&&t>=this._minOffset||n>this._maxOffset&&t<=this._maxOffset},_handleStart:function(t){return this._stopDeferred=n.Deferred(),this._stopScrolling(),this._thumbScrolling=this._isThumb(t),this._update(),this._stopDeferred.promise()},_stopScrolling:function(){this._hideScrollbar(),this._inertiaAnimator.stop(),this._bounceAnimator.stop()},_handleStop:function(){this._stopDeferred&&this._stopDeferred.resolve()},_handleFirstMove:function(){this._showScrollbar()},_handleMove:function(n){n=n[this._axis],this._thumbScrolling&&(n=-n/this._containerToContentRatio()),this._inBounds()||(n*=dt),this._scrollStep(n)},_containerToContentRatio:function(){return this._scrollbar.containerToContentRatio()},_handleMoveEnd:function(t){return this._completeDeferred=n.Deferred(),this._velocity=t[this._axis],this._suppressVelocity(),this._handleInertia(),this._resertThumbScrolling(),this._completeDeferred.promise()},_resertThumbScrolling:function(){this._thumbScrolling=!1},_suppressVelocity:function(){(!this._inertiaEnabled||this._thumbScrolling)&&(this._velocity=0)},_handleTapEnd:function(){this._resertThumbScrolling(),this._scrollToBounds()},_handleInertia:function(){this._inertiaAnimator.start()},_handleDispose:function(){this._$scrollbar.remove(),this._stopScrolling()},_handleUpdate:function(){this._update(),this._moveToBounds()},_update:function(){this._stopScrolling(),this._updateLocation(),this._updateBounds(),this._updateScrollbar(),this._moveScrollbar()},_updateLocation:function(){this._location=t.translator.locate(this._$content)[this._prop]},_updateBounds:function(){this._maxOffset=0,this._minOffset=s.min(this._containerSize()-this._contentSize(),0)},_updateScrollbar:function(){this._scrollbar.option({containerSize:this._containerSize(),contentSize:this._contentSize()})},_moveToBounds:function(){this._location=this._boundLocation(),this._move()},_handleCreateActions:function(n){this._scrollAction=n.scrollAction,this._bounceAction=n.bounceAction},_showScrollbar:function(){this._scrollbar.option("visible",!0)},_hideScrollbar:function(){this._scrollbar.option("visible",!1)},_containerSize:function(){return this._$container[this._dimension]()},_contentSize:function(){return this._$content[this._dimension]()},_validateEvent:function(t){var i=n(t.target);return this._isThumb(i)||this._isContent(i)},_isContent:function(n){return this._scrollByContent&&!!n.closest(this._$element).length},_isThumb:function(n){return this._scrollByThumb&&this._scrollbar.isThumb(n)},_validateDirection:function(n){return s.abs(n[this._axis])>=s.abs(n[this._axis==="x"?"y":"x"])},_reachedMin:function(){return this._location<=this._minOffset},_reachedMax:function(){return this._location>=this._maxOffset},_handleCursorEnter:function(){this._scrollbar.cursorEnter()},_handleCursorLeave:function(){this._scrollbar.cursorLeave()}});h.SimulatedScrollableStrategy=t.Class.inherit({ctor:function(n){this._init(n),this._attachEventHandlers()},_init:function(t){this._component=t,this._$element=t._element(),this._$container=t._$container.prop("tabindex",0),this._$content=t._$content,this.option=n.proxy(t.option,t),this._createActionByOption=n.proxy(t._createActionByOption,t),this._isLocked=n.proxy(t._isLocked,t)},_attachEventHandlers:function(){this._$container.on(u.addNamespace("scroll",f),n.proxy(this._handleScroll,this)).on(u.addNamespace("mouseenter",f),n.proxy(this._handleCursorEnter,this)).on(u.addNamespace("mouseleave",f),n.proxy(this._handleCursorLeave,this))},_handleScroll:function(){var t={x:this._$container.scrollLeft(),y:this._$container.scrollTop()};this._$container.scrollLeft(-t.x),this._$container.scrollTop(-t.y),this.scrollBy(t)},render:function(){this._$element.addClass(tt),this._createScrollers(),this._renderKeyboardHandler()},_createScrollers:function(){var n=this.option("direction");this._scrollers={},n!==c&&this._createScroller(e),n!==e&&this._createScroller(c),this._$element.toggleClass(yt,!this.option("showScrollbar"))},_createScroller:function(n){this._scrollers[n]=new ni(this._scrollerOptions(n))},_scrollerOptions:function(n){return{direction:n,$content:this._$content,$container:this._$container,$element:this._$element,scrollByContent:this.option("scrollByContent"),scrollByThumb:this.option("scrollByThumb"),scrollbarVisible:this.option("showScrollbar"),bounceEnabled:this.option("bounceEnabled"),inertiaEnabled:this.option("inertiaEnabled")}},_renderKeyboardHandler:function(){if(this.option("useKeyboard"))this._$container.on(u.addNamespace("keydown",f),n.proxy(this._handleKeyDown,this));else this._$container.off(u.addNamespace("keydown",f),this._handleKeyDown)},_handleKeyDown:function(n){if(document.activeElement===this._$container.get(0)){var t=!0;switch(n.keyCode){case l.DOWN:this._scrollByLine({y:1});break;case l.UP:this._scrollByLine({y:-1});break;case l.RIGHT:this._scrollByLine({x:1});break;case l.LEFT:this._scrollByLine({x:-1});break;case l.PAGE_DOWN:this._scrollByPage(1);break;case l.PAGE_UP:this._scrollByPage(-1);break;case l.HOME:this._scrollToHome();break;case l.END:this._scrollToEnd();break;default:t=!1}t&&(n.stopPropagation(),n.preventDefault())}},_scrollByLine:function(n){this.scrollBy({y:(n.y||0)*-et,x:(n.x||0)*-et})},_scrollByPage:function(n){var t=this._wheelAxis(),r=this._dimensionByAxis(t),i={};i[t]=n*-this._$container[r](),this.scrollBy(i)},_dimensionByAxis:function(n){return n==="x"?"width":"height"},_scrollToHome:function(){var t=this._wheelAxis().toLowerCase(),n={};n[t]=0,this._component.scrollTo(n)},_scrollToEnd:function(){var n=this._wheelAxis(),t=this._dimensionByAxis(n),i={};i[n]=this._$content[t]()-this._$container[t](),this._component.scrollTo(i)},createActions:function(){this._startAction=this._createActionHandler("startAction"),this._stopAction=this._createActionHandler("stopAction"),this._endAction=this._createActionHandler("endAction"),this._updateAction=this._createActionHandler("updateAction"),this._createScrollerActions()},_createScrollerActions:function(){this._handleEvent("CreateActions",{scrollAction:this._createActionHandler("scrollAction"),bounceAction:this._createActionHandler("bounceAction")})},_createActionHandler:function(t){var i=this,r=i._createActionByOption(t,{excludeValidators:["gesture"]});return function(){r(n.extend(i._createActionArgs(),arguments))}},_createActionArgs:function(){var n=this._scrollers[e],t=this._scrollers[c];return{jQueryEvent:g,scrollOffset:{top:t&&-t._location,left:n&&-n._location},reachedLeft:n&&n._reachedMax(),reachedRight:n&&n._reachedMin(),reachedTop:t&&t._reachedMax(),reachedBottom:t&&t._reachedMin()}},dispose:function(){this===r&&p(),this._handleEvent("Dispose"),this._detachScrollHandler(),this._$element.removeClass(tt),clearTimeout(this._gestureEndTimer)},_detachScrollHandler:function(){n(this._$container).off("."+f)},_handleEvent:function(t){var i=n.makeArray(arguments).slice(1),r=n.map(this._scrollers,function(n){return n["_handle"+t].apply(n,i)});return n.when.apply(n,r).promise()},_handleStart:function(t){this._handleEvent("Start",t).done(n.proxy(this._forgetGesture,this)).done(this._stopAction)},_handleFirstMove:function(){return this._$content.css("user-select","none"),this._handleEvent("FirstMove").done(this._startAction)},_prepareGesture:function(){clearTimeout(this._gestureEndTimer),this._$element.data(ot,!0),h.feedback.reset()},_handleMove:function(n){this._adjustDistance(n),this._handleEvent("Move",n)},_handleMoveEnd:function(n){return this._$content.css("user-select",this._userSelectDefaultValue),this._adjustDistance(n),this._handleEvent("MoveEnd",n).done(this._endAction)},_adjustDistance:function(n){n.x*=this._allowedDirections[e],n.y*=this._allowedDirections[c]},_forgetGesture:function(){this._gestureEndTimer=setTimeout(n.proxy(function(){this._$element.data(ot,!1)},this),400)},_handleTapEnd:function(){this._handleEvent("TapEnd")},location:function(){return t.translator.locate(this._$content)},_validateEvent:function(t){if(this.option("disabled"))return!1;if(t.type==="dxmousewheel")return this._prepareDirections(!0),!0;this._prepareDirections();var r=this._allowedDirections,i=!1;return n.each(this._scrollers,function(n){var u=this._validateEvent(t);r[n]=u,i=i||u}),i},_prepareDirections:function(n){n=n||!1,this._allowedDirections={},this._allowedDirections[e]=n,this._allowedDirections[c]=n},_validateDirection:function(t){var i=!1;return n.each(this._scrollers,function(){i=i||this._validateDirection(t)}),i},_handleCursorEnter:function(n){(n.originalEvent=n.originalEvent||{},o!==b||n.originalEvent._hoverHandled)||(v&&v._handleCursorLeave(),v=this,this._handleEvent("CursorEnter"),n.originalEvent._hoverHandled=!0)},_handleCursorLeave:function(){r!==v&&v===this&&(this._handleEvent("CursorLeave"),v=null)},_wheelAxis:function(){switch(this.option("direction")){case e:return"x";case c:return"y";default:return this._scrollers[c]._containerToContentRatio()>=1?"x":"y"}},_prepareWheelEvent:function(n){var t=this._wheelAxis(),i=this._directionByAxis(t),r="page"+t.toUpperCase();this._scrollers[i]._containerToContentRatio()<1&&(n[r]+=n.delta,n.preventDefault())},_directionByAxis:function(n){return n==="x"?e:c},update:function(){return this._userSelectDefaultValue=this._$content.css("user-select"),this._handleEvent("Update").done(this._updateAction)},scrollBy:function(n){this._prepareDirections(!0),this._handleFirstMove(),this._handleMove(n),this._handleMoveEnd({x:0,y:0})}});var v,b=0,y=1,rt=2,ti=100,ii=200,r,k,o=b,a,d,g,nt=null,ht=10,ct=function(t){var i=n(t).closest("."+tt),u,r;if(i.length)return u=i.data("dxComponents"),n.each(u,function(n,t){var u=h[t];if(u===h.dxScrollable||u.subclassOf(h.dxScrollable))return r=i.data(t),!1}),r&&r.option("disabled")?ct(i.parent()):r._strategy},p=function(){o=b,r=null},ri=function(){t.utils.resetActiveElement()},li=function(n){n.preventDefault()},lt=function(t){u.needSkipEvent(t)||(r=ct(t.target),r&&r._validateEvent(t)&&(k=r._$element.parents().length,g=t,nt=a=d=u.eventData(t),o=y,r._handleStart(n(t.target))))},at=function(n){var t,e,i,f;if(r){if(n.originalEvent&&(t=n.originalEvent.pointerMoveData,e=r.option("direction"),t&&t[e]!==k)){p();return}(g=n,o!==b)&&(i=u.eventData(n),f=u.eventDelta(a,i),o===y&&ui(f),o===rt&&ei(i,f))}},ui=function(t){if(!r._validateDirection(t)){p();return}n(":focus",r._$content).length&&ri(),r._handleFirstMove(),o=rt},fi=function(n){if(o===y&&n.originalEvent){var t=n.originalEvent.pointerMoveData||{},i=r.option("direction"),u=t[i];if(u&&u>k)return;t[i]=k,n.originalEvent.pointerMoveData=t}},ei=function(n,t){if(r._isLocked()){p();return}if(u.eventDelta(d,a).time>ii&&(d=a),a=n,nt){var i=u.eventDelta(nt,n);(s.abs(i.x)>ht||s.abs(i.y)>ht)&&(r._prepareGesture(),nt=null)}r._handleMove(t)},vt=function(t){var i;if(r){if(g=t,o===rt){var e=u.eventData(t),s=u.eventDelta(a,e),f={x:0,y:0};s.time<ti&&(i=u.eventDelta(d,a),f={x:i.x*it/i.time,y:i.y*it/i.time}),r._handleMoveEnd(f).done(n.proxy(r._forgetGesture,r))}else o===y&&r._handleTapEnd();p()}},oi=function(n){(lt(n),o===y)&&(r._prepareWheelEvent(n),at(n),vt(n))};n(function(){var i={context:h.dxScrollable,excludeValidators:["gesture"]},r=new t.Action(lt,i),e=new t.Action(at,i),o=new t.Action(vt,i),s=new t.Action(fi,i),c=new t.Action(oi,i);n("body").on(u.addNamespace("dxpointermove",f),function(n){s.execute(n)});n(document).on(u.addNamespace("dxpointerdown",f),function(n){r.execute(n)}).on(u.addNamespace("dxpointermove",f),function(n){e.execute(n)}).on(u.addNamespace("dxpointerup dxpointercancel",f),function(n){o.execute(n)}).on(u.addNamespace("dxmousewheel",f),function(n){c.execute(n)})})}(jQuery,DevExpress),function(n,t,i){var r=t.ui,f="dx-scrollview",o="dx-scrollview-content",s="dx-scrollview-top-pocket",h="dx-scrollview-bottom-pocket",u=f+"-pull-down",a=u+"-image",v=u+"-indicator",y=u+"-text",e=f+"-scrollbottom",c=e+"-indicator",l=e+"-text";r.registerComponent("dxScrollView",r.dxScrollable.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{pullingDownText:Globalize.localize("dxScrollView-pullingDownText"),pulledDownText:Globalize.localize("dxScrollView-pulledDownText"),refreshingText:Globalize.localize("dxScrollView-refreshingText"),reachBottomText:Globalize.localize("dxScrollView-reachBottomText"),pullDownAction:null,reachBottomAction:null,refreshStrategy:"pullDown"})},_initMarkup:function(){this.callBase(),this._element().addClass(f),this._initContent(),this._initTopPocket(),this._initBottomPocket()},_initContent:function(){var t=n("<div>").addClass(o);this._$content.wrapInner(t)},_initTopPocket:function(){var t=this._$topPocket=n("<div>").addClass(s),i=this._$pullDown=n("<div>").addClass(u);t.append(i),this._$content.prepend(t)},_initBottomPocket:function(){var t=this._$bottomPocket=n("<div>").addClass(h),i=this._$reachBottom=n("<div>").addClass(e),r=n("<div>").addClass(c),u=n("<div>").dxLoadIndicator(),f=this._$reachBottomText=n("<div>").addClass(l);this._updateReachBottomText(),i.append(r.append(u)).append(f),t.append(i),this._$content.append(t)},_updateReachBottomText:function(){this._$reachBottomText.text(this.option("reachBottomText"))},_createStrategy:function(){var u=this.option("useNative")||t.designMode?this.option("refreshStrategy"):"simulated",i=r.scrollViewRefreshStrategies[u];if(!i)throw Error("Unknown dxScrollView refresh strategy "+this.option("refreshStrategy"));this._strategy=new i(this),this._strategy.pullDownCallbacks.add(n.proxy(this._handlePullDown,this)),this._strategy.releaseCallbacks.add(n.proxy(this._handleRelease,this)),this._strategy.reachBottomCallbacks.add(n.proxy(this._handleReachBottom,this)),this._strategy.render()},_createActions:function(){this.callBase(),this._pullDownAction=this._createActionByOption("pullDownAction",{excludeValidators:["gesture"]}),this._reachBottomAction=this._createActionByOption("reachBottomAction",{excludeValidators:["gesture"]}),this._pullDownEnable(!!this.option("pullDownAction")&&!t.designMode),this._reachBottomEnable(!!this.option("reachBottomAction")&&!t.designMode)},_pullDownEnable:function(n){this._$pullDown.toggle(n),this._strategy.pullDownEnable(n)},_reachBottomEnable:function(n){this._$reachBottom.toggle(n),this._strategy.reachBottomEnable(n)},_handlePullDown:function(){this._pullDownAction(),this._lock()},_handleRelease:function(){this._unlock()},_handleReachBottom:function(){this._reachBottomAction(),this._lock()},_optionChanged:function(n){switch(n){case"pullDownAction":case"reachBottomAction":this._createActions();break;case"pullingDownText":case"pulledDownText":case"refreshingText":case"refreshStrategy":this._invalidate();break;case"reachBottomText":this._updateReachBottomText();break;default:this.callBase.apply(this,arguments)}},content:function(){return this._$content.children().eq(1)},release:function(n){return n!==i&&this.toggleLoading(!n),this._strategy.release()},toggleLoading:function(n){this._reachBottomEnable(n)},isFull:function(){return this.content().prop("scrollHeight")>this._$container.height()}})),r.scrollViewRefreshStrategies={}}(jQuery,DevExpress),function(n,t){var o=t.ui,y=Math,s="dx-scrollview-pull-down-loading",f="dx-scrollview-pull-down-ready",c="dx-scrollview-pull-down-image",l="dx-scrollview-pull-down-indicator",a="dx-scrollview-pull-down-text",e=0,r=1,u=2,h=3,v=o.NativeScrollableStrategy.inherit({_init:function(n){this.callBase(n),this._$topPocket=n._$topPocket,this._$pullDown=n._$pullDown,this._$bottomPocket=n._$bottomPocket,this._$refreshingText=n._$refreshingText,this._$scrollViewContent=n.content(),this._initCallbacks()},_initCallbacks:function(){this.pullDownCallbacks=n.Callbacks(),this.releaseCallbacks=n.Callbacks(),this.reachBottomCallbacks=n.Callbacks()},render:function(){this.callBase(),this._renderPullDown(),this._releaseState()},_renderPullDown:function(){var i=n("<div>").addClass(c),r=n("<div>").addClass(l),u=n("<div>").dxLoadIndicator(),t=this._$pullDownText=n("<div>").addClass(a);this._$pullingDownText=n("<div>").text(this.option("pullingDownText")).appendTo(t),this._$pulledDownText=n("<div>").text(this.option("pulledDownText")).appendTo(t),this._$refreshingText=n("<div>").text(this.option("refreshingText")).appendTo(t),this._$pullDown.empty().append(i).append(r.append(u)).append(t)},_releaseState:function(){this._state=e,this._refreshPullDownText()},_refreshPullDownText:function(){this._$pullingDownText.css("opacity",this._state===e?1:0),this._$pulledDownText.css("opacity",this._state===r?1:0),this._$refreshingText.css("opacity",this._state===u?1:0)},update:function(){this.callBase(),this._setTopPocketOffset()},_updateDimensions:function(){this.callBase(),this._topPocketSize=this._$topPocket.height(),this._bottomPocketSize=this._$bottomPocket.height(),this._scrollOffset=this._$container.height()-this._$content.height()},_setTopPocketOffset:function(){this._$topPocket.css({height:this._topPocketSize,top:-this._topPocketSize})},_handleEnd:function(){var n=this;n._state===r&&(n._setPullDownOffset(n._topPocketSize),setTimeout(function(){n._pullDownRefreshing()},400))},_setPullDownOffset:function(n){t.translator.move(this._$topPocket,{top:n}),t.translator.move(this._$scrollViewContent,{top:n})},_handleScroll:function(n){(this.callBase(n),this._state!==u)&&(this._location=this.location().top,this._isPullDown()?this._pullDownReady():this._isReachBottom()?this._reachBottom():this._stateReleased())},_isPullDown:function(){return this._pullDownEnabled&&this._location>=this._topPocketSize},_isReachBottom:function(){return this._reachBottomEnabled&&this._location<=this._scrollOffset+this._bottomPocketSize},_reachBottom:function(){this._state!==h&&(this._state=h,this.reachBottomCallbacks.fire())},_pullDownReady:function(){this._state!==r&&(this._state=r,this._$pullDown.addClass(f),this._refreshPullDownText())},_stateReleased:function(){this._state!==e&&(this._$pullDown.removeClass(s).removeClass(f),this._releaseState())},_pullDownRefreshing:function(){this._state!==u&&(this._state=u,this._$pullDown.addClass(s).removeClass(f),this._refreshPullDownText(),this.pullDownCallbacks.fire())},pullDownEnable:function(n){this._pullDownEnabled=n},reachBottomEnable:function(n){this._reachBottomEnabled=n},release:function(){var t=n.Deferred();return this._updateDimensions(),setTimeout(n.proxy(function(){this._setPullDownOffset(0),this._stateReleased(),this.releaseCallbacks.fire(),this._updateAction(),t.resolve()},this),400),t.promise()}});o.scrollViewRefreshStrategies.pullDown=v}(jQuery,DevExpress),function(n,t){var r=t.ui,s=r.events,h=Math,c="dx-scrollview-pull-down-loading",v="dx-scrollview-obsolete-android-browser",l=160,u=0,f=2,y=3,e=4,o=5,a=r.NativeScrollableStrategy.inherit({_init:function(n){this.callBase(n),this._$topPocket=n._$topPocket,this._$bottomPocket=n._$bottomPocket,this._$pullDown=n._$pullDown,this._$scrollViewContent=n.content(),this._initCallbacks(),this._releaseState(),this._location=0},_initCallbacks:function(){this.pullDownCallbacks=n.Callbacks(),this.releaseCallbacks=n.Callbacks(),this.reachBottomCallbacks=n.Callbacks()},render:function(){this.callBase(),this._renderPullDown()},_renderPullDown:function(){this._$pullDown.empty().append(n("<div class='dx-scrollview-pulldown-pointer1'>")).append(n("<div class='dx-scrollview-pulldown-pointer2'>")).append(n("<div class='dx-scrollview-pulldown-pointer3'>")).append(n("<div class='dx-scrollview-pulldown-pointer4'>"))},_releaseState:function(){this._state=u,this._$pullDown.css({width:"0%",opacity:0}),this._updateDimensions()},_updateDimensions:function(){this.callBase(),this._topPocketSize=this._$topPocket.height(),this._bottomPocketSize=this._$bottomPocket.height(),this._scrollOffset=this._$container.height()-this._$content.height()},_handleStart:function(n){this.callBase(n),this._state===u&&this._location===0&&(this._startClientY=s.eventData(n).y,this._state=e)},_handleMove:function(n){if(this.callBase(n),this._deltaY=s.eventData(n).y-this._startClientY,this._state===e&&(this._pullDownEnabled&&this._deltaY>0?(n.preventDefault(),this._state=o):this._handleEnd()),this._state===o){if(this._deltaY<0){this._handleEnd();return}this._$pullDown.css({opacity:1,width:h.min(h.abs(this._deltaY*100/l),100)+"%"}),this._isPullDown()&&this._pullDownRefreshing()}},_isPullDown:function(){return this._pullDownEnabled&&this._deltaY>=l},_handleEnd:function(){(this._state===e||this._state===o)&&this._releaseState()},_handleScroll:function(n){if(this.callBase(n),this._state!==f){var t=this.location().top,i=this._location-t;this._location=t,i>0&&this._isReachBottom()?this._reachBottom():this._stateReleased()}},_isReachBottom:function(){return this._reachBottomEnabled&&this._location<=this._scrollOffset+this._bottomPocketSize},_reachBottom:function(){this.reachBottomCallbacks.fire()},_stateReleased:function(){this._state!==u&&(this._$pullDown.removeClass(c),this._releaseState())},_pullDownRefreshing:function(){if(this._state!==f){this._state=f;var n=this;setTimeout(function(){n._$pullDown.addClass(c),n.pullDownCallbacks.fire()},400)}},pullDownEnable:function(n){this._$topPocket.toggle(n),this._pullDownEnabled=n},reachBottomEnable:function(n){this._reachBottomEnabled=n},release:function(){var t=this,i=n.Deferred();return t._updateDimensions(),setTimeout(function(){t._stateReleased(),t.releaseCallbacks.fire(),t._updateAction(),i.resolve()},800),i.promise()}});r.scrollViewRefreshStrategies.swipeDown=a}(jQuery,DevExpress),function(n,t){var u=t.ui,nt=Math,o=u.events,s="dxSlideDownNativeScrollViewStrategy",h="dx-scrollview-locked",c="dx-scrollview-pull-down-refreshing",l="dx-scrollview-pull-down-loading",tt="dx-scrollview-pull-down-ready",w="dx-scrollview-pull-down-image",b="dx-scrollview-pull-down-indicator",k="dx-scrollview-pull-down-text",a=0,f=1,r=2,v=3,y=4,it=80,e=4,p=t.Animator.inherit({ctor:function(n){this.callBase(),this.refreshStrategy=n,this._$content=n._$content},_isFinished:function(){return this._$content.scrollTop()===0},_step:function(){this._lock();var n=this._$content.scrollTop();n-=Math.min(n,2*e),this._$content.scrollTop(n)},_complete:function(){this._unlock()},_stop:function(){this._unlock()},_lock:function(){this.refreshStrategy._$container.addClass(h)},_unlock:function(){this.refreshStrategy._$container.removeClass(h)}}),d=p.inherit({_isFinished:function(){return this._currentPosition=this._$content.scrollTop(),this._currentPosition===this.refreshStrategy._topPocketSize},_step:function(){this._lock();var n=this._$content.scrollTop(),t=this.refreshStrategy._topPocketSize-n;n+=t<0?-Math.min(Math.abs(t),e):Math.min(t,e),this._$content.scrollTop(n)},_complete:function(){this.callBase(),this.refreshStrategy._releaseState()}}),g=u.NativeScrollableStrategy.inherit({_init:function(t){this.callBase(t),this._$topPocket=t._$topPocket,this._$pullDown=t._$pullDown,this._$bottomPocket=t._$bottomPocket,this._$refreshingText=t._$refreshingText,this._$content=t._$content,this._$scrollViewContent=t.content(),this._initCallbacks(),this._initAnimators();n(document).on("dx.viewchanged",n.proxy(this._hidePullDown,this))},_initCallbacks:function(){this.pullDownCallbacks=n.Callbacks(),this.releaseCallbacks=n.Callbacks(),this.reachBottomCallbacks=n.Callbacks()},_initAnimators:function(){this._slideDown=new d(this),this._slideUp=new p(this)},render:function(){this.callBase(),this._renderPullDown(),this._renderBottom(),this._releaseState(),this._updateDimensions(),this._hidePullDown()},_renderPullDown:function(){var i=n("<div>").addClass(w),r=n("<div>").addClass(b),u=n("<progress>"),t=this._$pullDownText=n("<div>").addClass(k);this._$pullingDownText=n("<div>").text(this.option("pullingDownText")).appendTo(t),this._$pulledDownText=n("<div>").text(this.option("pulledDownText")).appendTo(t),this._$refreshingText=n("<div>").text(this.option("refreshingText")).appendTo(t),this._$pullDown.empty().append(i).append(r.append(u)).append(t)},_renderBottom:function(){this._$bottomPocket.empty().append("<progress>")},_releaseState:function(){this._state=a,this._$container.removeClass(c).removeClass(l),this._refreshPullDownText()},_hidePullDown:function(){this._$content.scrollTop()<this._topPocketSize&&this._$content.scrollTop(this._topPocketSize)},_refreshPullDownText:function(){this._$pullingDownText.css("opacity",this._state===a?1:0),this._$pulledDownText.css("opacity",this._state===f?1:0),this._$refreshingText.css("opacity",this._state===r?1:0)},update:function(){this.callBase(),this._hidePullDown(),this._updateScrollbars()},_updateDimensions:function(){this._topPocketSize=this._$topPocket.height(),this._scrollOffset=this._$scrollViewContent.prop("scrollHeight")-this._$scrollViewContent.prop("clientHeight"),this._containerSize={height:this._$scrollViewContent.prop("clientHeight"),width:this._$scrollViewContent.prop("clientWidth")},this._contentSize={height:this._$scrollViewContent.prop("scrollHeight"),width:this._$scrollViewContent.prop("scrollWidth")}},_contentSize:function(){return{height:this._$scrollViewContent.prop("scrollHeight"),width:this._$scrollViewContent.prop("scrollWidth")}},location:function(){return{left:-this._$scrollViewContent.scrollLeft(),top:-this._$scrollViewContent.scrollTop()}},_attachScrollHandler:function(){this.callBase();n(this._$content).on(o.addNamespace("scroll",s),n.proxy(this._handleContentScroll,this));n(this._$scrollViewContent).on(o.addNamespace("scroll",s),n.proxy(this._handleScrollViewContentScroll,this))},_handleContentScroll:function(){var t=this._$content.scrollTop();this._isPullDown(t)?this._pullDownRefreshing():this._isReachBottom(t)?this._reachBottom():this._pullDownReady()},_isPullDown:function(n){return this._pullDownEnabled&&n===0},_pullDownRefreshing:function(){this._state!==r&&(this._state=r,this._stopAnimators(),this._refreshPullDownText(),this._$container.addClass(c),this.pullDownCallbacks.fire())},_isReachBottom:function(n){return this._scrollContent=this._$content.prop("scrollHeight")-this._$content.prop("clientHeight"),this._reachBottomEnabled&&n===this._scrollContent},_reachBottom:function(){this._state!==v&&this._reachBottomEnabled&&(this._state=v,this._stopAnimators(),this._$container.addClass(l),this.reachBottomCallbacks.fire())},_pullDownReady:function(){if(this._state!==f&&this._state!==y){if(this._state===r){this._slideUp.inProgress()||this._startUpAnimation();return}this._state=f,this._startDownAnimation()}},_startUpAnimation:function(){this._slideDown.stop(),this._slideUp.start()},_startDownAnimation:function(){this._slideUp.stop(),this._slideDown.start()},_stopAnimators:function(){this._slideDown.stop(),this._slideUp.stop()},_handleScrollViewContentScroll:function(n){this._handleScroll(n)},pullDownEnable:function(n){this._pullDownEnabled=n},reachBottomEnable:function(n){this._reachBottomEnabled=n,this._$bottomPocket.toggle(n)},release:function(){var t=n.Deferred();return this._updateDimensions(),this._updateScrollbars(),setTimeout(n.proxy(function(){this._state=y,this._startDownAnimation(),this.releaseCallbacks.fire(),this._updateAction(),t.resolve()},this),400),t.promise()},scrollBy:function(n){var t=this.location();this._component.content().scrollTop(-t.top-n.y),this._component.content().scrollLeft(-t.left-n.x)}});u.scrollViewRefreshStrategies.slideDown=g}(jQuery,DevExpress),function(n,t){var r=t.ui,h=Math,c="dx-scrollview-pull-down-loading",e="dx-scrollview-pull-down-ready",l="dx-scrollview-pull-down-image",a="dx-scrollview-pull-down-indicator",v="dx-scrollview-pull-down-text",u=0,f=1,o=2,s=3,y=r.ScrollViewScroller=r.Scroller.inherit({ctor:function(){this.callBase.apply(this,arguments),this._releaseState()},_releaseState:function(){this._state=u,this._refreshPullDownText()},_refreshPullDownText:function(){this._$pullingDownText.css("opacity",this._state===u?1:0),this._$pulledDownText.css("opacity",this._state===f?1:0),this._$refreshingText.css("opacity",this._state===o?1:0)},_initCallbacks:function(){this.callBase(),this.pullDownCallbacks=n.Callbacks(),this.releaseCallbacks=n.Callbacks(),this.reachBottomCallbacks=n.Callbacks()},_updateBounds:function(){var n=this._direction!=="horizontal";this._topPocketSize=n?this._$topPocket[this._dimension]():0,this._bottomPocketSize=n?this._$bottomPocket[this._dimension]():0,this._updateOffsets()},_updateOffsets:function(){this._minOffset=h.min(this._containerSize()-this._contentSize()+this._bottomPocketSize,-this._topPocketSize),this._maxOffset=-this._topPocketSize,this._bottomBound=this._minOffset-this._bottomPocketSize},_updateScrollbar:function(){this._scrollbar.option({containerSize:this._containerSize(),contentSize:this._contentSize()-this._topPocketSize-this._bottomPocketSize})},_calculateScrollBarPosition:function(){return this._topPocketSize+this._location},_moveContent:function(){this.callBase(),this._isPullDown()?this._pullDownReady():this._isReachBottom()?this._reachBottomReady():this._state!==u&&this._stateReleased()},_isPullDown:function(){return this._pullDownEnabled&&this._location>=0},_isReachBottom:function(){return this._reachBottomEnabled&&this._location<=this._bottomBound},_scrollComplete:function(){this._inBounds()&&this._state===f?this._pullDownRefreshing():this._inBounds()&&this._state===s?this._reachBottomLoading():this.callBase()},_reachBottomReady:function(){this._state!==s&&(this._state=s,this._minOffset=h.min(this._containerSize()-this._contentSize(),0))},_reachBottomLoading:function(){this.reachBottomCallbacks.fire()},_pullDownReady:function(){this._state!==f&&(this._state=f,this._maxOffset=0,this._$pullDown.addClass(e),this._refreshPullDownText())},_stateReleased:function(){this._state!==u&&(this._releaseState(),this._updateOffsets(),this._$pullDown.removeClass(c).removeClass(e),this.releaseCallbacks.fire())},_pullDownRefreshing:function(){this._state!==o&&(this._state=o,this._$pullDown.addClass(c).removeClass(e),this._refreshPullDownText(),this.pullDownCallbacks.fire())},_handleRelease:function(){return this._update(),t.utils.executeAsync(n.proxy(this._release,this))},_release:function(){this._stateReleased(),this._scrollComplete()},_handleReachBottomEnabling:function(n){this._reachBottomEnabled!==n&&(this._reachBottomEnabled=n,this._updateBounds())},_handlePullDownEnabling:function(n){this._pullDownEnabled!==n&&(this._pullDownEnabled=n,this._considerTopPocketChange(),this._handleUpdate())},_considerTopPocketChange:function(){this._location-=this._$topPocket.height()||-this._topPocketSize,this._move()}}),p=r.SimulatedScrollableStrategy.inherit({_init:function(n){this.callBase(n),this._$pullDown=n._$pullDown,this._$topPocket=n._$topPocket,this._$bottomPocket=n._$bottomPocket,this._initCallbacks()},_initCallbacks:function(){this.pullDownCallbacks=n.Callbacks(),this.releaseCallbacks=n.Callbacks(),this.reachBottomCallbacks=n.Callbacks()},render:function(){this._renderPullDown(),this.callBase()},_renderPullDown:function(){var i=n("<div>").addClass(l),r=n("<div>").addClass(a),u=n("<div>").dxLoadIndicator(),t=this._$pullDownText=n("<div>").addClass(v);this._$pullingDownText=n("<div>").text(this.option("pullingDownText")).appendTo(t),this._$pulledDownText=n("<div>").text(this.option("pulledDownText")).appendTo(t),this._$refreshingText=n("<div>").text(this.option("refreshingText")).appendTo(t),this._$pullDown.empty().append(i).append(r.append(u)).append(t)},pullDownEnable:function(n){this._handleEvent("PullDownEnabling",n)},reachBottomEnable:function(n){this._handleEvent("ReachBottomEnabling",n)},_createScroller:function(n){var t=this,i=t._scrollers[n]=new y(t._scrollerOptions(n));i.pullDownCallbacks.add(function(){t.pullDownCallbacks.fire()}),i.releaseCallbacks.add(function(){t.releaseCallbacks.fire()}),i.reachBottomCallbacks.add(function(){t.reachBottomCallbacks.fire()})},_scrollerOptions:function(t){return n.extend(this.callBase(t),{$topPocket:this._$topPocket,$bottomPocket:this._$bottomPocket,$pullDown:this._$pullDown,$pullDownText:this._$pullDownText,$pullingDownText:this._$pullingDownText,$pulledDownText:this._$pulledDownText,$refreshingText:this._$refreshingText})},release:function(){return this._handleEvent("Release").done(this._updateAction)}});r.scrollViewRefreshStrategies.simulated=p}(jQuery,DevExpress),function(n,t,i){var r=t.ui,o=r.events,s=t.utils,h=t.support.winJS,f;r.MapProvider=t.Class.inherit({_defaultRouteWeight:function(){return 5},_defaultRouteOpacity:function(){return.5},_defaultRouteColor:function(){return"#0000FF"},ctor:function(n,t){this._mapInstance=n,this._$container=t},load:n.noop,render:t.abstract,updateDimensions:t.abstract,updateMapType:t.abstract,updateLocation:t.abstract,updateZoom:t.abstract,updateControls:t.abstract,updateMarkers:t.abstract,addMarkers:t.abstract,updateRoutes:t.abstract,addRoutes:t.abstract,clean:t.abstract,cancelEvents:!1,map:function(){return this._map},mapRendered:function(){return!!this._map},_option:function(n,t){if(t===i)return this._mapInstance.option(n);this._mapInstance.setOptionSilent(n,t)},_key:function(n){var t=this._option("key");return t[n]===i?t:t[n]},_parseTooltipOptions:function(n){return{text:n.text||n,visible:n.isShown||!1}},_createAction:function(){return this._mapInstance._createAction.apply(this._mapInstance,n.makeArray(arguments))},_handleClickAction:function(){var t=this._createAction(this._option("clickAction")||n.noop);t()}}),f={},r.registerMapProvider=function(n,t){f[n]=t};var c="dx-map",l="dx-map-container",e="dx-map-shield",u=function(t){return n.isArray(t)?t:[t]};r.registerComponent("dxMap",r.Widget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{location:{lat:0,lng:0},width:300,height:300,zoom:1,type:"roadmap",provider:"google",markers:[],markerIconSrc:null,routes:[],key:{bing:"",google:"",googleStatic:""},controls:!1,readyAction:null,updateAction:null})},_init:function(){this.callBase(),this._initContainer(),this._grabEvents(),this._initProvider()},_initContainer:function(){this._$container=n("<div />").addClass(l),this._element().append(this._$container)},_grabEvents:function(){var t=o.addNamespace("dxpointerdown",this.NAME);this._element().on(t,n.proxy(this._cancelEvent,this))},_cancelEvent:function(n){var i=this._provider.cancelEvents&&!this.option("disabled");!t.designMode&&i&&n.stopPropagation()},_initProvider:function(){var n=this.option("provider");if(h&&this.option("provider")==="google")throw new Error("Google provider cannot be used in winJS application");this._provider&&this._provider.clean(),this._provider=new f[n](this,this._$container),this._mapLoader=this._provider.load()},_render:function(){this.callBase(),this._element().addClass(c),this._renderShield(),this._execAsyncProviderAction("render")},_renderShield:function(){var i;t.designMode||this.option("disabled")?(i=n("<div/>").addClass(e),this._element().append(i)):(i=this._element().find("."+e),i.remove())},_clean:function(){this._provider.clean()},_optionChanged:function(n){if(!this._cancelOptionChange)switch(n){case"disabled":this._renderShield(),this.callBase.apply(this,arguments);break;case"width":case"height":this.callBase.apply(this,arguments),this._execAsyncProviderAction("updateDimensions");break;case"type":this._execAsyncProviderAction("updateMapType");break;case"location":this._execAsyncProviderAction("updateLocation");break;case"zoom":this._execAsyncProviderAction("updateZoom");break;case"controls":this._execAsyncProviderAction("updateControls");break;case"markers":case"markerIconSrc":this._execAsyncProviderAction("updateMarkers");break;case"routes":this._execAsyncProviderAction("updateRoutes");break;case"key":s.logger.warn("Key option can not be modified after initialisation");case"provider":this._initProvider(),this._invalidate();break;case"clickAction":case"readyAction":case"updateAction":break;default:this.callBase.apply(this,arguments)}},_execAsyncProviderAction:function(t){if(this._provider.mapRendered()||t==="render"){var i=n.Deferred(),r=this,u=n.makeArray(arguments).slice(1);return n.when(this._mapLoader).done(function(){var f=r._provider;f[t].apply(f,u).done(function(t){r._triggerUpdateAction(),t&&r._triggerReadyAction(),i.resolve.apply(i,n.makeArray(arguments).slice(1))})}),i.promise()}},_triggerReadyAction:function(){this._createActionByOption("readyAction")({originalMap:this._provider.map()})},_triggerUpdateAction:function(){this._createActionByOption("updateAction")()},setOptionSilent:function(n,t){this._cancelOptionChange=!0,this.option(n,t),this._cancelOptionChange=!1},addMarker:function(t){var r=n.Deferred(),e=this,f=this._options.markers,i=u(t);return f.push.apply(f,i),this._execAsyncProviderAction("addMarkers",i).done(function(n){r.resolveWith(e,i.length>1?[n]:n)}),r.promise()},removeMarker:function(t){var i=n.Deferred(),f=this,r=this._options.markers,e=u(t);return n.each(e,function(t,i){var u=n.isNumeric(i)?i:n.inArray(i,r);u!==-1&&r.splice(u,1)}),this._execAsyncProviderAction("updateMarkers").done(function(){i.resolveWith(f)}),i.promise()},addRoute:function(t){var r=n.Deferred(),e=this,f=this._options.routes,i=u(t);return f.push.apply(f,i),this._execAsyncProviderAction("addRoutes",i).done(function(n){r.resolveWith(e,i.length>1?[n]:n)}),r.promise()},removeRoute:function(t){var i=n.Deferred(),f=this,r=this._options.routes,e=u(t);return n.each(e,function(t,i){var u=n.isNumeric(i)?i:n.inArray(i,r);u!==-1&&r.splice(u,1)}),this._execAsyncProviderAction("updateRoutes").done(function(){i.resolveWith(f)}),i.promise()}}))}(jQuery,DevExpress),function(n,t,i){var f=t.ui,o=t.support.winJS,r="_bingScriptReady",s="https://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&s=1&onScriptLoad="+r,h="ms-appx:///Bing.Maps.JavaScript/js/veapicore.js",c="ms-appx:///Bing.Maps.JavaScript/js/veapiModules.js",l="AhuxC0dQ1DBTNo8L-H9ToVMQStmizZzBJdraTSgCzDSWPsA1Qd8uIvFSflzxdaLH",e=1e-16,u;f.registerMapProvider("bing",f.MapProvider.inherit({_mapType:function(n){var t={roadmap:Microsoft.Maps.MapTypeId.road,hybrid:Microsoft.Maps.MapTypeId.aerial};return t[n]||t.roadmap},_movementMode:function(n){var t={driving:Microsoft.Maps.Directions.RouteMode.driving,walking:Microsoft.Maps.Directions.RouteMode.walking};return t[n]||t.driving},_resolveLocation:function(t){var i=n.Deferred(),r,u;return typeof t=="string"?(r=new Microsoft.Maps.Search.SearchManager(this._map),u={where:t,count:1,callback:function(n){var t=n.results[0].location;i.resolve(new Microsoft.Maps.Location(t.latitude,t.longitude))}},r.geocode(u)):n.isPlainObject(t)&&n.isNumeric(t.lat)&&n.isNumeric(t.lng)?i.resolve(new Microsoft.Maps.Location(t.lat,t.lng)):n.isArray(t)&&i.resolve(new Microsoft.Maps.Location(t[0],t[1])),i.promise()},_normalizeLocation:function(n){return{lat:n.latitude,lng:n.longitude}},load:function(){return u||(u=n.Deferred(),window[r]=n.proxy(this._mapReady,this),o?n.when(n.getScript(h),n.getScript(c)).done(function(){Microsoft.Maps.loadModule("Microsoft.Maps.Map",{callback:window[r]})}):n.getScript(s)),this._markers=[],this._routes=[],u},_mapReady:function(){try{delete window[r]}catch(e){window[r]=i}var t=n.Deferred(),f=n.Deferred();Microsoft.Maps.loadModule("Microsoft.Maps.Search",{callback:n.proxy(t.resolve,t)}),Microsoft.Maps.loadModule("Microsoft.Maps.Directions",{callback:n.proxy(f.resolve,f)}),n.when(t,f).done(function(){u.resolve()})},render:function(){var r=n.Deferred(),t=n.Deferred(),i=this._option("controls"),f={credentials:this._key("bing")||l,mapTypeId:this._mapType(this._option("type")),zoom:this._option("zoom"),showDashboard:i,showMapTypeSelector:i,showScalebar:i},u;this._map=new Microsoft.Maps.Map(this._$container[0],f),u=Microsoft.Maps.Events.addHandler(this._map,"tiledownloadcomplete",n.proxy(t.resolve,t)),this._viewChangeHandler=Microsoft.Maps.Events.addHandler(this._map,"viewchange",n.proxy(this._handleViewChange,this)),this._clickHandler=Microsoft.Maps.Events.addHandler(this._map,"click",n.proxy(this._handleClickAction,this));var e=this._renderLocation(),o=this._refreshMarkers(),s=this._renderRoutes();return n.when(t,e,o,s).done(function(){Microsoft.Maps.Events.removeHandler(u),r.resolve(!0)}),r.promise()},_handleViewChange:function(){var n=this._map.getCenter();this._option("location",this._normalizeLocation(n)),this._option("zoom",this._map.getZoom())},updateDimensions:function(){return n.Deferred().resolve().promise()},updateMapType:function(){return this._map.setView({mapTypeId:this._mapType(this._option("type"))}),n.Deferred().resolve().promise()},updateLocation:function(){return this._renderLocation()},_renderLocation:function(){var t=n.Deferred(),i=this;return this._resolveLocation(this._option("location")).done(function(n){i._map.setView({animate:!1,center:n}),t.resolve()}),t.promise()},updateZoom:function(){return this._map.setView({animate:!1,zoom:this._option("zoom")}),n.Deferred().resolve().promise()},updateControls:function(){return this.clean(),this.render()},_clearBounds:function(){this._bounds=null},_extendBounds:function(n){this._bounds=this._bounds?new Microsoft.Maps.LocationRect.fromLocations(this._bounds.getNorthwest(),this._bounds.getSoutheast(),n):new Microsoft.Maps.LocationRect(n,e,e)},_fitBounds:function(){this._bounds&&(this._bounds.height=this._bounds.height*1.1,this._bounds.width=this._bounds.width*1.1,this._map.setView({animate:!1,bounds:this._bounds}))},updateMarkers:function(){return this._refreshMarkers()},_refreshMarkers:function(){return this._clearMarkers(),this._renderMarkers()},_clearMarkers:function(){var t=this;this._clearBounds(),n.each(this._markers,function(n,i){t._map.entities.remove(i.pushpin),i.infobox&&t._map.entities.remove(i.infobox),i.handler&&Microsoft.Maps.Events.removeHandler(i.handler)}),this._markers=[]},addMarkers:function(n){return this._renderMarkers(n)},_renderMarkers:function(t){t=t||this._option("markers");var i=n.Deferred(),r=this,u=n.map(t,function(n){return r._addMarker(n)});return n.when.apply(n,u).done(function(){var t=n.map(n.makeArray(arguments),function(n){return n.pushpin});i.resolve(!1,t)}),i.done(function(){r._fitBounds()}),i.promise()},_addMarker:function(n){var t=this;return this._renderMarker(n).done(function(n){t._markers.push(n)})},_renderMarker:function(t){var r=n.Deferred(),i=this;return this._resolveLocation(t.location).done(function(u){var e=new Microsoft.Maps.Pushpin(u,{icon:t.iconSrc||i._option("markerIconSrc")}),f,o,s;i._map.entities.push(e),f=i._renderTooltip(u,t.tooltip),(t.clickAction||t.tooltip)&&(s=i._createAction(t.clickAction||n.noop),o=Microsoft.Maps.Events.addHandler(e,"click",function(){s({location:i._normalizeLocation(u)}),f&&f.setOptions({visible:!0})})),i._extendBounds(u),r.resolve({pushpin:e,infobox:f,handler:o})}),r.promise()},_renderTooltip:function(n,t){if(t){t=this._parseTooltipOptions(t);var i=new Microsoft.Maps.Infobox(n,{description:t.text,offset:new Microsoft.Maps.Point(0,33),visible:t.visible});return this._map.entities.push(i,null),i}},updateRoutes:function(){return this._refreshRoutes()},addRoutes:function(n){return this._renderRoutes(n)},_refreshRoutes:function(){return this._clearRoutes(),this._renderRoutes()},_renderRoutes:function(t){t=t||this._option("routes");var i=n.Deferred(),r=this,u=n.map(t,function(n){return r._addRoute(n)});return n.when.apply(n,u).done(function(){i.resolve(!1,n.makeArray(arguments))}),i.promise()},_clearRoutes:function(){var t=this;n.each(this._routes,function(n,t){t.dispose()}),this._routes=[]},_addRoute:function(n){var t=this;return this._renderRoute(n).done(function(n){t._routes.push(n)})},_renderRoute:function(i){var u=n.Deferred(),r=this,f=n.map(i.locations,function(n){return r._resolveLocation(n)});return n.when.apply(n,f).done(function(){var s=n.makeArray(arguments),f=new Microsoft.Maps.Directions.DirectionsManager(r._map),h=new t.Color(i.color||r._defaultRouteColor()).toHex(),e=new Microsoft.Maps.Color.fromHex(h),o;e.a=(i.opacity||r._defaultRouteOpacity())*255,f.setRenderOptions({autoUpdateMapView:!1,displayRouteSelector:!1,waypointPushpinOptions:{visible:!1},drivingPolylineOptions:{strokeColor:e,strokeThickness:i.weight||r._defaultRouteWeight()},walkingPolylineOptions:{strokeColor:e,strokeThickness:i.weight||r._defaultRouteWeight()}}),f.setRequestOptions({routeMode:r._movementMode(i.mode),routeDraggable:!1}),n.each(s,function(n,t){var i=new Microsoft.Maps.Directions.Waypoint({location:t});f.addWaypoint(i)}),o=Microsoft.Maps.Events.addHandler(f,"directionsUpdated",function(){Microsoft.Maps.Events.removeHandler(o),u.resolve(f)}),f.calculateDirections()}),u.promise()},clean:function(){this._map&&(Microsoft.Maps.Events.removeHandler(this._viewChangeHandler),Microsoft.Maps.Events.removeHandler(this._clickHandler),this._clearMarkers(),this._clearRoutes(),this._map.dispose())},cancelEvents:!0}))}(jQuery,DevExpress),function(n,t,i){var f=t.ui,r="_googleScriptReady",e="https://maps.google.com/maps/api/js?v=3.9&sensor=false&callback="+r,u;f.registerMapProvider("google",f.MapProvider.inherit({_mapType:function(n){var t={hybrid:google.maps.MapTypeId.HYBRID,roadmap:google.maps.MapTypeId.ROADMAP};return t[n]||t.hybrid},_movementMode:function(n){var t={driving:google.maps.TravelMode.DRIVING,walking:google.maps.TravelMode.WALKING};return t[n]||t.driving},_resolveLocation:function(t){var i=n.Deferred(),r;return typeof t=="string"?(r=new google.maps.Geocoder,r.geocode({address:t},function(n,t){t===google.maps.GeocoderStatus.OK&&i.resolve(n[0].geometry.location)})):n.isArray(t)?i.resolve(new google.maps.LatLng(t[0],t[1])):n.isPlainObject(t)&&n.isNumeric(t.lat)&&n.isNumeric(t.lng)&&i.resolve(new google.maps.LatLng(t.lat,t.lng)),i.promise()},_normalizeLocation:function(n){return{lat:n.lat(),lng:n.lng()}},load:function(){if(!u){u=n.Deferred();var t=this._key("google");window[r]=n.proxy(this._mapReady,this),n.getScript(e+(t?"&key="+t:""))}return this._markers=[],this._routes=[],u.promise()},_mapReady:function(){try{delete window[r]}catch(n){window[r]=i}u.resolve()},render:function(){var r=n.Deferred(),i=n.Deferred(),t=this._option("controls"),f={zoom:this._option("zoom"),center:new google.maps.LatLng(0,0),mapTypeId:this._mapType(this._option("type")),panControl:t,zoomControl:t,mapTypeControl:t,streetViewControl:t},u;this._map=new google.maps.Map(this._$container[0],f),u=google.maps.event.addListener(this._map,"idle",n.proxy(i.resolve,i)),this._zoomChangeListener=google.maps.event.addListener(this._map,"zoom_changed",n.proxy(this._handleZoomChange,this)),this._centerChangeListener=google.maps.event.addListener(this._map,"center_changed",n.proxy(this._handleCenterChange,this)),this._clickListener=google.maps.event.addListener(this._map,"click",n.proxy(this._handleClickAction,this));var e=this._renderLocation(),o=this._refreshMarkers(),s=this._renderRoutes();return n.when(i,e,o,s).done(function(){google.maps.event.removeListener(u),r.resolve(!0)}),r.promise()},updateDimensions:function(){return google.maps.event.trigger(this._map,"resize"),n.Deferred().resolve().promise()},updateMapType:function(){return this._map.setMapTypeId(this._mapType(this._option("type"))),n.Deferred().resolve().promise()},updateLocation:function(){return this._renderLocation()},_handleCenterChange:function(){var n=this._map.getCenter();this._option("location",this._normalizeLocation(n))},_renderLocation:function(){var t=n.Deferred(),i=this;return this._resolveLocation(this._option("location")).done(function(n){i._map.setCenter(n),t.resolve()}),t.promise()},_handleZoomChange:function(){this._option("zoom",this._map.getZoom())},updateZoom:function(){return this._map.setZoom(this._option("zoom")),n.Deferred().resolve().promise()},updateControls:function(){var t=this._option("controls");return this._map.setOptions({panControl:t,zoomControl:t,mapTypeControl:t,streetViewControl:t}),n.Deferred().resolve().promise()},_clearBounds:function(){this._bounds=null},_extendBounds:function(n){this._bounds?this._bounds.extend(n):(this._bounds=new google.maps.LatLngBounds,this._bounds.extend(n))},_fitBounds:function(){this._bounds&&this._map.fitBounds(this._bounds)},updateMarkers:function(){return this._refreshMarkers()},_refreshMarkers:function(){return this._clearMarkers(),this._renderMarkers()},_clearMarkers:function(){var t=this;this._clearBounds(),n.each(this._markers,function(n,t){t.instance.setMap(null),t.listner&&google.maps.event.removeListener(t.listner)}),this._markers=[]},addMarkers:function(n){return this._renderMarkers(n)},_renderMarkers:function(t){t=t||this._option("markers");var i=n.Deferred(),r=this,u=n.map(t,function(n){return r._addMarker(n)});return n.when.apply(n,u).done(function(){var t=n.map(n.makeArray(arguments),function(n){return n.instance});i.resolve(!1,t)}),i.done(function(){r._fitBounds()}),i.promise()},_addMarker:function(n){var t=this;return this._renderMarker(n).done(function(n){t._markers.push(n)})},_renderMarker:function(t){var r=n.Deferred(),i=this;return this._resolveLocation(t.location).done(function(u){var f=new google.maps.Marker({position:u,map:i._map,icon:t.iconSrc||i._option("markerIconSrc")}),e,o=i._renderTooltip(f,t.tooltip),s;(t.clickAction||t.tooltip)&&(s=i._createAction(t.clickAction||n.noop),e=google.maps.event.addListener(f,"click",function(){s({location:i._normalizeLocation(u)}),o&&o.open(i._map,f)})),i._extendBounds(u),r.resolve({instance:f,listner:e})}),r.promise()},_renderTooltip:function(n,t){if(t){t=this._parseTooltipOptions(t);var i=new google.maps.InfoWindow({content:t.text});return t.visible&&i.open(this._map,n),i}},updateRoutes:function(){return this._refreshRoutes()},addRoutes:function(){return this._renderRoutes()},_refreshRoutes:function(){return this._clearRoutes(),this._renderRoutes()},_clearRoutes:function(){var t=this;n.each(this._routes,function(n,t){t.setMap(null)}),this._routes=[]},_renderRoutes:function(t){t=t||this._option("routes");var i=n.Deferred(),r=this,u=n.map(t,function(n){return r._addRoute(n)});return n.when.apply(n,u).done(function(){i.resolve(!1,n.makeArray(arguments))}),i.promise()},_addRoute:function(n){var t=this;return this._renderRoute(n).done(function(n){t._routes.push(n)})},_renderRoute:function(i){var u=n.Deferred(),r=this,f=new google.maps.DirectionsService,e=n.map(i.locations,function(n){return r._resolveLocation(n)});return n.when.apply(n,e).done(function(){var e=n.makeArray(arguments),o=e.shift(),s=e.pop(),h=n.map(e,function(n){return{location:n,stopover:!0}}),c={origin:o,destination:s,waypoints:h,optimizeWaypoints:!0,travelMode:r._movementMode(i.mode)};f.route(c,function(n,f){if(f===google.maps.DirectionsStatus.OK){var e=new t.Color(i.color||r._defaultRouteColor()).toHex(),o={directions:n,map:r._map,suppressMarkers:!0,preserveViewport:!0,polylineOptions:{strokeWeight:i.weight||r._defaultRouteWeight(),strokeOpacity:i.opacity||r._defaultRouteOpacity(),strokeColor:e}},s=new google.maps.DirectionsRenderer(o);u.resolve(s)}})}),u.promise()},clean:function(){this._map&&(google.maps.event.removeListener(this._zoomChangeListener),google.maps.event.removeListener(this._centerChangeListener),google.maps.event.removeListener(this._clickListener),this._clearMarkers(),this._clearRoutes(),delete this._map,this._$container.empty())},cancelEvents:!0}))}(jQuery,DevExpress),function(n,t){var r=t.ui,u="https://maps.google.com/maps/api/staticmap?";r.registerMapProvider("googleStatic",r.MapProvider.inherit({_locationToString:function(t){return n.isPlainObject(t)?t.lat+","+t.lng:t.toString().replace(/ /g,"+")},render:function(){return this._updateMap()},updateDimensions:function(){return this._updateMap()},updateMapType:function(){return this._updateMap()},updateLocation:function(){return this._updateMap()},updateZoom:function(){return this._updateMap()},updateControls:function(){return n.Deferred().resolve().promise()},updateMarkers:function(){return this._updateMap()},addMarkers:function(){return this._updateMap()},updateRoutes:function(){return this._updateMap()},addRoutes:function(){return this._updateMap()},clean:function(){this._$container.css("background-image","none")},mapRendered:function(){return!0},_updateMap:function(){var r=this._key("googleStatic"),t=["sensor=false","size="+this._option("width")+"x"+this._option("height"),"maptype="+this._option("type"),"center="+this._locationToString(this._option("location")),"zoom="+this._option("zoom"),this._markersSubstring()],i;return t.push.apply(t,this._routeSubstrings()),r&&t.push("key="+this._key("googleStatic")),i=u+t.join("&"),this._$container.css("background",'url("'+i+'") no-repeat 0 0'),n.Deferred().resolve(!0).promise()},_markersSubstring:function(){var r=this,t=[],i=this._option("markerIconSrc");return i&&t.push("icon:"+i),n.each(this._option("markers"),function(n,i){t.push(r._locationToString(i.location))}),"markers="+t.join("|")},_routeSubstrings:function(){var r=this,i=[];return n.each(this._option("routes"),function(u,f){var o=new t.Color(f.color||ROUTE_COLOR_DEFAULT).toHex().replace("#","0x"),s=Math.round((f.opacity||ROUTE_OPACITY_DEFAULT)*255).toString(16),h=f.weight||ROUTE_WEIGHT_DEFAULT,e=[];n.each(f.locations,function(n,t){e.push(r._locationToString(t))}),i.push("path=color:"+o+s+"|weight:"+h+"|"+e.join("|"))}),i}}))}(jQuery,DevExpress),function(n,t){var r=t.ui,f=r.events,u="dxSwipeable",e="dx-swipeable",o={startAction:"dxswipestart",updateAction:"dxswipe",endAction:"dxswipeend",cancelAction:"dxswipecancel"};r.registerComponent(u,r.Component.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{elastic:!0,direction:"horizontal",itemSizeFunc:null,startAction:null,updateAction:null,endAction:null,cancelAction:null})},_render:function(){this.callBase(),this._element().addClass(e),this._attachEventHandlers()},_attachEventHandlers:function(){if(!this.option("disabled")){var t=this.NAME;this._createEventData(),n.each(o,n.proxy(function(n,i){var r=this._createActionByOption(n,{context:this,excludeValidators:["gesture"]}),i=f.addNamespace(i,t);this._element().off(i).on(i,this._eventData,function(n){return r({jQueryEvent:n})})},this))}},_createEventData:function(){this._eventData={elastic:this.option("elastic"),itemSizeFunc:this.option("itemSizeFunc"),direction:this.option("direction")}},_detachEventHanlers:function(){this._element().off("."+u)},_optionChanged:function(n){switch(n){case"disabled":case"startAction":case"updateAction":case"endAction":case"cancelAction":case"elastic":case"itemSizeFunc":case"direction":this._detachEventHanlers(),this._attachEventHandlers();break;default:this.callBase.apply(this,arguments)}}}))}(jQuery,DevExpress),function(n,t){var r=t.ui,f="dx-button",e="dx-button-content",u=".dx-button-content",o="dx-button-text",s=".dx-button-text",h="dx-button-back-arrow",c="dx-icon",l=".dx-icon",a=100;r.registerComponent("dxButton",r.Widget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{type:"normal",text:"",icon:"",iconSrc:"",hoverStateEnabled:!0})},_init:function(){this.callBase(),this._feedbackHideTimeout=a},_render:function(){this.callBase(),this._element().addClass(f).append(n("<div />").addClass(e)),this._renderIcon(),this._renderType(),this._renderText()},_clean:function(){this.callBase(),this._removeTypesCss()},_removeTypesCss:function(){var n=this._element().attr("class");n=n.replace(/\bdx-button-[-a-z0-9]+\b/gi,""),this._element().attr("class",n)},_renderIcon:function(){var f=this._element().find(u),i=f.find(l),t=this.option("icon"),r=this.option("iconSrc");(i.remove(),this.option("type")!=="back"||t||(t="back"),t||r)&&(t?i=n("<span />").addClass("dx-icon-"+t):r&&(i=n("<img />").attr("src",r)),f.prepend(i.addClass(c)))},_renderType:function(){var t=this.option("type");t&&this._element().addClass("dx-button-"+t),t==="back"&&this._element().prepend(n("<span />").addClass(h))},_renderText:function(){var r=this.option("text"),f=this._element().find(u),e=this.option("type")==="back",i=f.find(s);if(!r&&!e){i.remove();return}i.length||(i=n("<span />").addClass(o).appendTo(f)),i.text(r||t.localization.localizeString("@Back"))},_optionChanged:function(n){switch(n){case"icon":case"iconSrc":this._renderIcon();break;case"text":this._renderText();break;case"type":this._invalidate();break;default:this.callBase.apply(this,arguments)}}}))}(jQuery,DevExpress),function(n,t){var r=t.ui,u=r.events,f="dx-checkbox",e="dx-checkbox-icon",o="dx-checkbox-checked",s=100;r.registerComponent("dxCheckBox",r.Widget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{checked:!1,hoverStateEnabled:!0})},_init:function(){this.callBase(),this._feedbackHideTimeout=s},_render:function(){this.callBase(),this._element().addClass(f),n("<span />").addClass(e).appendTo(this._element()),this._renderValue()},_renderClick:function(){var n=this,t=u.addNamespace("dxclick",this.NAME),i=this._createActionByOption("clickAction",{beforeExecute:function(){n.option("checked",!n.option("checked"))}});this._element().off(t).on(t,function(n){i({jQueryEvent:n})})},_renderValue:function(){this._element().toggleClass(o,Boolean(this.option("checked")))},_optionChanged:function(n){switch(n){case"checked":this._renderValue();break;default:this.callBase.apply(this,arguments)}}}))}(jQuery,DevExpress),function(n,t){var u=t.ui,e=u.events,f=t.fx,r="dx-switch",o=r+"-wrapper",s=r+"-inner",h=r+"-handle",c=r+"-on-value",l=r+"-on",a=r+"-off",v=100;u.registerComponent("dxSwitch",u.Widget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{onText:Globalize.localize("dxSwitch-onText"),offText:Globalize.localize("dxSwitch-offText"),value:!1,valueChangeAction:null})},_init:function(){this.callBase(),this._animating=!1,this._animationDuration=v},_render:function(){var t=this._element();this._$switchInner=n("<div>").addClass(s),this._$handle=n("<div>").addClass(h).appendTo(this._$switchInner),this._$labelOn=n("<div>").addClass(l).prependTo(this._$switchInner),this._$labelOff=n("<div>").addClass(a).appendTo(this._$switchInner),this._$switchWrapper=n("<div>").addClass(o).append(this._$switchInner),t.addClass(r).append(this._$switchWrapper),t.dxSwipeable({elastic:!1,startAction:n.proxy(this._handleSwipeStart,this),updateAction:n.proxy(this._handleSwipeUpdate,this),endAction:n.proxy(this._handleSwipeEnd,this)}),this._renderLabels(),this.callBase(),this._updateMarginBound(),this._renderValue(),this._renderValueChangeAction()},_renderValueChangeAction:function(){this._changeAction=this._createActionByOption("valueChangeAction",{excludeValidators:["gesture"]})},_updateMarginBound:function(){this._marginBound=this._$switchWrapper.outerWidth(!0)-this._$handle.outerWidth()},_renderPosition:function(n,t){var i=n?1:0;this._$switchInner.css("marginLeft",this._marginBound*(i+t-1))},_validateValue:function(){var n=this.option("value");typeof n!="boolean"&&(this._options.value=!!n)},_renderClick:function(){this.callBase();var t=e.addNamespace("dxclick",this.NAME),i=this._createAction(n.proxy(this._handleClick,this));this._element().on(t,function(n){i({jQueryEvent:n})})},_handleClick:function(n){var t=n.component,i,r;t._animating||t._swiping||(t._animating=!0,i=t.option("value"),r=!i,f.animate(this._$switchInner,{from:{marginLeft:(Number(i)-1)*this._marginBound},to:{marginLeft:(Number(r)-1)*this._marginBound},duration:t._animationDuration,complete:function(){t._animating=!1,t.option("value",r)}}))},_handleSwipeStart:function(n){var t=this.option("value");n.jQueryEvent.maxLeftOffset=t?1:0,n.jQueryEvent.maxRightOffset=t?0:1,this._swiping=!0},_handleSwipeUpdate:function(n){this._renderPosition(this.option("value"),n.jQueryEvent.offset)},_handleSwipeEnd:function(n){var t=this;f.animate(this._$switchInner,{to:{marginLeft:this._marginBound*(t.option("value")+n.jQueryEvent.targetOffset-1)},duration:t._animationDuration,complete:function(){t._swiping=!1;var i=t.option("value")+n.jQueryEvent.targetOffset;t.option("value",Boolean(i))}})},_renderValue:function(){this._validateValue();var n=this.option("value");this._renderPosition(n,0),this._element().toggleClass(c,n)},_renderLabels:function(){this._$labelOn.text(this.option("onText")),this._$labelOff.text(this.option("offText"))},_optionChanged:function(n,t,i){switch(n){case"visible":case"width":this._refresh();break;case"value":this._renderValue(),this._changeAction(t);break;case"valueChangeAction":this._renderValueChangeAction();break;case"onText":case"offText":this._renderLabels();break;default:this.callBase(n,t,i)}},_feedbackOff:function(n){n||this.callBase.apply(this,arguments)}}))}(jQuery,DevExpress),function(n,t,i){var r=t.ui,u=r.events,h="dx-editbox",f="dx-editbox-input",c="."+f,l="dx-editbox-border",e="dx-placeholder",o=["focusIn","focusOut","keyDown","keyPress","keyUp","change"],s=function(){var n=document.createElement("input");return"placeholder"in n}();r.registerComponent("dxEditBox",r.Widget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{value:"",valueUpdateEvent:"change",valueUpdateAction:null,placeholder:"",readOnly:!1,focusInAction:null,focusOutAction:null,keyDownAction:null,keyPressAction:null,keyUpAction:null,changeAction:null,enterKeyAction:null,mode:"text"})},_input:function(){return this._element().find(c)},_render:function(){this._element().addClass(h),this._renderInput(),this._renderInputType(),this._renderValue(),this._renderProps(),this._renderPlaceholder(),this._renderEvents(),this._renderEnterKeyAction(),this.callBase()},_renderInput:function(){this._element().append(n("<input />").addClass(f)).append(n("<div />").addClass(l))},_renderValue:function(){this._input().val()!==this.option("value")&&this._input().val(this.option("value"))},_renderProps:function(){this._input().prop({placeholder:this.option("placeholder"),readOnly:this._readOnlyPropValue(),disabled:this.option("disabled")})},_readOnlyPropValue:function(){return this.option("readOnly")},_renderPlaceholder:function(){if(!s){var t=this,f=t.option("placeholder"),i=t._input(),r=n("<div />").addClass(e).addClass("dx-hide").attr("data-dx_placeholder",f),o=u.addNamespace("dxpointerdown",this.NAME);r.on(o,function(){i.focus()});i.wrap(r).on("focus.dxEditBox focusin.dxEditBox",function(){t._setStatePlaceholder.call(t,!0)}).on("blur.dxEditBox focusout.dxEditBox",function(){t._setStatePlaceholder.call(t,!1)});t._setStatePlaceholder()}},_renderEvents:function(){var t=this,i=t._input();t._renderValueUpdateEvent(),n.each(o,function(n,r){var f=u.addNamespace(r.toLowerCase(),t.NAME),e=t._createActionByOption(r+"Action");i.off(f).on(f,function(n){e({jQueryEvent:n})})})},_renderValueUpdateEvent:function(){var t=this.NAME+"ValueUpdate",i=u.addNamespace(this.option("valueUpdateEvent"),t);this._input().off("."+t).on(i,n.proxy(this._handleValueChange,this));this._changeAction=this._createActionByOption("valueUpdateAction")},_setStatePlaceholder:function(n){if(!s){var t=this._input(),r=t.parent("."+e);n===i&&(t.val()||t.prop("disabled")||!t.prop("placeholder")||(n=!1)),t.val()&&(n=!0),r.toggleClass("dx-hide",n)}},_handleValueChange:function(n){this._currentValueUpdateEvent=n,this.option("value",this._input().val()),this._currentValueUpdateEvent&&this._dispatchChangeAction()},_renderEnterKeyAction:function(){if(this.option("enterKeyAction")){this._enterKeyAction=this._createActionByOption("enterKeyAction");this._input().on("keyup.enterKey.dxEditBox",n.proxy(this._onKeyDownHandler,this))}else this._input().off("keyup.enterKey.dxEditBox"),this._enterKeyAction=i},_onKeyDownHandler:function(n){n.which===13&&this._enterKeyAction({jQueryEvent:n})},_toggleDisabledState:function(){this.callBase.apply(this,arguments),this._renderProps()},_dispatchChangeAction:function(){this._changeAction({actionValue:this.option("value"),jQueryEvent:this._currentValueUpdateEvent}),this._currentValueUpdateEvent=i},_updateValue:function(){this._renderValue(),this._setStatePlaceholder(),this._dispatchChangeAction()},_optionChanged:function(t){if(n.inArray(t.replace("Action",""),o)>-1){this._renderEvents();return}switch(t){case"value":this._updateValue();break;case"valueUpdateEvent":case"valueUpdateAction":this._renderValueUpdateEvent();break;case"readOnly":this._renderProps();break;case"mode":this._renderInputType();break;case"enterKeyAction":this._renderEnterKeyAction();break;case"placeholder":this._invalidate();break;default:this.callBase.apply(this,arguments)}},_renderInputType:function(){var n=this._input();try{n.prop("type",this.option("mode"))}catch(t){n.prop("type","text")}},focus:function(){this._input().focus()},blur:function(){this._input().is(document.activeElement),t.utils.resetActiveElement()}}))}(jQuery,DevExpress),function(n,t){var r=t.ui,e=r.events,o=t.devices,s=window.navigator.userAgent,h=[8,9,13,33,34,35,36,37,38,39,40,46],c="dx-textbox",u="dx-searchbox",f="dx-infocus",l="dx-empty-input",a="dx-icon-search",v="dx-icon-clear",y="dx-clear-button-area";r.registerComponent("dxTextBox",r.dxEditBox.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{mode:"text",maxLength:null})},_render:function(){this.callBase(),this._element().addClass(c),this._renderMaxLengthHandlers(),this._renderSearchMode()},_renderMaxLengthHandlers:function(){if(this._isAndroid())this._input().on(e.addNamespace("keydown",this.NAME),n.proxy(this._onKeyDownAndroidHandler,this)).on(e.addNamespace("change",this.NAME),n.proxy(this._onChangeAndroidHandler,this))},_renderProps:function(){if(this.callBase(),!this._isAndroid()){var n=this.option("maxLength");n>0&&this._input().prop("maxLength",n)}},_renderSearchMode:function(){var n=this._$element,t=this.option("mode")==="search",i=this._$element.hasClass(u),r=!i&&t,f=i&&!t;r&&(this._renderSearchIcon(),this._renderClearButton(),this._renderFocusEvent(n),this._renderEmptyEvent(n),n.addClass(u)),f&&(n.removeClass(u),n.find("input").unbind("click focusin focusout"),this._$clearButton.remove(),this._$searchIcon.remove())},_renderSearchIcon:function(){var t=n("<span>").addClass(a).text(this.option("placeholder"));this._$element.append(t),this._$searchIcon=t},_renderClearButton:function(){var t=n("<span>").addClass(y).append(n("<span>").addClass(v)).click(n.proxy(function(){this.option("value","")},this));this._$element.append(t),this._$clearButton=t},_renderFocusEvent:function(){var n=this._$element;n.find("input").focusin(function(){n.addClass(f)}).focusout(function(){n.removeClass(f)}).filter(":focus").addClass(f)},_renderEmptyEvent:function(){this._input().bind("input",n.proxy(this._toggleEmptyClass,this)),this._toggleEmptyClass()},_optionChanged:function(n){switch(n){case"maxLength":this._renderProps(),this._renderMaxLengthHandlers();break;case"mode":this.callBase.apply(this,arguments),this._renderSearchMode();break;case"value":this.callBase.apply(this,arguments),this._toggleEmptyClass();break;default:this.callBase.apply(this,arguments)}},_onKeyDownAndroidHandler:function(t){var r=this.option("maxLength"),i,u;return r?(i=n(t.target),u=t.keyCode,this._cutOffExtraChar(i),i.val().length<r||n.inArray(u,h)!==-1||window.getSelection().toString()!==""):!0},_onChangeAndroidHandler:function(t){var i=n(t.target);this.option("maxLength")&&this._cutOffExtraChar(i)},_cutOffExtraChar:function(n){var t=this.option("maxLength"),i=n.val();i.length>t&&n.val(i.substr(0,t))},_toggleEmptyClass:function(){this._$element.toggleClass(l,this._input().val()==="")},_isAndroid:function(){var n=o.real(),t=n.version.join(".");return n.platform==="android"&&t&&/^(2\.|4\.1)/.test(t)&&!/chrome/i.test(s)}}))}(jQuery,DevExpress),function(n,t){var u=t.ui,r=u.events,f="dx-textarea",e="dx-editbox-input",o="dx-editbox-border";u.registerComponent("dxTextArea",u.dxTextBox.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{})},_render:function(){this.callBase(),this._element().addClass(f)},_renderInput:function(){this._element().append(n("<textarea />").addClass(e)).append(n("<div />").addClass(o)),this._renderScrollHandler()},_renderScrollHandler:function(){var n=this._input(),t=0;n.on(r.addNamespace("dxpointerdown",this.NAME),function(n){t=r.eventData(n).y});n.on(r.addNamespace("dxpointermove",this.NAME),function(i){var u=n.scrollTop(),f=n.prop("scrollHeight")-n.prop("clientHeight")-u;if(u!==0||f!==0){var e=r.eventData(i).y,o=u===0&&t>=e,s=f===0&&t<=e,h=u>0&&f>0;(o||s||h)&&(i.originalEvent.isScrollingEvent=!0),t=e}})},_renderInputType:n.noop}))}(jQuery,DevExpress),function(n,t){var r=t.ui,u=Math,f=r.events;r.registerComponent("dxNumberBox",r.dxEditBox.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{value:0,min:-Number.MAX_VALUE,max:Number.MAX_VALUE,mode:"number"})},_render:function(){this.callBase(),this._element().addClass("dx-numberbox"),this._setInputInvalidHandler()},_renderProps:function(){this.callBase(),this._input().prop({min:this.option("min"),max:this.option("max")})},_setInputInvalidHandler:function(){var t=this,i=f.addNamespace(this.option("valueUpdateEvent"),this.NAME);this._input().on(i,function(){var n=t._input()[0];typeof n.checkValidity=="function"&&n.checkValidity()}).focusout(n.proxy(this._trimInputValue,this)).on("invalid",n.proxy(this._inputInvalidHandler,this))},_renderValue:function(){var t=this.option("value")?this.option("value").toString():this.option("value"),n;this._input().val()!==t&&(n=this._input().attr("type"),this._input().attr("type","text"),this._input().val(this.option("value")),this._input().attr("type",n))},_trimInputValue:function(){var i=this._input(),t=n.trim(i.val());t[t.length-1]==="."&&(t=t.slice(0,-1)),this._forceRefreshInputValue(t)},_inputInvalidHandler:function(){var n=this._input(),t=n.val();if(this._oldValue){this.option("value",this._oldValue),n.val(this._oldValue),this._oldValue=null;return}(!t||/,/.test(t))&&(this.option("value",""),n.val(""))},_handleValueChange:function(){var i=this._input(),t=n.trim(i.val());(t=t.replace(",","."),this._validateValue(t))&&(t=this._parseValue(t),t||t===0)&&(this.option("value",t),i.val()!=t&&i.val(t))},_forceRefreshInputValue:function(n){var t=this._input();t.val("").val(n)},_validateValue:function(n){var t=f.addNamespace(this.option("valueUpdateEvent"),this.NAME),i=this._input();return(this._oldValue=null,!n)?(this._oldValue=this.option("value"),this.option("value",""),!1):n[n.length-1]==="."?!1:!0},_parseValue:function(n){var t=parseFloat(n);return t=u.max(t,this.option("min")),t=u.min(t,this.option("max"))},_optionChanged:function(n){n==="min"||n==="max"?this._renderProps(arguments):this.callBase.apply(this,arguments)}}))}(jQuery,DevExpress),function(n,t){var u=t.ui,f=u.events,s=t.translator,e=t.utils,r="dx-slider",h=r+"-wrapper",o=r+"-handle",c="."+o,l=r+"-bar",a=r+"-range";u.registerComponent("dxSlider",u.Widget.inherit({_activeStateUnit:c,_defaultOptions:function(){return n.extend(this.callBase(),{min:0,max:100,step:1,value:50})},_init:function(){this.callBase(),e.windowResizeCallbacks.add(this._refreshHandler=n.proxy(this._refresh,this))},_dispose:function(){this.callBase(),e.windowResizeCallbacks.remove(this._refreshHandler)},_render:function(){this.callBase(),this._$wrapper=n("<div>").addClass(h),this._$bar=n("<div>").addClass(l).appendTo(this._$wrapper),this._$selectedRange=n("<div>").addClass(a).appendTo(this._$bar),this._$handle=n("<div>").addClass(o).appendTo(this._$bar),this._element().addClass(r).append(this._$wrapper),this._$wrapper.dxSwipeable({elastic:!1,startAction:n.proxy(this._handleSwipeStart,this),updateAction:n.proxy(this._handleSwipeUpdate,this),cancelAction:n.proxy(this._handleSwipeCancel,this),itemWidthFunc:n.proxy(this._itemWidthFunc,this)}),this._renderValue(),this._renderStartHandler()},_renderDimensions:function(){this.callBase(),this._$bar&&(this._$bar.width(this.option("width")),this._renderValue())},_renderStartHandler:function(){var t=f.addNamespace("dxpointerdown",this.NAME),i=this._createAction(n.proxy(this._handleStart,this),{excludeValidators:["gesture"]});this._element().off(t).on(t,function(n){n.preventDefault(),i({jQueryEvent:n})})},_itemWidthFunc:function(){return this._element().width()},_handleSwipeStart:function(n){this._startOffset=this._currentRatio,n.jQueryEvent.maxLeftOffset=this._startOffset,n.jQueryEvent.maxRightOffset=1-this._startOffset},_handleSwipeUpdate:function(n){this._handleValueChange(this._startOffset+n.jQueryEvent.offset)},_handleSwipeCancel:function(){this._feedbackOff()},_handleValueChange:function(n){var r=this.option("min"),e=this.option("max"),t=this.option("step"),o=n*(e-r),i=r+o,u,f;((!t||isNaN(t))&&(t=1),t=parseFloat(t.toFixed(5)),t===0&&(t=1e-5),t<0)||(i===e||i===r?this.option("value",i):(u=(t+"").split("."),f=u.length>1?u[1].length:f,i=Number((Math.round(o/t)*t+r).toFixed(f)),this.option("value",this._fitValue(i))))},_fitValue:function(n){return n=Math.min(n,this.option("max")),n=Math.max(n,this.option("min"))},_handleStart:function(n){var t=n.jQueryEvent;f.needSkipEvent(t)||(this._currentRatio=(u.events.eventData(t).x-this._$bar.offset().left)/this._$bar.width(),this._handleValueChange(this._currentRatio))},_renderValue:function(){var i=this.option("value"),n=this.option("min"),t=this.option("max");if(!(n>t)){if(i<n){this.option("value",n),this._currentRatio=0;return}if(i>t){this.option("value",t),this._currentRatio=1;return}var f=this._$handle.outerWidth(),u=this._$bar.width(),r=n===t?0:(i-n)/(t-n);this._$selectedRange.width(r*u),s.move(this._$handle,{left:r*u-f/2}),this._currentRatio=r}},_optionChanged:function(n){switch(n){case"min":case"max":case"step":case"value":this._renderValue();break;default:this.callBase.apply(this,arguments)}},_feedbackOff:function(n){n||this.callBase.apply(this,arguments)}}))}(jQuery,DevExpress),function(n,t){var r=t.ui,f=r.events,u=t.translator,e="dx-slider-handle";r.registerComponent("dxRangeSlider",r.dxSlider.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{start:40,end:60,value:50})},_render:function(){this._$handleRight=n("<div>").addClass(e),this.callBase(),this._$handleRight.appendTo(this._$bar)},_handleStart:function(n){var r=n.jQueryEvent,u=f.eventData(r).x-this._$bar.offset().left,t=this._$handle.position().left,i=this._$handleRight.position().left;this._$handlersDistance=Math.abs(t-i),this._capturedHandle=(t+i)/2>u?this._$handle:this._$handleRight,this.callBase(n)},_handleSwipeUpdate:function(n){Math.abs(this.option("start")-this.option("end"))===0&&this._$handlersDistance<this._$handle.outerWidth()&&(this._feedbackOff(!0),this._capturedHandle=n.jQueryEvent.offset<=0?this._$handle:this._$handleRight,this._feedbackOn(this._capturedHandle,!0)),this.callBase(n)},_handleValueChange:function(n){this.callBase(n);var f=this._capturedHandle===this._$handle?"start":"end",t=this.option("start"),u=this.option("end"),r=this.option("value"),i=this.option("max"),e=this.option("min");t>i&&(t=i,this.option("start",i)),t<e&&(t=e,this.option("start",e)),u>i&&(u=i,this.option("end",i)),r>u&&f==="start"&&(r=u),r<t&&f==="end"&&(r=t),this.option(f,r)},_renderValue:function(){var i=this.option("start"),r=this.option("end"),n=this.option("min"),t=this.option("max");i<n&&(i=n),i>t&&(i=t),r>t&&(r=t),r<i&&(r=i);var o=this._$handle.outerWidth(),f=this._$bar.width(),e=t===n?0:(i-n)/(t-n),s=t===n?0:(r-n)/(t-n);this._$selectedRange.width((s-e)*f),u.move(this._$selectedRange,{left:e*f}),u.move(this._$handle,{left:e*f-o/2}),u.move(this._$handleRight,{left:s*f-o/2})},_optionChanged:function(n){switch(n){case"start":case"end":this._renderValue();break;default:this.callBase.apply(this,arguments)}}}))}(jQuery,DevExpress),function(n,t,i){var r=t.ui,y=r.events,f="dx-radio-group",s="dx-radio-group-vertical",h="dx-radio-group-horizontal",e="dx-radio-button",u="."+e,c="dx-radio-button-value",l="dx-radio-value-container",p="dx-state-active",o="dx-radio-button-checked",a="dxRadioButtonData",v=100;r.registerComponent("dxRadioGroup",r.SelectableCollectionWidget.inherit({_activeStateUnit:u,_defaultOptions:function(){return n.extend(this.callBase(),{layout:"vertical",value:i,valueExpr:null,hoverStateEnabled:!0})},_itemClass:function(){return e},_itemDataKey:function(){return a},_itemContainer:function(){return this._element()},_init:function(){this.callBase(),this._dataSource||this._itemsToDataSource(),this._feedbackHideTimeout=v},_itemsToDataSource:function(){this._dataSource=new DevExpress.data.DataSource(this.option("items"))},_render:function(){this._element().addClass(f),this._compileValueGetter(),this.callBase(),this._renderLayout(),this._renderValue()},_compileValueGetter:function(){this._valueGetter=t.data.utils.compileGetter(this._valueGetterExpr())},_valueGetterExpr:function(){return this.option("valueExpr")||this._dataSource&&this._dataSource._store._key||"this"},_renderLayout:function(){var n=this.option("layout");this._element().toggleClass(s,n==="vertical"),this._element().toggleClass(h,n==="horizontal")},_renderValue:function(){this.option("value")?this._setIndexByValue():this._setValueByIndex()},_setIndexByValue:function(n){var t=this;n=n===i?t.option("value"):n,t._searchValue(n).done(function(n){t._dataSource.isLoaded()?t._setIndexByItem(n):t._dataSource.load().done(function(){t._setIndexByItem(n)})})},_setIndexByItem:function(t){this.option("selectedIndex",n.inArray(t,this._dataSource.items()))},_searchValue:function(i){var r=this,u=r._dataSource.store(),e=r._valueGetterExpr(),f=n.Deferred();return e===u.key()||u instanceof t.data.CustomStore?u.byKey(i).done(function(n){f.resolveWith(r,[n])}):u.load({filter:[e,i]}).done(function(n){f.resolveWith(r,n)}),f.promise()},_setValueByIndex:function(){var n=this.option("selectedIndex"),u=this._itemElements(),t,r;if(n<0||n>=u.length)return i;t=this._selectedItemElement(n),r=this._getItemData(t),this.option("value",this._getItemValue(r))},_getItemValue:function(n){return this._valueGetter(n)||n.text},_renderSelectedIndex:function(n){var i=this._itemElements(),t,r;n>=0&&n<i.length&&(t=i.eq(n),r=t.closest("."+f),r.find(u).removeClass(o),t.closest(u).addClass(o))},_createItemByRenderer:function(n,t){var i=this.callBase.apply(this,arguments);return this._renderInput(i,t.item),i},_createItemByTemplate:function(n,t){var i=this.callBase.apply(this,arguments);return this._renderInput(i,t.item),i},_renderInput:function(t,i){if(!i.html){var r=n("<div>").addClass(c),u=n("<div>").append(r).addClass(l);t.prepend(u)}},_optionChanged:function(n,t){switch(n){case"value":this._setIndexByValue(t);break;case"selectedIndex":this.callBase.apply(this,arguments),this._setValueByIndex();break;case"layout":this._renderLayout();break;case"valueExpr":this._compileValueGetter(),this._setValueByIndex();break;default:this.callBase.apply(this,arguments)}}}))}(jQuery,DevExpress),function(n,t){var r=t.ui,v=r.events,e="dx-tabs",o="dx-indent-wrapper",s="dx-tab",h=".dx-tab",u="dx-tab-selected",c="dx-tab-text",f="dx-icon",l="dxTabData",a=100;r.registerComponent("dxTabs",r.SelectableCollectionWidget.inherit({_activeStateUnit:h,_defaultOptions:function(){return n.extend(this.callBase(),{})},_init:function(){this.callBase(),this._feedbackHideTimeout=a},_itemClass:function(){return s},_itemDataKey:function(){return l},_itemRenderDefault:function(t,i,r){if(this.callBase(t,i,r),!t.html){var s=t.text,e=t.icon,o=t.iconSrc,u;s&&r.wrapInner(n("<span />").addClass(c)),e?u=n("<span />").addClass(f+"-"+e):o&&(u=n("<img />").attr("src",o)),u&&u.addClass(f).prependTo(r)}},_render:function(){this.callBase(),this._element().addClass(e),this._renderWrapper()},_renderWrapper:function(){this._element().wrapInner(n("<div />").addClass(o))},_renderSelectedIndex:function(n,t){var i=this._itemElements();t>=0&&i.eq(t).removeClass(u),n>=0&&i.eq(n).addClass(u)}}))}(jQuery,DevExpress),function(n,t){var r=t.ui,u="dx-navbar",f="dx-nav-item",e="dx-nav-item-content";r.registerComponent("dxNavBar",r.dxTabs.inherit({_render:function(){this.callBase(),this._element().addClass(u)},_renderItem:function(t,i){var r=this.callBase(t,i);return r.addClass(f).wrapInner(n("<div />").addClass(e))}}))}(jQuery,DevExpress),function(n,t,i){var o=t.ui,f=t.fx,u=t.translator,s=o.events,v="dx-pivottabs",l="dx-pivottabs-tab",e="dx-pivottabs-tab-selected",a="dx-pivottabs-ghosttab",y="dxPivotTabData",h=200,c="cubic-bezier(.40, .80, .60, 1)",r={moveTo:function(n,t,i){return f.animate(n,{type:"slide",to:{left:t},duration:h,easing:c,complete:i})},slideAppear:function(n,t){return f.animate(n,{type:"slide",to:{left:t,opacity:1},duration:h,easing:c})},slideDisappear:function(n,t){return f.animate(n,{type:"slide",to:{left:t,opacity:0},duration:h,easing:c})}},p=function(t){t&&n.each(t,function(n,t){f.stop(t,!0)})},w=function(t){n.each(t,function(n,t){f.stop(t)})};o.registerComponent("dxPivotTabs",o.SelectableCollectionWidget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{selectedIndex:0,prepareAction:null,updatePositionAction:null,rollbackAction:null,completeAction:null})},_itemClass:function(){return l},_itemDataKey:function(){return y},_itemContainer:function(){return this._element()},_init:function(){this.callBase(),this._initGhostTab(),this._initSwipeHandlers(),this._initActions()},_initGhostTab:function(){this._$ghostTab=n("<div>").addClass(a)},_initActions:function(){var n={excludeValidators:["gesture"]};this._updatePositionAction=this._createActionByOption("updatePositionAction",n),this._rollbackAction=this._createActionByOption("rollbackAction",n),this._completeAction=this._createActionByOption("completeAction",n),this._prepareAction=this._createActionByOption("prepareAction",n)},_render:function(){this._element().addClass(v),this.callBase(),this._renderGhostTab()},_dispose:function(){this.callBase(),w(this._allTabElements())},_renderGhostTab:function(){this._itemContainer().append(this._$ghostTab),this._toggleGhostTab(!1)},_toggleGhostTab:function(n){var t=this._$ghostTab;n?(this._updateGhostTabContent(),t.css("opacity",1)):t.css("opacity",0)},_isGhostTabVisible:function(){return this._$ghostTab.css("opacity")==1},_updateGhostTabContent:function(n){n=n===i?this._previousIndex():n;var t=this._$ghostTab,r=this._itemElements();t.html(r.eq(n).html())},_updateTabsPositions:function(n){var r=this._allTabElements(),n=this._applyOffsetBoundaries(n),t=n>0,i=this._calculateTabPositions(t?"replace":"append");this._moveTabs(i,n),this._toggleGhostTab(t)},_moveTabs:function(t,i){i=i||0;var r=this._allTabElements();r.each(function(r){u.move(n(this),{left:t[r]+i})})},_applyOffsetBoundaries:function(n){n=n||0;var t=n>0?this._maxRightOffset:this._maxLeftOffset;return n*t},_animateRollback:function(){var u=this,t=this._itemElements(),i=this._calculateTabPositions("prepend");this._isGhostTabVisible()&&(this._swapGhostWithTab(t.eq(this._previousIndex())),r.moveTo(this._$ghostTab,i[this._indexBoundary()],function(){u._toggleGhostTab(!1)})),t.each(function(t){r.moveTo(n(this),i[t])})},_animateComplete:function(n,t){var i=this,r=this._itemElements(),f=this._isGhostTabVisible(),u;r.eq(t).removeClass(e),u=f?this._animateIndexDecreasing(n):this._animateIndexIncreasing(n),r.eq(n).addClass(e),u.done(function(){i._indexChangeOnAnimation=!0,i.option("selectedIndex",n),i._indexChangeOnAnimation=!1})},_animateIndexDecreasing:function(t){var f=this._itemElements(),u=this._calculateTabPositions("append",t),i=[];return f.each(function(t){i.push(r.moveTo(n(this),u[t]))}),i.push(r.slideDisappear(this._$ghostTab,u[this._indexBoundary()])),n.when.apply(n,i)},_animateIndexIncreasing:function(t){var s=this,f=this._itemElements(),o=this._calculateTabPositions("prepend",t),i=this._previousIndex(t),h=u.locate(f.eq(i)).left<0,e=[];return h||this._moveTabs(this._calculateTabPositions("append",i)),this._updateGhostTabContent(i),this._swapGhostWithTab(f.eq(i)),f.each(function(t){var u=n(this),f=o[t];e.push(t===i?r.slideAppear(u,f):r.moveTo(u,f))}),e.push(r.moveTo(this._$ghostTab,o[this._indexBoundary()],function(){s._toggleGhostTab(!1)})),n.when.apply(n,e)},_swapGhostWithTab:function(n){var t=this._$ghostTab,i=u.locate(n).left,r=n.css("opacity");u.move(n,{left:u.locate(t).left}),n.css("opacity",t.css("opacity")),u.move(t,{left:i}),t.css("opacity",r)},_calculateTabPositions:function(n,t){t=t===i?this.option("selectedIndex"):t;var r=t+n;return this._calculetedPositionsMark!==r&&(this._calculetedPositions=this._calculateTabPositionsImpl(t,n),this._calculetedPositionsMark=r),this._calculetedPositions},_calculateTabPositionsImpl:function(t,i){var f=this._normalizeIndex(t-1),h=this._itemElements(),u=[],e=0,r=[],o,s;h.each(function(){u.push(n(this).outerWidth())}),o=function(n,t){r.splice(n,0,e),e+=t},n.each(u.slice(t),o),n.each(u.slice(0,t),o);switch(i){case"replace":s=r[f],r.splice(f,1,-u[f]),r.push(s);break;case"prepend":r.push(-u[f]);break;case"append":r.push(e)}return r},_allTabElements:function(){return this._itemContainer().find("."+l+", ."+a)},_initSwipeHandlers:function(){this._element().on(s.addNamespace("dxswipestart",this.NAME),n.proxy(this._swipeStartHandler,this)).on(s.addNamespace("dxswipe",this.NAME),n.proxy(this._swipeUpdateHandler,this)).on(s.addNamespace("dxswipeend",this.NAME),n.proxy(this._swipeEndHandler,this))},_swipeStartHandler:function(n){this._prepareAnimation(),this._prepareAction(),(t.designMode||this.option("disabled")||this._indexBoundary()<=1)&&(n.cancel=!0)},_prepareAnimation:function(){this._stopAnimation()},_stopAnimation:function(){p(this._allTabElements())},_swipeUpdateHandler:function(n){var t=n.offset;this._updatePositionAction({offset:t}),this._updateTabsPositions(t)},_swipeEndHandler:function(n){var i=this.option("selectedIndex"),r=n.targetOffset,t;r===0?(this._animateRollback(),this._rollbackAction()):(t=this._normalizeIndex(i-r),this._animateComplete(t,i),this._completeAction({newIndex:t}))},_previousIndex:function(n){return n=n===i?this.option("selectedIndex"):n,this._normalizeIndex(n-1)},_normalizeIndex:function(n){var t=this._indexBoundary();return n<0&&(n=t+n),n>=t&&(n=n-t),n},_indexBoundary:function(){return this.option("items").length},_onItemSelectAction:function(n){this._prepareAnimation(),this._prepareAction(),this._animateComplete(n,this.option("selectedIndex")),this._completeAction({newIndex:n})},_renderSelectedIndex:function(n,t){var i=this._itemElements();this._calculateMaxOffsets(n),this._indexChangeOnAnimation||(i.eq(t).removeClass(e),this._updateTabsPositions(),i.eq(n).addClass(e))},_calculateMaxOffsets:function(n){var t=this._itemElements();this._maxLeftOffset=t.eq(n).outerWidth(),this._maxRightOffset=t.eq(this._previousIndex(n)).outerWidth()},_itemRenderDefault:function(t,i,r){var u=n("<span>").text(t.title);r.html(u)},_optionChanged:function(n){switch(n){case"items":delete this._calculetedPositionsMark,this.callBase.apply(this,arguments);break;case"prepareAction":case"updatePositionAction":case"rollbackAction":case"completeAction":this._initActions();break;default:this.callBase.apply(this,arguments)}},prepare:function(){this._prepareAnimation()},updatePosition:function(n){this._updateTabsPositions(n)},rollback:function(){this._animateRollback()},complete:function(n){this._animateComplete(n,this.option("selectedIndex"))}}))}(jQuery,DevExpress),function(n,t,i){var u=t.ui,f=u.events,r=t.fx,e=t.translator,c="dx-pivot",l="dx-pivottabs-container",a="dx-pivot-itemcontainer",v="dx-pivot-itemwrapper",y="dx-pivot-item",o="dx-pivot-item-hidden",p="dxPivotItemData",w=200,b=50,k=250,d="cubic-bezier(.10, 1, 0, 1)",s={returnBack:function(n){r.animate(n,{type:"slide",to:{left:0},duration:w})},slideAway:function(n,t,i){r.animate(n,{type:"slide",to:{left:t},duration:b,complete:i})},slideBack:function(n){r.animate(n,{type:"slide",to:{left:0},easing:d,duration:k})}},h=function(n){r.stop(n,!0)},g=function(n){r.stop(n)};u.registerComponent("dxPivot",u.SelectableCollectionWidget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{selectedIndex:0})},_itemClass:function(){return y},_itemDataKey:function(){return p},_itemContainer:function(){return this._$itemWrapper},_init:function(){this.callBase(),this._initTabs(),this._initItemContainer(),this._clearItemsCache(),this._initSwipeHandlers()},_initItemContainer:function(){var t=n("<div>").addClass(a);this._element().append(t),this._$itemWrapper=n("<div>").addClass(v),t.append(this._$itemWrapper)},_clearItemsCache:function(){this._itemsCache=[]},_initTabs:function(){var t=this,i=n("<div>").addClass(l);this._element().append(i),i.dxPivotTabs({items:this.option("items"),selectedIndex:this.option("selectedIndex"),prepareAction:function(){t._prepareAnimation()},updatePositionAction:function(n){t._updateContentPosition(n.offset)},rollbackAction:function(){t._animateRollback()},completeAction:function(n){t._animateComplete(n.newIndex)}}),this._tabs=i.dxPivotTabs("instance")},_render:function(){this._element().addClass(c),this.callBase()},_renderCurrentContent:function(n,t){var i=this._itemsCache;i[t]=this._selectedItemElement(),i[t].addClass(o),i[n]?i[n].removeClass(o):this._renderContent()},_updateContentPosition:function(n){e.move(this._$itemWrapper,{left:this._calculatePixelOffset(n)})},_animateRollback:function(){s.returnBack(this._$itemWrapper)},_animateComplete:function(n){var t=this,i=this._$itemWrapper,u=this._isRightSwipeHandled(),r=u?this._itemWrapperWidth:-this._itemWrapperWidth;s.slideAway(i,r,function(){e.move(i,{left:-r}),t._indexChangeOnAnimation=!0,t.option("selectedIndex",n),t._indexChangeOnAnimation=!1,s.slideBack(i)})},_calculatePixelOffset:function(n){return n=n||0,n*this._itemWrapperWidth},_isRightSwipeHandled:function(){return e.locate(this._$itemWrapper).left>0},_initSwipeHandlers:function(){this._element().on(f.addNamespace("dxswipestart",this.NAME),n.proxy(this._swipeStartHandler,this)).on(f.addNamespace("dxswipe",this.NAME),n.proxy(this._swipeUpdateHandler,this)).on(f.addNamespace("dxswipeend",this.NAME),n.proxy(this._swipeEndHandler,this))},_swipeStartHandler:function(n){this._prepareAnimation(),this._tabs.prepare(),(t.designMode||this.option("disabled")||this._indexBoundary()<=1)&&(n.cancel=!0)},_prepareAnimation:function(){this._stopAnimation(),this._itemWrapperWidth=this._$itemWrapper.outerWidth()},_stopAnimation:function(){h(this._$itemWrapper),h(this._$itemWrapper)},_swipeUpdateHandler:function(n){var t=n.offset;this._updateContentPosition(t),this._tabs.updatePosition(t)},_swipeEndHandler:function(n){var i=this.option("selectedIndex"),r=n.targetOffset,t;r===0?(this._animateRollback(),this._tabs.rollback()):(t=this._normalizeIndex(i-r),this._animateComplete(t,i),this._tabs.complete(t))},_renderSelectedIndex:function(n,t){t!==i&&this._renderCurrentContent(n,t)},_normalizeIndex:function(n){var t=this._indexBoundary();return n<0&&(n=t+n),n>=t&&(n=n-t),n},_indexBoundary:function(){return this.option("items").length},_renderContentImpl:function(){var n=this.option("items"),t=this.option("selectedIndex");n.length&&this._renderItems([n[t]])},_selectedItemElement:function(){return this._$itemWrapper.children(":not(."+o+")")},_dispose:function(){this.callBase(),g(this._$itemWrapper)},_optionChanged:function(n,t){switch(n){case"disabled":this._tabs.option("disabled",t),this.callBase.apply(this,arguments);break;case"selectedIndex":this._indexChangeOnAnimation||this._tabs.option("selectedIndex",t),this.callBase.apply(this,arguments);break;case"items":this._tabs.option("items",t),this._clearItemsCache(),this.callBase.apply(this,arguments);break;default:this.callBase.apply(this,arguments)}}}))}(jQuery,DevExpress),function(n,t){var f=t.ui,s=t.fx,r=t.utils,h=t.translator,c="dx-toolbar",l="dx-toolbar-bottom",a="dx-toolbar-mini",v="dx-toolbar-item",e="dx-toolbar-label",u="dx-toolbar-button",y="dx-toolbar-menu-container",p="dx-toolbar-menu-button",w="dx-toolbar-items-container",o="."+e,b="dxToolbarItemDataKey",k="easeOutCubic",d=200,g=400,nt=function(n,t,i){var r=i?g:d;s.animate(n,{type:"slide",to:{top:t},easing:k,duration:r})};f.registerComponent("dxToolbar",f.CollectionContainerWidget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{menuItemRender:null,menuItemTemplate:"item",submenuType:"dxDropDownMenu",renderAs:"topToolbar"})},_itemContainer:function(){return this._$toolbarItemsContainer.find(".dx-toolbar-left,.dx-toolbar-center,.dx-toolbar-right")},_itemClass:function(){return v},_itemDataKey:function(){return b},_itemRenderDefault:function(i,r,u){var f;if(this.callBase(i,r,u),f=i.widget,f){var e=n("<div>").appendTo(u),o=t.inflector.camelize("dx-"+f),s=i.options||{};e[o](s)}else i.text&&u.wrapInner("<div>")},_render:function(){this._renderToolbar(),this._renderSections(),this.callBase(),this._renderMenu(),this._arrangeTitle(),this._windowTitleResizeCallback=n.proxy(this._arrangeTitle,this),r.windowResizeCallbacks.add(this._windowTitleResizeCallback)},_renderToolbar:function(){this._element().addClass(c).toggleClass(l,this.option("renderAs")==="bottomToolbar"),this._$toolbarItemsContainer=n("<div>").appendTo(this._element()),this._$toolbarItemsContainer.addClass(w)},_renderSections:function(){var t=this._$toolbarItemsContainer,i=this;n.each(["left","center","right"],function(){var r="dx-toolbar-"+this,u=t.find("."+r);u.length||(i["_$"+this+"Section"]=u=n("<div>").addClass(r).appendTo(t))})},_arrangeTitle:function(){var h=this._$toolbarItemsContainer,t=this._$centerSection,i=t.children(o).eq(0),r,u;if(i.length!==0){var c=h.width(),f=this._$leftSection.outerWidth(),e=this._$rightSection.outerWidth(),s=10;t.children().not(o).each(function(){s+=n(this).outerWidth()}),r=c-f-e-s,u=i.width()>r,t.css({marginLeft:u?f:"",marginRight:u?e:""}),i.css("max-width",r)}},_renderItem:function(n,t){t.align&&r.logger.warn("dxToolbar.items.align is deprecated. Please use dxToolbar.items.location instead.");var f=t.location||t.align||"center",o=this._$toolbarItemsContainer.find(".dx-toolbar-"+f),i=this.callBase(n,t,o);return i.addClass(u),t.text&&i.addClass(e).removeClass(u),i},_hasVisibleMenuItems:function(){var i=this._getMenuItems(),t=!1,r=DevExpress.data.utils.compileGetter("visible");return n.each(i,function(n,i){var u=r(i,{functionsAsIs:!0});u!==!1&&(t=!0)}),t},_getToolbarItems:function(){return n.grep(this.option("items")||[],function(n){return n.location!=="menu"})},_getMenuItems:function(){return n.grep(this.option("items")||[],function(n){return n.location==="menu"})},_renderContentImpl:function(){var n=this._getToolbarItems();this._element().toggleClass(a,n.length===0),this._renderedItemsCount?this._renderItems(n.slice(this._renderedItemsCount)):this._renderItems(n)},_renderMenu:function(){var t=this,i=this._createActionByOption("itemClickAction"),n={itemRender:this.option("menuItemRender"),itemTemplate:this.option("menuItemTemplate"),itemClickAction:function(n){t._toggleMenuVisibility(!1,!0),i(n)}};this._menuType=this.option("submenuType"),this._menuType==="dxList"&&this.option("renderAs")==="topToolbar"&&(this._menuType="dxDropDownMenu");switch(this._menuType){case"dxActionSheet":this._renderActionSheet(n);break;case"dxDropDownMenu":this._renderDropDown(n);break;case"dxList":this._renderList(n)}},_renderMenuButton:function(t){var i=n.extend({clickAction:n.proxy(this._handleMenuButtonClick,this)},t);this._renderMenuButtonContainer(),this._$button=n("<div>").appendTo(this._$menuButtonContainer).addClass(p).dxButton(i)},_renderMenuButtonContainer:function(){var t=this._$rightSection;this._$menuButtonContainer=n("<div>").appendTo(t).addClass(u).addClass(y)},_renderDropDown:function(t){this._hasVisibleMenuItems()&&(this._renderMenuButtonContainer(),this._menu=n("<div>").appendTo(this._$menuButtonContainer).dxDropDownMenu(t).dxDropDownMenu("instance"),this._renderMenuItems())},_renderActionSheet:function(t){if(this._hasVisibleMenuItems()){this._renderMenuButton({icon:"overflow"});var i=n.extend({target:this._$button,showTitle:!1},t);this._menu=n("<div>").appendTo(this._element()).dxActionSheet(i).dxActionSheet("instance"),this._renderMenuItems()}},_renderList:function(t){this._renderMenuButton({activeStateEnabled:!1,text:"..."});var i=n.extend({width:"100%"},t);this._renderListOverlay(),this._renderContainerSwipe(),this._hasVisibleMenuItems()&&(this._menu=n("<div>").appendTo(this._listOverlay.content()).dxList(i).dxList("instance"),this._renderMenuItems()),this._changeListVisible(this.option("visible")),this._windowResizeCallback=n.proxy(this._toggleMenuVisibility,this),r.windowResizeCallbacks.add(this._windowResizeCallback)},_renderMenuItems:function(){this._menu.addExternalTemplate(this._templates),this._menu.option("items",this._getMenuItems())},_getListHeight:function(){var n=this._listOverlay.content().find(".dx-list").height(),t=this._$toolbarItemsContainer.height()-this._element().height();return n+t},_renderListOverlay:function(){var t=this._element();this._listOverlay=n("<div>").appendTo(t).dxOverlay({targetContainer:!1,deferRendering:!1,shading:!1,height:"auto",width:"100%",showTitle:!1,closeOnOutsideClick:n.proxy(this._handleListOutsideClick,this),position:null,animation:null,backButtonHandler:null}).dxOverlay("instance")},_backButtonHandler:function(){this._toggleMenuVisibility(!1,!0)},_toggleBackButtonCallback:function(){this._closeCallback&&t.backButtonCallback.remove(this._closeCallback),this._menuShown&&(this._closeCallback=n.proxy(this._backButtonHandler,this),t.backButtonCallback.add(this._closeCallback))},_renderContainerSwipe:function(){this._$toolbarItemsContainer.appendTo(this._listOverlay.content()).dxSwipeable({elastic:!1,startAction:n.proxy(this._handleSwipeStart,this),updateAction:n.proxy(this._handleSwipeUpdate,this),endAction:n.proxy(this._handleSwipeEnd,this),itemSizeFunc:n.proxy(this._getListHeight,this),direction:"vertical"})},_handleListOutsideClick:function(t){n(t.target).closest(this._listOverlay.content()).length||this._toggleMenuVisibility(!1,!0)},_calculatePixelOffset:function(n){n=(n||0)-1;var t=this._getListHeight();return n*t},_handleSwipeStart:function(n){n.jQueryEvent.maxTopOffset=this._menuShown?0:1,n.jQueryEvent.maxBottomOffset=this._menuShown?1:0},_handleSwipeUpdate:function(n){var t=this._menuShown?n.jQueryEvent.offset:1+n.jQueryEvent.offset;this._renderMenuPosition(t,!1)},_handleSwipeEnd:function(n){var t=n.jQueryEvent.targetOffset;t-=this._menuShown-1,this._toggleMenuVisibility(t===0,!0)},_renderMenuPosition:function(n,t){var i=this._calculatePixelOffset(n),r=this._listOverlay.content();t?nt(r,i,this._menuShown):h.move(r,{top:i})},_handleMenuButtonClick:function(){this._toggleMenuVisibility(!this._menuShown,!0)},_toggleMenuVisibility:function(n,t){this._menuShown=n;switch(this._menuType){case"dxList":this._toggleBackButtonCallback(),this._renderMenuPosition(this._menuShown?0:1,t);break;case"dxActionSheet":this._menu.toggle(this._menuShown),this._menuShown=!1}},_renderEmptyMessage:n.noop,_clean:function(){this._$toolbarItemsContainer.children().empty(),this._element().empty()},_changeMenuOption:function(n,t){this._menu&&this._menu.option(n,t)},_changeListVisible:function(n){this._listOverlay&&(this._listOverlay.option("visible",n),this._toggleMenuVisibility(!1,!1))},_optionChanged:function(n,t){switch(n){case"renderAs":case"submenuType":this._invalidate();break;case"visible":this._changeListVisible(t),this.callBase.apply(this,arguments);break;case"menuItemRender":this._changeMenuOption("itemRender",t);break;case"menuItemTemplate":this._changeMenuOption("itemTemplate",t);break;case"itemClickAction":this._changeMenuOption(n,t),this.callBase.apply(this,arguments);break;default:this.callBase.apply(this,arguments)}},_dispose:function(){this._windowResizeCallback&&r.windowResizeCallbacks.remove(this._windowResizeCallback),this._windowTitleResizeCallback&&r.windowResizeCallbacks.remove(this._windowTitleResizeCallback),this.callBase()}}))}(jQuery,DevExpress),function(n,t){var c=t.ui,u=c.events,l=t.translator,r=t.fx,tt=t.utils,a=[],v=function(n){a.push(n)};v("delete"),v("selection");var it="dx-list-item-bag-container",y="dx-list-item-content",rt="dx-list-item-left-bag",ut="dx-list-item-right-bag",ft="leftBag",et="rightBag",ot="modifyElement",st=t.Class.inherit({ctor:function(n,t){this._list=n,this._config=t,this.isModifyingByDecorators()&&this._fetchRequiredDecorators()},dispose:function(){this._decorators&&this._decorators.length&&n.each(this._decorators,function(n,t){t.dispose()})},isModifyingByDecorators:function(){return!(this.isRenderingByRenderer()||this.isRenderingByTemplate())},isRenderingByRenderer:function(){return!!this.getItemRenderer()},getItemRenderer:function(){return this._config.itemRender},isRenderingByTemplate:function(){return!!this.getItemTemplateName()},getItemTemplateName:function(){return this._config.itemTemplate},_fetchRequiredDecorators:function(){this._decorators=[],n.each(a,n.proxy(function(n,t){var r=t+"Enabled",u=t+"Mode",i;this._config[r]&&(i=this._createDecorator(t,this._config[u]),this._decorators.push(i))},this))},_createDecorator:function(n,t){var i=this._findDecorator(n,t);return new i(this._list)},_findDecorator:function(n,t){return o[n][t]},modifyItemElement:function(){var t=[this._modifyItemElementImpl,this];t.push.apply(t,arguments),tt.executeAsync(n.proxy.apply(n,t))},_modifyItemElementImpl:function(t){var i=n(t.itemElement),r;i.addClass(it),this._wrapContent(i),r={$itemElement:i},this._prependLeftBags(i,r),this._appendRightBags(i,r),this._applyDecorators(ot,r)},_wrapContent:function(t){var i=n("<div />").addClass(y);t.wrapInner(i)},_prependLeftBags:function(n,t){var i=this._collectDecoratorsMarkup(ft,t,rt);n.prepend(i)},_appendRightBags:function(n,t){var i=this._collectDecoratorsMarkup(et,t,ut);n.append(i)},_collectDecoratorsMarkup:function(t,i,r){var u=n("<div />");return n.each(this._decorators,function(){var f=n("<div />").addClass(r);this[t](n.extend({$container:f},i)),f.children().length&&u.append(f)}),u.children()},_applyDecorators:function(t,i){n.each(this._decorators,function(){this[t](i)})},_handlerExists:function(t){var r,u,i;if(!this._decorators)return!1;for(r=this._decorators,u=r.length,i=0;i<u;i++)if(r[i][t]!==n.noop)return!0;return!1},_handleEvent:function(n,t){var i;if(!this._decorators)return!1;var r=!1,u=this._decorators,f=u.length;for(i=0;i<f;i++)if(r=u[i][n](t),r)break;return r},handleClick:function(n){return this._handleEvent("handleClick",n)},holdHandlerExists:function(){return this._handlerExists("handleHold")},handleHold:function(n){return this._handleEvent("handleHold",n)}}),o={},f=function(t,i,r){var u={};u[t]=o[t]?o[t]:{},u[t][i]=r,o=n.extend(o,u)},e="dxListEditDecorator",s=t.Class.inherit({ctor:function(n){this._list=n,this._init()},_init:n.noop,_shouldHandleSwipe:!1,_attachSwipeEvent:function(t){var i=u.addNamespace("dxswipestart",e),r=u.addNamespace("dxswipe",e),f=u.addNamespace("dxswipeend",e);t.$itemElement.on(i,n.proxy(this._handleItemSwipeStart,this)).on(r,n.proxy(this._handleItemSwipeUpdate,this)).on(f,n.proxy(this._handleItemSwipeEnd,this))},_handleItemSwipeStart:function(t){var i=n(t.currentTarget);if(i.is(".dx-state-disabled, .dx-state-disabled *")){t.cancel=!0;return}this._handleSwipeStart(i,t)},_handleItemSwipeUpdate:function(t){var i=n(t.currentTarget);this._handleSwipeUpdate(i,t)},_handleItemSwipeEnd:function(t){var i=n(t.currentTarget);this._handleSwipeEnd(i,t)},leftBag:n.noop,rightBag:n.noop,modifyElement:function(n){this._shouldHandleSwipe&&this._attachSwipeEvent(n)},handleClick:n.noop,handleHold:n.noop,_handleSwipeStart:n.noop,_handleSwipeUpdate:n.noop,_handleSwipeEnd:n.noop,dispose:n.noop}),h="dx-switchable-delete-ready",ht="dx-switchable-delete-top-shield",ct="dx-switchable-delete-bottom-shield",lt="dx-switchable-delete-item-content-shield",p=s.inherit({_init:function(){this._$topShield=n("<div />").addClass(ht),this._$bottomShield=n("<div />").addClass(ct),this._$itemContentShield=n("<div />").addClass(lt);this._$topShield.on(u.addNamespace("dxpointerdown",e),n.proxy(this._cancelDeleteReadyItem,this));this._$bottomShield.on(u.addNamespace("dxpointerdown",e),n.proxy(this._cancelDeleteReadyItem,this));this._list._element().append(this._$topShield.toggle(!1)).append(this._$bottomShield.toggle(!1))},handleClick:function(){return this._cancelDeleteReadyItem()},_cancelDeleteReadyItem:function(){return this._$readyToDeleteItem?(this._cancelDelete(this._$readyToDeleteItem),!0):!1},_cancelDelete:function(n){this._toggleDeleteReady(n,!1)},_toggleDeleteReady:function(n,t){t=t||!this._isReadyToDelete(n),this._toggleShields(n,t),this._cacheReadyToDeleteItem(n,t),this._animateToggleDelete(n,t)},_isReadyToDelete:function(n){return n.hasClass(h)},_toggleShields:function(n,t){this._$topShield.toggle(t),this._$bottomShield.toggle(t),t&&this._updateShieldsHeight(n),this._toggleContentShield(n,t)},_updateShieldsHeight:function(n){var t=this._list._element(),r=t.offset().top,u=t.outerHeight(),f=n.offset().top,e=n.outerHeight(),i=f-r,o=u-e-i;this._$topShield.height(Math.max(i,0)),this._$bottomShield.height(Math.max(o,0))},_toggleContentShield:function(n,t){t?n.find("."+y).append(this._$itemContentShield):this._$itemContentShield.detach()},_cacheReadyToDeleteItem:function(n,t){t?this._$readyToDeleteItem=n:delete this._$readyToDeleteItem},_animateToggleDelete:function(t,i){i?(this._prepareDeleteReady(t),this._animatePrepareDeleteReady(t)):this._animateForgetDeleteReady(t).done(n.proxy(this._forgetDeleteReady,this,t))},_prepareDeleteReady:function(n){n.addClass(h)},_animatePrepareDeleteReady:t.abstract,_animateForgetDeleteReady:t.abstract,_forgetDeleteReady:function(n){n.removeClass(h)},_deleteItem:function(n){(n=n||this._$readyToDeleteItem,n.is(".dx-state-disabled, .dx-state-disabled *"))||(this._cancelDelete(n),this._list.deleteItem(n))}}),at="dx-switchable-delete-button-container",vt="dx-switchable-delete-button-wrapper",yt="dx-switchable-delete-button-inner-wrapper",pt="dx-switchable-delete-button",w=200,b=p.inherit({_init:function(){this.callBase.apply(this,arguments);var t=n("<div />").addClass(at),i=n("<div />").addClass(vt),r=n("<div />").addClass(yt),u=n("<div />").addClass(pt);u.dxButton({text:Globalize.localize("dxListEditDecorator-delete"),type:"danger",clickAction:n.proxy(function(n){this._deleteItem(),n.jQueryEvent.stopPropagation()},this)}),t.append(i),i.append(r),r.append(u),this._$button=t},_prepareDeleteReady:function(n){this.callBase.apply(this,arguments),r.stop(this._$button,!0),this._$button.appendTo(n)},_animatePrepareDeleteReady:function(){return r.animate(this._$button,{type:"custom",duration:w,from:{right:-this._buttonWidth()},to:{right:0}})},_animateForgetDeleteReady:function(){return r.animate(this._$button,{type:"custom",duration:w,from:{right:0},to:{right:-this._buttonWidth()}})},_forgetDeleteReady:function(){this.callBase.apply(this,arguments),this._$button.detach()},_buttonWidth:function(){return this._buttonContainerWidth||(this._buttonContainerWidth=this._$button.outerWidth()),this._buttonContainerWidth}}),wt="dx-toggle-delete-switch-container",bt="dx-toggle-delete-switch";f("delete","toggle",b.inherit({leftBag:function(t){var r=t.$itemElement,i=t.$container,u=n("<div />").dxButton({icon:"toggle-delete",clickAction:n.proxy(function(n){this._toggleDeleteReady(r),n.jQueryEvent.stopPropagation()},this)}).addClass(bt);i.addClass(wt),i.append(u)}})),f("delete","slideButton",b.inherit({_shouldHandleSwipe:!0,_handleSwipeEnd:function(n,t){return t.targetOffset!==0&&this._toggleDeleteReady(n),!0}}));var kt="dx-slide-item-wrapper",k="dx-slide-item-content",dt="dx-slide-item-delete-button-container",d="dx-slide-item-delete-button",fi="dx-slide-item-delete-button-hidden",gt="dx-slide-item-delete-button-content",ni="dx-slide-item-positioning";f("delete","slideItem",p.inherit({_shouldHandleSwipe:!0,_init:function(){this.callBase.apply(this,arguments);var i=n("<div/>").addClass(gt).text(Globalize.localize("dxListEditDecorator-delete")),t=n("<div/>").addClass(d).append(i);this._$buttonContainer=n("<div/>").addClass(dt).append(t);t.on(u.addNamespace("dxclick",e),n.proxy(function(){this._deleteItem()},this))},modifyElement:function(t){this.callBase.apply(this,arguments);var i=t.$itemElement;i.wrapInner(n("<div/>").addClass(k)).addClass(kt)},_handleSwipeUpdate:function(n,t){this._togglePositioning(n,!0),this._cacheItemData(n);var i=this._cachedItemWidth*t.offset,r=this._isReadyToDelete(n)?-this._cachedButtonWidth:0,u=i+r<0?i+r:0;return l.move(this._$cachedContent,{left:u}),this._$buttonContainer.css("left",Math.max(this._cachedItemWidth+u,this._minButtonContainerLeftOffset())),!0},_togglePositioning:function(n,t){n.toggleClass(ni,t),this._$buttonContainer.appendTo(n)},_cacheItemData:function(n){n[0]!==this._cachedNode&&(this._$cachedContent=n.find("."+k),this._cachedItemWidth=n.outerWidth(),this._cachedButtonWidth=this._cachedButtonWidth||n.find("."+d).outerWidth(),this._$cachedContent.length&&(this._cachedNode=n[0]))},_minButtonContainerLeftOffset:function(){return this._cachedItemWidth-this._cachedButtonWidth},_handleSwipeEnd:function(n,t){this._cacheItemData(n);var i=this._cachedItemWidth*t.offset,r=!this._isReadyToDelete(n)&&-i>this._cachedButtonWidth*.8,u=t.targetOffset===-1||r;return this._toggleDeleteReady(n,u),!0},_animatePrepareDeleteReady:function(){var t=r.animate(this._$cachedContent,{to:{left:-this._cachedButtonWidth},type:"slide",duration:200}),i=r.animate(this._$buttonContainer,{to:{left:this._minButtonContainerLeftOffset()},duration:200});return n.when(t,i).promise()},_animateForgetDeleteReady:function(t){this._cacheItemData(t);var i=r.animate(this._$cachedContent,{to:{left:0},type:"slide",duration:200}),u=r.animate(this._$buttonContainer,{to:{left:this._cachedItemWidth},duration:200,complete:n.proxy(function(){this._$buttonContainer.css("left","100%")},this)});return n.when(i,u).promise()},_forgetDeleteReady:function(n){this.callBase.apply(this,arguments),this._togglePositioning(n,!1),this._$buttonContainer.detach()}})),f("delete","swipe",s.inherit({_shouldHandleSwipe:!0,_renderItemPosition:function(t,i,u){var f=n.Deferred(),e=i*this._itemElementWidth;return u?r.animate(t,{to:{left:e},type:"slide",complete:function(){f.resolve(t,i)}}):(l.move(t,{left:e}),f.resolve()),f.promise()},_handleSwipeStart:function(n){return this._itemElementWidth=n.width(),!0},_handleSwipeUpdate:function(n,t){return this._renderItemPosition(n,t.offset),!0},_handleSwipeEnd:function(t,i){var r=i.targetOffset;return this._renderItemPosition(t,r,!0).done(n.proxy(function(n,t){Math.abs(t)&&this._list.deleteItem(n)},this)),!0}}));var g="dx-holddelete-menu",ti="dx-holddelete-menucontent",ii="dx-holddelete-menuitem";f("delete","hold",s.inherit({_init:function(){this._$menu=n("<div/>").addClass(g),this._list._element().append(this._$menu),this._menu=this._renderOverlay(this._$menu)},_renderOverlay:function(t){return t.dxOverlay({shading:!1,deferRendering:!0,closeOnTargetScroll:!0,closeOnOutsideClick:function(t){return!n(t.target).closest("."+g).length},animation:{show:{type:"custom",duration:300,from:{height:0,opacity:1},to:{height:n.proxy(function(){return this._$menuContent.height()},this),opacity:1}},hide:{type:"custom",duration:0,from:{opacity:1},to:{opacity:0}}},contentReadyAction:n.proxy(this._renderMenuContent,this)}).dxOverlay("instance")},_renderMenuContent:function(t){var r=n("<div/>").addClass(ti),i=n("<div/>").addClass(ii).text(Globalize.localize("dxListEditDecorator-delete"));i.on(u.addNamespace("dxclick",e),n.proxy(this._deleteItem,this));this._$menuContent=r.append(i),t.component.content().append(this._$menuContent),t.component.option("height",n.proxy(function(){return this._$menuContent.height()},this))},_deleteItem:function(){this._menu.hide(),this._list.deleteItem(this._$itemWithMenu)},dispose:function(){this._$menu.remove()},handleHold:function(n){return this._menu.option({position:{my:"top",at:"bottom",of:n,collision:"flip"},width:function(){return n.width()}}),this._menu.show(),this._$itemWithMenu=n,!0}}));var ri="dx-list-item-selected",ui="dx-select-checkbox-container",nt="dx-select-checkbox";f("selection","control",s.inherit({leftBag:function(t){var i=t.$itemElement,r=t.$container,u=n("<div />").addClass(nt);u.dxCheckBox({checked:this._isSelected(i),clickAction:n.proxy(function(n){this._processCheckedState(i,n.component.option("checked")),n.jQueryEvent.stopPropagation()},this)}),r.addClass(ui),r.append(u)},modifyElement:function(t){this.callBase.apply(this,arguments);var i=t.$itemElement,r=i.find("."+nt).dxCheckBox("instance");i.on("stateChanged",n.proxy(function(){r.option("checked",this._isSelected(i))},this))},_isSelected:function(n){return n.hasClass(ri)},_processCheckedState:function(n,t){t?this._list.selectItem(n):this._list.unselectItem(n)}})),f("selection","item",o.selection.control.inherit({handleClick:function(n){var t=!this._isSelected(n);return this._processCheckedState(n,t),!0}})),c.ListEditProvider=st}(jQuery,DevExpress),function(n,t,i){var u=t.ui,f=u.events,et="dxPreventItemClickAction",c=t.Class.inherit({ctor:function(n){this._list=n},isItemIndex:t.abstract,getItemElementIndex:t.abstract,normalizeItemIndex:t.abstract,deleteItemAtIndex:t.abstract,updateSelectionAfterDelete:t.abstract,fetchSelectedItems:t.abstract,selectedItemIndecies:t.abstract,getItemByIndex:t.abstract}),p=c.inherit({isItemIndex:function(t){return n.isNumeric(t)},getItemElementIndex:function(n){return this._list._itemElements().index(n)},normalizeItemIndex:function(n){return n},deleteItemAtIndex:function(n){this._list.option("items").splice(n,1)},updateSelectionAfterDelete:function(t){var i=this._list._selectedItemIndices;n.each(i,function(n,r){r>t&&(i[n]-=1)})},fetchSelectedItems:function(){var i=this._list.option("items"),t=[];return n.each(this._list._selectedItemIndices,function(n,r){t.push(i[r])}),t},selectedItemIndecies:function(){var t=[],i=this._list.option("items"),r=this._list.option("selectedItems");return n.each(r,function(r,u){var f=n.inArray(u,i);f!==-1&&t.push(f)}),t},getItemByIndex:function(n){return this._list._itemElements().eq(n)}}),l=20,w=2303,e=function(n){return(n.group<<l)+n.item},r=function(n){return{group:n>>l,item:n&w}},a=function(t,i){var u=t.items,r={key:t.key,items:[]};return n.each(i,function(n,t){r.items.push(u[t])}),r},b=function(n,t){for(var r=n.length,i=0;i<r;i++)if(n[i].key===t)return n[i]},k=c.inherit({_groupElements:function(){return this._list._itemContainer().find("."+s)},_groupItemElements:function(n){return n.find("."+o)},isItemIndex:function(t){return n.isNumeric(t.group)&&n.isNumeric(t.item)},getItemElementIndex:function(t){var i=n(t),r=i.closest("."+s);return e({group:this._groupElements().index(r),item:this._groupItemElements(r).index(i)})},normalizeItemIndex:function(n){return e(n)},deleteItemAtIndex:function(n){var t=r(n),i=this._list.option("items")[t.group].items;i.splice(t.item,1)},updateSelectionAfterDelete:function(t){var i=r(t),u=this._list._selectedItemIndices;n.each(u,function(n,t){var f=r(t);f.group===i.group&&f.item>i.item&&(u[n]-=1)})},fetchSelectedItems:function(){var f=this._list.option("items"),e=this._list._selectedItemIndices,u=[],i,t;return e.sort(function(n,t){return n-t}),i=0,t=[],n.each(e,function(n,e){var o=r(e);o.group!==i&&t.length&&(u.push(a(f[i],t)),t.length=0),i=o.group,t.push(o.item)}),t.length&&u.push(a(f[i],t)),u},selectedItemIndecies:function(){var t=[],i=this._list.option("items"),r=this._list.option("selectedItems");return n.each(r,function(r,u){var f=b(i,u.key),o=n.inArray(f,i);n.each(u.items,function(i,r){var u=n.inArray(r,f.items);u!==-1&&t.push(e({group:o,item:u}))})}),t},getItemByIndex:function(n){var t=r(n),i=this._groupElements().eq(t.group);return this._groupItemElements(i).eq(t.item)}}),v=function(t,i){var r=[];return n.each(t,function(t,u){var f=n.inArray(u,i);f===-1&&r.push(u)}),r},d="dx-list",o="dx-list-item",g="."+o,s="dx-list-group",nt="dx-list-group-header",tt="dx-has-next",it="dx-list-next-button",rt="dx-list-editing",h="dx-list-item-selected",y="dx-list-item-response-wait",ut="dxListItemData",ft=70;u.registerComponent("dxList",u.CollectionContainerWidget.inherit({_activeStateUnit:g,_defaultOptions:function(){return n.extend(this.callBase(),{pullRefreshEnabled:!1,autoPagingEnabled:!0,scrollingEnabled:!0,showScrollbar:!0,useNativeScrolling:!0,pullingDownText:Globalize.localize("dxList-pullingDownText"),pulledDownText:Globalize.localize("dxList-pulledDownText"),refreshingText:Globalize.localize("dxList-refreshingText"),pageLoadingText:Globalize.localize("dxList-pageLoadingText"),scrollAction:null,pullRefreshAction:null,pageLoadingAction:null,showNextButton:!1,nextButtonText:Globalize.localize("dxList-nextButtonText"),itemHoldAction:null,itemHoldTimeout:750,itemSwipeAction:null,grouped:!1,groupTemplate:"group",groupRender:null,editEnabled:!1,editConfig:{itemTemplate:null,itemRender:null,deleteEnabled:!1,deleteMode:"toggle",selectionEnabled:!1,selectionMode:"item"},itemDeleteAction:null,selectedItems:[],itemSelectAction:null,itemUnselectAction:null})},_itemClass:function(){return o},_itemDataKey:function(){return ut},_itemContainer:function(){return this._$container},_allowDinamicItemsAppend:function(){return!0},_init:function(){this.callBase(),this._$container=this._element(),this._initScrollView(),this._initEditProvider(),this._initEditStrategy(this.option("grouped")),this._initSelectedItems(),this._feedbackShowTimeout=ft},_initSelectedItems:function(){this._selectedItemIndices=this._editStrategy.selectedItemIndecies()},_clearSelectedItems:function(){this._selectedItemIndices=[],this._updateSelectedItems()},_dataSourceOptions:function(){return n.extend(this.callBase(),{paginate:!0})},_initScrollView:function(){var t=this.option("scrollingEnabled"),r=t&&this.option("pullRefreshEnabled"),i=t&&this.option("autoPagingEnabled")&&!!this._dataSource,u=this._element().dxScrollView({disabled:this.option("disabled")||!t,scrollAction:n.proxy(this._handleScroll,this),pullDownAction:r?n.proxy(this._handlePullDown,this):null,reachBottomAction:i?n.proxy(this._handleScrollBottom,this):null,showScrollbar:this.option("showScrollbar"),useNative:this.option("useNativeScrolling"),pullingDownText:this.option("pullingDownText"),pulledDownText:this.option("pulledDownText"),refreshingText:this.option("refreshingText"),reachBottomText:this.option("pageLoadingText")});this._scrollView=u.dxScrollView("instance"),this._scrollView.toggleLoading(i),this._$container=this._scrollView.content(),this._createScrollViewActions()},_createScrollViewActions:function(){this._scrollAction=this._createActionByOption("scrollAction",{excludeValidators:["gesture"]}),this._pullRefreshAction=this._createActionByOption("pullRefreshAction",{excludeValidators:["gesture"]}),this._pageLoadingAction=this._createActionByOption("pageLoadingAction",{excludeValidators:["gesture"]})},_handleScroll:function(n){this._scrollAction(n)},_afterItemsRendered:function(n){var r=this._isLastPage(),t=!n||r,u=this.option("autoPagingEnabled"),i=!u||t,f=this._scrollViewIsFull();i||f?(this._scrollView.release(i),this._shouldRenderNextButton()&&this._dataSource.isLoaded()&&this._toggleNextButton(!t)):this._infiniteDataLoading()},_isLastPage:function(){return!this._dataSource||this._dataSource.isLastPage()},_scrollViewIsFull:function(){return!this._scrollView||this._scrollView.isFull()},_handlePullDown:function(n){this._pullRefreshAction(n),this._dataSource&&!this._dataSource.isLoading()?(this._dataSource.pageIndex(0),this._dataSource.load()):this._afterItemsRendered()},_infiniteDataLoading:function(){var n=this._dataSource;this._scrollViewIsFull()||!n||n.isLoading()||this._isLastPage()||t.utils.executeAsync(this._loadNextPage,this)},_handleScrollBottom:function(n){this._pageLoadingAction(n);var t=this._dataSource;t&&!t.isLoading()?this._loadNextPage():this._afterItemsRendered()},_loadNextPage:function(){var n=this._dataSource;return this._expectNextPageLoading(),n.pageIndex(1+n.pageIndex()),n.load()},_renderItems:function(t){this.option("grouped")?(n.each(t,n.proxy(this._renderGroup,this)),this._renderEmptyMessage()):this.callBase.apply(this,arguments),this._afterItemsRendered(!0)},_handleDataSourceLoadError:function(){this.callBase.apply(this,arguments),this._initialized&&this._afterItemsRendered()},_initEditProvider:function(){this._editProvider&&this._editProvider.dispose(),this._editProvider=new u.ListEditProvider(this,this.option("editConfig"))},_initEditStrategy:function(n){var t=n?k:p;this._editStrategy=new t(this)},_render:function(){this._element().addClass(d),this._renderEditing(),this.callBase(),this._attachHoldEvent()},_attachClickEvent:function(){var t=f.addNamespace("dxclick",this.NAME),i=this._itemSelector();this._itemContainer().off(t,i).on(t,i,n.proxy(this._handleItemClick,this))},_handleItemClick:function(t){var i=n(t.currentTarget),r;i.is(".dx-state-disabled, .dx-state-disabled *")||(r=this.option("editEnabled")&&this._editProvider.handleClick(i),r)||this.callBase.apply(this,arguments)},_attachHoldEvent:function(){var t=this._itemContainer(),i=f.addNamespace("dxhold",this.NAME),r=this._itemSelector();if(t.off(i,r),this.option("itemHoldAction")||this._editProvider.holdHandlerExists())t.on(i,r,{timeout:this.option("itemHoldTimeout")},n.proxy(this._handleItemHold,this))},_handleItemHold:function(t){var i=n(t.currentTarget),r;i.is(".dx-state-disabled, .dx-state-disabled *")||(r=this.option("editEnabled")&&this._editProvider.handleHold(i),r)||this._handleItemJQueryEvent(t,"itemHoldAction")},_renderEditing:function(){this._element().toggleClass(rt,this.option("editEnabled"))},_shouldRenderNextButton:function(){return this.option("showNextButton")&&this._dataSource},_getNextButtonContainer:function(){return this._nextButtonContainer||(this._nextButtonContainer=this._createNextButtonContainer()),this._nextButtonContainer},_createNextButtonContainer:function(){var t=n("<div>").addClass(it);return this._nextButton=n("<div>").dxButton({text:this.option("nextButtonText"),clickAction:n.proxy(this._handleNextButton,this)}),t.append(this._nextButton)},_getItemRenderer:function(){return this.option("editEnabled")&&this._editProvider.isRenderingByRenderer()?this._editProvider.getItemRenderer():this.callBase()},_getItemTemplateName:function(){return this.option("editEnabled")&&this._editProvider.isRenderingByTemplate()?this._editProvider.getItemTemplateName():this.callBase()},_postprocessRenderItem:function(t){var i=n(t.itemElement);this._isItemSelected(this._getItemIndex(i))&&i.addClass(h),this.option("itemSwipeAction")&&this._attachSwipeEvent(i),this.option("editEnabled")&&this._editProvider.isModifyingByDecorators()&&this._editProvider.modifyItemElement(t)},_attachSwipeEvent:function(t){var i=f.addNamespace("dxswipeend",this.NAME);t.on(i,n.proxy(this._handleItemSwipeEnd,this))},_handleItemSwipeEnd:function(n){this._handleItemJQueryEvent(n,"itemSwipeAction",{direction:n.offset<0?"left":"right"},{excludeValidators:["gesture"]})},_handleNextButton:function(){var n=this._dataSource;n&&!n.isLoading()&&(this._scrollView.toggleLoading(!0),this._expectNextPageLoading(),n.pageIndex(1+n.pageIndex()),n.load(),this._nextButtonContainer.detach())},_groupRenderDefault:function(n){return String(n.key||n)},_renderGroup:function(t,i){var r=this,e=n("<div>").addClass(s).appendTo(r._itemContainer()),o=r.option("groupRender"),c=r.option("groupTemplate"),h=r._getTemplate(i.template||c,t,i),u,f={index:t,group:i,container:e};u=o?r._createGroupByRenderer(o,f):h?r._createGroupByTemplate(h,f):r._createGroupByRenderer(r._groupRenderDefault,f),u.addClass(nt),this._renderingGroupIndex=t,n.each(i.items||[],function(n,t){r._renderItem(n,t,e)})},_createGroupByRenderer:function(t,i){var r=n("<div>").appendTo(i.container),u=t(i.group,i.index,r);return u&&r[0]!==u[0]&&r.append(u),r},_createGroupByTemplate:function(n,t){return n.render(t.container,t.group)},_clean:function(){this._toggleNextButton(!1),this.callBase.apply(this,arguments)},_dispose:function(){clearTimeout(this._holdTimer),this.callBase()},_toggleNextButton:function(n){var t=this._dataSource,i=this._getNextButtonContainer();this._element().toggleClass(tt,n),n&&t&&t.isLoaded()&&i.appendTo(this._itemContainer()),n||i.detach()},_optionChanged:function(n,t){switch(n){case"nextButtonText":this._nextButton.dxButton("option","text",t);break;case"showNextButton":this._toggleNextButton(t);break;case"itemHoldAction":case"itemHoldTimeout":this._attachHoldEvent();break;case"dataSource":this.callBase.apply(this,arguments),this._initScrollView();break;case"pullingDownText":case"pulledDownText":case"refreshingText":case"pageLoadingText":case"useNativeScrolling":case"showScrollbar":case"scrollingEnabled":case"pullRefreshEnabled":case"autoPagingEnabled":this._initScrollView();break;case"selectedItems":this._selectedItemsInternalChange||this._refreshSelectedItems();break;case"itemSwipeAction":this._invalidate();break;case"scrollAction":case"pullRefreshAction":case"pageLoadingAction":this._createScrollViewActions(),this._invalidate();break;case"grouped":this._clearSelectedItems(),delete this._renderingGroupIndex,this._initEditStrategy(t),this._invalidate();break;case"groupTemplate":case"groupRender":this._invalidate();break;case"items":case"editEnabled":this._clearSelectedItems(),this._invalidate();break;case"editConfig":this._initEditProvider(),this._invalidate();break;case"width":case"height":this.callBase.apply(this,arguments),this._scrollView.update();break;case"itemDeleteAction":case"itemSelectAction":case"itemUnselectAction":break;default:this.callBase.apply(this,arguments)}},_getItemIndex:function(n){return this._editStrategy.isItemIndex(n)?this._editStrategy.normalizeItemIndex(n):this._editStrategy.getItemElementIndex(n)},_getItemElement:function(t){return this._editStrategy.isItemIndex(t)?this._editStrategy.getItemByIndex(this._editStrategy.normalizeItemIndex(t)):n(t)},_isItemSelected:function(t){return n.inArray(t,this._selectedItemIndices)>-1},_updateSelectedItems:function(){this._selectedItemsInternalChange=!0,this.option("selectedItems",this._editStrategy.fetchSelectedItems()),this._selectedItemsInternalChange=!1},_updateSelectionAfterDelete:function(t){var r=this,i=n.inArray(t,this._selectedItemIndices);i>-1&&this._selectedItemIndices.splice(i,1),this._editStrategy.updateSelectionAfterDelete(t),this._updateSelectedItems()},_selectItem:function(n){var t=this._getItemIndex(n);this.option("editEnabled")&&t>-1&&!this._isItemSelected(t)&&(n.addClass(h),this._selectedItemIndices.push(t),n.trigger("stateChanged"),this._updateSelectedItems(),this._handleItemEvent(n,"itemSelectAction",{},{excludeValidators:["gesture","disabled"]}))},_unselectItem:function(t){var i=n.inArray(this._getItemIndex(t),this._selectedItemIndices);this.option("editEnabled")&&i>-1&&(t.removeClass(h),this._selectedItemIndices.splice(i,1),t.trigger("stateChanged"),this._updateSelectedItems(),this._handleItemEvent(t,"itemUnselectAction",{},{excludeValidators:["gesture","disabled"]}))},_refreshSelectedItems:function(){var t=this,i=this._editStrategy.selectedItemIndecies(),u=v(this._selectedItemIndices,i),r;n.each(u,function(n,i){var r=t._editStrategy.getItemByIndex(i);t._unselectItem(r)}),r=v(i,this._selectedItemIndices),n.each(r,function(n,i){var r=t._editStrategy.getItemByIndex(i);t._selectItem(r)})},_deleteItemFromDS:function(t){var u=this,r=n.Deferred(),e=this.option("disabled"),f=this._dataSource.store();if(this.option("disabled",!0),!f.remove)throw new Error("You have to implement 'remove' method in dataStore used by dxList to be able to delete items");return f.remove(f.keyOf(this._getItemData(t))).done(function(n){n!==i?r.resolveWith(u):r.rejectWith(u)}).fail(function(){r.rejectWith(u)}),r.always(function(){u.option("disabled",e)}),r},_refreshLastPage:function(){return this._expectLastItemLoading(),this._dataSource.load()},deleteItem:function(t){var i=this,r=n.Deferred(),u=this._getItemElement(t),o=this._getItemIndex(t),f,e;return(this.option("editEnabled")&&o>-1?(u.addClass(y),this._dataSource?(f="dataSource",r=this._deleteItemFromDS(u)):(f="items",r.resolveWith(this))):r.rejectWith(this),r.done(function(){u.detach(),i._editStrategy.deleteItemAtIndex(o),i.optionChanged.fireWith(i,[f,i.option(f)]),i._updateSelectionAfterDelete(o),i._handleItemEvent(u,"itemDeleteAction",{},{excludeValidators:["gesture","disabled"]}),i._renderEmptyMessage()}).fail(function(){u.removeClass(y)}),this._isLastPage()||this.option("grouped"))?r.promise():(e=n.Deferred(),r.done(function(){i._refreshLastPage().done(function(){e.resolveWith(i)})}),r.fail(function(){e.rejectWith(i)}),e.promise())},isItemSelected:function(n){return this._isItemSelected(this._getItemIndex(n))},selectItem:function(n){this._selectItem(this._getItemElement(n))},unselectItem:function(n){this._unselectItem(this._getItemElement(n))},update:function(){var t=this,i=n.Deferred();return t._scrollView?t._scrollView.update().done(function(){i.resolveWith(t)}):i.resolveWith(t),i.promise()},scrollTop:function(){return this._scrollView.scrollOffset().top},clientHeight:function(){return this._scrollView.clientHeight()},scrollHeight:function(){return this._scrollView.scrollHeight()},scrollBy:function(n){this._scrollView.scrollBy(n)},scrollTo:function(n){this._scrollView.scrollTo(n)}}))}(jQuery,DevExpress),function(n,t){var r=t.ui,u=t.utils,e="dx-tileview",o="dx-tiles-wrapper",f="dx-tile",s="."+f,h="dxTileData";r.registerComponent("dxTileView",r.CollectionContainerWidget.inherit({_activeStateUnit:s,_defaultOptions:function(){return n.extend(this.callBase(),{items:null,showScrollbar:!1,listHeight:500,baseItemWidth:100,baseItemHeight:100,itemMargin:20})},_itemClass:function(){return f},_itemDataKey:function(){return h},_itemContainer:function(){return this._$wrapper},_init:function(){var n=this;n.callBase(),n._refreshHandler=function(){n._renderGeometry()},u.windowResizeCallbacks.add(n._refreshHandler)},_dispose:function(){this.callBase(),u.windowResizeCallbacks.remove(this._refreshHandler)},_render:function(){this.cellsPerColumn=1,this._element().addClass(e),this._renderListHeight(),this._initScrollable(),this._$wrapper||this._renderWrapper(),this.callBase(),this._renderGeometry(),this._fireContentReadyAction()},_renderListHeight:function(){this._element().height(this.option("listHeight"))},_renderContent:function(){this._renderContentImpl()},_renderWrapper:function(){this._$wrapper=n("<div />").addClass(o).appendTo(this._scrollView.content())},_initScrollable:function(){this._scrollView=this._element().dxScrollable({direction:"horizontal",showScrollbar:this.option("showScrollbar"),disabled:this.option("disabled")}).data("dxScrollable")},_renderGeometry:function(){var t=this.option("items")||[],i=Math.max.apply(Math,n.map(t||[],function(n){return Math.round(n.heightRatio||1)}));this.cellsPerColumn=Math.floor(this._element().height()/(this.option("baseItemHeight")+this.option("itemMargin"))),this.cellsPerColumn=Math.max(this.cellsPerColumn,i),this.cells=[],this.cells.push(new Array(this.cellsPerColumn)),this._arrangeItems(t),this._$wrapper.width(this.cells.length*this.option("baseItemWidth")+(this.cells.length+1)*this.option("itemMargin"))},_arrangeItems:function(t){var i=this;n.each(t,function(n,t){var r={},f,u;r.widthRatio=t.widthRatio||1,r.heightRatio=t.heightRatio||1,r.text=t.text||"",r.widthRatio=r.widthRatio<=0?0:Math.round(r.widthRatio),r.heightRatio=r.heightRatio<=0?0:Math.round(r.heightRatio),f=i._itemElements().eq(n),u=i._getItemPosition(r),u.x===-1&&(u.x=i.cells.push(new Array(i.cellsPerColumn))-1),i._occupyCells(r,u),i._arrangeItem(f,r,u)})},_getItemPosition:function(n){for(var r={x:-1,y:0},i,t=0;t<this.cells.length;t++){for(i=0;i<this.cellsPerColumn;i++)if(this._itemFit(t,i,n)){r.x=t,r.y=i;break}if(r.x>-1)break}return r},_itemFit:function(n,t,i){var f=!0,r,u;if(t+i.heightRatio>this.cellsPerColumn)return!1;for(r=n;r<n+i.widthRatio;r++)for(u=t;u<t+i.heightRatio;u++)if(this.cells.length-1<r)this.cells.push(new Array(this.cellsPerColumn));else if(this.cells[r][u]){f=!1;break}return f},_occupyCells:function(n,t){for(var r,i=t.x;i<t.x+n.widthRatio;i++)for(r=t.y;r<t.y+n.heightRatio;r++)this.cells[i][r]=!0},_arrangeItem:function(n,t,i){var u=this.option("baseItemHeight"),f=this.option("baseItemWidth"),r=this.option("itemMargin");n.css({height:t.heightRatio*u+(t.heightRatio-1)*r,width:t.widthRatio*f+(t.widthRatio-1)*r,top:i.y*u+(i.y+1)*r,left:i.x*f+(i.x+1)*r,display:t.widthRatio<=0||t.heightRatio<=0?"none":""})},_optionChanged:function(n,t){switch(n){case"showScrollbar":this._initScrollable();break;case"disabled":this._scrollView.option("disabled",t);break;case"baseItemWidth":case"baseItemHeight":case"itemMargin":this._renderGeometry();break;case"listHeight":this._renderListHeight();break;default:this.callBase.apply(this,arguments)}}}))}(jQuery,DevExpress),function(n,t){var u=t.ui,c=t.utils,f=u.events,s=t.fx,l=t.translator,r="dx-gallery",a="dx-gallery-loop",k=r+"-wrapper",v=r+"-active",e=r+"-item",o=e+"-loop",d="."+e,y=e+"-selected",p=r+"-indicator",h=p+"-item",w="."+h,b=h+"-selected",g="dxGalleryItemData";u.registerComponent("dxGalleryNavButton",u.Widget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{direction:"next"})},_render:function(){this.callBase(),this._element().addClass(r+"-nav-button-"+this.option("direction"))},_optionChanged:function(n,t,i){switch(n){case"clickAction":case"direction":this._invalidate();break;default:this.callBase(n,t,i)}}})),u.registerComponent("dxGallery",u.CollectionContainerWidget.inherit({_activeStateUnit:d,_defaultOptions:function(){return n.extend(this.callBase(),{activeStateEnabled:!1,animationDuration:400,loop:!1,swipeEnabled:!0,indicatorEnabled:!0,showIndicator:!0,selectedIndex:0,slideshowDelay:0,showNavButtons:!1})},_dataSourceOptions:function(){return{paginate:!1}},_itemContainer:function(){return this._$container},_itemClass:function(){return e},_itemDataKey:function(){return g},_itemWidth:function(){return this._itemElements().first().outerWidth()},_itemsCount:function(){return(this.option("items")||[]).length},_itemRenderDefault:function(t,i,r){this.callBase(t,i,r),n.isPlainObject(t)||r.append(n("<img />").attr("src",String(t)))},_render:function(){this._element().addClass(r),this._element().toggleClass(a,this.option("loop")),this._renderDragHandler(),this._renderItemContainer(),this.callBase(),this._renderContainerPosition(),this._renderItemPositions(),this._renderIndicator(),this._renderSelectedIndicatorItem(),this._renderUserInteraction(),this._renderNavButtons(),this._setupSlideShow(),this._reviseDimensions(),this._windowResizeCallback=n.proxy(this._handleResize,this),c.windowResizeCallbacks.add(this._windowResizeCallback)},_renderDragHandler:function(){var n=f.addNamespace("dragstart",this.NAME);this._element().off(n).on(n,"img",function(){return!1})},_renderItems:function(n){this.callBase(n),this._renderDuplicateItems()},_renderItemContainer:function(){this._$container||(this._$container=n("<div>").addClass(k).appendTo(this._element()))},_renderDuplicateItems:function(){var t=this.option("items")||[],i=t.length,r,u,n;if(i){for(this._element().find("."+o).remove(),r=this._element().width()/this._itemWidth(),u=Math.min(r,i),n=0;n<u;n++)this._renderItem(0,t[n]).addClass(o);this._renderItem(0,t[this._itemsCount()-1]).addClass(o)}},_handleResize:function(){this._renderDuplicateItems(),this._renderItemPositions(),this._renderContainerPosition()},_renderItemPositions:function(){var t=this._itemWidth(),i=this._element().find("."+o).length,r=this._itemsCount()+i-1;this._itemElements().each(function(i){var u=i;i===r&&(u=-1),l.move(n(this),{left:u*t})})},_renderContainerPosition:function(t,i){t=t||0;var r=this,e=this._itemWidth(),o=this.option("selectedIndex"),s=t-o,f=s*e,u;return i?(r._startSwipe(),u=r._animate(f).done(n.proxy(r._endSwipe,r))):(l.move(this._$container,{left:f}),u=n.Deferred().resolveWith(r)),u.promise()},_startSwipe:function(){this._element().addClass(v)},_endSwipe:function(){this._element().removeClass(v)},_animate:function(t,i){var r=this,u=n.Deferred();return s.animate(this._$container,n.extend({type:"slide",to:{left:t},duration:r.option("animationDuration"),complete:function(){u.resolveWith(r)}},i||{})),u},_reviseDimensions:function(){var n=this,t=n._itemElements().first();t&&(n.option("height")||n.option("height",t.outerHeight()),n.option("width")||n.option("width",t.outerWidth()))},_renderIndicator:function(){if(!this.option("showIndicator")){this._cleanIndicators();return}var t=this._$indicator=n("<div>").addClass(p).appendTo(this._element());n.each(this.option("items")||[],function(){n("<div>").addClass(h).appendTo(t)})},_cleanIndicators:function(){this._$indicator&&this._$indicator.remove()},_renderSelectedIndicatorItem:function(){var n=this.option("selectedIndex");this._itemElements().removeClass(y).eq(n).addClass(y),this._element().find(w).removeClass(b).eq(n).addClass(b)},_renderUserInteraction:function(){var t=this,i=t._element(),r=t.option("swipeEnabled")&&this._itemsCount()>1,e=r?"pointer":"default",u;i.dxSwipeable({startAction:r?n.proxy(t._handleSwipeStart,t):function(n){n.jQueryEvent.cancel=!0},disabled:this.option("disabled"),updateAction:n.proxy(t._handleSwipeUpdate,t),endAction:n.proxy(t._handleSwipeEnd,t),itemSizeFunc:n.proxy(t._itemWidth,t)}),u=this._createAction(this._handleIndicatorSelect);i.find(w).off(f.addNamespace("dxclick",this.NAME)).on(f.addNamespace("dxclick",this.NAME),function(n){u({jQueryEvent:n})})},_handleIndicatorSelect:function(t){var u=t.jQueryEvent,i=t.component,r;f.needSkipEvent(u)||i.option("indicatorEnabled")&&(r=n(u.target).index(),i._renderContainerPosition(i.option("selectedIndex")-r,!0).done(function(){this._suppressRenderItemPositions=!0,i.option("selectedIndex",r)}))},_renderNavButtons:function(){var t=this;if(!t.option("showNavButtons")){t._cleanNavButtons();return}t._prevNavButton=n("<div />").dxGalleryNavButton({direction:"prev",clickAction:function(){t.prevItem(!0)}}).appendTo(this._element()),t._nextNavButton=n("<div />").dxGalleryNavButton({direction:"next",clickAction:function(){t.nextItem(!0)}}).appendTo(this._element()),this._renderNavButtonsVisibility()},_cleanNavButtons:function(){this._prevNavButton&&this._prevNavButton.remove(),this._prevNavButton&&this._nextNavButton.remove()},_renderNavButtonsVisibility:function(){var i,r;if(this.option("showNavButtons")){var t=this.option("selectedIndex"),u=this.option("loop"),n=this._itemsCount();(this._prevNavButton.show(),this._nextNavButton.show(),u)||(i=n<2||t===n-1,r=n<2||t===0,r&&this._prevNavButton.hide(),i&&this._nextNavButton.hide())}},_setupSlideShow:function(){var n=this,t=n.option("slideshowDelay");t&&(clearTimeout(n._slideshowTimer),n._slideshowTimer=setTimeout(function(){if(n._userInteraction){n._setupSlideShow();return}n.nextItem(!0).done(n._setupSlideShow)},t))},_handleSwipeStart:function(n){var i=this._itemsCount(),t;if(!i){n.jQueryEvent.cancel=!0;return}this._stopItemAnimations(),this._startSwipe(),this._userInteraction=!0,this.option("loop")||(t=this.option("selectedIndex"),n.jQueryEvent.maxLeftOffset=i-t-1,n.jQueryEvent.maxRightOffset=t)},_stopItemAnimations:function(){s.animating(this._$container)&&s.stop(this._$container,!0)},_handleSwipeUpdate:function(n){this._renderContainerPosition(n.jQueryEvent.offset)},_handleSwipeEnd:function(n){this._renderContainerPosition(n.jQueryEvent.targetOffset,!0).done(function(){var t=this.option("selectedIndex"),i=this._fitIndex(t-n.jQueryEvent.targetOffset);this._suppressRenderItemPositions=!0,this.option("selectedIndex",i),this._renderContainerPosition(),this._userInteraction=!1,this._setupSlideShow()})},_flipIndex:function(n){if(!this.option("loop"))return n;var t=this._itemsCount();return n=n%t,n>(t+1)/2&&(n-=t),n<-(t-1)/2&&(n+=t),n},_fitIndex:function(n){if(!this.option("loop"))return n;var t=this._itemsCount();return n=n%t,n<0&&(n+=t),n},_clean:function(){this.callBase(),this._cleanIndicators(),this._cleanNavButtons()},_dispose:function(){c.windowResizeCallbacks.remove(this._windowResizeCallback),clearTimeout(this._slideshowTimer),this.callBase()},_handleSelectedIndexChanged:function(){this._suppressRenderItemPositions||this._renderContainerPosition(),this._suppressRenderItemPositions=!1,this._renderSelectedIndicatorItem(),this._renderNavButtonsVisibility()},_optionChanged:function(n,t,i){switch(n){case"width":this.callBase(n,t,i),this._handleResize();break;case"animationDuration":this._renderNavButtonsVisibility();break;case"loop":this._element().toggleClass(a,t),this._renderNavButtonsVisibility();return;case"selectedIndex":this._handleSelectedIndexChanged();return;case"showIndicator":this._renderIndicator();return;case"showNavButtons":this._renderNavButtons();return;case"slideshowDelay":this._setupSlideShow();return;case"swipeEnabled":case"indicatorEnabled":this._renderUserInteraction();return;default:this.callBase(n,t,i)}},goToItem:function(t,i){var r=new n.Deferred,u=this.option("selectedIndex"),f=this._itemsCount();return(t=this._fitIndex(t),t>f-1||t<0)?r.resolveWith(this).promise():(this._renderContainerPosition(u-t,i).done(function(){this._suppressRenderItemPositions=!0,this.option("selectedIndex",t),r.resolveWith(this)}),r.promise())},prevItem:function(n){return this.goToItem(this.option("selectedIndex")-1,n)},nextItem:function(n){return this.goToItem(this.option("selectedIndex")+1,n)}}))}(jQuery,DevExpress),function(n,t,i){var u=t.ui,o=t.utils,f=u.events,s=t.fx,r="dx-overlay",c=r+"-wrapper",l=r+"-content",a=r+"-shader",v=r+"-modal",h=["showingAction","shownAction","hidingAction","hiddenAction","positioningAction","positionedAction"],e=1e3,y="dx-state-disabled";u.registerComponent("dxOverlay",u.ContainerWidget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{activeStateEnabled:!1,visible:!1,deferRendering:!0,shading:!0,position:{my:"center",at:"center",of:window},width:function(){return n(window).width()*.8},height:function(){return n(window).height()*.8},animation:{show:{type:"pop",duration:400},hide:{type:"pop",duration:400,to:{opacity:0,scale:0},from:{opacity:1,scale:1}}},closeOnOutsideClick:!1,closeOnTargetScroll:!1,showingAction:null,shownAction:null,positioningAction:null,positionedAction:null,hidingAction:null,hiddenAction:null,targetContainer:i,backButtonHandler:i})},_optionsByReference:function(){return n.extend(this.callBase(),{animation:!0})},_wrapper:function(){return this._$wrapper},_container:function(){return this._$container},_init:function(){this.callBase(),this._actions={},this._initWindowResizeHandler(),this._initCloseOnOutsideClickHandler(),this._$wrapper=n("<div>").addClass(c),this._$container=n("<div>").addClass(l);this._$wrapper.on("MSPointerDown",n.noop)},_initOptions:function(n){this._initTargetContainer(n.targetContainer),this._initBackButtonHandler(n.backButtonHandler),this.callBase(n)},_initTargetContainer:function(r){r=r===i?t.overlayTargetContainer():r;var f=this._element(),u=f.closest(r);u.length||(u=n(r).first()),this._$targetContainer=u.length?u:f.parent()},_initBackButtonHandler:function(t){this._backButtonHandler=t!==i?t:n.proxy(this._defaultBackButtonHandler,this)},_defaultBackButtonHandler:function(){this.hide()},_initWindowResizeHandler:function(){this._windowResizeCallback=n.proxy(this._renderGeometry,this)},_initCloseOnOutsideClickHandler:function(){this._documentDownHandler=n.proxy(function(){this._handleDocumentDown.apply(this,arguments)},this)},_handleDocumentDown:function(t){var i,r,u;e===this._zIndex&&(i=this.option("closeOnOutsideClick"),n.isFunction(i)&&(i=i(t)),i&&(r=this._$container,u=!r.is(t.target)&&!n.contains(r.get(0),t.target),u&&this.hide()))},_render:function(){var n=this._element();this._$wrapper.addClass(n.attr("class")),this._setActions(),this._renderModalState(),this.callBase(),n.addClass(r)},_setActions:function(){var t=this;n.each(h,function(n,i){t._actions[i]=t._createActionByOption(i)||function(){}})},_renderModalState:function(){this._$wrapper.toggleClass(v,this.option("shading")&&!this.option("targetContainer"))},_renderVisibilityAnimate:function(t){return t&&(this._showTimestamp=n.now()),this._stopAnimation(),this._updateRegistration(t),t?this._makeVisible():this._makeHidden()},_updateRegistration:function(n){n?this._zIndex||(this._zIndex=++e):this._zIndex&&(--e,delete this._zIndex)},_makeVisible:function(){var i=this,r=n.Deferred(),u=i.option("animation")||{},t=u.show,f=t&&t.complete||n.noop;return this._actions.showingAction(),this._toggleVisibility(!0),this._$wrapper.css("z-index",this._zIndex),this._$container.css("z-index",this._zIndex),this._animate(t,function(){f.apply(this,arguments),i._actions.shownAction(),r.resolve()}),r.promise()},_makeHidden:function(){var i=this,r=n.Deferred(),u=this.option("animation")||{},t=u.hide,f=t&&t.complete||n.noop;return this._actions.hidingAction(),this._toggleShading(!1),this._animate(t,function(){i._toggleVisibility(!1),f.apply(this,arguments),i._actions.hiddenAction(),r.resolve()}),r.promise()},_animate:function(t,i){t?s.animate(this._$container,n.extend({},t,{complete:i})):i()},_stopAnimation:function(){s.stop(this._$container,!0)},_toggleVisibility:function(n){this._stopAnimation(),this.callBase.apply(this,arguments),this._$container.toggle(n),this._toggleShading(n),this._toggleSubscriptions(n),this._updateRegistration(n),n?(this._renderContent(),this._moveToTargetContainer(),this._renderGeometry()):this._moveFromTargetContainer()},_toggleShading:function(n){this._$wrapper.toggleClass(a,n&&this.option("shading"))},_toggleSubscriptions:function(n){this._toggleWindowResizeSubscription(n),this._toggleBackButtonCallback(n),this._toggleDocumentDownHandler(n),this._toggleParentsScrollSubscription(n)},_toggleWindowResizeSubscription:function(n){n?o.windowResizeCallbacks.add(this._windowResizeCallback):o.windowResizeCallbacks.remove(this._windowResizeCallback)},_toggleBackButtonCallback:function(n){this._backButtonHandler&&(n?t.backButtonCallback.add(this._backButtonHandler):t.backButtonCallback.remove(this._backButtonHandler))},_toggleDocumentDownHandler:function(t){var r=this,i=f.addNamespace("dxpointerdown",r.NAME);if(t)n(document).on(i,this._documentDownHandler);else n(document).off(i,this._documentDownHandler)},_toggleParentsScrollSubscription:function(t){var i=this.option("position");if(i&&i.of){var r=this,e=this.option("closeOnTargetScroll"),u=n(i.of).parents();if(u.off(f.addNamespace("scroll",r.NAME)),t&&e)u.on(f.addNamespace("scroll",r.NAME),function(n){n.overlayProcessed||(n.overlayProcessed=!0,r.hide())})}},_renderContent:function(){this._contentAlreadyRendered||!this.option("visible")&&this.option("deferRendering")||(this._contentAlreadyRendered=!0,this.callBase())},_renderContentImpl:function(n){var t=this._element();this._$container.append(t.contents()).appendTo(t),(n||this._templates.template).render(this.content())},_fireContentReadyAction:function(){this.option("visible")&&this._moveToTargetContainer(),this.callBase.apply(this,arguments)},_moveToTargetContainer:function(){this._attachWrapperToTargetContainer(),this._$container.appendTo(this._$wrapper)},_attachWrapperToTargetContainer:function(){var n=this._element();!this._$targetContainer||this._$targetContainer[0]===n.parent()[0]?this._$wrapper.appendTo(n):this._$wrapper.appendTo(this._$targetContainer)},_moveFromTargetContainer:function(){this._$container.appendTo(this._element()),this._detachWrapperFromTargetContainer()},_detachWrapperFromTargetContainer:function(){this._$wrapper.detach()},_renderGeometry:function(){this.option("visible")&&this._renderGeometryImpl()},_renderGeometryImpl:function(){this._stopAnimation(),this._renderDimensions(),this._renderPosition()},_renderDimensions:function(){this._$container.width(this.option("width")).height(this.option("height"))},_renderPosition:function(){var r=this.option("position"),u=this._$wrapper,s=r?n(r.of):n(),e=this.option("targetContainer"),i=e?n(e):s,f,o;u.css("position",i.get(0)===window?"fixed":"absolute"),this.option("shading")&&(this._$wrapper.show(),u.css({width:i.outerWidth(),height:i.outerHeight()}),t.position(u,{my:"top left",at:"top left",of:i})),this._$container.css({top:"initial",left:"initial",transform:"none"}),f=t.calculatePosition(this._$container,r),this._actions.positioningAction({position:f}),o=t.position(this._$container,f),this._actions.positionedAction({position:o})},_refresh:function(){this._renderModalState(),this._toggleVisibility(this.option("visible"))},_dispose:function(){this._stopAnimation(),this._toggleSubscriptions(!1),this._updateRegistration(!1),this._actions=null,this.callBase(),this._$wrapper.remove(),this._$container.remove()},_toggleDisabledState:function(n){this.callBase.apply(this,arguments),this._$container.toggleClass(y,n)},_optionChanged:function(t,i){if(n.inArray(t,h)>-1){this._setActions();return}switch(t){case"shading":this._toggleShading(this.option("visible"));break;case"width":case"height":case"position":this._renderGeometry();break;case"visible":this._renderVisibilityAnimate(i).done(n.proxy(function(){this._animateDeferred&&(this._animateDeferred.resolveWith(this),delete this._animateDeferred)},this));break;case"targetContainer":this._initTargetContainer(i),this._invalidate();break;case"deferRendering":this._invalidate();break;case"closeOnOutsideClick":this._toggleDocumentDownHandler(this.option("visible"));break;case"closeOnTargetScroll":this._toggleParentsScrollSubscription(this.option("visible"));break;case"overlayShowEventTolerance":case"animation":break;default:this.callBase.apply(this,arguments)}},toggle:function(t){if(t=t===i?!this.option("visible"):t,t===this.option("visible"))return n.Deferred().resolve().promise();var r=n.Deferred();return this._animateDeferred=r,this.option("visible",t),r.promise()},show:function(){return this.toggle(!0)},hide:function(){return this.toggle(!1)},content:function(){return this._$container},repaint:function(){this._renderGeometry()}}))}(jQuery,DevExpress),function(n,t){var u=t.ui,f="dx-toast",r=f+"-",e=r+"wrapper",o=r+"content",s=r+"message",h=r+"icon",c="dxToast",l=["info","warning","error","success"];u.registerComponent(c,u.dxOverlay.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{message:"",type:"info",displayTime:2e3,position:{my:"bottom center",at:"bottom center",of:window,offset:"0 -20"},animation:{show:{type:"fade",duration:400,from:0,to:1},hide:{type:"fade",duration:400,to:0}},shading:!1,disabled:!1,height:"auto"})},_renderContentImpl:function(){this.option("message")&&(this._message=n("<div>").addClass(s).text(this.option("message")).appendTo(this.content())),n.inArray(this.option("type").toLowerCase(),l)>-1&&this.content().prepend(n("<div>").addClass(h)),this.callBase()},_render:function(){this.callBase(),this._element().addClass(f),this._wrapper().addClass(e),this._$container.addClass(r+String(this.option("type")).toLowerCase()),this.content().addClass(o)},_makeVisible:function(){return this.callBase.apply(this,arguments).done(n.proxy(function(){clearTimeout(this._hideTimeout),this._hideTimeout=setTimeout(n.proxy(function(){this.hide()},this),this.option("displayTime"))},this))},_dispose:function(){clearTimeout(this._hideTimeout),this.callBase()},_optionChanged:function(n,t,i){switch(n){case"type":this._$container.removeClass(r+i),this._$container.addClass(r+String(t).toLowerCase());break;case"message":this._message&&this._message.text(t);break;case"displayTime":break;default:this.callBase.apply(this,arguments)}}}))}(jQuery,DevExpress),function(n,t){var f=t.ui,r="dx-popup",h=r+"-wrapper",e=r+"-fullscreen",c=r+"-content",o=r+"-title",s="."+o,l="dx-closebutton",u="dx-popup-bottom",a="dx-toolbar-left",v="dx-toolbar-right",p=".dx-overlay-content",y=function(i){var f=t.devices.current(i),r={cancel:{subclass:"dx-popup-cancel"},clear:{subclass:"dx-popup-clear"},done:{subclass:"dx-popup-done"}};return f.ios&&(n.extend(r.cancel,{parent:s,wraperClass:a}),n.extend(r.clear,{parent:s,wraperClass:v}),n.extend(r.done,{wraperClass:u})),(f.android||f.platform==="desktop"||f.win8||f.tizen||f.generic)&&(n.extend(r.cancel,{wraperClass:u}),n.extend(r.clear,{wraperClass:u}),n.extend(r.done,{wraperClass:u})),r};f.registerComponent("dxPopup",f.dxOverlay.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{title:"",showTitle:!0,fullScreen:!1,cancelButton:null,doneButton:null,clearButton:null,closeButton:null})},_init:function(){this.callBase(),this._$content=this._container().wrapInner(n("<div />").addClass(c)).children().eq(0)},_render:function(){this.callBase(),this._element().addClass(r),this._wrapper().addClass(h)},_renderContent:function(){this.callBase()},_renderContentImpl:function(){this._container().toggleClass(e,this.option("fullScreen")),this.callBase(this._templates.content),this._renderTitle(),this._renderCloseButton(),this._renderCancelButton(),this._renderClearButton(),this._renderDoneButton()},_renderTitle:function(){if(this.option("showTitle")){this._$title=this._$title||n("<div />").addClass(o),this._element().append(this._$title);var t=this._templates.title;t?t.render(this._$title.html("")):this._defaultTitleRender(),this._$title.prependTo(this._$container)}else this._$title&&this._$title.detach()},_defaultTitleRender:function(){this._$title.text(this.option("title"))},_renderCloseButton:function(){if(!this._templates.title&&this.option("closeButton")&&this.option("showTitle")){var t=this._createButtonAction();n("<div/>").addClass(l).on(f.events.addNamespace("dxclick",this.NAME+"TitleCloseButton"),function(n){t({jQueryEvent:n})}).appendTo(this._$title)}},_renderCancelButton:function(){this._renderSpecificButton(this.option("cancelButton"),{type:"cancel",text:Globalize.localize("Cancel")})},_renderClearButton:function(){this._renderSpecificButton(this.option("clearButton"),{type:"clear",text:Globalize.localize("Clear")})},_renderDoneButton:function(){this._renderSpecificButton(this.option("doneButton"),{type:"done",text:Globalize.localize("Done")})},_renderSpecificButton:function(n,t){var u=this._getRenderButtonParams(t.type),i;(this._removeButton(u),this._wrapper().toggleClass(r+"-"+t.type+"-visible",!!n),n)&&(i=this.option(t.type+"Button"),this._renderButton({text:i.text||t.text,clickAction:this._createButtonAction(i.clickAction)},u))},_createButtonAction:function(n){return this._createAction(n,{afterExecute:function(n){n.component.hide()}})},_getRenderButtonParams:function(t){return n.extend({},y()[t])},_renderButton:function(t,i){var f=n("<div/>").addClass(i.subclass).dxButton(t),e=i.parent?this._container().find(i.parent):this._container(),r=this._container().find("."+i.wraperClass);r.length||(r=n("<div/>").addClass(i.wraperClass).appendTo(e)),f.appendTo(r),this._container().find("."+u).addClass(i.subclass)},_removeButton:function(n){var t="."+(n.subclass||n.wraperClass);this.content()&&this.content().removeClass(n.subclass),this._container().find(t).remove()},_renderGeometryImpl:function(){this.callBase.apply(this,arguments),this._setContentHeight()},_renderDimensions:function(){this.option("fullScreen")?(this._wrapper().css({width:"100%",height:"100%"}),this._container().css({width:"100%",height:"100%"})):this.callBase.apply(this,arguments)},_renderPosition:function(){this.option("fullScreen")?this._container().css({top:0,left:0}):this.callBase.apply(this,arguments)},_setContentHeight:function(){var t;if(this._$content){var n=this._$container.height(),i=this.option("cancelButton")||this.option("doneButton")||this.option("clearButton"),r=this._$wrapper.find(".dx-popup-bottom");this._$title&&(n-=this._$title.outerHeight(!0)||0),i&&(t=r.outerHeight(!0)||0,n-=t,this._$content.css("margin-bottom",t)),this.option("height")==="auto"?this._$content.css("height","auto"):n>0&&this._$content.css("height",n)}},_optionChanged:function(n,t){switch(n){case"showTitle":case"title":this._renderTitle(),this._renderCloseButton(),this._setContentHeight();break;case"cancelButton":this._renderCancelButton();break;case"clearButton":this._renderClearButton();break;case"doneButton":this._renderDoneButton();break;case"closeButton":this._renderCloseButton();break;case"fullScreen":this._container().toggleClass(e,t),this._refresh();break;default:this.callBase.apply(this,arguments)}},content:function(){return this._$content}}))}(jQuery,DevExpress),function(n,t){var r=t.ui,u=t.fx,f="dx-popover",e="dx-popover-wrapper",o="dx-popover-arrow",s="dx-popover-arrow-flipped",h="dx-popover-without-title",c="dx-tooltip";r.registerComponent("dxPopover",r.dxPopup.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{target:window,shading:!1,position:{my:"top center",at:"bottom center",collision:"flip flip"},closeOnOutsideClick:n.proxy(this._isOutsideClick,this),animation:{show:{type:"fade",from:0,to:1},hide:{type:"fade",to:0}},showTitle:!1,width:"auto",height:"auto",isTooltip:!1,closeOnTargetScroll:!0})},_render:function(){this._$arrow=n("<div>").addClass(o),this._wrapper().addClass(e),this.option("isTooltip")&&this._wrapper().addClass(c),this.callBase(),this._element().addClass(f),this._renderTarget()},_renderContentImpl:function(){this.callBase(),this._$arrow.appendTo(this._wrapper())},_renderGeometryImpl:function(){this.callBase.apply(this,arguments),this._updateContentSize()},_updateContentSize:function(){var i,t,u,f,r;this._$content&&(i=n(this.option("target")),t=0,typeof i.offset()!="undefined"&&(t=i.offset().top),u=this._$container.outerHeight()-this._$content.height(),f=n(window).height()-t-i.outerHeight(),r=f>t?f-this._$arrow.height()-u:t-this._$arrow.height()-u,this._$content.height()>r&&this._$content.height(+r))},_isOutsideClick:function(t){return!n(t.target).closest(this.option("target")).length},_animate:function(i){this.callBase.apply(this,arguments),i&&t.fx.animate(this._$arrow,n.extend({},i,{complete:n.noop}))},_stopAnimation:function(){this.callBase.apply(this,arguments),u.stop(this._$arrow)},_renderTitle:function(){this._wrapper().toggleClass(h,!this.option("showTitle")),this.callBase()},_renderTarget:function(){this.option("position.of",this.option("target"))},_positionAlias:null,_setPositionAlias:function(){this._positionAlias=this.option("position").at.split(" ")[0]},_renderPosition:function(){var f;this._setPositionAlias(),this._$wrapper.addClass("dx-position-"+this._positionAlias),t.translator.move(this._$arrow,{left:0,top:0}),t.translator.move(this._$container,{left:0,top:0}),this._updateContentSize();var i=n.extend({},this.option("position")),o=n.extend({},i,{offset:this._$arrow.width()+" "+this._$arrow.height()}),e=t.calculatePosition(this._$container,o),r=e.v.flip,u=e.h.flip;this._$arrow.toggleClass(s,r||u),(r||u)&&n.extend(i,{my:i.at,at:i.my}),t.position(this._$arrow,i),f={my:i.my,at:i.at,of:this._$arrow,collision:"fit"},f.offset=this._updateContentOffset(r,u),t.position(this._$container,f)},_updateContentOffset:function(n,t){var i=this._positionAlias,r=i==="top"&&!n||i==="bottom"&&n,u=i==="bottom"&&!n||i==="top"&&n,f=i==="left"&&!t||i==="right"&&t,e=i==="right"&&!t||i==="left"&&t;return r?"0 1":u?"0 -1":f?"1 0":e?"-1 0":void 0},_optionChanged:function(n,t){switch(n){case"isTooltip":this._invalidate();break;case"target":this._renderTarget();break;case"fullScreen":t&&this.option("fullScreen",!1);break;default:this.callBase.apply(this,arguments)}}}))}(jQuery,DevExpress),function(n,t,i){var e=t.ui,w=e.events,b=t.support,s=Globalize,g="dx-datebox",nt="dx-datepicker",tt="dx-datepicker-wrapper",it="dx-datepicker-rollers",rt="dx-datepicker-roller",ut="dx-state-active",ft="dx-datepicker-roller-current",a="dx-datepicker-item",et="dx-datepicker-item-selected",ot="dx-datepicker-item-selected-frame",st="dx-datepicker-button-up",ht="dx-datepicker-button-down",ct="dx-datepicker-formatter-container",lt="dx-datepicker-value-formatter",at="dx-datepicker-name-formatter",vt=["date","time","datetime"],yt=function(n){return n},k=function(t,i){var r=n("<div />").addClass(ct);return n("<span>").text(t).addClass(lt).appendTo(r),n("<span>").text(i).addClass(at).appendTo(r),r},o="year",h="month",u="day",c="hours",l="minutes",v="seconds",d="milliseconds",pt=31536e7,r={},f,y;r[o]={getter:"getFullYear",setter:"setFullYear",possibleFormats:["yy","yyyy"],formatter:yt,startValue:i,endValue:i},r[u]={getter:"getDate",setter:"setDate",possibleFormats:["d","dd"],formatter:function(n,t,i){if(!t)return n;var r=new Date(i.getTime());return r.setDate(n),k(n,s.culture().calendar.days.names[r.getDay()])},startValue:1,endValue:i},r[h]={getter:"getMonth",setter:"setMonth",possibleFormats:["M","MM","MMM","MMMM"],formatter:function(n,t){var i=s.culture().calendar.months.names[n];return t?k(n+1,i):i},startValue:0,endValue:11},r[c]={getter:"getHours",setter:"setHours",possibleFormats:["H","HH","h","hh"],formatter:function(n){return s.format(new Date(0,0,0,n),"HH")},startValue:0,endValue:23},r[l]={getter:"getMinutes",setter:"setMinutes",possibleFormats:["m","mm"],formatter:function(n){return s.format(new Date(0,0,0,0,n),"mm")},startValue:0,endValue:59},r[v]={getter:"getSeconds",setter:"setSeconds",possibleFormats:["s","ss"],formatter:function(n){return s.format(new Date(0,0,0,0,0,n),"ss")},startValue:0,endValue:59},r[d]={getter:"getMilliseconds",setter:"setMilliseconds",possibleFormats:["f","ff","fff"],formatter:function(n){return s.format(new Date(0,0,0,0,0,0,n),"fff")},startValue:0,endValue:999},f={date:{standardPattern:"yyyy-MM-dd",components:[o,u,h]},time:{standardPattern:"HH:mm",components:[c,l]},datetime:{standardPattern:"yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'",components:[o,u,h,c,l,v,d]},"datetime-local":{standardPattern:"yyyy'-'MM'-'dd'T'HH':'mm",components:[o,h,u,c,l,v]}},y=function(n,t){return Globalize.format(n,f[t].standardPattern)},function(){var t="yyyy'-'MM'-'dd'T'HH':'mm'Z'",i=n("<input />").attr("type","datetime");i.val(y(new Date,"datetime",t)),i.val()||(f.datetime.standardPattern=t)}();var wt=function(n){return Globalize.parseDate(n,f.datetime.standardPattern)||Globalize.parseDate(n,f["datetime-local"].standardPattern)||Globalize.parseDate(n,f.time.standardPattern)||Globalize.parseDate(n,f.date.standardPattern)},p=function(n,t){return new Date(n,t+1,0).getDate()},bt=function(t,u,e){if(!u)return i;isNaN(t.getTime())&&(t=new Date(0,0,0,0,0,0));var o=f[e];return n.each(o.components,function(){var n=r[this];t[n.setter](u[n.getter]())}),t};e.registerComponent("dxDatePickerRoller",e.dxScrollable.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{clickableItems:!1,showScrollbar:!1,useNative:!1,selectedIndex:0,items:[]})},_init:function(){this.callBase(),this._renderSelectedItemFrame(),this._renderControlButtons()},_render:function(){this.callBase(),this._element().addClass(rt),this._renderItems(),this._renderSelectedValue(),this._renderItemsClick(),this._wrapAction("_endAction",n.proxy(this._handleEndAction,this))},_wrapAction:function(n,t){var i=this._strategy,r=i[n];i[n]=function(){return t.apply(this,arguments),r.apply(this,arguments)}},_renderItems:function(){var i=this.option("items")||[],t=n();this._$content.empty(),n.each(i,function(){t=t.add(n("<div>").addClass(a).append(this))}),this._$content.append(t),this._$items=t,this.update()},_renderSelectedItemFrame:function(){n("<div>").addClass(ot).insertAfter(this._$container)},_renderControlButtons:function(){n("<div>").addClass(st).insertAfter(this._$container).dxButton({clickAction:n.proxy(this._handleUpButtonClick,this)}),n("<div>").addClass(ht).insertAfter(this._$container).dxButton({clickAction:n.proxy(this._handleDownButtonClick,this)})},_renderSelectedValue:function(n){n===i&&(n=this.option("selectedIndex")),n=this._fitIndex(n);var t=this._getItemPosition(n);this.option().selectedIndex=n,this._moveTo({y:t}),this._renderActiveStateItem()},_fitIndex:function(n){var i=this.option("items")||[],t=i.length;return n>=t?t-1:n<0?0:n},_renderItemsClick:function(){var t="."+a,i=w.addNamespace("dxclick",this.NAME);if(this._element().off(i,t),this.option("clickableItems"))this._element().on(i,t,n.proxy(this._handleItemClick,this))},_handleItemClick:function(n){this._renderSelectedValue(this._itemElementIndex(this._closestItemElement(n)))},_itemElementIndex:function(n){return this._itemElements().index(n)},_closestItemElement:function(n){return n.currentTarget},_itemElements:function(){return this._element().find("."+a)},_renderActiveStateItem:function(){var t=this.option("selectedIndex");n.each(this._$items,function(i){n(this).toggleClass(et,t===i)})},_handleUpButtonClick:function(){this._animation=!0,this.option("selectedIndex",this.option("selectedIndex")-1)},_handleDownButtonClick:function(){this._animation=!0,this.option("selectedIndex",this.option("selectedIndex")+1)},_getItemPosition:function(n){return this._itemHeight()*n},_moveTo:function(i){i=this._normalizeLocation(i);var f=this._location(),r,u={x:-(f.left-i.x),y:-(f.top-i.y)};this._isVisible()&&(u.x||u.y)&&(this._strategy._prepareDirections(!0),this._animation?(r=t.fx.animate(this._$content,{duration:200,type:"slide",to:{top:i.y}}),delete this._animation):(r=n.Deferred().resolve().promise(),this._strategy._handleMove(u)),r.done(n.proxy(function(){this._strategy.update(),this._strategy._handleMoveEnd({x:0,y:0})},this)))},_handleEndAction:function(){var n=-this._location().top/this._itemHeight(),t=Math.round(n);this._animation=!0,this._renderSelectedValue(t)},_itemHeight:function(){var n=this._$items.first();return n.outerHeight()+parseFloat(n.css("margin-top")||0)},_toggleActive:function(n){this._element().toggleClass(ut,n)},_isVisible:function(){return this._$container.is(":visible")},_optionChanged:function(n){switch(n){case"selectedIndex":this._renderSelectedValue();break;case"items":this._renderItems(),this._renderSelectedValue();break;case"clickableItems":this._renderItemsClick();break;default:this.callBase.apply(this,arguments)}}})),e.registerComponent("dxDatePicker",e.dxPopup.inherit({_valueOption:function(){return new Date(this.option("value"))=="Invalid Date"?new Date:new Date(this.option("value"))},_defaultOptions:function(){return n.extend(this.callBase(),{minDate:new Date(1),maxDate:new Date(n.now()+pt),format:"date",value:new Date,culture:Globalize.culture().name,showNames:!1,cancelButton:{text:"Cancel",icon:"close",clickAction:n.proxy(function(){this._value=this._valueOption()},this)},doneButton:{text:"Done",icon:"save",clickAction:n.proxy(function(){this.option("value",new Date(this._value)),this.hide()},this)}})},_render:function(){this.callBase(),this._element().addClass(nt),this._wrapper().addClass(tt),this._value=this._valueOption()},_renderContentImpl:function(){this.callBase(),this._value=this._valueOption(),this._renderRollers()},_renderRollers:function(){var t=this;t._$rollersContainer||(t._$rollersContainer=n("<div>").appendTo(t.content()).addClass(it)),t._$rollersContainer.empty(),t._createRollerConfigs(),t._rollers={},n.each(t._rollerConfigs,function(){var i=this,r=n("<div>").appendTo(t._$rollersContainer).dxDatePickerRoller({items:i.displayItems,selectedIndex:i.selectedIndex,showScrollbar:!1,startAction:function(n){var r=n.component;r._toggleActive(!0),t._setActiveRoller(i,r.option("selectedIndex"))},endAction:function(n){var r=n.component;t._setRollerState(i,r.option("selectedIndex")),r._toggleActive(!1)}});t._rollers[i.type]=r.dxDatePickerRoller("instance")})},_setActiveRoller:function(t){var i=this._rollers[t.type];n.each(this._rollers,function(){this._$element.toggleClass(ft,this===i)})},_refreshRollers:function(){var t=this;n.each(this._rollers,function(n){var i=t._rollerConfigs[n].getIndex(t._value);this.update(),this._renderSelectedValue(i)})},_setRollerState:function(n,t){var f,e;if(t!==n.selectedIndex){var r=n.valueItems[t],s=n.setValue,i=this._value.getDate();n.type===h?(i=Math.min(i,p(this._value.getFullYear(),r)),this._value.setDate(i)):n.type===o&&(i=Math.min(i,p(r,this._value.getMonth())),this._value.setDate(i)),this._value[s](r),n.selectedIndex=t}f=this._rollers[u],(n.type===h||n.type===o)&&f&&(this._createRollerConfig(u),e=this._rollerConfigs[u],window.setTimeout(function(){f.option("items",e.displayItems)},100))},_createRollerConfigs:function(t){var i=this;t=t||i.option("format"),i._rollerConfigs={},n.each(i._getFormatPattern(t).split(/\W+/),function(t,u){n.each(r,function(t,r){n.inArray(u,r.possibleFormats)>-1&&i._createRollerConfig(t)})})},_getFormatPattern:function(n){var t=Globalize.culture(this.option("culture")),i="";return n==="date"?i=t.calendar.patterns.d:n==="time"?i=t.calendar.patterns.t:n==="datetime"&&(i=[t.calendar.patterns.d,t.calendar.patterns.t].join(" ")),i},_createRollerConfig:function(n){var i=r[n],e=i.startValue,s=i.endValue,h=i.formatter,c=this.option("showNames"),t,f;for(n===o&&(e=this.option("minDate").getFullYear(),s=this.option("maxDate").getFullYear()),n===u&&(s=p(this._value.getFullYear(),this._value.getMonth())),t={type:n,setValue:i.setter,valueItems:[],displayItems:[],getIndex:function(n){return n[i.getter]()-e}},f=e;f<=s;f++)t.valueItems.push(f),t.displayItems.push(h(f,c,this._value));t.selectedIndex=t.getIndex(this._value),this._rollerConfigs[n]=t},_optionChanged:function(n,t,i){switch(n){case"showNames":case"minDate":case"maxDate":case"culture":case"format":this._renderRollers();break;case"visible":this.callBase(n,t,i),t&&this._refreshRollers();break;case"value":this._value=this._valueOption(),this._renderRollers();break;default:this.callBase(n,t,i)}}})),e.registerComponent("dxDateBox",e.dxEditBox.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{format:"date",value:new Date,useNativePicker:!0})},_init:function(){this.callBase(),this._initFormat()},_render:function(){this.callBase(),this._element().addClass(g),this._renderDatePicker()},_renderDatePicker:function(){var t,i;if(this._usingNativeDatePicker()||this.option("readOnly")){this._datePicker&&(this._datePicker._element().remove(),this._datePicker=null);return}if(t={value:this.option("value"),format:this.option("format")},this._datePicker)this._datePicker.option(t);else{this._datePicker=n("<div>").appendTo(this._element()).dxDatePicker(n.extend(t,{hidingAction:n.proxy(function(n){this.option("value",n.component.option("value"))},this)})).dxDatePicker("instance"),i=this._createAction(function(n){n.component._datePicker.show()});this._input().on(w.addNamespace("dxclick",this.NAME),function(n){return i({jQuery:n})})}},_initFormat:function(){var t=this.option("format");n.inArray(t,vt)===-1?(t="date",this.option("format",t)):t!=="datetime"||b.inputType(t)||(t="datetime-local"),this.option("mode",t)},_usingNativeDatePicker:function(){return b.inputType(this.option("mode"))||this.option("useNativePicker")},_readOnlyPropValue:function(){return this._usingNativeDatePicker()?this.callBase():!0},_handleValueChange:function(){var i=wt(this._input().val()),n=new Date(this.option("value")&&this.option("value").valueOf()),t=bt(n,i,this.option("mode"));this.option({value:t}),t!==n&&this._renderValue()},_renderValue:function(){this._input().val(y(this.option("value"),this.option("mode")))},_renderProps:function(){this.callBase(),this._input().attr("autocomplete","off")},_optionChanged:function(n,t,i){switch(n){case"value":this._renderValue(),this._changeAction(t),this._renderDatePicker();break;case"format":this._initFormat(),this._renderValue(),this._renderDatePicker();break;case"readOnly":case"useNativePicker":this._invalidate();break;default:this.callBase(n,t,i)}}}))}(jQuery,DevExpress),function(n,t){var u=t.ui,r="dx-loadindicator",h=r+"-wrapper",c=r+"-icon",f=r+"-segment",e=r+"-segment",l=r+"-win8-segment",a=r+"-win8-segment",v=r+"-win8-inner-segment",o=r+"-image",s=["small","medium","large"];u.registerComponent("dxLoadIndicator",u.Widget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{disabled:!1,visible:!0,size:""})},_render:function(){this.callBase(),this._element().addClass(r),this._clearSizes(),this._setSize(),t.support.animation&&!this.option("viaImage")?this._renderMarkupForAnimation():this._renderMarkupForImage()},_renderMarkupForAnimation:function(){var i=n("<div>").addClass(c),t;for(i.append(n("<div>").addClass(f).addClass(e+"0")),t=15;t>0;--t)i.append(n("<div>").addClass(f).addClass(e+t));for(t=1;t<=5;++t)i.append(n("<div>").addClass(l).addClass(a+t).append(n("<div>").addClass(v)));n("<div>").addClass(h).append(i).appendTo(this._element())},_renderMarkupForImage:function(){var n=this.option("size");n==="small"||n==="large"?this._element().addClass(o+"-"+n):this._element().addClass(o)},_clearSizes:function(){var t=this;n.each(s,function(n,i){t._element().removeClass(r+"-"+i)})},_setSize:function(){var t=this.option("size");t&&n.inArray(t,s)!==-1&&this._element().addClass(r+"-"+t)},_optionChanged:function(n){switch(n){case"size":this._clearSizes(),this._setSize();break;default:this.callBase.apply(this,arguments)}}}))}(jQuery,DevExpress),function(n,t){var u=t.ui,r="dx-loadpanel",s=r+"-wrapper",f=r+"-indicator",e=r+"-message",o=r+"-content",h=o+"-wrapper",c=r+"-pane-hidden";u.registerComponent("dxLoadPanel",u.dxOverlay.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{message:Globalize.localize("Loading"),width:200,height:70,animation:null,disabled:!1,showIndicator:!0,showPane:!0})},_render:function(){this._$contentWrapper=n("<div>").addClass(h).appendTo(this.content()),this.callBase(),this._element().addClass(r),this._wrapper().addClass(s)},_renderContentImpl:function(){this.callBase(),this.content().addClass(o),this._togglePaneVisible(),this._cleanPreviousContent(),this._renderLoadIndicator(),this._renderMessage()},_renderMessage:function(){var t=this.option("message"),i;t&&(i=n("<div>").addClass(e).text(t),this._$contentWrapper.append(i))},_renderLoadIndicator:function(){if(this.option("showIndicator")){var t=n("<div>").addClass(f);this._$contentWrapper.append(t),t.dxLoadIndicator()}},_cleanPreviousContent:function(){this.content().find("."+e).remove(),this.content().find("."+f).remove()},_togglePaneVisible:function(){this.content().toggleClass(c,!this.option("showPane"))},_optionChanged:function(n){switch(n){case"message":case"showIndicator":this._cleanPreviousContent(),this._renderLoadIndicator(),this._renderMessage();break;case"showPane":this._togglePaneVisible();break;default:this.callBase.apply(this,arguments)}},_defaultBackButtonHandler:n.noop}))}(jQuery,DevExpress),function(n,t,i){var u=t.ui,c=t.utils,o=u.events,r="dx-lookup",f=r+"-selected",l=r+"-search",a=r+"-search-wrapper",v=r+"-field",e=r+"-popup",y=e+"-wrapper",s=e+"-search",p=r+"-popover-mode",w=r+"-empty",h=".dx-list-item",b="dxListItemData",k=200;u.registerComponent("dxLookup",u.ContainerWidget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{items:[],dataSource:null,value:i,displayValue:i,title:"",valueExpr:null,displayExpr:"this",placeholder:Globalize.localize("Select"),searchPlaceholder:Globalize.localize("Search"),searchEnabled:!0,noDataText:Globalize.localize("dxCollectionContainerWidget-noDataText"),searchTimeout:1e3,minFilterLength:0,fullScreen:!1,valueChangeAction:null,itemTemplate:null,itemRender:null,showCancelButton:!0,cancelButtonText:Globalize.localize("Cancel"),showClearButton:!1,clearButtonText:Globalize.localize("Clear"),showDoneButton:!1,doneButtonText:Globalize.localize("Done"),contentReadyAction:null,shownAction:null,hiddenAction:null,popupWidth:function(){return n(window).width()*.8},popupHeight:function(){return n(window).height()*.8},animation:{show:{type:"fade",from:0,to:1},hide:{type:"fade",from:1,to:0}},usePopover:!1})},_optionsByReference:function(){return n.extend(this.callBase(),{value:!0})},_init:function(){this.callBase(),this._initDataSource(),this._searchTimer=null,this._compileValueGetter(),this._compileDisplayGetter(),this._createEventActions(),this._dataSource||this._itemsToDataSource()},_compileValueGetter:function(){this._valueGetter=t.data.utils.compileGetter(this._valueGetterExpr())},_valueGetterExpr:function(){return this.option("valueExpr")||this._dataSource&&this._dataSource._store._key||"this"},_compileDisplayGetter:function(){this._displayGetter=t.data.utils.compileGetter(this.option("displayExpr"))},_createEventActions:function(){this._valueChangeAction=this._createActionByOption("valueChangeAction")},_itemsToDataSource:function(){this._dataSource=new DevExpress.data.DataSource(this.option("items"))},_render:function(){this.callBase(),this._element().addClass(r).toggleClass(p,this.option("usePopover")),this._renderField(),this._needRenderContent=!0,this._calcSelectedItem(n.proxy(this._setFieldText,this))},_renderContent:n.noop,_renderField:function(){var t=this._createAction(this._handleFieldClick);this._$field=n("<div>").addClass(v).appendTo(this._element()).on(o.addNamespace("dxclick",this.NAME),function(n){t({jQueryEvent:n})})},_handleFieldClick:function(n){var t=n.component;t._renderContentIfNeed(),t._setListDataSource(),t._refreshSelected(),t._popup.show(),t._lastSelectedItem=t._selectedItem},_renderContentIfNeed:function(){this._needRenderContent&&(this._renderPopup(),this._needRenderContent=!1)},_renderPopup:function(){var t=n("<div>").addClass(e).appendTo(this._element()),i={title:this.option("title"),contentReadyAction:n.proxy(this._popupContentReadyAction,this),width:this.option("popupWidth"),height:this.option("popupHeight"),cancelButton:this._getCancelButtonConfig(),doneButton:this._getDoneButtonConfig(),clearButton:this._getClearButtonConfig(),shownAction:this._createActionByOption("shownAction"),hiddenAction:this._createActionByOption("hiddenAction")};this._popup=this.option("usePopover")&&!this.option("fullScreen")?this._createPopover(t,i):this._createPopup(t,i),this._popup._wrapper().addClass(y).toggleClass(s,this.option("searchEnabled"))},_createPopover:function(t,i){return t.dxPopover(n.extend(i,{showTitle:!0,target:this._element(),animation:this.option("animation")})).dxPopover("instance")},_createPopup:function(t,i){return t.dxPopup(n.extend(i,{fullScreen:this.option("fullScreen"),shading:!this.option("fullScreen"),animation:this.option("animation")})).dxPopup("instance")},_getCancelButtonConfig:function(){return this.option("showCancelButton")?{text:this.option("cancelButtonText")}:null},_getDoneButtonConfig:function(){return this.option("showDoneButton")?{text:this.option("doneButtonText"),clickAction:n.proxy(function(){this.option("value",this._valueGetter(this._lastSelectedItem))},this)}:null},_getClearButtonConfig:function(){return this.option("showClearButton")?{text:this.option("clearButtonText"),clickAction:n.proxy(function(){this.option("value",i)},this)}:null},_renderCancelButton:function(){this._popup&&this._popup.option("cancelButton",this._getCancelButtonConfig())},_renderDoneButton:function(){this._popup&&this._popup.option("doneButton",this._getDoneButtonConfig())},_renderClearButton:function(){this._popup&&this._popup.option("clearButton",this._getClearButtonConfig())},_popupContentReadyAction:function(){this._renderSearch(),this._renderList()},_renderSearch:function(){this._$search=n("<div>").addClass(l).dxTextBox({mode:"search",placeholder:this._getSearchPlaceholder(),valueUpdateEvent:"change input",valueUpdateAction:n.proxy(this._searchChangedHandler,this)}).appendTo(this._popup.content()).wrap(n("<div>").addClass(a).toggle(this.option("searchEnabled"))),this._search=this._$search.dxTextBox("instance")},_getSearchPlaceholder:function(){var n=this.option("minFilterLength"),t=this.option("searchPlaceholder");return n&&t===Globalize.localize("Search")?c.stringFormat(Globalize.localize("dxLookup-searchPlaceholder"),n):t},_renderList:function(){this._list=n("<div>").appendTo(this._popup.content()).dxList({dataSource:null,itemClickAction:n.proxy(function(n){this._toggleSelectedClass(n.jQueryEvent),this._updateOptions(n)},this),itemRenderedAction:n.proxy(function(n){this._setSelectedClass(n.itemElement,n.itemData)},this),itemRender:this._getItemRender(),itemTemplate:this.option("itemTemplate"),noDataText:this.option("noDataText")}).data("dxList"),this._list.addExternalTemplate(this._templates),this._needSetItemRenderToList&&(this._updateListItemRender(),this._needSetItemRenderToList=!1),this._setListDataSource(),this._list.option("contentReadyAction",this.option("contentReadyAction")),this._list._fireContentReadyAction()},_setListDataSource:function(n){if(this._list){var t=this._search.option("value").length>=this.option("minFilterLength"),r=!!this._list.option("dataSource"),u=t===r;(n||!u)&&(this._list.option("dataSource",t?this._dataSource:null),t||this._list.option("items",i))}},_refreshSelected:function(){var t=this;t._list&&n.each(this._list._element().find(h),function(){var i=n(this);t._setSelectedClass(i,i.data(b))})},_calcSelectedItem:function(n){function o(t){s._selectedItem=t,n()}var e=this._dataSource,r,u,s=this,f=this.option("value");if(!e||f===i){this._selectedItem=i,n();return}r=e.store(),u=this._valueGetterExpr(),u===r.key()||r instanceof t.data.CustomStore?r.byKey(f).done(o):r.load({filter:[u,f]}).done(function(n){o(n[0])})},_setFieldText:function(n){arguments.length||(n=this._getDisplayText()),this._$field.text(n),this.option("displayValue",n),this._toggleEmptyClass()},_getDisplayText:function(){return this.option("value")===i||!this._dataSource?this.option("placeholder"):this._displayGetter(this._selectedItem)||this.option("placeholder")},_searchChangedHandler:function(){if(this._search){var t=this._search.option("value"),i=t.length>=this.option("minFilterLength");if(clearTimeout(this._searchTimer),this._search.option("placeholder",this._getSearchPlaceholder()),!i){this._setListDataSource();return}this.option("searchTimeout")?this._searchTimer=setTimeout(n.proxy(this._doSearch,this,t),this.option("searchTimeout")):this._doSearch(t)}},_doSearch:function(n){this._dataSource&&(arguments.length||(n=this.option("searchEnabled")?this._search.option("value"):""),this._filterStore(n),this._dataSource.items().length&&this._setListDataSource())},_filterStore:function(n){this._dataSource.searchExpr()||this._dataSource.searchExpr(this.option("displayExpr")),this._dataSource.searchValue(n),this._dataSource.pageIndex(0),this._dataSource.load()},_updateOptions:function(n){this._lastSelectedItem===n.itemData&&this._updateAndHidePopup(),this._lastSelectedItem=n.itemData,this.option("showDoneButton")||this._updateAndHidePopup()},_setSelectedClass:function(n,t){var i=this._optionValuesEqual("value",this._valueGetter(t),this.option("value"));n.toggleClass(f,i)},_getItemRender:function(){if(!this.option("itemTemplate"))return this.option("itemRender")||n.proxy(this._displayGetter,this)},_toggleSelectedClass:function(t){var i=this._list._element().find("."+f);i.length&&i.removeClass(f),n(t.target).closest(h).addClass(f)},_toggleEmptyClass:function(){var n=!this._selectedItem;this._element().toggleClass(w,n)},_hidePopup:function(){this._popup.hide()},_updateAndHidePopup:function(){this.option("value",this._valueGetter(this._lastSelectedItem)),clearTimeout(this._hidePopupTimer),this._hidePopupTimer=setTimeout(n.proxy(this._hidePopup,this),k),this._setFieldText(this._displayGetter(this._lastSelectedItem))},_updateListItemRender:function(){this._list?this._list.option("itemRender",this._getItemRender()):this._needSetItemRenderToList=!0},_updateListItemTemplate:function(){this._list&&this._list.option("itemTemplate",this.option("itemTemplate"))},_handleDataSourceChanged:function(){this._calcSelectedItem(n.proxy(this._setFieldText,this))},_clean:function(){this._popup&&this._popup._element().remove(),this._$field&&this._$field.remove(),this.callBase()},_dispose:function(){clearTimeout(this._searchTimer),clearTimeout(this._hidePopupTimer),n(window).off(o.addNamespace("popstate",this.NAME)),this.callBase()},_changeListOption:function(n,t){this._list&&this._list.option(n,t)},_optionChanged:function(t,i){switch(t){case"valueExpr":case"value":this._calcSelectedItem(n.proxy(function(){t==="value"&&this._valueChangeAction({selectedItem:this._selectedItem}),this._compileValueGetter(),this._compileDisplayGetter(),this._refreshSelected(),this._setFieldText()},this));break;case"displayExpr":this._compileDisplayGetter(),this._updateListItemRender(),this._refreshSelected(),this._setFieldText();break;case"displayValue":break;case"itemRender":this._updateListItemRender();case"itemTemplate":this._updateListItemTemplate();break;case"items":case"dataSource":t==="items"?this._itemsToDataSource():this._initDataSource(),this._setListDataSource(!0),this._compileValueGetter(),this._calcSelectedItem(n.proxy(this._setFieldText,this));break;case"searchEnabled":this._$search&&this._$search.toggle(i),this._popup&&this._popup._wrapper().toggleClass(s,i);break;case"minFilterLength":this._setListDataSource(),this._setFieldText(),this._searchChangedHandler();break;case"placeholder":this._setFieldText();break;case"searchPlaceholder":this._$search&&this._$search.dxTextBox("instance").option("placeholder",i);break;case"shownAction":case"hiddenAction":case"animation":this._renderPopup();break;case"title":case"fullScreen":this._popup&&(this.option("usePopover")?this._renderPopup():this._popup.option(t,i));break;case"valueChangeAction":this._createEventActions();break;case"clearButtonText":case"showClearButton":this._renderClearButton();break;case"cancelButtonText":case"showCancelButton":this._renderCancelButton();break;case"doneButtonText":case"showDoneButton":this._renderDoneButton();break;case"contentReadyAction":this._changeListOption("contentReadyAction",i);break;case"popupWidth":this._popup&&this._popup.option("width",i);break;case"popupHeight":this._popup&&this._popup.option("height",i);break;case"usePopover":this._invalidate();break;case"noDataText":this._changeListOption("noDataText",this.option("noDataText"));break;case"searchTimeout":break;default:this.callBase.apply(this,arguments)}}}).include(u.DataHelperMixin))}(jQuery,DevExpress),function(n,t){var r=t.ui,u="dx-action-sheet",f="dx-action-sheet-container",e="dx-action-sheet-popup-wrapper",o="dx-action-sheet-popover-wrapper",s="dx-action-sheet-cancel",h="dx-action-sheet-item",c="dxActionSheetItemData",l="dx-action-sheet-without-title";r.registerComponent("dxActionSheet",r.CollectionContainerWidget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{usePopover:!1,target:null,title:"",showTitle:!0,showCancelButton:!0,cancelText:Globalize.localize("Cancel"),cancelClickAction:null,noDataText:"",visible:!1})},_itemContainer:function(){return this._$itemContainer},_itemClass:function(){return h},_itemDataKey:function(){return c},_toggleVisibility:n.noop,_renderDimensions:n.noop,_render:function(){this._element().addClass(u),this._createItemContainer(),this._renderPopup(),this._renderClick()},_createItemContainer:function(){this._$itemContainer=n("<div>").addClass(f),this._renderDisabled()},_renderClick:function(){this._popup.option("clickAction",this.option("clickAction"))},_renderDisabled:function(){this._$itemContainer.toggleClass("dx-state-disabled",this.option("disabled"))},_renderPopup:function(){this._$popup=n("<div>").appendTo(this._element()),this._popup=this._isPopoverMode()?this._createPopover():this._createPopup(),n.extend(this._popup._templates,this._templates),this._renderPopupTitle(),this._mapPopupOption("visible")},_mapPopupOption:function(n){this._popup.option(n,this.option(n))},_isPopoverMode:function(){return this.option("usePopover")&&this.option("target")},_renderPopupTitle:function(){this._mapPopupOption("showTitle"),this._popup._wrapper().toggleClass(l,!this.option("showTitle"))},_clean:function(){this._$popup&&this._$popup.remove(),this.callBase()},_createPopover:function(){var t=this._$popup.dxPopover({showTitle:!0,title:this.option("title"),width:this.option("width")||200,height:this.option("height")||"auto",target:this.option("target"),hiddenAction:n.proxy(this.hide,this),contentReadyAction:n.proxy(this._popupContentReadyAction,this)}).dxPopover("instance");return t._wrapper().addClass(o),t},_createPopup:function(){var t=this._$popup.dxPopup({title:this.option("title"),width:this.option("width")||"100%",height:this.option("height")||"auto",contentReadyAction:n.proxy(this._popupContentReadyAction,this),position:{my:"bottom",at:"bottom",of:window},animation:{show:{type:"slide",duration:400,from:{position:{my:"top",at:"bottom",of:window}},to:{position:{my:"bottom",at:"bottom",of:window}}},hide:{type:"slide",duration:400,from:{position:{my:"bottom",at:"bottom",of:window}},to:{position:{my:"top",at:"bottom",of:window}}}}}).dxPopup("instance");return t.optionChanged.add(n.proxy(function(n,t){n==="visible"&&this.option("visible",t)},this)),t._wrapper().addClass(e),t},_popupContentReadyAction:function(){this._popup.content().append(this._$itemContainer),this._attachClickEvent(),this._renderContent(),this._renderCancelButton()},_renderCancelButton:function(){if(!this._isPopoverMode()&&(this._$cancelButton&&this._$cancelButton.remove(),this.option("showCancelButton"))){var i=new t.Action(n.proxy(this.hide,this),{beforeExecute:this.option("cancelClickAction")});this._$cancelButton=n("<div>").addClass(s).appendTo(this._popup.content()).dxButton({text:this.option("cancelText"),clickAction:function(n){i.execute(n)}})}},_handleItemClick:function(t){this.callBase(t),n(t.target).is(".dx-state-disabled, .dx-state-disabled *")||this.hide()},_itemRenderDefault:function(n,t,i){i.dxButton(n)},_optionChanged:function(n){switch(n){case"width":case"height":case"visible":case"title":this._mapPopupOption(n);break;case"disabled":this._renderDisabled();break;case"showTitle":this._renderPopupTitle();break;case"showCancelButton":case"cancelClickAction":case"cancelText":this._renderCancelButton();break;case"target":case"usePopover":case"items":this._invalidate();break;default:this.callBase.apply(this,arguments)}},toggle:function(t){var i=this,r=n.Deferred();return i._popup.toggle(t).done(function(){i.option("visible",t),r.resolveWith(i)}),r.promise()},show:function(){return this.toggle(!0)},hide:function(){return this.toggle(!1)}}))}(jQuery,DevExpress),function(n,t,i){var u=t.ui,f=t.utils,e=40,o=38,c=13,l=27,a=39,s=9,h="dx-autocomplete",v=h+"-popup-wrapper",r="dx-autocomplete-selected",y="."+r,p=".dx-list",w=".dx-editbox-input",b=".dx-list-item",k="dxListItemData",d=["startswith","contains","endwith","notcontains"];u.registerComponent("dxAutocomplete",u.ContainerWidget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{value:"",items:[],dataSource:null,itemTemplate:null,itemRender:null,minSearchLength:1,searchTimeout:0,placeholder:"",filterOperator:"contains",displayExpr:"this",valueUpdateAction:null,valueUpdateEvent:"change",maxLength:null})},_listElement:function(){return this._popup.content().find(p)},_listItemElement:function(){return this._popup.content().find(b)},_listSelectedItemElement:function(){return this._popup.content().find(y)},_inputElement:function(){return this._element().find(w)},_textboxElement:function(){return this._textbox._element()},_init:function(){this.callBase(),this._validateFilterOperator(),this._compileDisplayGetter(),this._initDataSource(),this._fillDataSourceFromItemsIfNeeded()},_fillDataSourceFromItemsIfNeeded:function(){!this.option("dataSource")&&this.option("items")&&this._itemsToDataSource()},_validateFilterOperator:function(){var i=this.option("filterOperator"),r=i.toLowerCase();if(!(n.inArray(r,d)>-1))throw Error(t.utils.stringFormat('Filter operator "{0}" is unavailable',i));},_compileDisplayGetter:function(){this._displayGetter=t.data.utils.compileGetter(this.option("displayExpr"))},_render:function(){this.callBase(),this._element().addClass(h),this._checkExceptions()},_renderDimensions:function(){this.callBase(),this._textbox&&(this._textbox.option("width",this.option("width")),this._textbox.option("height",this.option("height"))),this._popup&&this._popup.option("width",this._textboxElement().width())},_renderContentImpl:function(){this._renderTextbox(),this._renderPopup(),this._renderValueUpdateEvent()},_renderTextbox:function(){this._textbox=n("<div>").dxTextBox({width:this.option("width"),height:this.option("height"),value:this.option("value"),placeholder:this.option("placeholder"),disabled:this.option("disabled"),maxLength:this.option("maxLength"),keyDownAction:n.proxy(this._handleTextboxKeyDown,this),keyUpAction:n.proxy(this._handleTextboxKeyUp,this),valueUpdateAction:n.proxy(this._updateValue,this),focusOutAction:n.proxy(function(){this._popup.hide()},this)}).appendTo(this._element()).data("dxTextBox"),this._caretPosition={start:0,end:0}},_renderValueUpdateEvent:function(){this._changeAction=this._createActionByOption("valueUpdateAction"),this._textboxOptionChange("valueUpdateEvent",this._getValueUpdateEvent())},_getValueUpdateEvent:function(){var n=this.option("valueUpdateEvent");return this._hasUpdateEvent("keyup")||(n+=" keyup"),this._hasUpdateEvent("change")||(n+=" change"),n},_hasUpdateEvent:function(n){return n&&this.option("valueUpdateEvent").indexOf(n)!==-1},_handleTextboxKeyDown:function(t){var i=this._listElement(),r=[s,o,e],u=t.jQueryEvent.which;i.is(":hidden")||n.inArray(u,r)>-1&&t.jQueryEvent.preventDefault()},_updateValue:function(n){var t=this._inputElement(),i;this.option("value",this._textbox.option("value")),t.prop("selectionStart",this._caretPosition.start),t.prop("selectionEnd",this._caretPosition.end),i=n.jQueryEvent&&this._hasUpdateEvent(n.jQueryEvent.type),(!n.jQueryEvent||i)&&this._changeAction(this.option("value"))},_handleTextboxKeyUp:function(n){var t=n.jQueryEvent.which;this._caretPosition={start:this._inputElement().prop("selectionStart"),end:this._inputElement().prop("selectionEnd")};switch(t){case e:this._handleTextboxDownKey();break;case o:this._handleTextboxUpKey();break;case c:this._handleTextboxEnterKey();break;case a:case s:this._handleTextboxCompleteKeys();break;case l:this._handleTextboxEscKey();break;default:return}},_handleTextboxDownKey:function(){var n=this._listSelectedItemElement(),t;n.length?(t=n.next(),t.addClass(r),n.removeClass(r)):this._listItemElement().first().addClass(r)},_handleTextboxUpKey:function(){var n=this._listSelectedItemElement(),t,i=this._listElement();if(!i.is(":hidden")){if(!n.length){this._listItemElement().last().addClass(r);return}n.removeClass(r),t=n.prev(),t.length&&t.addClass(r)}},_handleTextboxEnterKey:function(){var t=this._listSelectedItemElement(),n;if(!t.length){this._popup.hide();return}n=this._selectedItemDataGetter(),this._caretPosition={start:n.length,end:n.length},this.option("value",n),this._popup.hide(),this._inputElement().blur()},_handleTextboxCompleteKeys:function(){var i=this._listElement(),n,t;i.is(":hidden")||(t=this._selectedItemDataGetter(),n=t.length?t:this._dataSource.items()[0],this._caretPosition={start:n.length,end:n.length},n=this._displayGetter(n),this.option("value",n),this._popup.hide())},_selectedItemDataGetter:function(){var n=this._listSelectedItemElement();return n.length?this._displayGetter(n.data(k)):[]},_handleTextboxEscKey:function(){this._popup.hide()},_renderPopup:function(){var u=this._textboxElement(),e=u.width(),o=this._textbox._input(),i=0,r=0;t.devices.current().win8?i=-2:(t.devices.current().platform==="desktop"||t.devices.current().tizen)&&(i=-1),t.devices.current().platform==="desktop"&&(r=-1),this._popup=n("<div>").appendTo(this._element()).dxPopup({shading:!1,closeOnOutsideClick:!1,closeOnTargetScroll:!0,showTitle:!1,width:e,showingAction:n.proxy(this._handlePopupShowing,this),deferRendering:!1,position:{my:"left top",at:"left bottom",of:o,offset:{h:r,v:i},collision:"flip"},animation:{show:{type:"pop",duration:400,from:{opacity:0,scale:1},to:{opacity:1,scale:1}},hide:{type:"fade",duration:400,from:1,to:0}}}).data("dxPopup"),this._popup._wrapper().addClass(v),this._renderList(),this._autocompleteResizeCallback=n.proxy(this._calculatePopupDimensions,this),f.windowResizeCallbacks.add(this._autocompleteResizeCallback)},_handlePopupShowing:function(){this._calculatePopupDimensions()},_calculatePopupDimensions:function(){this._calculatePopupHeight(),this._calculatePopupWidth()},_calculatePopupHeight:function(){var t=this._popup;t.option("height","auto"),this._heightApplyingTimer=setTimeout(function(){var i=t.content().height(),r=n(window).height()*.5;t.option("height",Math.min(i,r))})},_calculatePopupWidth:function(){var n=this._textboxElement(),t=n.width();this._popup.option("width",t)},_renderList:function(){this._list=n("<div>").appendTo(this._popup.content()).dxList({itemClickAction:n.proxy(this._handleListItemClick,this),itemTemplate:this.option("itemTemplate"),itemRender:this._getItemRender(),noDataText:"",showNextButton:!1,autoPagingEnabled:!1,dataSource:this._dataSource}).data("dxList"),this._list.addExternalTemplate(this._templates)},_getItemRender:function(){if(!this.option("itemTemplate"))return this.option("itemRender")||n.proxy(this._displayGetter,this)},_handleListItemClick:function(n){var t=this._displayGetter(n.itemData);this._caretPosition={start:t.length,end:t.length},this.option("value",t),this._popup.hide(),this._inputElement().blur()},_itemsToDataSource:function(){return this._dataSource=new DevExpress.data.DataSource(this.option("items"))},_filterDataSource:function(){var n=this._textbox.option("value");this._reloadDataSource(n),this._clearSearchTimer()},_reloadDataSource:function(n,t){var i=this,r=i._dataSource;r.searchExpr(i.option("displayExpr")),r.searchOperation(t||i.option("filterOperator")),r.searchValue(n),i._dataSource.pageIndex(0),i._dataSource.load().done(function(){i._refreshVisibility()})},_refreshVisibility:function(){var i=this._textbox.option("value").length>=this.option("minSearchLength"),t=this._dataSource,n=t&&t.items(),r=n.length;i&&r?n.length===1&&this._displayGetter(n[0])===this.option("value")?this._popup.hide():this._displayGetter(n[0]).length<this.option("value").length?this._popup.hide():(this._popup._refresh(),this._popup.show()):this._popup.hide()},_dispose:function(){clearTimeout(this._heightApplyingTimer),this._clearSearchTimer(),f.windowResizeCallbacks.remove(this._autocompleteResizeCallback),this.callBase()},_textboxOptionChange:function(n,t){this._textbox.option(n,t)},_optionChanged:function(n,t){switch(n){case"disabled":this.callBase(n,t),this._textboxOptionChange(n,t);break;case"value":this._checkExceptions(),this._textboxOptionChange(n,t),this._applyFilter();break;case"maxLength":case"placeholder":this._textboxOptionChange(n,t);break;case"items":case"dataSource":n==="items"?this._itemsToDataSource():this._initDataSource();case"itemTemplate":case"itemRender":this._list.option(n,t);break;case"filterOperator":this._validateFilterOperator();break;case"displayExpr":this._compileDisplayGetter(),this._list.option("itemRender",this._getItemRender());break;case"minSearchLength":case"searchTimeout":break;case"valueUpdateEvent":case"valueUpdateAction":this._renderValueUpdateEvent();break;case"shouldActivateFocusOut":this._invalidate();break;default:this.callBase.apply(this,arguments)}},_applyFilter:function(){var t=this._textbox.option("value"),i=t.length>=this.option("minSearchLength");if(!i){this._clearSearchTimer(),this._popup.hide();return}this.option("searchTimeout")>0?this._searchTimer||(this._searchTimer=setTimeout(n.proxy(this._filterDataSource,this),this.option("searchTimeout"))):this._filterDataSource()},_clearSearchTimer:function(){clearTimeout(this._searchTimer),delete this._searchTimer},_checkExceptions:function(){if(this.option("value")===i)throw Error("Value option should not be undefined");},_clean:function(){this.callBase(),this._element().empty()}}).include(u.DataHelperMixin))}(jQuery,DevExpress),function(n,t){var r=t.ui,u=r.events,f="dx-dropdownmenu",e=f+"-popup-wrapper",o="dx-dropdownmenu-list",s="dx-dropdownmenu-button";r.registerComponent("dxDropDownMenu",r.ContainerWidget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{items:[],itemClickAction:null,dataSource:null,itemTemplate:"item",itemRender:null,buttonText:"",buttonIcon:"overflow",buttonIconSrc:null,buttonClickAction:null,usePopover:!1})},_init:function(){this.callBase(),this._initDataSource(),this._initItemClickAction()},_initItemClickAction:function(){this._itemClickAction=this._createActionByOption("itemClickAction")},_render:function(){this._element().addClass(f),this._renderButton(),this.callBase()},_clean:function(){this.callBase(),this._popup._element().remove()},_renderContentImpl:function(){this._renderPopup()},_renderButton:function(){var n=this.option("buttonIconSrc"),t=this.option("buttonIcon");this._button=this._element().addClass(s).dxButton({text:this.option("buttonText"),icon:t,iconSrc:n,clickAction:this.option("buttonClickAction")}).dxButton("instance")},_renderClick:function(){this.callBase();var n=this._createAction(this._handleButtonClick);this._element().on(u.addNamespace("dxclick",this.NAME),function(t){n({jQueryEvent:t})});this._popup&&this._popup.option("clickAction",this.option("clickAction"))},_handleButtonClick:function(n){n.component._popup.toggle()},_renderList:function(t){var r=t.content(),i=this,u;i._list=r.addClass(o).dxList({autoPagingEnabled:!1,noDataText:"",itemRender:i.option("itemRender"),itemTemplate:i.option("itemTemplate"),itemClickAction:function(n){i._popup.hide(),i._itemClickAction(n)}}).data("dxList"),i._list.addExternalTemplate(i._templates),i._setListDataSource(),i._attachListClick(),u=n(window).height()*.5,r.height()>u&&r.height(u)},_toggleVisibility:function(n){this.callBase(n),this._button.option("visible",n)},_attachListClick:function(){var n=this._createAction(this._handleListClick);this._list._element().off("."+this.NAME).on(u.addNamespace("dxclick",this.NAME),function(t){n({jQueryEvent:t})})},_handleListClick:function(n){n.component._popup.hide()},_renderPopup:function(){var t=this._$popup=n("<div>").appendTo(this._element()),i={clickAction:this.option("clickAction"),contentReadyAction:n.proxy(this._popupContentReadyHandler,this),deferRendering:!1};this._popup=this.option("usePopover")?this._createPopover(t,i):this._createPopup(t,i),this._popup._wrapper().addClass(e)},_popupContentReadyHandler:function(){var n=this._$popup[this.option("usePopover")?"dxPopover":"dxPopup"]("instance");this._renderList(n)},_createPopover:function(t,i){return t.dxPopover(n.extend(i,{target:this._element()})).dxPopover("instance")},_createPopup:function(t,i){return t.dxPopup(n.extend(i,{showTitle:!1,width:"auto",height:"auto",shading:!1,closeOnOutsideClick:n.proxy(function(t){return!n(t.target).closest(this._button._element()).length},this),closeOnTargetScroll:!0,position:{my:"right top",at:"right bottom",of:this._element(),collision:"fit flip"},animation:{show:{type:"fade",to:1},hide:{type:"fade",to:0}}})).dxPopup("instance")},_setListDataSource:function(){this._list&&this._list.option("dataSource",this._dataSource||this.option("items"))},_optionChanged:function(n,t){if(/^button/.test(n)){this._renderButton();return}switch(n){case"items":case"dataSource":this._refreshDataSource(),this._setListDataSource();break;case"itemRender":case"itemTemplate":this._list&&this._list.option(n,t);break;case"itemClickAction":this._initItemClickAction();break;case"usePopover":this._invalidate();break;default:this.callBase.apply(this,arguments)}}}).include(r.DataHelperMixin))}(jQuery,DevExpress),function(n,t,i){var u=t.ui,s=u.events,r="dx-selectbox",h=r+"-popup",f=r+"-container",e=r+"-arrow",o=e+"-container";u.registerComponent("dxSelectBox",u.dxAutocomplete.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{items:[],value:i,valueChangeAction:null,placeholder:Globalize.localize("Select"),valueExpr:null,tooltipEnabled:!1})},_init:function(){this.callBase(),this._dataSource||this._itemsToDataSource()},_itemsToDataSource:function(){this._dataSource=new DevExpress.data.DataSource(this.option("items"))},_getValueWidth:function(t){var i=n("<div>").html(t).css({width:"auto",position:"fixed",top:"-3000px",left:"-3000px"}).appendTo("body");return i.width()},_setTooltip:function(n){this.option("tooltipEnabled")&&(this._$element.context.title=this._$element.context.scrollWidth<=this._getValueWidth(n)?n:"")},_render:function(){this._compileValueGetter(),this.callBase(),this._setTooltip(this.option("value")),this._renderContainer(),this._setWidgetClasses(),this._renderArrowDown()},_renderContainer:function(){this._textbox._element().wrap(n("<div>").addClass(f)),this._$container=this._element().find("."+f)},_renderPopup:function(){if(this.callBase(),this._popup.beginUpdate(),t.devices.current().win8){var i=this._popup.option("position");n.extend(i,{at:"left top",offset:{h:0,v:2}}),this._popup.option("position",i)}this._popup.option("closeOnOutsideClick",!0),this._popup.endUpdate()},_renderValueUpdateEvent:function(){this._changeAction=this._createActionByOption("valueChangeAction")},_setWidgetClasses:function(){var n=this._element(),t=this._popup._element();n.addClass(r),t.addClass(h)},_renderArrowDown:function(){var t=this._createAction(function(n){n.component._popup.toggle()});n("<div>").addClass(o).appendTo(this._$container).on(s.addNamespace("dxclick",this.NAME),n.proxy(function(){t()},this));n("<div>").addClass(e).appendTo(this._$container.find("."+o))},_applyFilter:n.noop,_updateValue:n.noop,_renderTextbox:function(){var t=this.option("value");this.callBase(),t?this._searchValue(t).done(n.proxy(this._updateTextBox,this)):this._updateTextBox()},_updateTextBox:function(t){this._selectedItem=t,this._textbox.option({readOnly:!0,value:this._displayGetter(this._selectedItem),clickAction:n.proxy(function(){this._popup.toggle()},this),focusOutAction:null})},_compileValueGetter:function(){this._valueGetter=t.data.utils.compileGetter(this._valueGetterExpr())},_valueGetterExpr:function(){return this.option("valueExpr")||this._dataSource&&this._dataSource._store._key||"this"},_handleListItemClick:function(n){this.option("value",this._valueGetter(n.itemData)),this._popup.hide()},_searchValue:function(i){var f=this,r=this._dataSource.store(),e=this._valueGetterExpr(),u=n.Deferred();return e===r.key()||r instanceof t.data.CustomStore?r.byKey(i).done(function(n){u.resolveWith(f,[n])}):r.load({filter:[e,i]}).done(function(n){u.resolveWith(f,n)}),u.promise()},_changeValueExpr:function(){this._compileValueGetter(),this.option("value",this._valueGetter(this._selectedItem))},_changeValue:function(t){this._searchValue(t).done(n.proxy(this._handleSearchComplete,this)),this._setTooltip(t)},_handleSearchComplete:function(n){this._selectedItem=n,this._textboxOptionChange("value",this._displayGetter(n)),this._changeAction(this.option("value"))},_renderList:function(){this.callBase(),this._list.option("autoPagingEnabled",!0)},_optionChanged:function(n,t){switch(n){case"tooltipEnabled":this._setTooltip(this.option("value"));break;case"valueExpr":this._changeValueExpr();break;case"displayExpr":this._compileDisplayGetter(),this._refresh();break;case"value":this._changeValue(t);break;case"valueChangeAction":this._renderValueUpdateEvent();break;default:this.callBase.apply(this,arguments)}}}))}(jQuery,DevExpress),function(n,t){var o=t.ui,s=o.events,e=t.fx,c=t.translator,l=t.utils,w="dx-panorama",b="dx-panorama-title",k="dx-panorama-ghosttitle",d="dx-panorama-itemscontainer",a="dx-panorama-item",v="dx-panorama-ghostitem",g="dx-panorama-item-header",nt="dxPanoramaItemData",tt=.02,it=.02,rt=300,ut="cubic-bezier(.40, .80, .60, 1)",ft=300,et="cubic-bezier(.40, .80, .60, 1)",ot=300,st="cubic-bezier(.40, .80, .60, 1)",y=function(n,t){n.css("background-position",t+"px 0%")},f=function(n){return c.locate(n).left},r=function(n,t){c.move(n,{left:t})},u={backgroundMove:function(n,t,i){return e.animate(n,{to:{"background-position":t+"px 0%"},duration:rt,easing:ut,complete:i})},titleMove:function(n,t,i){return e.animate(n,{type:"slide",to:{left:t},duration:ft,easing:et,complete:i})},itemMove:function(n,t,i){return e.animate(n,{type:"slide",to:{left:t},duration:ot,easing:st,complete:i})}},p=function(t){t&&n.each(t,function(n,t){e.stop(t,!0)})},h=t.Class.inherit({ctor:function(n){this._panorama=n},init:n.noop,render:n.noop,allItemElements:function(){return this._panorama._itemElements()},updatePositions:t.abstract,animateRollback:t.abstract,detectBoundsTransition:t.abstract,animateComplete:t.abstract,_itemMargin:function(){return this._panorama._$itemsContainer.width()*tt},_indexBoundary:function(){return this._panorama._indexBoundary()},_normalizeIndex:function(n){return this._panorama._normalizeIndex(n)}}),ht=h.inherit({updatePositions:function(){var t=this._panorama._itemElements(),i=this._itemMargin();t.each(function(){r(n(this),i)})},animateRollback:n.noop,detectBoundsTransition:n.noop,animateComplete:n.noop}),ct=h.inherit({init:function(){this._initGhostItem()},render:function(){this._renderGhostItem()},_initGhostItem:function(){this._$ghostItem=n("<div>").addClass(v)},_renderGhostItem:function(){this._panorama._itemContainer().append(this._$ghostItem),this._toggleGhostItem(!1)},_toggleGhostItem:function(n){var t=this._$ghostItem;n?t.css("opacity",1):t.css("opacity",0)},_updateGhostItemContent:function(n){n!==!1&&n!==this._prevGhostIndex&&(this._$ghostItem.html(this._panorama._itemElements().eq(n).html()),this._prevGhostIndex=n)},_isGhostItemVisible:function(){return this._$ghostItem.css("opacity")==1},_swapGhostWithItem:function(n){var t=this._$ghostItem,i=f(n);r(n,f(t)),r(t,i)},allItemElements:function(){return this._panorama._itemContainer().find("."+a+", ."+v)},updatePositions:function(t){var e=this.allItemElements(),i=this._panorama.option("selectedIndex"),u=t>0&&i===0||t<0&&i===1,f=t<0&&i===0||t>0&&i===1,o=u&&"replaceLast"||f&&"replaceFirst",s=u&&1||f&&0,h=this._calculateItemPositions(i,o);this._updateGhostItemContent(s),this._toggleGhostItem(u||f),e.each(function(i){r(n(this),h[i]+t)})},animateRollback:function(t){var s=this,i=this._panorama._itemElements(),e=this._itemMargin(),h=f(i.eq(t))-e,r=f(this._$ghostItem)-e,o=this._calculateItemPositions(t,r>0?"prepend":"append"),c=t===0&&h>0&&r>0||t===1&&r<0;c?this._swapGhostWithItem(i.eq(1)):this._swapGhostWithItem(i.eq(0)),i.each(function(t){u.itemMove(n(this),o[t])}),u.itemMove(this._$ghostItem,o[2],function(){s._toggleGhostItem(!1)})},detectBoundsTransition:function(n,t){var i=f(this._$ghostItem),r=this._itemMargin();return n===0&&i<r?"left":t===0&&i>r?"right":void 0},animateComplete:function(t,i,r){var o=this,s=!t^!(r===0)?"prepend":"append",h=this._panorama._itemElements(),e=this._calculateItemPositions(i,s),f=[];return h.each(function(t){f.push(u.itemMove(n(this),e[t]))}),f.push(u.itemMove(this._$ghostItem,e[2],function(){o._toggleGhostItem(!1)})),n.when.apply(n,f)},_calculateItemPositions:function(n,t){var i=[],h=this._panorama._itemElements(),e=this._itemMargin(),o=h.eq(0).outerWidth(),s=o+e,u=n===0,f=-o,r=e;i.push(r),r+=s,u?i.push(r):i.splice(0,0,r),r+=s;switch(t){case"replaceFirst":i.push(i[0]),i[0]=u?r:f;break;case"replaceLast":u?i.splice(1,0,f):i.splice(1,0,r);break;case"prepend":i.push(f);break;case"append":i.push(r)}return i}}),lt=h.inherit({updatePositions:function(t){var i=this._panorama._itemElements(),u=this._calculateItemPositions(this._panorama.option("selectedIndex"),t<0);i.each(function(i){r(n(this),u[i]+t)})},animateRollback:function(){var i=this._panorama._itemElements(),t=this._panorama.option("selectedIndex"),e=this._calculateItemPositions(t),o=[t,this._normalizeIndex(t+1)];f(i.eq(t))>this._itemMargin()&&o.push(this._normalizeIndex(t-1)),i.each(function(t){var i=n(this);n.inArray(t,o)!==-1?u.itemMove(i,e[t]):r(i,e[t])})},detectBoundsTransition:function(n,t){var i=this._indexBoundary()-1;return t===i&&n===0?"left":t===0&&n===i?"right":void 0},animateComplete:function(t,i,f){var s=[],h=this._panorama._itemElements(),e=this._calculateItemPositions(i),o=this._normalizeIndex(f-1)===i,l=h.length===3&&o?this._normalizeIndex(f+1):null,a=e[this._indexBoundary()],c=[i,f],v=o?f:i;return o||c.push(this._normalizeIndex(v+1)),h.each(function(t){var i=n(this);if(n.inArray(t,c)===-1){r(i,e[t]);return}s.push(t!==l?u.itemMove(i,e[t]):u.itemMove(i,a,function(){r(i,e[t])}))}),n.when.apply(n,s)},_calculateItemPositions:function(n,t){for(var f=this._normalizeIndex(n-1),h=this._panorama._itemElements(),e=this._itemMargin(),o=h.eq(0).outerWidth(),s=o+e,i=[],c=-o,r=e,u=n;u!==f;u=this._normalizeIndex(u+1))i[u]=r,r+=s;return t?(i[f]=r,r+=s):i[f]=c,i.push(r),i}});o.registerComponent("dxPanorama",o.SelectableCollectionWidget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{selectedIndex:0,title:"panorama",backgroundImage:{url:null,width:0,height:0}})},_itemClass:function(){return a},_itemDataKey:function(){return nt},_itemContainer:function(){return this._$itemsContainer},_init:function(){this.callBase(),this._initItemsRenderStrategy(),this._initTitle(),this._initItemsContainer(),l.windowResizeCallbacks.add(this._windowResizeCallBack=n.proxy(this._handleWindowResize,this)),this._initSwipeHandlers()},_dispose:function(){this.callBase.apply(this,arguments),l.windowResizeCallbacks.remove(this._windowResizeCallBack)},_initItemsRenderStrategy:function(){var n;switch(this.option("items").length){case 0:case 1:n=ht;break;case 2:n=ct;break;default:n=lt}this._itemsRenderStrategy=new n(this),this._itemsRenderStrategy.init()},_initBackgroundImage:function(){var n=this.option("backgroundImage.url");n&&this._element().css("background-image","url("+n+")")},_initTitle:function(){this._$title=n("<div>").addClass(b),this._$ghostTitle=n("<div>").addClass(k),this._element().append(this._$title),this._element().append(this._$ghostTitle),this._updateTitle()},_updateTitle:function(){var n=this.option("title");this._$title.text(n),this._$ghostTitle.text(n),this._toggleGhostTitle(!1)},_toggleGhostTitle:function(n){var t=this._$ghostTitle;n?t.css("opacity",1):t.css("opacity",0)},_initItemsContainer:function(){this._$itemsContainer=n("<div>").addClass(d),this._element().append(this._$itemsContainer)},_handleWindowResize:function(){this._updatePositions()},_render:function(){this._element().addClass(w),this.callBase(),this._initBackgroundImage(),this._itemsRenderStrategy.render()},_updatePositions:function(n){n=n||0,this._updateBackgroundPosition(n*this._calculateBackgroundStep()),this._updateTitlePosition(n*this._calculateTitleStep()),this._itemsRenderStrategy.updatePositions(n*this._$itemsContainer.width())},_updateBackgroundPosition:function(n){y(this._element(),this._calculateBackgroundPosition(this.option("selectedIndex"))+n)},_updateTitlePosition:function(n){r(this._$title,this._calculateTitlePosition(this.option("selectedIndex"))+n)},_animateRollback:function(n){this._animateBackgroundMove(n),this._animateTitleMove(n),this._itemsRenderStrategy.animateRollback(n)},_animateBackgroundMove:function(n){return u.backgroundMove(this._element(),this._calculateBackgroundPosition(n))},_animateTitleMove:function(n){return u.titleMove(this._$title,this._calculateTitlePosition(n))},_animateComplete:function(t,i){var r=this,u=this._itemsRenderStrategy.detectBoundsTransition(t,i),f=this._performBackgroundAnimation(u,t),e=this._performTitleAnimation(u,t),o=this._itemsRenderStrategy.animateComplete(u,t,i);n.when(f,e,o).done(function(){r._indexChangeOnAnimation=!0,r.option("selectedIndex",t),r._indexChangeOnAnimation=!1})},_performBackgroundAnimation:function(n,t){return n?this._animateBackgroundBoundsTransition(n,t):this._animateBackgroundMove(t)},_animateBackgroundBoundsTransition:function(n,t){var r=this,f=n==="left",i=this._calculateBackgroundPosition(t),e=f?-this._calculateBackgroundScaledWidth():this._calculateBackgroundScaledWidth(),o=i+e;return u.backgroundMove(this._element(),o,function(){y(r._element(),i)})},_performTitleAnimation:function(n,t){return n?this._animateTitleBoundsTransition(n,t):this._animateTitleMove(t)},_animateTitleBoundsTransition:function(t,i){var l=this,f=this._$ghostTitle,o=f.outerWidth(),e=this._element().width(),s=t==="left",a=s?e:-o,v=s?-(e+o):e,h,c;return r(f,a),this._toggleGhostTitle(!0),this._swapGhostWithTitle(),h=u.titleMove(f,v,function(){l._toggleGhostTitle(!1)}),c=u.titleMove(this._$title,this._calculateTitlePosition(i)),n.when(h,c)},_swapGhostWithTitle:function(){var n=this._$ghostTitle,t=this._$title,i=f(t);r(t,f(n)),r(n,i)},_calculateTitlePosition:function(n){var t=this._element().width(),i=t*it;return i-n*this._calculateTitleStep()},_calculateTitleStep:function(){var i=this._element().width(),n=this._$title.outerWidth(),t=this._indexBoundary()||1;return Math.max((n-i)/t,n/t)},_calculateBackgroundPosition:function(n){return-(n*this._calculateBackgroundStep())},_calculateBackgroundStep:function(){var n=this._itemElements().eq(0).outerWidth(),t=this._calculateBackgroundScaledWidth();return Math.max((t-n)/(this._indexBoundary()||1),0)},_calculateBackgroundScaledWidth:function(){return this._element().height()*this.option("backgroundImage.width")/(this.option("backgroundImage.height")||1)},_initSwipeHandlers:function(){this._element().on(s.addNamespace("dxswipestart",this.NAME),n.proxy(this._swipeStartHandler,this)).on(s.addNamespace("dxswipe",this.NAME),n.proxy(this._swipeUpdateHandler,this)).on(s.addNamespace("dxswipeend",this.NAME),n.proxy(this._swipeEndHandler,this))},_swipeStartHandler:function(n){this._stopAnimations(),(t.designMode||this.option("disabled")||this._indexBoundary()<=1)&&(n.cancel=!0)},_stopAnimations:function(){p([this._element(),this._$ghostTitle,this._$title]),p(this._itemsRenderStrategy.allItemElements())},_swipeUpdateHandler:function(n){this._updatePositions(n.offset)},_swipeEndHandler:function(n){var t=this.option("selectedIndex"),i=n.targetOffset;i===0?this._animateRollback(t):this._animateComplete(this._normalizeIndex(t-i),t)},_renderSelectedIndex:function(){this._indexChangeOnAnimation||this._updatePositions()},_normalizeIndex:function(n){var t=this._indexBoundary();return n<0&&(n=t+n),n>=t&&(n=n-t),n},_indexBoundary:function(){return this.option("items").length},_optionChanged:function(n){switch(n){case"backgroundImage":this._invalidate();break;case"title":this._updateTitle();break;case"items":this._initItemsRenderStrategy(),this.callBase.apply(this,arguments);break;default:this.callBase.apply(this,arguments)}},_itemRenderDefault:function(t,i,r){if(this.callBase(t,i,r),t.header){var u=n("<div>").addClass(g).text(t.header);r.prepend(u)}}}))}(jQuery,DevExpress),function(n,t,i){var r=t.ui,w=r.events,f=t.fx,e=t.utils,s=t.translator,h="dx-slideout",c="dx-slideout-item-container",l="dx-slideout-menu",a="dx-slideout-shield",o="dx-slideout-item",v="dxSlideoutItemData",u="dx-state-invisible",y=45,p=400;r.registerComponent("dxSlideOut",r.SelectableCollectionWidget.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{activeStateEnabled:!1,menuItemRender:null,menuItemTemplate:"menuItem",swipeEnabled:!0,menuVisible:!1})},_itemClass:function(){return o},_itemDataKey:function(){return v},_init:function(){this.callBase(),this._deferredAnimate=i},_render:function(){this._renderItemsContainer(),this._renderShield(),this._renderList(),this._initSwipeHandlers(),this._element().addClass(h),this.callBase(),this._initWindowResizeCallback(),this._renderPosition(this.option("menuVisible")?1:0,!1)},_renderShield:function(){this._$shield=n("<div />").addClass(a),this._$shield.appendTo(this._$container);this._$shield.on("dxclick",n.proxy(this.hideMenu,this));this._toggleShieldVisibility()},_initWindowResizeCallback:function(){var n=this;this._windowResizeCallback=function(){n._renderPosition(n.option("menuVisible")?1:0,!1)},e.windowResizeCallbacks.add(this._windowResizeCallback)},_renderItemsContainer:function(){this._$container=n("<div />").addClass(c).appendTo(this._element());this._$container.on("MSPointerDown",function(){})},_renderContentImpl:function(){var t=this.option("items"),i=this.option("selectedIndex");t.length&&i>-1&&this._renderItems([t[i]])},_renderList:function(){this._$list=n("<div />").addClass(l).prependTo(this._element()),this._renderItemClickAction();var t=this._$list.dxList().dxList("instance");t.addExternalTemplate(this._templates),this._$list.dxList({height:"100%",itemClickAction:n.proxy(this._handleListItemClick,this),items:this.option("items"),dataSource:this.option("dataSource"),itemRender:this.option("menuItemRender"),itemTemplate:this.option("menuItemTemplate")})},_handleListItemClick:function(n){var t=this._$list.find(".dx-list-item").index(n.itemElement);this.option("selectedIndex",t),this._itemClickAction(n)},_renderItemClickAction:function(){this._itemClickAction=this._createActionByOption("itemClickAction")},_renderItem:function(n,t){this._$container.find("."+o).remove(),this.callBase(n,t,this._$container)},_renderSelectedIndex:function(){this._renderContent()},_initSwipeHandlers:function(){this._$container.dxSwipeable({elastic:!1,itemSizeFunc:n.proxy(this._getListWidth,this),startAction:n.proxy(this.option("swipeEnabled")?this._handleSwipeStart:function(n){n.jQueryEvent.cancel=!0},this),updateAction:n.proxy(this._handleSwipeUpdate,this),endAction:n.proxy(this._handleSwipeEnd,this)})},_handleSwipeStart:function(n){this._$shield.addClass(u),f.stop(this._$container),n.jQueryEvent.maxLeftOffset=this.option("menuVisible")?1:0,n.jQueryEvent.maxRightOffset=this.option("menuVisible")?0:1},_handleSwipeUpdate:function(n){var t=this.option("menuVisible")?n.jQueryEvent.offset+1:n.jQueryEvent.offset;this._renderPosition(t,!1)},_handleSwipeEnd:function(n){var t=n.jQueryEvent.targetOffset+this.option("menuVisible"),i=t!==0;this.option("menuVisible")===i?this._renderPosition(this.option("menuVisible")?1:0,!0):this.option("menuVisible",t!==0)},_handleMenuButtonClick:function(){this.option("menuVisible",!this.option("menuVisible"))},_toggleMenuVisibility:function(n){this.option("menuVisible",n)},_renderPosition:function(t,i){var r=this._calculatePixelOffset(t);i?(this._$shield.addClass(u),f.animate(this._$container,{type:"slide",to:{left:r},duration:p,complete:n.proxy(this._handleAnimationComplete,this)})):s.move(this._$container,{left:r})},_calculatePixelOffset:function(n){var n=n||0,t=this._getListWidth();return n*t},_getListWidth:function(){var n=this._$list.width(),t=this._element().width()-y;return Math.min(t,n)},_changeMenuOption:function(n,t){this._$list.dxList("instance").option(n,t)},_optionChanged:function(n,t,i){switch(n){case"menuVisible":this._renderPosition(t?1:0,!0);break;case"swipeEnabled":this._initSwipeHandlers();break;case"menuItemRender":this._changeMenuOption("itemRender",t);break;case"menuItemTemplate":this._changeMenuOption("itemTemplate",t);break;case"items":case"dataSource":this._changeMenuOption(n,t);break;case"itemClickAction":this._renderItemClickAction();break;default:this.callBase(n,t,i)}},_toggleShieldVisibility:function(){this._$shield.toggleClass(u,!this.option("menuVisible"))},_handleAnimationComplete:function(){this._toggleShieldVisibility(),this._deferredAnimate&&this._deferredAnimate.resolveWith(this)},_dispose:function(){e.windowResizeCallbacks.remove(this._windowResizeCallback),this.callBase()},showMenu:function(){return this.toggleMenuVisibility(!0)},hideMenu:function(){return this.toggleMenuVisibility(!1)},toggleMenuVisibility:function(t){return t=t===i?!this.option("menuVisible"):t,this._deferredAnimate=n.Deferred(),this.option("menuVisible",t),this._deferredAnimate.promise()}}))}(jQuery,DevExpress),DevExpress.MOD_WIDGETS=!0}if(!DevExpress.MOD_FRAMEWORK){if(!window.DevExpress)throw Error("Required module is not referenced: core");(function(n,t,i){var u=function(n,t,i){for(var u=[],r=0,f=n.length;r<f;r++)i(n[r],t)||u.push(n[r]);return u.push.apply(u,t),u},f=function(){return function(t,i){return u(t,i,function(t,i){return n.grep(i,function(n){return t.option("id")===n.option("id")&&n.option("id")||t.option("behavior")===n.option("behavior")&&t.option("behavior")}).length})}},r=function(n,t,r){var u=t?t[r]:i;return n.option(r)||u},e=function(n,t){var i=!!n.option("icon")||n.option("iconSrc"),u=r(n,t,"title");return t.showText||!i?u:""},o=function(n,t,u){var f=!!n.option("title"),e=r(n,t,u);return t.showIcon||!f?e:i},s=function(n,t){return r(n,t,"type")};t.framework={utils:{mergeCommands:f(),commandToContainer:{resolveTypeValue:s,resolveIconValue:o,resolveTextValue:e,resolvePropertyValue:r}}}})(jQuery,DevExpress),function(n,t){var i=t.Class;t.framework.Route=i.inherit({_trimSeparators:function(n){return n.replace(/^[\/.]+|\/+$/g,"")},_escapeRe:function(n){return n.replace(/\W/g,"\\$1")},_checkConstraint:function(n,t){n=String(n),typeof t=="string"&&(t=new RegExp(t));var i=t.exec(n);return!i||i[0]!==n?!1:!0},_ensureReady:function(){var t=this;if(this._patternRe)return!1;this._pattern=this._trimSeparators(this._pattern),this._patternRe="",this._params=[],this._segments=[],this._separators=[],this._pattern.replace(/[^\/]+/g,function(n,i){t._segments.push(n),i&&t._separators.push(t._pattern.substr(i-1,1))}),n.each(this._segments,function(n){var u=!0,i=this,r=n?t._separators[n-1]:"";i.charAt(0)===":"?(u=!1,i=i.substr(1),t._params.push(i),t._patternRe+="(?:"+r+"([^/]*))",i in t._defaults&&(t._patternRe+="?")):t._patternRe+=r+t._escapeRe(i)}),this._patternRe=new RegExp("^"+this._patternRe+"$")},ctor:function(n,t,i){this._pattern=n||"",this._defaults=t||{},this._constraints=i||{}},parse:function(t){var u=this,i,r;return(this._ensureReady(),i=this._patternRe.exec(t),!i)?!1:(r=n.extend({},this._defaults),n.each(this._params,function(n){var t=n+1;i.length>=t&&i[t]&&(r[this]=u.parseSegment(i[t]))}),n.each(this._constraints,function(n){if(!u._checkConstraint(r[n],u._constraints[n]))return r=!1,!1}),r)},format:function(t){var r=this,u="",c,o;this._ensureReady();var f=n.extend({},this._defaults),s=0,i=[],h=[],e={};return(n.each(t,function(n,i){t[n]=r.formatSegment(i),n in f||(e[n]=!0)}),n.each(this._segments,function(n,u){if(i[n]=n?r._separators[n-1]:"",u.charAt(0)===":"){var o=u.substr(1);if(!(o in t)&&!(o in r._defaults)||o in r._constraints&&!r._checkConstraint(t[o],r._constraints[o]))return i=null,!1;o in t?(t[o]!==undefined&&(f[o]=t[o],i[n]+=t[o],s=n),delete e[o]):o in f&&(i[n]+=f[o],h.push(n))}else i[n]+=u,s=n}),n.each(f,function(u,f){if(!!f&&n.inArray(":"+u,r._segments)===-1&&t[u]!==f)return i=null,!1}),c=0,n.isEmptyObject(e)||(u="?",n.each(e,function(n){u+=n+"="+t[n]+"&",c++}),u=u.substr(0,u.length-1)),n.each(t,function(){if(!this in f)return i=null,!1}),i===null)?!1:(h.length&&n.map(h,function(n){n>=s&&(i[n]="")}),o=i.join(""),o=o.replace(/\/+$/,""),{uri:o+u,unusedCount:c})},formatSegment:function(t){return n.isArray(t)||n.isPlainObject(t)?"json:"+encodeURIComponent(JSON.stringify(t)):encodeURIComponent(t)},parseSegment:function(t){if(t.substr(0,5)==="json:")try{return n.parseJSON(decodeURIComponent(t.substr(5)))}catch(i){}return decodeURIComponent(t)}}),t.framework.MvcRouter=t.Class.inherit({ctor:function(){this._registry=[]},_trimSeparators:function(n){return n.replace(/^[\/.]+|\/+$/g,"")},_createRoute:function(n,i,r){return new t.framework.Route(n,i,r)},register:function(n,t,i){this._registry.push(this._createRoute(n,t,i))},_parseQuery:function(t){var i={},r=t.split("&");return n.each(r,function(n,t){var r=t.split("=");i[r[0]]=decodeURIComponent(r[1])}),i},parse:function(t){var f=this,i;t=this._trimSeparators(t);var r=t.split("?",2),e=r[0],u=r[1];return n.each(this._registry,function(){var t=this.parse(e);if(t!==!1)return i=t,u&&(i=n.extend(i,f._parseQuery(u))),!1}),i?i:!1},format:function(t){var i=!1,r=99999;return t=t||{},n.each(this._registry,function(){var f=n.extend(!0,{},t),u=this.format(f);u!==!1&&r>u.unusedCount&&(r=u.unusedCount,i=u.uri)}),i}})}(jQuery,DevExpress),function(n,t){var i=t.ui;t.framework.dxCommand=i.Component.inherit({ctor:function(t,i){n.isPlainObject(t)&&(i=t,t=n("<div />")),this.beforeExecute=n.Callbacks(),this.afterExecute=n.Callbacks(),this.callBase(t,i)},_defaultOptions:function(){return n.extend(this.callBase(),{action:null,id:null,title:"",icon:"",iconSrc:"",visible:!0,disabled:!1})},execute:function(){var i=this._options.disabled;if(n.isFunction(i)&&(i=!!i.apply(this,arguments)),i)throw new Error(t.utils.stringFormat("Cannot execute command: {0}",this._options.id));this.beforeExecute.fire(arguments),this._createActionByOption("action",{allowedForGesture:!0}).apply(this,arguments),this.afterExecute.fire(arguments)},_render:function(){this.callBase(),this._element().addClass("dx-command")},_renderDisabledState:n.noop,_dispose:function(){this.callBase(),this._element().removeData(this.NAME),this.beforeExecute.empty(),this.afterExecute.empty()}}),i.registerComponent("dxCommand",t.framework.dxCommand)}(jQuery,DevExpress),function(n,t){t.framework.CommandMapping=t.Class.inherit({ctor:function(){this._commandMappings={},this._containerDefaults={}},setDefaults:function(n,t){return this._containerDefaults[n]=t,this},mapCommands:function(t,i){var r=this;return n.each(i,function(i,u){typeof u=="string"&&(u={id:u});var e=u.id,f=r._commandMappings[t]||{};f[e]=n.extend({showIcon:!0,showText:!0},r._containerDefaults[t]||{},u),r._commandMappings[t]=f}),this._initExistingCommands(),this},unmapCommands:function(t,i){var r=this;n.each(i,function(n,i){var u=r._commandMappings[t]||{};u&&delete u[i]}),this._initExistingCommands()},getCommandMappingForContainer:function(n,t){return(this._commandMappings[t]||{})[n]},checkCommandsExist:function(t){var r=this,i=n.grep(t,function(i,u){return n.inArray(i,r._existingCommands)<0&&n.inArray(i,t)===u});if(i.length!==0)throw new Error("The '"+i.join("', '")+"' command"+(i.length===1?" is":"s are")+" not registred in the application's command mapping. See http://dxpr.es/1bTjfj1 for more details.");},load:function(t){if(t){var i=this;return n.each(t,function(n,t){i.setDefaults(n,t.defaults),i.mapCommands(n,t.commands)}),this}},_initExistingCommands:function(){var t=this;this._existingCommands=[],n.each(t._commandMappings,function(i,r){n.each(r,function(i,r){n.inArray(r.id,t._existingCommands)<0&&t._existingCommands.push(r.id)})})}}),t.framework.CommandMapping.defaultMapping={"global-navigation":{defaults:{showIcon:!0,showText:!0},commands:[]},"ios-header-toolbar":{defaults:{showIcon:!1,showText:!0,location:"right"},commands:["edit","save",{id:"back",location:"left"},{id:"cancel",location:"left"},{id:"create",showIcon:!0,showText:!1}]},"ios-action-sheet":{defaults:{showIcon:!1,showText:!0},commands:[]},"ios-view-footer":{defaults:{showIcon:!1,showText:!0},commands:[{id:"delete",type:"danger"}]},"android-header-toolbar":{defaults:{showIcon:!0,showText:!1,location:"right"},commands:[{id:"back",showIcon:!1,location:"left"},"create","edit","save",{id:"cancel",showText:!0,location:"menu"},{id:"delete",showText:!0,location:"menu"}]},"android-simple-toolbar":{defaults:{showIcon:!0,showText:!1,location:"right"},commands:[{id:"back",showIcon:!1,location:"left"},{id:"create"},{id:"save",showText:!0,location:"left"},{id:"edit",showText:!0,location:"menu"},{id:"cancel",showText:!0,location:"menu"},{id:"delete",showText:!0,location:"menu"}]},"android-footer-toolbar":{defaults:{location:"right"},commands:[{id:"create",showText:!1,location:"center"},{id:"edit",showText:!1,location:"left"},{id:"delete",location:"menu"},{id:"save",showIcon:!1,location:"left"}]},"tizen-header-toolbar":{defaults:{showIcon:!0,showText:!1,location:"right"},commands:[{id:"back",showIcon:!1,location:"left"},"create","edit","save",{id:"cancel",showText:!0,location:"menu"},{id:"delete",showText:!0,location:"menu"}]},"tizen-footer-toolbar":{defaults:{location:"right"},commands:[{id:"create",showText:!1},{id:"edit",showText:!1,location:"left"},{id:"delete",location:"menu"},{id:"save",showIcon:!1,location:"left"}]},"tizen-simple-toolbar":{defaults:{showIcon:!0,showText:!1,location:"right"},commands:[{id:"back",showIcon:!1,location:"left"},{id:"create"},{id:"save",showText:!0,location:"left"},{id:"edit",showText:!0,location:"menu"},{id:"cancel",showText:!0,location:"menu"},{id:"delete",showText:!0,location:"menu"}]},"generic-header-toolbar":{defaults:{showIcon:!1,showText:!0,location:"right"},commands:["edit","save",{id:"back",location:"left"},{id:"cancel",location:"left"},{id:"create",showIcon:!0,showText:!1}]},"generic-view-footer":{defaults:{showIcon:!1,showText:!0},commands:[{id:"delete",type:"danger"}]},"win8-appbar":{defaults:{location:"right"},commands:["edit","cancel","save","delete",{id:"create",location:"left"}]},"win8-toolbar":{defaults:{showText:!1,location:"left"},commands:[{id:"previousPage"}]},"win8-phone-appbar":{defaults:{location:"center"},commands:["create","edit","cancel","save",{id:"delete",location:"menu"}]},"desktop-toolbar":{defaults:{showIcon:!1,showText:!0,location:"right"},commands:["cancel","create","edit","save",{id:"delete",type:"danger"}]}}}(jQuery,DevExpress),function(n,t){var r=t.Class;t.framework.ViewCache=r.inherit({ctor:function(){this._cache={}},setView:function(n,t){this._cache[n]=t},getView:function(n){return this._cache[n]},removeView:function(n){var t=this._cache[n];return delete this._cache[n],t},clear:function(){this._cache={}},hasView:function(n){return n in this._cache}}),t.framework.NullViewCache=r.inherit({setView:n.noop,getView:n.noop,removeView:n.noop,clear:n.noop,hasView:n.noop})}(jQuery,DevExpress),function(n,t){var r=t.Class;t.framework.MemoryKeyValueStorage=r.inherit({ctor:function(){this.storage={}},getItem:function(n){return this.storage[n]},setItem:function(n,t){this.storage[n]=t},removeItem:function(n){delete this.storage[n]}}),t.framework.StateManager=r.inherit({ctor:function(n){n=n||{},this.storage=n.storage||new t.framework.MemoryKeyValueStorage,this.stateSources=n.stateSources||[]},addStateSource:function(n){this.stateSources.push(n)},removeStateSource:function(t){var i=n.inArray(t,this.stateSources);i>-1&&(this.stateSources.splice(i,1),t.removeState(this.storage))},saveState:function(){var t=this;n.each(this.stateSources,function(n,i){i.saveState(t.storage)})},restoreState:function(){var t=this;n.each(this.stateSources,function(n,i){i.restoreState(t.storage)})},clearState:function(){var t=this;n.each(this.stateSources,function(n,i){i.removeState(t.storage)})}})}(jQuery,DevExpress),function(n,t){var u=t.Class,r="__root__",f="__buffer__";t.framework.DefaultBrowserAdapter=u.inherit({ctor:function(i){i=i||{},this._window=i.window||window,this.popState=n.Callbacks();n(this._window).on("hashchange",n.proxy(this._onHashChange,this));this._tasks=t.createQueue()},replaceState:function(n){var t=this;return this._addTask(function(){n=t._normalizeUri(n),t._window.history.replaceState(null,null,"#"+n),t._currentTask.resolve()})},pushState:function(n){var t=this;return this._addTask(function(){n=t._normalizeUri(n),t._window.history.pushState(null,null,"#"+n),t._currentTask.resolve()})},createRootPage:function(){return this.replaceState(r)},_onHashChange:function(){this._currentTask&&this._currentTask.resolve(),this.popState.fire()},back:function(){var n=this;return this._addTask(function(){n._window.history.back()})},getHash:function(){return this._normalizeUri(this._window.location.hash)},isRootPage:function(){return this.getHash()===r},_normalizeUri:function(n){return(n||"").replace(/^#+/,"")},_addTask:function(t){var r=this,i=n.Deferred();return this._tasks.add(function(){return r._currentTask=i,t(),i}),i.promise()}}),t.framework.OldBrowserAdapter=t.framework.DefaultBrowserAdapter.inherit({ctor:function(){this._innerEventCount=0,this.callBase.apply(this,arguments),this._skipNextEvent=!1},replaceState:function(t){var i=this;return(t=i._normalizeUri(t),i.getHash()!==t)?(i._addTask(function(){i._skipNextEvent=!0,i._window.history.back()}),i._addTask(function(){i._skipNextEvent=!0,i._window.location.hash=t})):n.Deferred().resolve().promise()},pushState:function(t){var i=this;return(t=this._normalizeUri(t),this.getHash()!==t)?i._addTask(function(){i._skipNextEvent=!0,i._window.location.hash=t}):n.Deferred().resolve().promise()},createRootPage:function(){return this.pushState(r)},_onHashChange:function(){var n=this._currentTask;this._currentTask=null,this._skipNextEvent?this._skipNextEvent=!1:this.popState.fire(),n&&n.resolve()}}),t.framework.BuggyAndroidBrowserAdapter=t.framework.OldBrowserAdapter.inherit({createRootPage:function(){return this.pushState(f),this.callBase()}}),t.framework.HistorylessBrowserAdapter=t.framework.DefaultBrowserAdapter.inherit({ctor:function(t){t=t||{},this._window=t.window||window,this.popState=n.Callbacks();n(this._window).on("dxback",n.proxy(this._onHashChange,this));this._currentHash=this._window.location.hash},replaceState:function(t){return this._currentHash=this._normalizeUri(t),n.Deferred().resolve().promise()},pushState:function(n){return this.replaceState(n)},createRootPage:function(){return this.replaceState(r)},getHash:function(){return this._normalizeUri(this._currentHash)},back:function(){return this.replaceState(r)},_onHashChange:function(){var n=this.back();return this.popState.fire(),n}})}(jQuery,DevExpress),function(n,t){var u=t.Class,r="dxPhoneJSApplication";t.framework.BrowserNavigationDevice=u.inherit({ctor:function(t){t=t||{},this._browserAdapter=t.browserAdapter||this._createBrowserAdapter(t),this.uriChanged=n.Callbacks(),this.backInitiated=n.Callbacks(),this._deferredNavigate=null,this._browserAdapter.popState.add(n.proxy(this._onPopState,this));n(window).on("unload",this._saveBrowserState)},_isBuggyAndroid2:function(){var i=t.devices.real(),n=i.version;return i.platform==="android"&&n.length>1&&(n[0]===2&&n[1]<4||n[0]<2)},_isBuggyAndroid4:function(){var i=t.devices.real(),n=i.version;return i.platform==="android"&&n.length>1&&n[0]===4&&n[1]===0},_createBrowserAdapter:function(n){var i=n.window||window,r=i.history.replaceState&&i.history.pushState;return i!==i.top?new t.framework.HistorylessBrowserAdapter(n):this._isBuggyAndroid4()?new t.framework.BuggyAndroidBrowserAdapter(n):this._isBuggyAndroid2()||!r?new t.framework.OldBrowserAdapter(n):new t.framework.DefaultBrowserAdapter(n)},_saveBrowserState:function(){window.sessionStorage&&sessionStorage.setItem(r,!0)},_prepareBrowserHistory:function(){var t=this.getUri();return!window.sessionStorage||sessionStorage.getItem(r)?n.Deferred().resolve().promise():(sessionStorage.removeItem(r),this._browserAdapter.createRootPage(),this._browserAdapter.pushState(t))},getUri:function(){return this._browserAdapter.getHash()},setUri:function(n){return this._browserAdapter.isRootPage()?this._browserAdapter.pushState(n):this._browserAdapter.replaceState(n)},_onPopState:function(){var i=this,r=this.getUri();this._deferredNavigate&&this._deferredNavigate.state()==="pending"?this._browserAdapter.isRootPage()?this._deferredNavigate.resolve():this._browserAdapter.back():this._browserAdapter.isRootPage()?this.backInitiated.fire():(this._deferredNavigate=n.Deferred().done(function(){i.uriChanged.fire(r)}),this._browserAdapter.back())},back:function(){return this._browserAdapter.back()},init:function(){var n=this;return n._prepareBrowserHistory().done(function(){n._browserAdapter.isRootPage()&&n._browserAdapter.pushState("")})}})}(jQuery,DevExpress),function(n,t,i){var u=t.Class,r={current:"current",blank:"blank",back:"back"},f="__history";t.framework.NavigationStack=u.inherit({ctor:function(t){t=t||{},this.itemsRemoved=n.Callbacks(),this.clear()},currentItem:function(){return this.items[this.currentIndex]},back:function(n){if(this.currentIndex--,this.currentIndex<0)throw Error("Unable to go back");var t=this.currentItem();t.uri!==n&&this._updateItem(this.currentIndex,n)},forward:function(){if(this.currentIndex++,this.currentIndex>=this.items.length)throw Error("Unable to go forward");},navigate:function(n,t){if(!(this.currentIndex<this.items.length)||!(this.currentIndex>-1)||this.items[this.currentIndex].uri!==n){if(t&&this.currentIndex>-1&&this.currentIndex--,this.currentIndex+1<this.items.length&&this.items[this.currentIndex+1].uri===n)this.currentIndex++;else{var i=this.items.splice(this.currentIndex+1,this.items.length-this.currentIndex-1);this.items.push({}),this.currentIndex++,this._updateItem(this.currentIndex,n),this._deleteItems(i)}return this.currentItem()}},_updateItem:function(n,t){var i=this.items[n];i.uri=t,i.key=this.items[0].uri+"_"+n+"_"+t},_deleteItems:function(n){n&&this.itemsRemoved.fire(n)},getPreviousItem:function(){return this.items.length>1?this.items[this.currentIndex-1]:i},canBack:function(){return this.currentIndex>0},clear:function(){this._deleteItems(this.items),this.items=[],this.currentIndex=-1}}),t.framework.NavigationManager=u.inherit({ctor:function(r){r=r||{};var u=this;u.navigationStacks={},u._keepPositionInStack=r.keepPositionInStack,u.currentStack=new t.framework.NavigationStack,u.currentUri=i,u.navigating=n.Callbacks(),u.navigated=n.Callbacks(),u.navigatingBack=n.Callbacks(),u.navigationCanceled=n.Callbacks(),u.itemRemoved=n.Callbacks(),u._navigationDevice=r.navigationDevice||new t.framework.BrowserNavigationDevice,u._navigationDevice.uriChanged.add(n.proxy(u.navigate,u)),u._navigationDevice.backInitiated.add(n.proxy(u._deviceBackInitiated,u)),t.hardwareBackButton.add(n.proxy(u._deviceBackInitiated,u)),u._stateStorageKey=r.stateStorageKey||f},init:function(){return this._navigationDevice.init()},_deviceBackInitiated:function(){t.backButtonCallback.fire()?this._restoreDevicePreviousUri():this.back({isHardwareButton:!0})},_restoreDevicePreviousUri:function(){this._navigationDevice.setUri(this.currentUri)},navigate:function(u,f){var e=this,o;if(f=n.extend({target:r.blank},f||{}),u===i&&(u=e._navigationDevice.getUri()),/^_back$/.test(u)){e.back();return}o={currentUri:e.currentUri,uri:u,options:f,cancel:!1,navigateWhen:[]},e.navigating.fire(o),u=o.uri,o.cancel||e.currentUri===u?(this._restoreDevicePreviousUri(),e.navigationCanceled.fire(o)):n.when.apply(n,o.navigateWhen).done(function(){t.utils.executeAsync(function(){var n=e.currentUri;e.currentUri=u,e._updateHistory(u,f),e._restoreDevicePreviousUri(),e.navigated.fire({uri:u,previousUri:n,options:f,item:e.currentItem()})})})},_createNavigationStack:function(){var i=new t.framework.NavigationStack;return i.itemsRemoved.add(n.proxy(this._removeItems,this)),i},_updateHistory:function(n,u){var f=u.root,o=f,s=!1,h,c,e;if((f||!this.currentStack.items.length)&&(this.navigationStacks[n]=this.navigationStacks[n]||this._createNavigationStack(),this.currentStack===this.navigationStacks[n]?s=!0:this.currentStack=this.navigationStacks[n],o=!0),f&&this.currentStack.items.length)this._keepPositionInStack&&u.root&&!s?this.currentUri=this.currentItem().uri:(this.currentStack.currentIndex=0,this.currentItem().uri!==n&&this.currentStack.navigate(n,!0));else{h=this.currentStack.currentIndex,c=this.currentItem()||{};switch(u.target){case r.blank:this.currentStack.navigate(n);break;case r.current:this.currentStack.navigate(n,!0);break;case r.back:this.currentStack.currentIndex>0?this.currentStack.back(n):this.currentStack.navigate(n,!0);break;default:throw Error(t.utils.stringFormat('Unknown navigation target: "{0}". Use the DevExpress.framework.NavigationManager.NAVIGATION_TARGETS enumerable values',u.target));}u.direction===i&&(e=this.currentStack.currentIndex-h,u.direction=e<0?this.currentItem().backDirection||"backward":e>0&&this.currentStack.currentIndex>0?"forward":"none"),c.backDirection=u.direction==="forward"?"backward":"none"}u.root=o},_removeItems:function(t){var i=this;n.each(t,function(n,t){i.itemRemoved.fire(t)})},back:function(t){var u,i;if(t=t||{},u=n.extend({cancel:!1},t),this.navigatingBack.fire(u),u.cancel){this._restoreDevicePreviousUri();return}i=this.getPreviousItem(),i?this.navigate(i.uri,{target:r.back,item:i}):this._navigationDevice.back()},getPreviousItem:function(){return this.currentStack.getPreviousItem()},currentItem:function(){return this.currentStack.currentItem()},currentIndex:function(){return this.currentStack.currentIndex},rootUri:function(){return this.currentStack.items.length?this.currentStack.items[0].uri:this.currentUri},canBack:function(){return this.currentStack.canBack()},getItemByIndex:function(n){return this.currentStack.items[n]},saveState:function(n){if(this.currentStack.items.length){var t={items:this.currentStack.items,currentIndex:this.currentStack.currentIndex,currentStackKey:this.currentStack.items[0].uri},i=JSON.stringify(t);n.setItem(this._stateStorageKey,i)}else this.removeState(n)},restoreState:function(n){var r,t,i;if(!this.disableRestoreState&&(r=n.getItem(this._stateStorageKey),r))try{if(t=JSON.parse(r),i=this._createNavigationStack(),!t.items[0].uri)throw Error("Error while application state restoring. State has been cleared. Refresh the page");i.items=t.items,i.currentIndex=t.currentIndex,this.navigationStacks[i.items[0].uri]=i,this.currentStack=this.navigationStacks[t.currentStackKey],this._navigationDevice.setUri(this.currentItem().uri)}catch(u){this.removeState(n);throw u;}},removeState:function(n){n.removeItem(this._stateStorageKey)},clearHistory:function(){this.currentStack.clear()}}),t.framework.NavigationManager.NAVIGATION_TARGETS=r}(jQuery,DevExpress),function(n,t,i){t.framework.createActionExecutors=function(r){return{routing:{execute:function(t){var u=t.action,i,f,e;n.isPlainObject(u)&&(i=u.routeValues,i&&n.isPlainObject(i)?f=u.options:i=u,e=r.router.format(i),r.navigate(e,f),t.handled=!0)}},hash:{execute:function(u){var o;if(typeof u.action=="string"&&u.action.charAt(0)==="#"){var f=u.action.substr(1),s=u.args[0],e=f,h=function(n){var i=t.data.utils.compileGetter(n),r=u.args[0].model;return i(r)},c=s.evaluate||h;e=f.replace(/\{([^}]+)\}/g,function(r,u){u=n.trim(u),u.indexOf(",")>-1&&(u=n.map(u.split(","),n.trim));var f=c(u);return f===i&&(f=""),f=t.framework.Route.prototype.formatSegment(f)}),o=(u.component||{}).NAME==="dxCommand"?u.component.option():{},r.navigate(e,o),u.handled=!0}}}}}}(jQuery,DevExpress),function(n,t){var f=t.Class,i,e="InProgress",r="Inited",u=t.framework;t.framework.Application=f.inherit({ctor:function(r){r=r||{},this._options=r,this.namespace=r.namespace||r.ns||window,this.components=[],i=t.localization.localizeString("@Back"),this.router=r.router||new t.framework.MvcRouter,this.navigationManager=r.navigationManager||new t.framework.NavigationManager({keepPositionInStack:r.navigateToRootViewMode==="keepHistory"}),this.navigationManager.navigating.add(n.proxy(this._onNavigating,this)),this.navigationManager.navigatingBack.add(n.proxy(this._onNavigatingBack,this)),this.navigationManager.navigated.add(n.proxy(this._onNavigated,this)),this.navigationManager.navigationCanceled.add(n.proxy(this._onNavigationCanceled,this)),this.navigationManager.itemRemoved.add(n.proxy(this._onNavigationItemRemoved,this)),this.stateManager=r.stateManager||new t.framework.StateManager({storage:r.stateStorage||sessionStorage}),this.stateManager.addStateSource(this.navigationManager),this._viewCache=r.disableViewCache?new t.framework.NullViewCache:r.viewCache||new t.framework.ViewCache,this.navigation=this._createNavigationCommands(r.navigation),this.commandMapping=this._createCommandMapping(r.commandMapping,this.navigation),this.beforeViewSetup=n.Callbacks(),this.afterViewSetup=n.Callbacks(),this.viewShowing=n.Callbacks(),this.viewShown=n.Callbacks(),this.viewHidden=n.Callbacks(),this.viewDisposing=n.Callbacks(),this.viewDisposed=n.Callbacks(),this.navigating=n.Callbacks(),this.navigatingBack=n.Callbacks(),this.initialized=n.Callbacks(),this._isNavigating=!1,this._viewsToDispose=[],t.registerActionExecutor(t.framework.createActionExecutors(this)),t.overlayTargetContainer(".dx-viewport"),this.components.push(this.router),this.components.push(this.navigationManager)},_createCommandMapping:function(i,r){var u=i,f;return i instanceof t.framework.CommandMapping||(u=new t.framework.CommandMapping,u.load(t.framework.CommandMapping.defaultMapping||{}).load(i||{})),f=n.map(r,function(n){return n.option("id")}),u.mapCommands("global-navigation",f),u},_createNavigationCommands:function(t){if(!t)return[];var r=this,i=0;return n.map(t,function(t){var r;return r=t instanceof u.dxCommand?t:new u.dxCommand(n.extend({root:!0},t)),r.option("id")||r.option("id","navigation_"+i++),r})},_callComponentMethod:function(t,i){var r=[];return n.each(this.components,function(u,f){if(f[t]&&n.isFunction(f[t])){var e=f[t](i);e&&e.done&&r.push(e)}}),n.when.apply(n,r)},init:function(){var n=this;return n._initState=e,n._callComponentMethod("init").done(function(){n._initState=r,n._processEvent("initialized")})},_onNavigatingBack:function(n){this._processEvent("navigatingBack",n)},_onNavigating:function(n){var i=this,u,r;if(i._isNavigating){i._pendingNavigationArgs=n,n.cancel=!0;return}if(i._isNavigating=!0,delete i._pendingNavigationArgs,u=this.router.parse(n.uri),!u)throw new Error(t.utils.stringFormat('Routing rule is not found for the "{0}" url',n.uri));r=this.router.format(u),n.uri!==r&&r?(n.cancel=!0,t.utils.executeAsync(function(){i.navigate(r,n.options)})):i._processEvent("navigating",n)},_onNavigated:function(i){var r=this,e=i.options.direction,f=n.Deferred(),u=r._acquireViewInfo(i.item);r._isViewReadyToShow(u)?f.resolve():r._setViewLoadingState(u,e).done(function(){t.utils.executeAsync(function(){r._createViewModel(u),r._createViewCommands(u),f.resolve()})}).fail(function(){r._isNavigating=!1,f.reject()}),f.done(function(){r._highlightCurrentNavigationCommand(u),r._showView(u,e).always(function(){r._isNavigating=!1;var n=r._pendingNavigationArgs;n&&t.utils.executeAsync(function(){r.navigate(n.uri,n.options)})})})},_isViewReadyToShow:function(n){return!!n.model},_onNavigationCanceled:function(n){var i=this,r;i._pendingNavigationArgs&&i._pendingNavigationArgs.uri===n.uri||(r=i.navigationManager.currentItem(),r&&t.utils.executeAsync(function(){var n=i._acquireViewInfo(r);i._highlightCurrentNavigationCommand(n)}),i._isNavigating=!1)},_onViewRemoved:function(n){this._viewsToDispose.push(n)},_disposeRemovedViews:function(){for(var t,n;t=this._viewsToDispose.shift();)n={viewInfo:t},this._processEvent("viewDisposing",n,n.viewInfo.model),this._disposeView(t),this._processEvent("viewDisposed",n,n.viewInfo.model)},_onNavigationItemRemoved:function(n){var t=this._viewCache.removeView(n.key);t&&this._onViewRemoved(t)},_onViewHidden:function(n){var t={viewInfo:n};this._processEvent("viewHidden",t,t.viewInfo.model)},_disposeView:function(t){var i=t.commands||[];n.each(i,function(n,t){t._dispose()})},_acquireViewInfo:function(n){var t=this._viewCache.getView(n.key);return t||(t=this._createViewInfo(n),this._viewCache.setView(n.key,t)),t},_processEvent:function(n,t,i){this._callComponentMethod(n,t),this[n]&&this[n].fire&&this[n].fire(t);var r=(i||{})[n];r&&r.call(i,t)},_createViewInfo:function(n){var t=n.uri,i=this.router.parse(t);return{viewName:i.view,routeData:i,uri:t,key:n.key,canBack:this.canBack()}},_createViewModel:function(n){this._processEvent("beforeViewSetup",{viewInfo:n}),n.model=n.model||this._callViewCodeBehind(n.routeData),this._processEvent("afterViewSetup",{viewInfo:n})},_createViewCommands:function(n){n.commands=n.model.commands||[],n.canBack&&this._appendBackCommand(n)},_callViewCodeBehind:function(t){var i=n.noop;return t.view in this.namespace&&(i=this.namespace[t.view]),i.call(this.namespace,t)||{}},_appendBackCommand:function(n){var r=n.commands,u=[new t.framework.dxCommand({id:"back",title:i,behavior:"back",action:"#_back",icon:"arrowleft",type:"back"})],f=t.framework.utils.mergeCommands(u,r);r.length=0,r.push.apply(r,f)},_showView:function(n,t){var i=this,r={viewInfo:n,direction:t};return i._processEvent("viewShowing",r,n.model),i._showViewImpl(r.viewInfo,r.direction).done(function(){i._processEvent("viewShown",r,n.model),i._disposeRemovedViews()})},_highlightCurrentNavigationCommand:function(i){var f=this,r,e=i.uri,u=i.model&&i.model.currentNavigationItemId;u!==undefined&&n.each(this.navigation,function(n,t){if(t.option("id")===u)return r=t,!1}),r||n.each(this.navigation,function(n,i){var u=i.option("action");if(t.utils.isString(u)&&(u=u.replace(/^#+/,""),u===f.navigationManager.rootUri()))return r=i,!1}),n.each(this.navigation,function(n,t){t.option("highlighted",t===r)})},_initViewLoadingState:t.abstract,_setCurrentViewAsyncImpl:t.abstract,navigate:function(t,i){var u=this;if(n.isPlainObject(t)&&(t=u.router.format(t),t===!1))throw new Error("The passed object cannot be formatted into a uri string by router. An appropriate route should be registered.");if(u._initState)if(u._initState===r)u.navigationManager.navigate(t,i);else throw new Error("Unable to navigate. Application is being initialized. Consider using the 'HtmlApplication.navigating' event to alter the navigation logic.");else u.init().done(function(){u.restoreState(),u.navigate(t,i)})},canBack:function(){return this.navigationManager.canBack()},back:function(){this.navigationManager.back()},saveState:function(){this.stateManager.saveState()},restoreState:function(){this.stateManager.restoreState()},clearState:function(){this.stateManager.clearState()}})}(jQuery,DevExpress),function(n,t){t.framework.html={layoutControllers:[]}}(jQuery,DevExpress),function(n,t){var i=t.framework.utils.commandToContainer,r=t.framework.html.commandToDXWidgetAdapters={addCommandBase:function(t,i,r,u,f){var o=n.extend(u,r,i.option()),s=t.option("items"),e;s.push(o),e=function(r,u,e){n.extend(o,i.option()),f(o,r,u,e),r!=="highlighted"&&t.option("items",s)},e(),i.optionChanged.add(e),t.disposing.add(function(){i.optionChanged.remove(e)})}};r.dxToolbar={addCommand:function(n,t,u){function o(n){var r=i.resolvePropertyValue(t,u,"location"),f;n.location=r,r==="menu"?n.text=i.resolveTextValue(t,u):(f={text:i.resolveTextValue(t,u),disabled:t.option("disabled"),icon:i.resolveIconValue(t,u,"icon"),iconSrc:i.resolveIconValue(t,u,"iconSrc"),type:i.resolveTypeValue(t,u)},n.options=f,e.widget="button")}var f=n.data("dxToolbar"),e={command:t};f.option("itemClickAction",function(n){n.itemData.command&&n.itemData.command.execute()}),r.addCommandBase(f,t,u,e,o),f.option("visible",!0)}},r.dxActionSheet={addCommand:function(n,t,u){var f=n.data("dxActionSheet"),e={command:t};r.addCommandBase(f,t,u,e,function(n){n.text=i.resolveTextValue(t,u),n.icon=i.resolveIconValue(t,u,"icon"),n.iconSrc=i.resolveIconValue(t,u,"iconSrc")})}},r.dxList={addCommand:function(n,t,u){var f=n.data("dxList");r.addCommandBase(f,t,u,{},function(n){n.title=i.resolveTextValue(t,u),n.clickAction=function(){n.disabled||t.execute()},n.icon=i.resolveIconValue(t,u,"icon"),n.iconSrc=i.resolveIconValue(t,u,"iconSrc")})}},r.dxNavBar={addCommand:function(n,t,u){var f=n.data("dxNavBar"),o={command:t},e;f.option("itemClickAction",function(n){for(var i=f.option("items"),t=i.length;--t;)i[t].command.option("highlighted",!1);n.itemData.command.execute()}),e=function(){for(var t=f.option("items"),n=0,i=t.length;n<i;n++)if(t[n].highlighted){f.option("selectedIndex",n);break}},r.addCommandBase(f,t,u,o,function(n,r,f){r==="highlighted"?f&&e():(n.text=i.resolveTextValue(t,u),n.icon=i.resolveIconValue(t,u,"icon"),n.iconSrc=i.resolveIconValue(t,u,"iconSrc"),e())})}},r.dxPivot={addCommand:function(n,t,u){var f=n.data("dxPivot"),o={command:t},e;f.option("itemSelectAction",function(n){n.itemData.command.execute()}),e=function(){for(var t=f.option("items")||[],n=0,i=t.length;n<i;n++)if(t[n].highlighted){f.option("selectedIndex",n);break}},r.addCommandBase(f,t,u,o,function(n,r,f){r==="highlighted"?f&&e():(n.title=i.resolveTextValue(t,u),e())})}},r.dxSlideOut={addCommand:function(n,t,u){var f=n.data("dxSlideOut"),o={command:t},e;f.option("itemClickAction",function(n){n.itemData.command.execute()}),e=function(){for(var t=f.option("items")||[],n=0,i=t.length;n<i;n++)if(t[n].highlighted){f.option("selectedIndex",n);break}},r.addCommandBase(f,t,u,o,function(n,r,f){r==="highlighted"?f&&e():(n.title=i.resolveTextValue(t,u),n.icon=i.resolveIconValue(t,u,"icon"),n.iconSrc=i.resolveIconValue(t,u,"iconSrc"),e())})}}}(jQuery,DevExpress),function(n,t){var u=t.Class,r=DevExpress.ui;t.framework.dxCommandContainer=r.Component.inherit({ctor:function(t,i){n.isPlainObject(t)&&(i=t,t=n("<div />")),this.callBase(t,i)},_render:function(){this.callBase(),this._element().addClass("dx-command-container")}}),r.registerComponent("dxCommandContainer",t.framework.dxCommandContainer),t.framework.html.CommandManager=u.inherit({ctor:function(n){n=n||{},this.globalCommands=n.globalCommands||[],this.commandsToWidgetRegistry=[this._commandsToDXWidget],this.commandMapping=n.commandMapping||new t.framework.CommandMapping},_commandsToDXWidget:function(i,r){var f=i.data("dxComponents"),o=t.framework.html.commandToDXWidgetAdapters,s,u,e;if(f)for(s in f)if(u=f[s],u in o)return e=i.data(u),e.beginUpdate(),n.each(r,function(n,t){o[u].addCommand(i,t.command,t.options)}),e.endUpdate(),!0;return!1},_findCommands:function(t){return n.map(t.addBack().find(".dx-command"),function(t){return n(t).dxCommand("instance")})},_findCommandContainers:function(t){return n.map(t.find(".dx-command-container"),function(t){return n(t).dxCommandContainer("instance")})},_checkCommandId:function(n,t){if(n===null)throw new Error("The command's 'id' option should be specified.\r\nProcessed markup: "+t._element().get(0).outerHTML);},_arrangeCommandsToContainers:function(t,i){var r=this,u={},f=[];n.each(t,function(n,t){var i=t.option("id");r._checkCommandId(i,t),f.push(i),u[i]=t}),r.commandMapping.checkCommandsExist(f),n.each(i,function(t,i){var f=[];n.each(u,function(n,t){var e=n,u=r.commandMapping.getCommandMappingForContainer(e,i.option("id"));u&&f.push({command:t,options:u})}),r._attachCommandsToContainer(i._element(),f)})},_attachCommandsToContainer:function(t,i){var r=!1;n.each(this.commandsToWidgetRegistry,function(n,u){return r=u(t,i),!r}),r||this._defaultCommandsToContainer(t,i)},_defaultCommandsToContainer:function(t,i){n.each(i,function(n,i){var u=i.command,r=u._element();if(r){t.append(r);r.on("dxclick",function(){u.execute()})}})},_collectCommands:function(n,i){var r=this._findCommands(n),u=t.framework.utils.mergeCommands(i,r);return t.framework.utils.mergeCommands(this.globalCommands,u)},layoutCommands:function(n,t){t=t||[];var i=this._collectCommands(n,t),r=this._findCommandContainers(n);this._arrangeCommandsToContainers(i,r)}})}(jQuery,DevExpress),function(n,t){var f=t.Class,r="__hidden-bag",u=".dx-transition:not(.dx-transition .dx-transition)",e=function(n){return".dx-transition-"+n};t.framework.html.DefaultLayoutController=f.inherit({ctor:function(n){n=n||{},this._layoutTemplateName=n.layoutTemplateName||"",this._disableViewLoadingState=n.disableViewLoadingState,this._layoutModel=n.layoutModel||{}},init:function(i){i=i||{},this._$viewPort=i.$viewPort||n("body"),this._$hiddenBag=i.$hiddenBag||n(document.getElementById(r))||n("<div/>").hide().appendTo("body"),this.viewReleased=n.Callbacks(),this.viewRendered=n.Callbacks(),this._commandManager=i.commandManager||new t.framework.html.CommandManager({commandMapping:i.commandMapping}),this._viewEngine=i.viewEngine,this._prepareTemplates(i.navigation||[])},activate:function(){this._justActivated=!0,this._visibleViews={},this._moveToViewPort(this._getRootElement()),this._getRootElement().show()},deactivate:function(){var t=this;n.each(this._visibleViews,function(n,i){t._hideView(i),t._releaseView(i)}),this._moveToHiddenBag(this._getRootElement())},_getPreviousViewInfo:function(n){return this._visibleViews[this._getTargetFrame(n)]},_prepareTemplates:function(n){var t=this,i=t._viewEngine.findLayoutTemplate(this._getLayoutTemplateName()).removeClass("dx-hidden");t._$layoutTemplate=i,t._$mainLayout=t._createEmptyLayout().show(),t._createNavigation(n),t._blankViewInfo=t._createBlankViewInfo(i)},_createNavigation:function(n){this._viewEngine._applyTemplate(this._$mainLayout,this._layoutModel),this._renderCommands(this._$mainLayout,n)},_getRootElement:function(){return this._$mainLayout},_getViewFrame:function(){return this._$mainLayout},_getLayoutTemplateName:function(){return this._layoutTemplateName},_createBlankViewInfo:function(t){var i=this,r=t.clone().addClass("blank-view").appendTo(i._$hiddenBag),u,f;return i._viewEngine._createComponents(r),u={title:ko.observable()},this._getTransitionElements(r).each(function(t,r){i._viewEngine._applyTemplate(n(r),u)}),f={model:u,renderResult:{$markup:r,$viewItems:n()},isBlankView:!0},i._appendViewToLayout(f),f},_createViewLayoutTemplate:function(){var n=this,t=n._$layoutTemplate.clone().appendTo(n._$hiddenBag);return n._viewEngine._createComponents(t),t},_createEmptyLayout:function(){var n=this,t=n._$layoutTemplate.clone().appendTo(n._$hiddenBag);return n._viewEngine._createComponents(t),n._removeTransitionContent(t),t},_removeTransitionContent:function(n){var t=this._getTransitionElements(n);t.children().remove()},_getTransitionElements:function(n){return n.find(u).addBack(u)},setViewLoadingState:function(t,i){var r=this,u;return r._disableViewLoadingState?n.Deferred().resolve().promise():(u=n.extend({},t,r._blankViewInfo),r._blankViewInfo.model.title((t.viewTemplateInfo||{}).title||"Loading..."),r._showViewImpl(u,i))},showView:function(n,t){var i=this,r=i._getPreviousViewInfo(n);return r&&r.isBlankView&&(t="none"),i._ensureViewRendered(n),this._showViewImpl(n,t).done(function(){i._onViewShown(n)})},disposeView:function(n){n.renderResult&&(n.renderResult.$markup.remove(),n.renderResult.$viewItems.remove(),delete n.renderResult)},_prepareViewTemplate:function(n){this._viewEngine._createComponents(n)},_renderView:function(t,i){var e=this,u=this._createViewLayoutTemplate(),o=t.children(),f,r;if(this._getTransitionElements(u).each(function(t,r){e._viewEngine._applyTemplate(n(r),i.model)}),this._viewEngine._applyLayoutCore(t,u),f=!0,r=n(),o.each(function(t,u){var o=n(u);e._viewEngine._applyTemplate(o,i.model),o.is(".dx-command,.dx-content,script")?f=!1:r=r.add(o)}),r.length&&!f)throw new Error("All the dxView element children should be either of the dxCommand or dxContent type.\r\nProcessed markup: "+r[0].outerHTML);i.renderResult={$markup:u,$viewItems:o}},_renderCommands:function(n,t){var i=this._findCommandContainers(n);this._commandManager._arrangeCommandsToContainers(t,i)},_applyViewCommands:function(n){var i=n.renderResult.$viewItems,r=n.renderResult.$markup,u=this._commandManager._findCommands(i);n.commands=t.framework.utils.mergeCommands(n.commands||[],u),this._renderCommands(r,n.commands)},_findCommandContainers:function(n){return this._viewEngine._createComponents(n,["dxCommandContainer"])},_ensureViewRendered:function(n){var t=this,i;n.renderResult||(i=n.$viewTemplate||this._viewEngine.findViewTemplate(n.viewName),this._prepareViewTemplate(i,n),this._renderView(i,n),this._applyViewCommands(n),t._appendViewToLayout(n),t._onRenderComplete(n),t.viewRendered.fire(n))},_appendViewToLayout:function(t){var i=this,f=i._getViewFrame(t),r=t.renderResult.$markup,u=n();n.each(r.find(".dx-content-placeholder"),function(t,i){var r=n(i).dxContentPlaceholder("instance");r.prepareTransition()}),n.each(i._getTransitionElements(f),function(t,f){var s=n(f),o=r.find(e(s.data("dx-transition-name"))).children();i._hideViewElements(o),s.append(o),u=u.add(o)}),i._$mainLayout.append(t.renderResult.$viewItems.filter(".dx-command")),r.remove(),t.renderResult.$markup=u},_onRenderComplete:function(){},_onViewShown:function(){n(document).trigger("dx.viewchanged")},_doTransition:function(t,i){var r=this,u=n.Deferred(),f=n.map(t.renderResult.$markup,function(t){var u=n(t),f=u.parent(),e=r._disableTransitions?"none":f.data("dx-transition-type");return{destination:f,source:u,type:e||"none",direction:i||"none"}});return r._executeTransitions(f).done(function(){u.resolve()}),u.promise()},_hideView:function(n){n.renderResult&&this._hideViewElements(n.renderResult.$markup)},_showViewImpl:function(t,i){var r=this,u=n.Deferred();return this._justActivated&&(this._justActivated=!1,i="none"),r._doTransition(t,i).done(function(){r._changeView(t)})},_releaseView:function(n){this.viewReleased.fireWith(this,[n])},_getViewPortElement:function(){return this._$viewPort},_getHiddenBagElement:function(){return this._$hiddenBag},_changeView:function(n){var i=this,t=i._getPreviousViewInfo(n);t&&t!==n&&(i._hideView(t),t.isBlankView||this._releaseView(t)),this._visibleViews[this._getTargetFrame(n)]=n},_getTargetFrame:function(){return"content"},_hideViewElements:function(n){this._patchIDs(n),this._disableInputs(n),n.removeClass("dx-active-view").addClass("dx-inactive-view")},_showViewElements:function(n){this._unpatchIDs(n),this._enableInputs(n),n.removeClass("dx-inactive-view").addClass("dx-active-view")},_executeTransitions:function(i){var r=this,u=n.map(i,function(n){return r._showViewElements(n.source),n.source.children().length?t.framework.html.TransitionExecutor.create(n.destination,n):void 0}),f=n.map(u,function(n){return n.options.source.addClass("dx-transition-source"),n.exec()});return n.when.apply(n,f).done(function(){n.each(u,function(n,t){t.finalize(),r._hideViewElements(t.options.source.parent().find(".dx-active-view:not(.dx-transition-source)")),t.options.source.removeClass("dx-transition-source")})})},_patchIDs:function(n){this._processIDs(n,function(n){var t=n;return n.indexOf(r)===-1&&(t=r+"-"+n),t})},_unpatchIDs:function(n){this._processIDs(n,function(n){var t=n;return n.indexOf(r)===0&&(t=n.substr(r.length+1)),t})},_processIDs:function(t,i){var r=t.find("[id]");n.each(r,function(t,r){var u=n(r),f=u.attr("id");u.attr("id",i(f))})},_enableInputs:function(t){var i=t.find(":input[data-dx-disabled=true]");n.each(i,function(t,i){n(i).removeAttr("disabled").removeAttr("data-dx-disabled")})},_disableInputs:function(t){var i=t.find(":input:not([disabled], [disabled=true])");n.each(i,function(t,i){n(i).attr({disabled:!0,"data-dx-disabled":!0})})},_moveToViewPort:function(n){n.appendTo(this._getViewPortElement())},_moveToHiddenBag:function(n){n.appendTo(this._getHiddenBagElement())}}),t.framework.html.layoutControllers.push({controller:new t.framework.html.DefaultLayoutController})}(jQuery,DevExpress),function(n,t){var r=t.Class;t.framework.html.KnockoutJSTemplateEngine=r.inherit({applyTemplate:function(t,i){ko.applyBindings(i,n(t).get(0))}})}(jQuery,DevExpress),function(n,t,i){var s=t.Class,r=t.ui,u="dxView",f="dxLayout",e,o;t.framework[u]=r.Component.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{name:null,title:null,layout:null})},_render:function(){this.callBase(),this._element().addClass("dx-view")}}),r.registerComponent(u,t.framework.dxView),t.framework[f]=r.Component.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{name:null})},_render:function(){this.callBase(),this._element().addClass("dx-layout")}}),r.registerComponent(f,t.framework.dxLayout),t.framework.dxViewPlaceholder=r.Component.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{viewName:null})},_render:function(){this.callBase(),this._element().addClass("dx-view-placeholder")}}),r.registerComponent("dxViewPlaceholder",t.framework.dxViewPlaceholder),e=function(n,t,i,r){r==="absolute"?n.addClass("dx-transition-absolute"):n.addClass("dx-transition-static"),n.addClass("dx-transition").addClass("dx-transition-"+i),n.data("dx-transition-type",t),n.data("dx-transition-name",i)},o=function(n){n.addClass("dx-transition-inner-wrapper")},t.framework.dxTransition=r.Component.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{name:null,type:"slide"})},_render:function(){this.callBase();var n=this._element();e(n,this.option("type"),this.option("name"),"absolute"),n.wrapInner("<div/>"),o(n.children())},_clean:function(){this.callBase(),this._element().empty()}}),r.registerComponent("dxTransition",t.framework.dxTransition),t.framework.dxContentPlaceholder=r.Component.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{name:null,transition:"none",contentCssPosition:"absolute"})},_render:function(){this.callBase();var n=this._element();n.addClass("dx-content-placeholder").addClass("dx-content-placeholder-"+this.option("name")),e(n,this.option("transition"),this.option("name"),this.option("contentCssPosition"))},prepareTransition:function(){var n=this._element();n.children(".dx-content").length===0&&(n.wrapInner("<div>"),n.children().dxContent({targetPlaceholder:this.option("name")}))}}),r.registerComponent("dxContentPlaceholder",t.framework.dxContentPlaceholder),t.framework.dxContent=r.Component.inherit({_defaultOptions:function(){return n.extend(this.callBase(),{targetPlaceholder:null})},_optionChanged:function(){this._refresh()},_clean:function(){this.callBase(),this._element().removeClass(this._currentClass)},_render:function(){this.callBase();var n=this._element();n.addClass("dx-content"),this._currentClass="dx-content-"+this.option("targetPlaceholder"),n.addClass(this._currentClass),o(n)}}),r.registerComponent("dxContent",t.framework.dxContent),t.framework.html.ViewEngine=s.inherit({ctor:function(t){t=t||{},this.$root=t.$root,this.device=t.device||{},this.templateEngine=t.templateEngine,this.dataOptionsAttributeName=t.dataOptionsAttributeName||"data-options",this._templateMap={},this._pendingViewContainer=null,this.viewSelecting=n.Callbacks(),this.modelFromViewDataExtended=n.Callbacks(),this.layoutSelecting=n.Callbacks()},init:function(){var n=this;return this._initDefaultLayout(),this._loadTemplates().done(function(){n._enumerateTemplates(function(t){n._applyPartialViews(t._element())})})},_enumerateTemplates:function(t){var i=this;n.each(i._templateMap,function(i,r){n.each(r,function(i,r){n.each(r,function(n,i){t(i)})})})},_findComponent:function(n,t){return((this._templateMap[n]||{})[t]||[])[0]},_findTemplate:function(n,t){var f=this,r=f._findComponent(n,t),u,i;if(!r)throw new Error("Error 404: Template not found. role:  "+t+", name: "+n);return u=r._element(),i=u.clone(),this._createComponents(i,[t]),i},findViewTemplate:function(t){var i={viewName:t};return this.viewSelecting.fire(i),i.view?n(i.view):this._findTemplate(t,u,!0)},_extendModelFromViewData:function(n,i){t.utils.extendFromObject(i,n.data(u).option()),this.modelFromViewDataExtended.fire({view:n,model:i})},_createComponents:function(i,r){var u=this,f=[];return i.find("*").addBack().filter("["+u.dataOptionsAttributeName+"]").each(function(i,e){var s=n(e),c=s.attr(u.dataOptionsAttributeName),h,o;try{h=new Function("return {"+c+"}")()}catch(l){throw new Error(t.utils.stringFormat("Unable to parse options.\nMessage: {0};\nOptions value: {1}",l,c));}for(o in h)(!r||n.inArray(o,r)>-1)&&s[o]&&(s[o](h[o]),f.push(s[o]("instance")))}),f},_loadTemplatesFromMarkup:function(i){var r,e;if(i.find("[data-dx-role]").length)throw Error("View templates should be updated according to the 13.1 changes. Go to http://dxpr.es/15ikrJA for more details");r=this,i.appendTo(this.$root),t.localization.localizeNode(i),e=r._createComponents(i,[u,f]),n.each(e,function(n,t){var i=t._element();i.addClass("dx-hidden"),r._registerTemplateComponent(t),t._element().detach()})},_registerTemplateComponent:function(n){var r=this,e=n._element(),i=n.NAME,f=n.option(),u=f.name,t=r._templateMap[u]||{};t[i]=t[i]||[],t[i].push(n),r._templateMap[u]=t},getViewTemplateInfo:function(n){return this._templateMap[n][u][0].option()},_applyPartialViews:function(t){var i=this;this._createComponents(t,["dxViewPlaceholder"]),n.each(t.find(".dx-view-placeholder"),function(){var r=n(this),f=r.data("dxViewPlaceholder").option("viewName"),t=i._findTemplate(f,u);i._applyPartialViews(t),r.append(t),t.removeClass("dx-hidden")})},_ajaxImpl:function(){return n.ajax.apply(n,arguments)},_loadTemplates:function(){var r=this,u,f;return this._templateMap={},this._loadTemplatesFromMarkup(this.$root.children()),u=[],location.protocol.indexOf("wmapp")>=0&&(f=location.protocol+"www/"),n("head").find("link[rel='dx-template']").each(function(e,o){var s=n(o).attr("href"),h=r._ajaxImpl({url:(f||"")+s,isLocal:f?!0:i,success:function(n){r._loadTemplatesFromMarkup(t.utils.createMarkupFromString(n))},dataType:"html"});u.push(h)}),n.when.apply(n,u).done(function(){n.each(r._templateMap,function(t,i){n.each(i,function(n,t){r._filterTemplatesByDevice(t)})})})},_filterTemplatesByDevice:function(i){var u=t.utils.findBestMatches(this.device,i,function(n){return n.option()}),r;this._checkMatchedTemplates(u),r=u[0],n.each(i,function(n,t){t!=r&&(t._dispose(),t._element().remove())}),i.length=0,r&&i.push(r)},_checkMatchedTemplates:function(t){if(t.length>1){var i="Concurrent templates are found:\r\n";n.each(t,function(n,t){i+=t._element().attr("data-options")+"\r\n"}),i+="Target device:\r\n",i+=JSON.stringify(this.device);throw Error(i);}},_extendModelFormViewTemplate:function(n,t){this._extendModelFromViewData(n,t)},_ensureTemplates:function(n){this._ensureViewTemplate(n)},_ensureViewTemplate:function(n){return n.$viewTemplate=n.$viewTemplate||this.findViewTemplate(n.viewName)},_wrapViewDefaultContent:function(n){n.wrapInner('<div class="dx-full-height"><\/div>'),n.children().eq(0).dxContent({targetPlaceholder:"content"})},_initDefaultLayout:function(){this._$defaultLayoutTemplate=n('<div class="dx-full-height" data-options="dxLayout : { name: \'default\' } ">                 <div class="dx-full-height" data-options="dxContentPlaceholder : { name: \'content\' } " ><\/div>             <\/div>')},_getDefaultLayoutTemplate:function(){var n=this._$defaultLayoutTemplate.clone();return this._createComponents(n),n},findLayoutTemplate:function(t){if(!t)return this._getDefaultLayoutTemplate();var i={layoutName:t};return this.layoutSelecting.fire(i),i.layout?n(i.layout):this._findTemplate(t,f)},_applyTemplate:function(n,t){var i=this;n.each(function(n,r){i.templateEngine.applyTemplate(r,t)})},_applyLayoutCore:function(t,r){(r===i||r.length===0)&&(r=this._getDefaultLayoutTemplate()),t.children(".dx-content").length===0&&this._wrapViewDefaultContent(t);var u=n().add(r).add(t),f=u.find(".dx-content");return n.each(f,function(){var t=n(this),r=t.data("dxContent").option("targetPlaceholder"),i=u.find(".dx-content-placeholder-"+r);i.empty(),i.append(t)}),f.filter(":not(.dx-content-placeholder .dx-content)").remove(),r}})}(jQuery,DevExpress),function(n,t){var f=t.framework,r=f.html,u="dx-viewport",e="__hidden-bag",o="dx-hidden-bag";r.HtmlApplication=f.Application.inherit({ctor:function(i){i=i||{},this.callBase(i),this._$root=n(i.rootNode||document.body),this._initViewPort(i.viewPort),this.device=i.device||t.devices.current(),this._navigationType=i.navigationType||i.defaultLayout,this._initHiddenBag(),this.viewEngine=i.viewEngine||new r.ViewEngine({$root:this._$root,device:this.device,templateEngine:i.templateEngine||new r.KnockoutJSTemplateEngine({navigationManager:this.navigationManager})}),this.components.push(this.viewEngine),this.viewRendered=n.Callbacks(),this._layoutControllers=i.layoutControllers||r.layoutControllers,this._availableLayoutControllers=[],this.resolveLayoutController=n.Callbacks()},_initViewPort:function(i){this._$viewPort=this._getViewPort(),i=i||{},t.devices.current().platform==="desktop"&&(i=n.extend({disabled:!0},i)),i.disabled||t.ui.initViewport(i),t.devices.attachCss(this._$viewPort),this._$viewPort.addClass(this._getColorSchemeClass())},_getViewPort:function(){var t=n("."+u);return t.length||(t=n("<div>").addClass(u).appendTo(this._$root)),t},_initHiddenBag:function(){this._$hiddenBag=this._getHiddenBag(this._$root,this._$viewPort)},_getHiddenBag:function(t,i){var r=n("#"+e);return r.length||(r=n("<div/>").addClass(o).attr("id",e).appendTo(t)),r.addClass((i.attr("class")||"").replace(u,"")),r},_showViewImpl:function(n,t){return this._activateLayoutController(n.layoutController),this._activeLayoutController.showView(n,t)},_setViewLoadingState:function(n,t){return this._activateLayoutController(n.layoutController),this._activeLayoutController.setViewLoadingState(n,t)},_resolveLayoutController:function(n){var t={viewInfo:n,layoutController:null,availableLayoutControllers:this._availableLayoutControllers};return this._processEvent("resolveLayoutController",t,n.model),t.layoutController||this._resolveLayoutControllerImpl(n)},_resolveLayoutControllerImpl:function(i){var f=i.viewTemplateInfo||{},u=n.extend({root:!i.canBack,navigationType:f.navigationType||f.layout||this._navigationType},t.devices.current()),r=t.utils.findBestMatches(u,this._availableLayoutControllers);if(!r.length)throw Error("The layout controller cannot be resolved. There are no appropriate layout controllers for the current context. Make sure you have the corresponding *.js references in your main *.html file.");if(r.length>1)throw Error("The layout controller cannot be resolved. Two or more layout controllers suit the current context. Make the layout controllers registration more specific.");if(r[0].navigationType!==u.navigationType)throw Error("The layout controller cannot be resolved. There are no appropriate layout controllers for the specified navigation type: '"+u.navigationType+"'. Make sure you have the corresponding *.js references in your main *.html file.");return r[0].controller},_activateLayoutController:function(n){var t=this;t._activeLayoutController!==n&&(t._activeLayoutController&&t._activeLayoutController.deactivate(),n.activate(),t._activeLayoutController=n)},init:function(){var t=this,n=this.callBase();return n.done(function(){t._initLayoutControllers()}),n},_disposeView:function(n){n.layoutController.disposeView&&n.layoutController.disposeView(n),this.callBase(n)},viewPort:function(){return this._$viewPort},_getThemeClasses:function(n){var t={ios:"dx-theme-ios dx-theme-ios-typography",android:"dx-theme-android dx-theme-android-typography",desktop:"dx-theme-desktop dx-theme-desktop-typography",win8:"dx-theme-win8 dx-theme-win8-typography",win8phone:"dx-theme-win8 dx-theme-win8-typography",tizen:"dx-theme-tizen dx-theme-tizen-typography",generic:"dx-theme-generic dx-theme-generic-typography"};return t[n.platform]},_createViewInfo:function(n){var t=this.callBase(n);return t.viewTemplateInfo=this.viewEngine.getViewTemplateInfo(t.viewName)||{},t.layoutController=this._resolveLayoutController(t),t},_createViewModel:function(n){var i,r,t;this.callBase(n),i=n.viewTemplateInfo,r=n.model;for(t in i)t in r||(r[t]=i[t])},_checklayoutControllersRegistration:function(t){var i=[];if(n.each(t,function(n,t){t.controller||i.push(n)}),i.length!==0)throw new Error("A deprecated way is used for the registration of the following layout controllers: '"+i.join("' ,'")+"'.\r\nFor details, read the http://dxpr.es/1bTjfj1");},_initLayoutControllers:function(){var i=this;i._checklayoutControllersRegistration(i._layoutControllers),n.each(i._layoutControllers,function(r,u){var f=u.controller,e=n.extend({navigationType:this._navigationType},t.devices.current());t.utils.findBestMatches(e,[u]).length&&(i._availableLayoutControllers.push(u),f.init&&f.init({app:i,$viewPort:i._$viewPort,$hiddenBag:i._$hiddenBag,navigationManager:i.navigationManager,commandMapping:i.commandMapping,viewEngine:i.viewEngine,navigation:i.navigation}),f.viewReleased&&f.viewReleased.add(function(n){i._onViewReleased(n)}),f.viewRendered&&f.viewRendered.add(function(n){i._processEvent("viewRendered",n,n.model)}))})},_onViewReleased:function(n){this._onViewHidden(n),this._viewCache.hasView(n.key)||this._onViewRemoved(n)},_getColorSchemeClass:function(){var i=n("<div>").addClass("dx-color-scheme").appendTo(this._$viewPort),r="font-family",t=i.css(r).replace(/^['"]|['"]$/g,"");if(i.remove(),t&&t!=="#")return"dx-color-scheme-"+t},getViewTemplate:function(n){return this.viewEngine.findViewTemplate(n)},getViewTemplateInfo:function(n){return this.viewEngine.getViewTemplateInfo(n)}})}(jQuery,DevExpress),function(n,t){n.fn.extend({unwrapInner:function(t){return this.each(function(){var i=this,r=n(i).children(t);r.each(function(){var t=n(this);t.contents().appendTo(i),t.remove()})})}});var i=400,r=t.Class.inherit({ctor:function(n,t){this.container=n,this.options=t},exec:function(){var t=this,i=t.options,u=i.source,r=i.destination,f=u,o=r,e=t._getTransitionInnerElement(r);return this._finalize=function(){},t._animate(n.extend({},i,{source:f,destination:e}))},finalize:function(){if(!this._finalize)throw Error('The "exec" method should be called before the "finalize" one');this._finalize()},_getTransitionInnerElement:function(n){return n.children(".dx-active-view:not(.dx-transition-source)")},_animate:function(){return(new n.Deferred).resolve().promise()}}),u=r.inherit({_animate:function(i){var u=i.source,f=i.destination,r=this.container.width();return t.fx.animate(u,{type:"slide",from:{left:0},to:{left:0},duration:0}),t.fx.animate(f,{type:"slide",from:{left:-r},to:{left:-r},duration:0}),n.Deferred().resolve().promise()}}),f=r.inherit({_animate:function(r){var e,o;if(r.direction==="none")return n.Deferred().resolve().promise();var s=r.source,f=r.destination,u=this.container.width(),h=f.position().left;return r.direction==="backward"&&(u=-u),e=t.fx.animate(s,{type:"slide",from:{left:u},to:{left:0},duration:i}),o=t.fx.animate(f,{type:"slide",from:{left:0},to:{left:-u},duration:i}),n.when(o,e)}}),e=r.inherit({_animate:function(r){var a,v;if(r.direction==="none")return n.Deferred().resolve().promise();var f=r.source,u=r.destination,e=this.container.width(),l=e/5,o,s,h,c,w=u.position().left,y=f.css("z-index"),p=u.css("z-index");return r.direction==="backward"?(o=-l,s=0,h=0,c=e,f.css("z-index",1),u.css("z-index",2)):(o=e,s=0,h=0,c=-l,f.css("z-index",2),u.css("z-index",1)),a=t.fx.animate(f,{type:"slide",from:{left:o},to:{left:s},duration:i}),v=t.fx.animate(u,{type:"slide",from:{left:h},to:{left:c},duration:i}),n.when(v,a).done(function(){f.css("z-index",y),u.css("z-index",p)})}}),o=r.inherit({_animate:function(r){var s=r.source,o=r.destination,h=o.position().top,u=o.position().left,e=this.container.width(),f;return r.direction==="backward"&&(e=-e),f=[],r.direction==="forward"?f.push(t.fx.animate(s,{type:"slide",from:{top:h,left:e+u,"z-index":1},to:{left:u},duration:i})):(f.push(t.fx.animate(s,{type:"slide",from:{left:u,"z-index":1},to:{left:u},duration:i})),f.push(t.fx.animate(o,{type:"slide",from:{"z-index":2},to:{left:u-e},duration:i}))),n.when.apply(n,f)}}),s=r.inherit({_animate:function(t){var r=t.source,f=t.destination,u=new n.Deferred;return r.css({opacity:0}),f.animate({opacity:0},i),r.animate({opacity:1},i,function(){u.resolve()}),u.promise()}});r.create=function(n,i){var h=i.direction==="none"?"none":i.type,r=t.devices.current();switch(h){case"none":return new u(n,i);case"slide":return r.platform==="ios"&&r.version[0]===7?new e(n,i):new f(n,i);case"fade":return new s(n,i);case"overflow":return new o(n,i);default:throw Error(t.utils.formatString('Unknown transition type "{0}"',i.type));}},t.framework.html.TransitionExecutor=r}(jQuery,DevExpress),DevExpress.MOD_FRAMEWORK=!0};
(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Reddit,Client,jQuery,JavaScript,Pervasives,List,Option,console,Seq,Date,Utils,Arrays;
 Runtime.Define(Global,{
  WebSharper:{
   Reddit:{
    Client:{
     DataSource:function(navigate)
     {
      var options;
      options={
       pageSize:1,
       paginate:true
      };
      options.store=Client.Store(navigate);
      return new Global.DevExpress.data.DataSource(options);
     },
     Main:Runtime.Field(function()
     {
      return jQuery(function()
      {
       var MainApp,app;
       MainApp={};
       MainApp.app=new Global.DevExpress.framework.html.HtmlApplication(Pervasives.NewFromList(List.ofArray([["namespace",MainApp],["navigationType","simple"]])));
       app=MainApp.app;
       MainApp.List=function()
       {
        return{
         dataSource:Client.DataSource(Runtime.CreateFuncWithThis(function(_this)
         {
          return app.navigate("Page/"+Global.encodeURIComponent(_this.Url));
         }))
        };
       };
       MainApp.Page=function(paramz)
       {
        return{
         Title:paramz.title,
         Url:Global.decodeURIComponent(paramz.url)
        };
       };
       app.router.register(":view",{
        view:"List"
       });
       app.router.register(":view/:url",{
        view:"Page",
        url:""
       });
       return app.navigate();
      });
     }),
     Store:function(navigate)
     {
      return new Global.DevExpress.data.CustomStore(Pervasives.NewFromList(List.ofArray([["load",function(ops)
      {
       var _,x,url;
       if(ops.refresh)
        {
         _={
          $:0
         };
         Client.lastFetched=function()
         {
          return _;
         };
        }
       x=Client.lastFetched();
       url=Option.fold(function(s)
       {
        return function(a)
        {
         return s+"?after="+a;
        };
       },"http://www.reddit.com/r/all/hot.json",x);
       return jQuery.getJSON(url).then(function(data)
       {
        var posts,result,_1,matchValue;
        if(console)
         {
          console.log(data);
         }
        try
        {
         posts=data.data.children;
         result=Seq.toArray(Seq.delay(function()
         {
          return Seq.collect(function(post)
          {
           var data1,date;
           data1=post.data;
           date=new Date(0);
           date.setUTCSeconds(data1.created_utc);
           return[{
            Author:data1.author,
            Title:data1.title,
            Name:data1.name,
            CreatedUTC:date,
            Score:data1.score,
            Thumbnail:data1.thumbnail,
            Url:data1.url,
            Open:navigate,
            Nsfw:data1.over_18,
            Subreddit:"/r/"+data1.subreddit
           }];
          },posts);
         }));
         _1={
          $:1,
          $0:Utils["[]`1.get_Last"](result).Name
         };
         Client.lastFetched=function()
         {
          return _1;
         };
         return result;
        }
        catch(matchValue)
        {
         return null;
        }
       });
      }]])));
     },
     lastFetched:Runtime.Field(function()
     {
      return{
       $:0
      };
     })
    },
    Utils:{
     Array:{
      Last:function(arr)
      {
       return Arrays.get(arr,Arrays.length(arr)-1);
      }
     },
     "[]`1.get_Last":function(_)
     {
      return Arrays.get(_,Arrays.length(_)-1);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Reddit=Runtime.Safe(Global.WebSharper.Reddit);
  Client=Runtime.Safe(Reddit.Client);
  jQuery=Runtime.Safe(Global.jQuery);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  Pervasives=Runtime.Safe(JavaScript.Pervasives);
  List=Runtime.Safe(Global.WebSharper.List);
  Option=Runtime.Safe(Global.WebSharper.Option);
  console=Runtime.Safe(Global.console);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Date=Runtime.Safe(Global.Date);
  Utils=Runtime.Safe(Reddit.Utils);
  return Arrays=Runtime.Safe(Global.WebSharper.Arrays);
 });
 Runtime.OnLoad(function()
 {
  Client.lastFetched();
  Client.Main();
  return;
 });
}());


if (typeof IntelliFactory !=='undefined')
  IntelliFactory.Runtime.Start();
