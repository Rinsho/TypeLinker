
import type { Link, HeadsOf, TailsOf, Variance, Link_O2N, Link_M2N } from '../core/TypeLinker';
//
// TESTS
//
class A { A:string; } 
class B extends A { B:string; } 
class C extends B { C:string; } 
class D { D:string; }
type TypeMaps = {
    tuple: [ Link<A, C>, Link<B, A>, Link<C, D>, Link<D, null>],
    union: Link<A, C> | Link<B, A> | Link<C, D> | Link<D, null>,
    nested: [ Link<A, C>, [[Link<B, A>] | Link<C, D>], [[[Link<D, null>]]]]
}
type ActiveMap = TypeMaps['nested'];

//Class example
class example<K extends HeadsOf<ActiveMap>, V extends TailsOf<ActiveMap, K, Variance.Co>> {}
var test: example<A,C>;

//Covariant
var a: TailsOf<ActiveMap, A, Variance.Co>; //A | C | D
var b: TailsOf<ActiveMap, B, Variance.Co>; //A | D
var h: TailsOf<ActiveMap, C, Variance.Co>; //D
var j: TailsOf<ActiveMap, D, Variance.Co>; //null

//Contravariant
var c: TailsOf<ActiveMap, A, Variance.Contra>; //C
var d: TailsOf<ActiveMap, B, Variance.Contra>; //A | C
var i: TailsOf<ActiveMap, C, Variance.Contra>; //A | C | D
var k: TailsOf<ActiveMap, D, Variance.Contra>; //null

//Invariant
var e: TailsOf<ActiveMap, A>; //C
var f: TailsOf<ActiveMap, B>; //A
var g: TailsOf<ActiveMap, C, Variance.None>; //D
var l: TailsOf<ActiveMap, D, Variance.None>; //null

//Bivariant
var m: TailsOf<ActiveMap, A, Variance.Bi>; //A | C | D
var n: TailsOf<ActiveMap, B, Variance.Bi>; //A | C | D
var o: TailsOf<ActiveMap, C, Variance.Bi>; //A | C | D
var p: TailsOf<ActiveMap, D, Variance.Bi>; //null

//Multi-key
var q: TailsOf<ActiveMap, A|D>; //C | null
var r: TailsOf<ActiveMap, A|D, Variance.Co>; //A | C | D | null

//Link Distributivity
var s: TailsOf<Link<A,C> | Link<A,null>, A>; //C | null
var t: TailsOf<Link_O2N<A, C|null>, A>; //C | null
var u: TailsOf<Link_M2N<A|D, D|null> | Link<B,A>, A, Variance.Co>; //A | D | null