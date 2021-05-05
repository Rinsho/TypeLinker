
import type { Link, HeadsOf, TailsFrom, Variance, Link_O2N, Link_M2N } from '../core/TypeLinker';
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
    nested: [ Link<A, C>, [[Link<B, A>] | Link<C, D>], [[[Link<D, null>]]]],
    default: [ Link<never, never> ]
}
type ActiveMap = TypeMaps['nested'];

//Class example
class example<K extends HeadsOf<ActiveMap>, V extends TailsFrom<ActiveMap, K, Variance.Co>> {}
var test: example<A,C>;

//Covariant
var a: TailsFrom<ActiveMap, A, Variance.Co>; //A | C | D
var b: TailsFrom<ActiveMap, B, Variance.Co>; //A | D
var h: TailsFrom<ActiveMap, C, Variance.Co>; //D
var j: TailsFrom<ActiveMap, D, Variance.Co>; //null

//Contravariant
var c: TailsFrom<ActiveMap, A, Variance.Contra>; //C
var d: TailsFrom<ActiveMap, B, Variance.Contra>; //A | C
var i: TailsFrom<ActiveMap, C, Variance.Contra>; //A | C | D
var k: TailsFrom<ActiveMap, D, Variance.Contra>; //null

//Invariant
var e: TailsFrom<ActiveMap, A>; //C
var f: TailsFrom<ActiveMap, B>; //A
var g: TailsFrom<ActiveMap, C, Variance.None>; //D
var l: TailsFrom<ActiveMap, D, Variance.None>; //null

//Bivariant
var m: TailsFrom<ActiveMap, A, Variance.Bi>; //A | C | D
var n: TailsFrom<ActiveMap, B, Variance.Bi>; //A | C | D
var o: TailsFrom<ActiveMap, C, Variance.Bi>; //A | C | D
var p: TailsFrom<ActiveMap, D, Variance.Bi>; //null

//Multi-key
var q: TailsFrom<ActiveMap, A|D>; //C | null
var r: TailsFrom<ActiveMap, A|D, Variance.Co>; //A | C | D | null

//Link Distributivity
var s: TailsFrom<Link<A,C> | Link<A,null>, A>; //C | null
var t: TailsFrom<Link_O2N<A, C|null>, A>; //C | null
var u: TailsFrom<Link_M2N<A|D, D|null> | Link<B,A>, A, Variance.Co>; //A | D | null